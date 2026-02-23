import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import SalesRep from './pages/SalesRep';
import './index.css';

// PrivateRoute to restrict unauthenticated users
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Navigation bar for authenticated users
const NavBar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/inventory">Inventory</Link></li>
                <li><Link to="/sales-rep">Sales Representative</Link></li>
                <li><button onClick={logout}>Logout</button></li>
            </ul>
        </nav>
    );
};

const AppContent = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Router>
            <NavBar />
            <div className="main-content">
                <Routes>
                    {/* Public Route */}
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to="/inventory" /> : <Login />}
                    />

                    {/* Private Routes */}
                    <Route
                        path="/inventory"
                        element={
                            <PrivateRoute>
                                <Inventory />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/sales-rep"
                        element={
                            <PrivateRoute>
                                <SalesRep />
                            </PrivateRoute>
                        }
                    />

                    {/* Fallback routing */}
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/inventory" : "/login"} replace />} />
                </Routes>
            </div>
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
