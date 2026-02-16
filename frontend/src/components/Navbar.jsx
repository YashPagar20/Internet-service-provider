import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="navbar-search">
                {/* Search input placeholder */}
            </div>

            <div className="navbar-user">
                <div className="user-info">
                    <div className="user-name">{user?.username}</div>
                    <div className="user-role">{user?.role}</div>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
