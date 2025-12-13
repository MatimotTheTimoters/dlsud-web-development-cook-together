import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaShieldAlt, FaLock, FaUser } from 'react-icons/fa';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="protected-route-container">
        <div className="protected-route-card card">
          <div className="card-header">
            <div className="card-title">
              <FaShieldAlt className="icon-chef-red" />
              <h2>🔒 Access Restricted</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="access-message">
              <FaLock className="access-icon" />
              <p>This content requires authentication.</p>
              <p>Please login or register to continue.</p>
            </div>
            <div className="access-actions">
              <a href="/login" className="btn-rpg btn-rpg-primary">
                <FaUser className="button-icon" />
                🔐 Login
              </a>
              <a href="/register" className="btn-rpg btn-rpg-secondary">
                <FaShieldAlt className="button-icon" />
                👤 Register
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;