import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data.data);
            } catch (err) {
                setError('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h2>Dashboard</h2>
                    <p>Overview of your distribution operations</p>
                </div>
                <div className="loader"><div className="spinner"></div> Loading stats...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Overview of your distribution operations</p>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue">📦</div>
                    <div className="stat-info">
                        <h4>Total Products</h4>
                        <div className="stat-value">{stats?.totalProducts || 0}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">🏪</div>
                    <div className="stat-info">
                        <h4>Total Shops</h4>
                        <div className="stat-value">{stats?.totalShops || 0}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">📋</div>
                    <div className="stat-info">
                        <h4>Total Orders</h4>
                        <div className="stat-value">{stats?.totalOrders || 0}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple">👥</div>
                    <div className="stat-info">
                        <h4>Sales Reps</h4>
                        <div className="stat-value">{stats?.totalSalesReps || 0}</div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card recent-orders">
                <div className="card-header">
                    <h3>Recent Orders</h3>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Shop</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentOrders?.length > 0 ? (
                                stats.recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                            {order.id.substring(0, 8)}...
                                        </td>
                                        <td>{order.shops?.name || '—'}</td>
                                        <td style={{ fontWeight: 600 }}>
                                            ${Number(order.total_amount).toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${order.status}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="table-empty">
                                        No orders yet. Orders from sales reps will appear here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
