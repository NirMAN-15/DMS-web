import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Shops = () => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingShop, setEditingShop] = useState(null);
    const [formData, setFormData] = useState({
        name: '', address: '', phone: '', credit_limit: '',
    });

    const fetchShops = async () => {
        try {
            setLoading(true);
            const response = await api.get('/shops');
            setShops(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch shops.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const resetForm = () => {
        setFormData({ name: '', address: '', phone: '', credit_limit: '' });
        setEditingShop(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingShop) {
                await api.put(`/shops/${editingShop.id}`, formData);
                setSuccess('Shop updated successfully!');
            } else {
                await api.post('/shops', formData);
                setSuccess('Shop added successfully!');
            }
            resetForm();
            fetchShops();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        }
    };

    const handleEdit = (shop) => {
        setFormData({
            name: shop.name,
            address: shop.address,
            phone: shop.phone || '',
            credit_limit: shop.credit_limit || '',
        });
        setEditingShop(shop);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this shop?')) return;
        try {
            await api.delete(`/shops/${id}`);
            setSuccess('Shop deleted successfully!');
            fetchShops();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete shop.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Shop Management</h2>
                <p>Manage customer shops — addresses, credit limits, and contact info</p>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                    <h3>{editingShop ? '✏️ Edit Shop' : '➕ Add New Shop'}</h3>
                    {!showForm && (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
                            + Add Shop
                        </button>
                    )}
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Shop Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sunrise Grocery"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Credit Limit</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={formData.credit_limit}
                                    onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Address *</label>
                                <input
                                    type="text"
                                    placeholder="Full shop address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="action-bar">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-sm">
                                {editingShop ? 'Update Shop' : 'Add Shop'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>🏪 Shop List ({shops.length})</h3>
                </div>

                {loading ? (
                    <div className="loader"><div className="spinner"></div> Loading shops...</div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Credit Limit</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shops.length > 0 ? (
                                    shops.map((shop) => (
                                        <tr key={shop.id}>
                                            <td style={{ fontWeight: 500 }}>{shop.name}</td>
                                            <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {shop.address}
                                            </td>
                                            <td>{shop.phone || '—'}</td>
                                            <td style={{ fontWeight: 600 }}>
                                                ${Number(shop.credit_limit || 0).toFixed(2)}
                                            </td>
                                            <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                                {new Date(shop.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className="action-bar">
                                                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(shop)}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(shop.id)}>
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="table-empty">
                                            No shops found. Add your first shop above!
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

export default Shops;
