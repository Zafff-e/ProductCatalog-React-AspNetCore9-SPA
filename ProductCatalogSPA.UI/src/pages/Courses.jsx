import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({ courseName: '' });
    const [isEditing, setIsEditing] = useState(false);

    const loadData = async () => {
        const res = await api.get('/courses');
        setCourses(res.data);
        setFilteredCourses(res.data);
    };

    useEffect(() => { loadData(); }, []);

    // Live search debounce
    useEffect(() => {
        const delay = setTimeout(() => {
            const lowerSearch = searchTerm.toLowerCase();
            setFilteredCourses(courses.filter(c => c.courseName.toLowerCase().includes(lowerSearch)));
        }, 300);
        return () => clearTimeout(delay);
    }, [searchTerm, courses]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await api.put(`/courses/${currentCourse.courseId}`, currentCourse);
        } else {
            await api.post('/courses', currentCourse);
        }
        setIsModalOpen(false);
        loadData();
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this course?')) {
            await api.delete(`/courses/${id}`);
            loadData();
        }
    };

    const openCreateModal = () => {
        setCurrentCourse({ courseName: '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="heading">Courses</h1>
                <button className="btn" onClick={openCreateModal}><Plus size={18} /> Add Course</button>
            </div>

            <div style={{ marginBottom: '20px', position: 'relative', width: '300px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={18} />
                <input 
                    className="input-field" 
                    style={{ paddingLeft: '40px', marginBottom: '0' }} 
                    placeholder="Live search courses..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Course Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.map(course => (
                            <tr key={course.courseId}>
                                <td>{course.courseId}</td>
                                <td>{course.courseName}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => handleDelete(course.courseId)}>
                                            <Trash2 size={16} />
                                        </button>
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
                        <h2>{isEditing ? 'Edit Course' : 'New Course'}</h2>
                        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                            <label className="label">Course Name</label>
                            <input className="input-field" type="text" value={currentCourse.courseName} onChange={e => setCurrentCourse({...currentCourse, courseName: e.target.value})} required maxLength={100} />
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

export default Courses;
