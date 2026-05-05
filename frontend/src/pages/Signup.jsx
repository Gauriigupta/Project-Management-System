import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/signup', formData);
            alert("Signup successful! Please login.");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="email" placeholder="Email" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input type="password" placeholder="Password (min 6 chars)" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                <select onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                </select>

                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;