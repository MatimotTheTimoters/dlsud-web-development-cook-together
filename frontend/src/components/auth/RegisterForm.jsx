import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../../api/auth';
import { FaUserPlus, FaCrown, FaTrophy, FaLock, FaEnvelope, FaUser } from 'react-icons/fa';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
      const response = await authApi.register(formData);

      if (response.success) {
        navigate('/');
      } else {
        setErrors({ general: response.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred during registration' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    if (!password) return { strength: '', color: '' };

    let strength = '';
    let color = '';

    if (password.length < 6) {
      strength = 'Weak';
      color = '#FF6B6B'; // Chef's Red
    } else if (password.length < 10) {
      strength = 'Medium';
      color = '#FF9F43'; // Sizzling Orange
    } else {
      strength = 'Strong';
      color = '#2ECC71'; // Success Green
    }

    return { strength, color };
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  return (
    <div className="register-form-container">
      <div className="register-card card">
        <div className="card-header">
          <div className="card-title">
            <FaCrown className="icon-gold-coin" />
            <h2>👤 Create Your Account</h2>
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
              <label htmlFor="full_name" className="form-label">
                <FaUser className="form-label-icon" />
                <span>👤 Full Name:</span>
              </label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  className={`form-input ${errors.full_name ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.full_name && <div className="form-error">{errors.full_name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="form-label-icon" />
                <span>📧 Email:</span>
              </label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
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
                <span>🔐 Password:</span>
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {formData.password && (
                <div className="password-strength">
                  <span className="strength-text">
                    Strength: <span style={{ color: passwordStrength.color }}>
                      {passwordStrength.strength}
                    </span>
                  </span>
                </div>
              )}
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <FaLock className="form-label-icon" />
                <span>🔐 Confirm:</span>
              </label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>

            <div className="welcome-bonus">
              <div className="bonus-header">
                <FaTrophy className="icon-gold-coin" />
                <h3>Welcome Bonus!</h3>
              </div>
              <div className="bonus-items">
                <div className="bonus-item">
                  <span className="bonus-icon">🎁</span>
                  <span>+100 Gold</span>
                </div>
                <div className="bonus-item">
                  <span className="bonus-icon">🏆</span>
                  <span>Level 1 Starter Kit</span>
                </div>
              </div>
            </div>

            <div className="form-terms">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>✅ I agree to Terms of Service</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-rpg btn-rpg-primary btn-register"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-text">Creating Account...</span>
              ) : (
                <>
                  <FaUserPlus className="button-icon" />
                  <span>🍳 Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card-footer">
          <div className="auth-links">
            <p>
              Already have an account?{' '}
              <a href="/login" className="login-link">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;