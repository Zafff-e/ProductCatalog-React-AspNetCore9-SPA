import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ categoryName: '' });
    const [isEditing, setIsEditing] = useState(false);

    const loadData = async () => {
        const res = await api.get('/categories');
        setCategories(res.data);
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await api.put(`/categories/${currentCategory.categoryId}`, currentCategory);
        } else {
            await api.post('/categories', currentCategory);
        }
        setIsModalOpen(false);
        loadData();
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this category?')) {
            await api.delete(`/categories/${id}`);
            loadData();
        }
    };

    const openCreateModal = () => {
        setCurrentCategory({ categoryName: '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (cat) => {
        setCurrentCategory(cat);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="heading">Categories</h1>
                <button className="btn" onClick={openCreateModal}><Plus size={18} /> Add Category</button>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                            <th style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.categoryId}>
                                <td>{cat.categoryId}</td>
                                <td>{cat.categoryName}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn" style={{ padding: '6px' }} onClick={() => openEditModal(cat)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => handleDelete(cat.categoryId)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>No categories found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content">
                        <h2>{isEditing ? 'Edit Category' : 'New Category'}</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                            <label className="label">Category Name</label>
                            <input 
                                className="input-field" 
                                type="text" 
                                value={currentCategory.categoryName} 
                                onChange={e => setCurrentCategory({...currentCategory, categoryName: e.target.value})} 
                                required 
                                maxLength={20}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                                <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--border-color)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
