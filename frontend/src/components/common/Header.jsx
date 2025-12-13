import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as usersApi from '../../api/users';
import {
  FaHome, FaUtensils, FaUsers, FaBook,
  FaUser, FaCoins, FaGem, FaSignOutAlt,
  FaSearch, FaBell, FaStore, FaTrophy,
  FaBars, FaEnvelope
} from 'react-icons/fa';

const Header = () => {
  const { logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const response = await usersApi.getUserStats();
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  if (!isAuthenticated()) {
    return (
      <header className="page-header">
        <nav className="nav-main">
          <Link to="/" className="nav-brand">
            <span className="nav-brand-icon">🍳</span>
            <span className="nav-brand-text">CookTogether</span>
          </Link>

          <div className="nav-menu">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="btn-rpg btn-rpg-primary">
              Register
            </Link>
          </div>

          <button
            className="nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars />
          </button>
        </nav>
      </header>
    );
  }

  return (
    <header className="page-header">
      <nav className="nav-main">
        <Link to="/" className="nav-brand">
          <span className="nav-brand-icon">🍳</span>
          <span className="nav-brand-text">CookTogether</span>
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" /> Home
          </Link>
          <Link to="/recipes" className="nav-link">
            <FaUtensils className="nav-icon" /> Recipes
          </Link>
          <Link to="/discover" className="nav-link">
            <FaUsers className="nav-icon" /> Discover
          </Link>
          <Link to="/cookbooks" className="nav-link">
            <FaBook className="nav-icon" /> Cookbooks
          </Link>
          <Link to="/shop" className="nav-link">
            <FaStore className="nav-icon" /> Shop
          </Link>
        </div>

        <div className="nav-actions">
          <button className="nav-action-button">
            <FaBell className="nav-icon" />
          </button>
          <button className="nav-action-button">
            <FaEnvelope className="nav-icon" />
          </button>
          <button className="nav-action-button">
            <FaUser className="nav-icon" />
          </button>
          {userStats && (
            <div className="currency-display">
              <div className="currency-item currency-gold">
                <FaCoins className="currency-icon" />
                <span className="currency-amount">
                  {userStats.gold_count || 0}G
                </span>
              </div>
              <div className="currency-item currency-gem">
                <FaGem className="currency-icon" />
                <span className="currency-amount">
                  {userStats.gem_count || 0}
                </span>
              </div>
              <div className="level-badge">
                <FaTrophy /> Lvl {userStats.level || 1}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn-rpg btn-rpg-secondary"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FaBars />
        </button>
      </nav>
    </header>
  );
};

export default Header;