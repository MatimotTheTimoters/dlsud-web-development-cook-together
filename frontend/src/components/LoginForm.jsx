import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
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

        try {
            const response = await api.post('/login.php', {
                email: formData.email,
                password: formData.password
            });

            const data = response.data;

            if (data.success) {
                // Store authentication data - NO TOKEN, just user data
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('user_stats', JSON.stringify(data.stats));

                // Show success message
                alert(`✅ ${data.message}\n\n🎁 Daily Bonus: +${data.daily_bonus.gold} Gold, +${data.daily_bonus.gems} Gems`);

                // Redirect to home page
                navigate('/');
            } else {
                setErrors({
                    server: data.message || 'Login failed'
                });
            }
        } catch (error) {
            if (error.response) {
                setErrors({
                    server: error.response.data?.message || 'Login failed'
                });
            } else if (error.request) {
                setErrors({
                    server: 'Network error. Please check your connection.'
                });
            } else {
                setErrors({
                    server: 'An error occurred. Please try again.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-form-container">
            <h2 className="login-title">Welcome Back! 👨‍🍳</h2>
            <p className="login-subtitle">Sign in to continue your cooking journey</p>

            {errors.server && (
                <div className="error-message">
                    ❌ {errors.server}
                </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={errors.email ? 'error' : ''}
                        disabled={isLoading}
                        autoComplete="email"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={errors.password ? 'error' : ''}
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="show-password-btn"
                            onClick={toggleShowPassword}
                            tabIndex="-1"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-options">
                    <label className="remember-me">
                        <input type="checkbox" />
                        <span>Remember me</span>
                    </label>
                    <a href="/forgot-password" className="forgot-password">
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign In 🍳'}
                </button>

                <div className="bonus-info">
                    <h4>📅 Daily Login Bonus:</h4>
                    <p>• <span className="gold-text">+10 Gold</span> every day</p>
                    <p>• <span className="gem-text">+1 Gem</span> daily reward</p>
                    <p>• <span className="xp-text">Streak bonuses</span> every 7 days</p>
                </div>

                <div className="register-link">
                    New to CookTogether? <a href="/register">Create an account</a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;