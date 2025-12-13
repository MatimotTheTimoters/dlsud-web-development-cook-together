import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import { FaUserPlus, FaCrown, FaTrophy } from 'react-icons/fa';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
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
      const response = await register(formData);

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

  return (
    <div className="register-form">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-center gap-3">
            <h2>REGISTER FORM</h2>
            <FaCrown className="text-gold-coin" />
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
              <label htmlFor="full_name">
                <FaUserPlus />
                Full Name
              </label>
              <div className="form-with-icon">
                <FaUserPlus className="form-icon" />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  className={`form-control ${errors.full_name ? 'form-control-error' : ''}`}
                />
              </div>
              {errors.full_name && <span className="form-error">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className={`form-control ${errors.email ? 'form-control-error' : ''}`}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password"
                className={`form-control ${errors.password ? 'form-control-error' : ''}`}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn-rpg btn-rpg-primary w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : <><FaCrown /> REGISTER</>}
            </button>
          </form>
        </div>

        <div className="card-footer">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <FaTrophy />
              <h3>Welcome Bonus!</h3>
            </div>
            <p>100 Gold + Chef Hat Unlocked!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;