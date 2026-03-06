import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', sku: '', price: '', stock: '', image_url: '' });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', sku: '', price: '', stock: '', image_url: '' });
        setEditingProduct(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
                setSuccess('Product updated successfully!');
            } else {
                await api.post('/products', formData);
                setSuccess('Product added successfully!');
            }
            resetForm();
            fetchProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            sku: product.sku,
            price: product.price,
            stock: product.stock,
            image_url: product.image_url || '',
        });
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            setSuccess('Product deleted successfully!');
            fetchProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete product.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Inventory Management</h2>
                <p>Manage your product catalog — SKUs, pricing, and stock levels</p>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            {/* Add/Edit Form */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                    <h3>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                    {!showForm && (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
                            + Add Product
                        </button>
                    )}
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Coca-Cola 350ml"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>SKU *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. COKE-350ML"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/product.jpg"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="action-bar">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-sm">
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Products Table */}
            <div className="card">
                <div className="card-header">
                    <h3>📦 Product List ({products.length})</h3>
                </div>

                {loading ? (
                    <div className="loader"><div className="spinner"></div> Loading products...</div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <span style={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.82rem',
                                                    background: 'var(--primary-light)',
                                                    color: 'var(--primary)',
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 600,
                                                }}>
                                                    {product.sku}
                                                </span>
                                            </td>
                                            <td>{product.name}</td>
                                            <td style={{ fontWeight: 600 }}>${Number(product.price).toFixed(2)}</td>
                                            <td>
                                                <span style={{
                                                    color: product.stock > 10 ? 'var(--success)' :
                                                           product.stock > 0 ? 'var(--warning)' : 'var(--error)',
                                                    fontWeight: 600,
                                                }}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                                {new Date(product.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className="action-bar">
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="table-empty">
                                            No products found. Add your first product above!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
