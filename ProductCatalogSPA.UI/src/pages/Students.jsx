import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({ name: '', email: '', courseId: '' });
    const [isEditing, setIsEditing] = useState(false);
    
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'Admin';

    const loadData = async () => {
        const [studRes, courseRes] = await Promise.all([api.get('/students'), api.get('/courses')]);
        setStudents(studRes.data);
        setCourses(courseRes.data);
    };

    useEffect(() => { loadData(); }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            const lowerSearch = searchTerm.toLowerCase();
            setFilteredStudents(students.filter(s => s.name.toLowerCase().includes(lowerSearch) || s.email.toLowerCase().includes(lowerSearch)));
        }, 300);
        return () => clearTimeout(delay);
    }, [searchTerm, students]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...currentStudent, courseId: parseInt(currentStudent.courseId) };
        if (isEditing) {
            await api.put(`/students/${currentStudent.studentId}`, data);
        } else {
            await api.post('/students', data);
        }
        setIsModalOpen(false);
        loadData();
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this student?')) {
            await api.delete(`/students/${id}`);
            loadData();
        }
    };

    const openCreateModal = () => {
        setCurrentStudent({ name: '', email: '', courseId: courses.length > 0 ? courses[0].courseId : '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (stud) => {
        setCurrentStudent(stud);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="heading">Students</h1>
                {isAdmin && <button className="btn" onClick={openCreateModal}><Plus size={18} /> Add Student</button>}
            </div>

            <div style={{ marginBottom: '20px', position: 'relative', width: '300px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={18} />
                <input 
                    className="input-field" 
                    style={{ paddingLeft: '40px', marginBottom: '0' }} 
                    placeholder="Live search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Course</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(stud => (
                            <tr key={stud.studentId}>
                                <td>{stud.name}</td>
                                <td>{stud.email}</td>
                                <td>{stud.course?.courseName || stud.courseId}</td>
                                {isAdmin && <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn" style={{ padding: '6px' }} onClick={() => openEditModal(stud)}><Edit2 size={16} /></button>
                                        <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => handleDelete(stud.studentId)}><Trash2 size={16} /></button>
                                    </div>
                                </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content" style={{ maxWidth: '500px' }}>
                        <h2>{isEditing ? 'Edit Student' : 'New Student'}</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="label">Full Name</label>
                                <input className="input-field" type="text" value={currentStudent.name} onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})} required maxLength={50} />
                            </div>
                            <div>
                                <label className="label">Email Address</label>
                                <input className="input-field" type="email" value={currentStudent.email} onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})} required />
                            </div>
                            <div>
                                <label className="label">Enrolled Course</label>
                                <select className="input-field" value={currentStudent.courseId} onChange={e => setCurrentStudent({...currentStudent, courseId: e.target.value})} required>
                                    <option value="" disabled>Select Course</option>
                                    {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
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

export default Students;
