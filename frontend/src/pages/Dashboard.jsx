import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Dashboard</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </header>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <h2>Welcome, {user?.username}!</h2>
                <p>Role: <strong>{user?.role}</strong></p>
                <p>This is a protected dashboard area.</p>
            </div>
        </div>
    );
};

export default Dashboard;
