import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            try {
                const decoded = jwtDecode(token);
                // Extract role (depends on how ASP.NET formats it, usually it's in a specific schema string)
                const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'User';
                setUser({ username, token, role });
            } catch (e) {
                console.error("Invalid token");
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        const token = res.data.token;
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'User';
        
        localStorage.setItem('token', token);
        localStorage.setItem('username', res.data.username);
        setUser({ username: res.data.username, token, role });
    };

    const register = async (userData) => {
        await api.post('/auth/register', userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
