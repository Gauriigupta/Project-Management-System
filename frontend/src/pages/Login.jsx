import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await API.post('/auth/login', formData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="brand-overlay">
                <h1>Ethara.Al</h1>
                <p>Welcome back to the research portal.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-title">
                    <h2>Login</h2>
                    <p>Enter your credentials to access your workspace.</p>
                </div>

                <input
                    type="email"
                    placeholder="Email Address"
                    required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    className={`btn-submit ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                <p className="navigate-text">
                    New here? <Link to="/signup" className="link-text">Create Account</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;