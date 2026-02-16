import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decode token to get user info (simplified for now)
            // In a real app, you might call /api/auth/me
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token } = response.data;

            localStorage.setItem('token', token);
            setToken(token);

            // Simulating user data extraction (since backend doesn't return user details yet)
            // Ideally backend should return user info with token
            const userData = { username, role: username === 'admin' ? 'ADMIN' : 'CUSTOMER' };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
