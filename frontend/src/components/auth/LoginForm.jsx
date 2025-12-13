import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../../api/auth';
import { FaUser, FaLock, FaFire } from 'react-icons/fa';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await authApi.login(formData.email, formData.password);

      if (response.success) {
        // Show login success notification if response contains bonus info
        if (response.data.daily_bonus) {
          // Bonus notification would be handled by NotificationContext
        }
        navigate('/');
      } else {
        setErrors({ general: response.message || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred during login' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="login-form-container">
      <div className="login-card card">
        <div className="card-header">
          <div className="card-title">
            <FaFire className="icon-chef-red" />
            <h2>🔐 Login to CookTogether</h2>
          </div>
        </div>

        <div className="card-body">
          {errors.general && (
            <div className="notification notification-error">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaUser className="form-label-icon" />
                <span>📧 Email:</span>
              </label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="form-label-icon" />
                <span>🔒 Password:</span>
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>✅ Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-password-link">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="btn-rpg btn-rpg-primary btn-login"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-text">Authenticating...</span>
              ) : (
                <>
                  <FaFire className="button-icon" />
                  <span>🍳 Login</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card-footer">
          <div className="auth-links">
            <p>
              New here?{' '}
              <a href="/register" className="register-link">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;