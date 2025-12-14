import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        full_name: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3 || formData.username.length > 20) {
            newErrors.username = 'Username must be 3-20 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password needs uppercase, lowercase, and number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            // Use axios
            const response = await api.post('/register.php', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name
            });

            const data = response.data;

            if (data.success) {
                setSuccessMessage(data.message);
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('rewards', JSON.stringify(data.rewards));

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setErrors({
                    server: data.message || 'Registration failed'
                });
            }
        } catch (error) {
            // Error handling
            if (error.response) {
                // Server responded with error status
                setErrors({
                    server: error.response.data?.message || 'Registration failed'
                });
            } else if (error.request) {
                // Request made but no response
                setErrors({
                    server: 'Network error. Please check your connection.'
                });
            } else {
                // Something else went wrong
                setErrors({
                    server: 'An error occurred. Please try again.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-form-container">
            <h2 className="register-title">Join CookTogether 🍳</h2>
            <p className="register-subtitle">Start your cooking journey with us!</p>

            {successMessage && (
                <div className="success-message">
                    <div className="success-icon">🎉</div>
                    <div>
                        <h3>{successMessage}</h3>
                        <p>You received: <span className="gold-text">100 Gold</span> & <span className="gem-text">10 Gems</span>!</p>
                        <p>Redirecting to login...</p>
                    </div>
                </div>
            )}

            {errors.server && (
                <div className="error-message">
                    ❌ {errors.server}
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label htmlFor="username">Username *</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        className={errors.username ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={errors.email ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        className={errors.password ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.password && <span className="error-text">{errors.password}</span>}
                    <div className="password-hint">
                        Must contain: uppercase, lowercase, and number
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        className={errors.confirmPassword ? 'error' : ''}
                        disabled={isLoading}
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                <div className="rewards-preview">
                    <h4>🎁 Welcome Bonus:</h4>
                    <p>• <span className="gold-text">100 Gold</span> to start cooking</p>
                    <p>• <span className="gem-text">10 Gems</span> for premium features</p>
                    <p>• <span className="xp-text">Level 1 Starter Kit</span></p>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account 🍳'}
                </button>

                <div className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;