import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, Package, Tag, LogOut, Users } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);

    return (
        <div className="sidebar glass-panel">
            <h2 className="heading" style={{ fontSize: '1.5rem' }}>Catalog SPA</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Welcome, {user?.username}</p>
            
            <div className="sidebar-nav">
                <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
                    <LayoutDashboard size={20} /> Dashboard
                </NavLink>
                <NavLink to="/categories" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                    <List size={20} /> Categories
                </NavLink>
                <NavLink to="/products" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                    <Package size={20} /> Products
                </NavLink>
                <NavLink to="/brands" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                    <Tag size={20} /> Brands
                </NavLink>
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '12px 0' }}></div>
                <NavLink to="/courses" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                    <List size={20} /> Courses
                </NavLink>
                <NavLink to="/students" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                    <Users size={20} /> Students
                </NavLink>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <button onClick={logout} className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
