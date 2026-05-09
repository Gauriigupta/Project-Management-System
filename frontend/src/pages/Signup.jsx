import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await API.post('/auth/signup', formData);
            alert("Registration successful!");
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed");
        }finally {
            // Success ho ya error, loading ko false karein
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="brand-overlay">
                <h1>Ethara.Al</h1>
                <p>Join India's research-first AI lab for AGI development.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-title">
                    <h2>Create Researcher Account</h2>
                    <p>Access domain-specific LLM post-training workflows.</p>
                </div>

                <input
                    type="text" placeholder="Full Name" required
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isLoading}
                />
                <input
                    type="email" placeholder="Email" required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                />
                <input
                    type="password" placeholder="Password " required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                />

                <label className="field-label">Specialization Role:</label>
                <select onChange={(e) => setFormData({ ...formData, role: e.target.value })} disabled={isLoading}>
                    <option value="Annotator">Member</option>
                    <option value="Admin"> Admin</option>
                </select>

                <button
                    type="submit"
                    className={`btn-submit ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Register'}
                </button>

                <p className="navigate-text">
                    Already a member? <Link to="/" className="link-text">Login to Workspace</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;