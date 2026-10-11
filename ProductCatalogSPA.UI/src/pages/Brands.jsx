import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBrand, setCurrentBrand] = useState({ brandName: '', stock: 0, productId: '' });
    const [isEditing, setIsEditing] = useState(false);

    const loadData = async () => {
        const [brandRes, prodRes] = await Promise.all([api.get('/brands'), api.get('/products')]);
        setBrands(brandRes.data);
        setProducts(prodRes.data);
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...currentBrand, productId: parseInt(currentBrand.productId), stock: parseInt(currentBrand.stock) };
        if (isEditing) {
            await api.put(`/brands/${currentBrand.brandId}`, data);
        } else {
            await api.post('/brands', data);
        }
        setIsModalOpen(false);
        loadData();
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this brand?')) {
            await api.delete(`/brands/${id}`);
            loadData();
        }
    };

    const openCreateModal = () => {
        setCurrentBrand({ brandName: '', stock: 0, productId: products.length > 0 ? products[0].productId : '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (brand) => {
        setCurrentBrand(brand);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="heading">Brands</h1>
                <button className="btn" onClick={openCreateModal}><Plus size={18} /> Add Brand</button>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Brand Name</th>
                            <th>Stock</th>
                            <th>Product</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map(brand => (
                            <tr key={brand.brandId}>
                                <td>{brand.brandName}</td>
                                <td>
                                    <span style={{ 
                                        padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem',
                                        background: brand.stock > 10 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: brand.stock > 10 ? 'var(--success)' : 'var(--danger)'
                                    }}>
                                        {brand.stock} in stock
                                    </span>
                                </td>
                                <td>{brand.product?.productName || brand.productId}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn" style={{ padding: '6px' }} onClick={() => openEditModal(brand)}><Edit2 size={16} /></button>
                                        <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => handleDelete(brand.brandId)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content">
                        <h2>{isEditing ? 'Edit Brand' : 'New Brand'}</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                            <label className="label">Brand Name</label>
                            <input className="input-field" type="text" value={currentBrand.brandName} onChange={e => setCurrentBrand({...currentBrand, brandName: e.target.value})} required maxLength={20} />
                            
                            <label className="label">Stock</label>
                            <input className="input-field" type="number" min="0" value={currentBrand.stock} onChange={e => setCurrentBrand({...currentBrand, stock: e.target.value})} required />
                            
                            <label className="label">Product</label>
                            <select className="input-field" value={currentBrand.productId} onChange={e => setCurrentBrand({...currentBrand, productId: e.target.value})} required>
                                <option value="" disabled>Select Product</option>
                                {products.map(p => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
                            </select>

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

export default Brands;
