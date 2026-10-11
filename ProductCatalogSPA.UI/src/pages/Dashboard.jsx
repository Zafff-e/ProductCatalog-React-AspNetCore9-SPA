import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, List, Tag, Users } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalCategories: 0, totalProducts: 0, totalBrands: 0, totalStudents: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <div className="page-header">
                <h1 className="heading">Dashboard</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '16px', borderRadius: '12px', color: 'var(--primary)' }}>
                        <List size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }}>Categories</p>
                        <h2 style={{ fontSize: '2rem', marginTop: '8px' }}>{stats.totalCategories}</h2>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '16px', borderRadius: '12px', color: 'var(--success)' }}>
                        <Package size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }}>Products</p>
                        <h2 style={{ fontSize: '2rem', marginTop: '8px' }}>{stats.totalProducts}</h2>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '16px', borderRadius: '12px', color: '#a855f7' }}>
                        <Tag size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }}>Brands</p>
                        <h2 style={{ fontSize: '2rem', marginTop: '8px' }}>{stats.totalBrands}</h2>
                    </div>
                </div>

                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '12px', color: 'var(--danger)' }}>
                        <Users size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }}>Students</p>
                        <h2 style={{ fontSize: '2rem', marginTop: '8px' }}>{stats.totalStudents}</h2>
                    </div>
                </div>
            </div>
            
            <div className="glass-panel" style={{ marginTop: '40px' }}>
                <h3 style={{ marginBottom: '16px' }}>Welcome to Enterprise Admin Portal</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    This massive dashboard is powered by a custom Stored Procedure executed via Entity Framework Core's <code>FromSqlRaw</code>. 
                    It instantly aggregates data across both the Product Catalog domain and the Students domain!
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
