import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaFire } from 'react-icons/fa';
import { login } from '../../api/auth';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginStreak, setLoginStreak] = useState(7);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Use the API module instead of direct fetch
      const response = await login(formData.email, formData.password);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Increment login streak (simulated - backend would handle this)
        const newStreak = loginStreak + 1;
        setLoginStreak(newStreak);
        
        // Show success message with gamified element
        alert('🔥 Login successful! +10 EXP for daily login!');
        
        // Navigate to home page
        navigate('/');
      } else {
        setErrors({ general: response.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred during login' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '' });
    setErrors({});
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card animate__animated animate__fadeIn">
        <div className="login-form-header">
          <h2>LOGIN FORM</h2>
          <div className="fire-icon">
            <FaFire size={24} color="#FF6B6B" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message game-error">
              ⚠️ {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">
              <FaUser className="input-icon" /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="login-streak-display">
            <div className="streak-icon">🎮</div>
            <div className="streak-text">Login Streak: {loginStreak} days</div>
            <div className="streak-bonus">+5 EXP per day!</div>
          </div>
          
          <button 
            type="submit" 
            className="login-button game-button"
            disabled={loading}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <FaFire className="button-icon" />
                LOGIN
              </>
            )}
          </button>
          
          <div className="form-footer">
            <button 
              type="button" 
              className="reset-button"
              onClick={resetForm}
            >
              Reset Form
            </button>
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>
        </form>
        
        <div className="daily-bonus-banner animate__animated animate__pulse animate__infinite">
          <FaFire className="bonus-icon" />
          <span className="bonus-text">🔥 Daily Login Bonus Available! +100 Gold Today!</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;