import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '' });
    const [error, setError] = useState('');

    // Fetch all products (GET /products)
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add product (POST /products)
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        try {
            const response = await api.post('/products', {
                name: newProduct.name,
                price: parseFloat(newProduct.price)
            });
            setProducts([...products, response.data]);
            setNewProduct({ name: '', price: '' });
        } catch (err) {
            setError('Failed to add product.');
        }
    };

    // Delete product (DELETE /products/:id)
    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            setError('Failed to delete product.');
        }
    };

    return (
        <div className="inventory-container">
            <h2>Inventory Management</h2>
            {error && <p className="error">{error}</p>}

            <div className="add-product-form">
                <h3>Add New Product</h3>
                <form onSubmit={handleAddProduct}>
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                    />
                    <button type="submit">Add Product</button>
                </form>
            </div>

            <div className="product-list">
                <h3>Product List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>${Number(product.price).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="4">No products available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
