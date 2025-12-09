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
    <div className="center-layout">
      <div className="form-layout card animate__animated animate__fadeIn">
        <div className="card-header text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-warm-gray-dark">LOGIN FORM</h2>
            <div className="text-chef-red">
              <FaFire size={24} />
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
              <label htmlFor="email" className="form-label flex items-center gap-2">
                <FaUser className="text-warm-gray-medium" />
                Email Address
              </label>
              <div className="form-with-icon">
                <FaUser className="form-icon text-warm-gray-medium" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`form-control ${errors.email ? 'form-control-error' : ''}`}
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label flex items-center gap-2">
                <FaLock className="text-warm-gray-medium" />
                Password
              </label>
              <div className="form-with-icon">
                <FaLock className="form-icon text-warm-gray-medium" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`form-control ${errors.password ? 'form-control-error' : ''}`}
                />
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="bg-creamy-white p-3 rounded-lg border border-gold-coin">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎮</div>
                <div className="flex-1">
                  <div className="font-semibold text-warm-gray-dark">Login Streak: {loginStreak} days</div>
                  <div className="text-sm text-sizzling-orange">+5 EXP per day!</div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-rpg btn-rpg-primary w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <FaFire />
                  LOGIN
                </>
              )}
            </button>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                className="btn-rpg btn-rpg-secondary text-sm"
                onClick={resetForm}
              >
                Reset Form
              </button>
              <a href="/forgot-password" className="text-chef-red hover:underline text-sm">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>

        <div className="card-footer animate__animated animate__pulse animate__infinite bg-gradient-to-r from-chef-red to-sizzling-orange text-white">
          <div className="flex items-center gap-2 justify-center">
            <FaFire />
            <span className="font-semibold">🔥 Daily Login Bonus Available! +100 Gold Today!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;