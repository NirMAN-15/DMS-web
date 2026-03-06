import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Shops from './pages/Shops';
import Orders from './pages/Orders';
import SalesRep from './pages/SalesRep';
import './index.css';

// PrivateRoute to restrict unauthenticated users
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Sidebar navigation for authenticated users
const Sidebar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    if (!isAuthenticated) return null;

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : '?';

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-icon">📦</div>
                <div>
                    <h1>DMS</h1>
                    <span>Admin Panel</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">📊</span> Dashboard
                </NavLink>
                <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">📦</span> Inventory
                </NavLink>
                <NavLink to="/shops" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">🏪</span> Shops
                </NavLink>
                <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">📋</span> Orders
                </NavLink>
                <NavLink to="/sales-rep" className={({ isActive }) => isActive ? 'active' : ''}>
                    <span className="nav-icon">👥</span> Sales Reps
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{initials}</div>
                    <div>
                        <div className="user-name">{user?.name || 'Admin'}</div>
                        <div className="user-role">{user?.role || 'admin'}</div>
                    </div>
                </div>
                <button onClick={logout}>
                    <span>🚪</span> Sign Out
                </button>
            </div>
        </aside>
    );
};

const AppContent = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Router>
            {isAuthenticated && (
                <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
                            <Route path="/shops" element={<PrivateRoute><Shops /></PrivateRoute>} />
                            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                            <Route path="/sales-rep" element={<PrivateRoute><SalesRep /></PrivateRoute>} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                </div>
            )}

            {!isAuthenticated && (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            )}
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
