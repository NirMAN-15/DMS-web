import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}`, { status: newStatus });
            setSuccess(`Order status updated to "${newStatus}".`);
            fetchOrders();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Orders</h2>
                <p>View and manage all orders placed by sales representatives</p>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}
            {success && <div className="alert alert-success">✅ {success}</div>}

            <div className="card">
                <div className="card-header">
                    <h3>📋 All Orders ({orders.length})</h3>
                </div>

                {loading ? (
                    <div className="loader"><div className="spinner"></div> Loading orders...</div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Shop</th>
                                    <th>Sales Rep</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                {order.id.substring(0, 8)}...
                                            </td>
                                            <td style={{ fontWeight: 500 }}>{order.shops?.name || '—'}</td>
                                            <td>{order.users?.name || '—'}</td>
                                            <td style={{ fontWeight: 600 }}>
                                                ${Number(order.total_amount).toFixed(2)}
                                            </td>
                                            <td>
                                                <span className={`badge badge-${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <select
                                                    className="btn btn-secondary btn-sm"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        fontSize: '0.78rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="table-empty">
                                            No orders yet. Orders from the mobile app will appear here.
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

export default Orders;
