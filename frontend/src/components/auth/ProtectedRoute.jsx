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
      <div className="center-layout loading-spinner">
        <div className="center-content card p-5">
          <div className="flex flex-column items-center gap-4">
            <div className="relative">
              <FaShieldAlt size={64} className="text-chef-red" />
              <div className="absolute -bottom-2 -right-2">
                <FaSpinner className="spinner-icon" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-warm-gray-dark">Authentication Check</h2>
            <p className="text-warm-gray-medium text-center">
              🔒 Verifying your credentials...
            </p>
            <div className="w-full mt-4">
              <div className="progress-label">
                <span>Progress</span>
                <span className="progress-value">Loading...</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar progress-bar-exp" style={{ width: '70%' }}></div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm text-warm-gray-medium">
                <FaShieldAlt className="text-xs" />
                <span>Checking JWT token validity...</span>
              </div>
            </div>
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