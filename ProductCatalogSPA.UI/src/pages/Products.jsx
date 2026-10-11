import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Search, UploadCloud } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ 
        productName: '', manufacturingDate: '', isAvailable: true, modelNo: '', categoryId: '', price: 0, imageUrl: '' 
    });
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'Admin';

    const loadData = async () => {
        const [prodRes, catRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
    };

    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            const lowerSearch = searchTerm.toLowerCase();
            setFilteredProducts(products.filter(p => p.productName.toLowerCase().includes(lowerSearch) || p.modelNo.toLowerCase().includes(lowerSearch)));
        }, 300);
        return () => clearTimeout(delay);
    }, [searchTerm, products]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...currentProduct, categoryId: parseInt(currentProduct.categoryId) };
        let productId = currentProduct.productId;

        if (isEditing) {
            await api.put(`/products/${productId}`, data);
        } else {
            const res = await api.post('/products', data);
            productId = res.data.productId;
        }

        if (imageFile && isAdmin) {
            const formData = new FormData();
            formData.append('image', imageFile);
            await api.post(`/products/${productId}/image`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        }

        setIsModalOpen(false);
        setImageFile(null);
        loadData();
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            await api.delete(`/products/${id}`);
            loadData();
        }
    };

    const openCreateModal = () => {
        setCurrentProduct({ productName: '', manufacturingDate: new Date().toISOString().split('T')[0], isAvailable: true, modelNo: '', categoryId: categories.length > 0 ? categories[0].categoryId : '', price: 0, imageUrl: '' });
        setImageFile(null);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="heading">Products</h1>
                {isAdmin && <button className="btn" onClick={openCreateModal}><Plus size={18} /> Add Product</button>}
            </div>

            <div style={{ marginBottom: '20px', position: 'relative', width: '300px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={18} />
                <input 
                    className="input-field" 
                    style={{ paddingLeft: '40px', marginBottom: '0' }} 
                    placeholder="Live search by name or model..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Model No</th>
                            <th>Category</th>
                            <th>Price</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(prod => (
                            <tr key={prod.productId}>
                                <td>
                                    {prod.imageUrl ? 
                                        <img src={`http://localhost:5000${prod.imageUrl}`} alt={prod.productName} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} /> : 
                                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={20} /></div>
                                    }
                                </td>
                                <td>{prod.productName}</td>
                                <td>{prod.modelNo}</td>
                                <td>{prod.category?.categoryName || prod.categoryId}</td>
                                <td>${prod.price.toFixed(2)}</td>
                                {isAdmin && <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => handleDelete(prod.productId)}><Trash2 size={16} /></button>
                                    </div>
                                </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content" style={{ maxWidth: '600px' }}>
                        <h2>{isEditing ? 'Edit Product' : 'New Product'}</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="label">Product Name</label>
                                <input className="input-field" type="text" value={currentProduct.productName} onChange={e => setCurrentProduct({...currentProduct, productName: e.target.value})} required maxLength={50} />
                            </div>
                            <div>
                                <label className="label">Model No (exactly 11 chars)</label>
                                <input className="input-field" type="text" value={currentProduct.modelNo} onChange={e => setCurrentProduct({...currentProduct, modelNo: e.target.value})} required minLength={11} maxLength={11} />
                            </div>
                            <div>
                                <label className="label">Price</label>
                                <input className="input-field" type="number" step="0.01" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})} required />
                            </div>
                            <div>
                                <label className="label">Category</label>
                                <select className="input-field" value={currentProduct.categoryId} onChange={e => setCurrentProduct({...currentProduct, categoryId: e.target.value})} required>
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Manufacturing Date</label>
                                <input className="input-field" type="date" value={currentProduct.manufacturingDate} onChange={e => setCurrentProduct({...currentProduct, manufacturingDate: e.target.value})} required />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="label">Product Image</label>
                                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('fileUpload').click()}>
                                    <UploadCloud size={24} style={{ marginBottom: '8px', color: 'var(--text-muted)' }} />
                                    <p>{imageFile ? imageFile.name : 'Click to upload image'}</p>
                                    <input id="fileUpload" type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
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

export default Products;
