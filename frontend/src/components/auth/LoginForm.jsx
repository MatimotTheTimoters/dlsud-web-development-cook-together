import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
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

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
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

  return (
    <div className="login-form">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-center gap-3">
            <h2>LOGIN FORM</h2>
            <FaFire className="text-chef-red" />
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="notification notification-error">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <FaUser />
                Email Address
              </label>
              <div className="form-with-icon">
                <FaUser className="form-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className={`form-control ${errors.email ? 'form-control-error' : ''}`}
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock />
                Password
              </label>
              <div className="form-with-icon">
                <FaLock className="form-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`form-control ${errors.password ? 'form-control-error' : ''}`}
                />
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn-rpg btn-rpg-primary w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : <><FaFire /> LOGIN</>}
            </button>

            <div className="flex justify-between items-center">
              <button
                type="button"
                className="btn-rpg btn-rpg-secondary"
                onClick={resetForm}
              >
                Reset Form
              </button>
              <a href="/forgot-password">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;