import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaCrown, FaTrophy } from 'react-icons/fa';
import { register } from '../../api/auth';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    age: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 13 || formData.age > 120)) {
      newErrors.age = 'Age must be between 13 and 120';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    if (!password) return 'No password';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const ratings = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return ratings[strength];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Check password strength in real-time
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare user data according to API contract
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        ...(formData.age && { age: parseInt(formData.age) }),
        ...(formData.gender && { gender: formData.gender })
      };
      
      // Use the API module instead of direct fetch
      const response = await register(userData);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Show welcome bonus message
        alert('🏆 Welcome Bonus: 100 Gold + Chef Hat Unlocked!');
        
        // Navigate to home page
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

  return (
    <div className="register-form-container">
      <div className="register-form-card animate__animated animate__fadeIn">
        <div className="register-form-header">
          <h2>REGISTER FORM</h2>
          <div className="crown-icon">
            <FaCrown size={28} color="#FFD700" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message game-error">
              ⚠️ {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="full_name">
              <FaUserPlus className="input-icon" /> Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.full_name ? 'input-error' : ''}
            />
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
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
            <label htmlFor="password">🔑 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            {formData.password && (
              <div className="password-strength">
                Strength: <span className={`strength-${passwordStrength.toLowerCase().replace(' ', '-')}`}>
                  {passwordStrength}
                </span>
              </div>
            )}
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="age">👥 Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="13"
                max="120"
                className={errors.age ? 'input-error' : ''}
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>
            
            <div className="form-group half">
              <label htmlFor="gender">👥 Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? 'input-error' : ''}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          <div className="reward-info">
            <div className="reward-item">
              <FaCrown className="reward-icon" />
              <span className="reward-text">Register & Get 100 Gold</span>
            </div>
            <div className="reward-item">
              <FaTrophy className="reward-icon" />
              <span className="reward-text">Complete Profile +50 EXP</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="register-button game-button"
            disabled={loading}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <FaCrown className="button-icon" />
                REGISTER & GET 100 GOLD
              </>
            )}
          </button>
        </form>
        
        <div className="welcome-bonus-banner animate__animated animate__pulse">
          <FaTrophy className="bonus-icon" />
          <div className="bonus-content">
            <h3>🏆 Welcome Bonus!</h3>
            <p>100 Gold + Chef Hat Unlocked!</p>
            <small>Complete your profile to earn additional rewards</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;