import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                await register({ username, password, email, fullName });
                setIsRegistering(false);
                alert("Registration successful, please log in.");
            } else {
                await login(username, password);
                navigate('/');
            }
        } catch (err) {
            alert('Authentication failed.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
            <div className="glass-panel" style={{ width: '400px' }}>
                <h2 className="heading" style={{ textAlign: 'center', marginBottom: '24px' }}>
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <>
                            <label className="label">Full Name</label>
                            <input className="input-field" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
                            <label className="label">Email</label>
                            <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </>
                    )}
                    <label className="label">Username</label>
                    <input className="input-field" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                    
                    <label className="label">Password</label>
                    <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    
                    <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                        {isRegistering ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button 
                        onClick={() => setIsRegistering(!isRegistering)} 
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
