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
    <div className="center-layout">
      <div className="form-layout card animate__animated animate__fadeIn">
        <div className="card-header text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-warm-gray-dark">REGISTER FORM</h2>
            <div className="text-gold-coin">
              <FaCrown size={28} />
            </div>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="notification notification-error p-3 rounded-lg">
                ⚠️ {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="full_name" className="form-label flex items-center gap-2">
                <FaUserPlus className="text-warm-gray-medium" />
                Full Name
              </label>
              <div className="form-with-icon">
                <FaUserPlus className="form-icon text-warm-gray-medium" />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`form-control ${errors.full_name ? 'form-control-error' : ''}`}
                />
              </div>
              {errors.full_name && <span className="form-error">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">📧 Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`form-control ${errors.email ? 'form-control-error' : ''}`}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">🔑 Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`form-control ${errors.password ? 'form-control-error' : ''}`}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
              {formData.password && (
                <div className="form-help">
                  Strength: <span className={`font-semibold ${passwordStrength === 'Weak' ? 'text-chef-red' :
                      passwordStrength === 'Fair' ? 'text-sizzling-orange' :
                        passwordStrength === 'Good' ? 'text-gold-coin' :
                          passwordStrength === 'Strong' ? 'text-success-green' :
                            'text-rare-gem'
                    }`}>
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age" className="form-label">👥 Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  min="13"
                  max="120"
                  className={`form-control ${errors.age ? 'form-control-error' : ''}`}
                />
                {errors.age && <span className="form-error">{errors.age}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">👥 Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`form-control ${errors.gender ? 'form-control-error' : ''}`}
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

            <div className="bg-creamy-white p-3 rounded-lg border border-gold-coin">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaCrown className="text-gold-coin" />
                  <span className="font-semibold">Register & Get 100 Gold</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-sizzling-orange" />
                  <span className="font-semibold">Complete Profile +50 EXP</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-rpg btn-rpg-gold w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FaCrown />
                  REGISTER & GET 100 GOLD
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card-footer bg-gradient-to-r from-gold-coin to-sizzling-orange text-white">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaTrophy size={24} />
              <h3 className="text-lg font-bold">🏆 Welcome Bonus!</h3>
            </div>
            <p className="font-semibold mb-1">100 Gold + Chef Hat Unlocked!</p>
            <small className="opacity-90">Complete your profile to earn additional rewards</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;