import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SalesRep = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [reps, setReps] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchReps = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setReps(response.data.data || []);
        } catch (err) {
            // Silently handle — users may not have data yet
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReps();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await api.post('/auth/register', formData);
            setMessage('Sales representative registered successfully!');
            setFormData({ name: '', email: '', password: '' });
            setShowForm(false);
            fetchReps();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Sales Representatives</h2>
                <p>Register and manage your field sales team</p>
            </div>

            {message && <div className="alert alert-success">✅ {message}</div>}
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            {/* Registration Form */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                    <h3>➕ Register New Sales Rep</h3>
                    {!showForm && (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
                            + Register
                        </button>
                    )}
                </div>

                {showForm && (
                    <form onSubmit={handleRegister}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    placeholder="john@dms.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password *</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="action-bar">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-sm">
                                Register Representative
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Sales Reps List */}
            <div className="card">
                <div className="card-header">
                    <h3>👥 Team Members ({reps.length})</h3>
                </div>

                {loading ? (
                    <div className="loader"><div className="spinner"></div> Loading team members...</div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reps.length > 0 ? (
                                    reps.map((rep) => (
                                        <tr key={rep.id}>
                                            <td style={{ fontWeight: 500 }}>{rep.name}</td>
                                            <td>{rep.email}</td>
                                            <td>
                                                <span className={`badge badge-${rep.role}`}>
                                                    {rep.role === 'sales_rep' ? 'Sales Rep' : rep.role}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                                {new Date(rep.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="table-empty">
                                            No team members yet. Register your first sales rep above!
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

export default SalesRep;
