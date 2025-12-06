import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaSpinner } from 'react-icons/fa';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Check token with backend endpoint
        const response = await fetch('http://localhost/api/auth/me.php', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsAuthenticated(true);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        } else {
          // API error
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  if (loading) {
    return (
      <div className="auth-loading-container animate__animated animate__fadeIn">
        <div className="auth-shield-icon">
          <FaShieldAlt size={64} color="#4CAF50" />
          <div className="spinner-container">
            <FaSpinner className="spinner-icon" size={32} />
          </div>
        </div>
        <h2 className="auth-loading-title">Authentication Check</h2>
        <p className="auth-loading-text">
          🔒 Verifying your credentials...
        </p>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="loading-tip">
            <FaShieldAlt className="tip-icon" />
            <span>Checking JWT token validity...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;