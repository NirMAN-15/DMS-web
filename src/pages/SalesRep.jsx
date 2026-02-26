import React, { useState } from 'react';
import api from '../services/api';

const SalesRep = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Register Sales Representative (POST /auth/register)
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await api.post('/auth/register', formData);
            setMessage('Sales representative registered successfully!');
            setFormData({ name: '', email: '', password: '' }); // Reset form
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="sales-rep-container">
            <h2>Register Sales Representative</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Register Representative</button>
            </form>
        </div>
    );
};

export default SalesRep;
