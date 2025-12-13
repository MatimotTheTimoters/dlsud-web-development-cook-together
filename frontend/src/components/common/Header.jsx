import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as usersApi from '../../api/users';
import {
  FaHome, FaUtensils, FaUsers, FaBook,
  FaUser, FaCoins, FaGem, FaSignOutAlt,
  FaSearch, FaBell, FaStore, FaTrophy,
  FaChevronDown, FaBars
} from 'react-icons/fa';

const Header = () => {
  const { logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userStats, setUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadUserStats = async () => {
    if (!user) return;

    setLoadingStats(true);
    try {
      const response = await usersApi.getUserStats();
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoadingStats(false);
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
      {/* Top Bar */}
      <div className="header-top-bar nav-main">
        <div className="nav-brand">
          <Link to="/" className="nav-brand">
            <span className="nav-brand-icon animate__animated animate__pulse">🍳</span>
            <span className="nav-brand-text">CookTogether</span>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-container">
          <div className="form-with-icon">
            <FaSearch className="form-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, users, cookbooks..."
              className="form-control"
            />
            <button type="submit" className="btn-rpg btn-rpg-sm">
              Search
            </button>
          </div>
        </form>

        {/* User Info */}
        <div className="user-info-container">
          <div className="currency-display">
            <div className="currency-item currency-gold">
              <FaCoins className="currency-icon" />
              <span className="currency-amount">
                {loadingStats ? '...' : (userStats?.gold_count || 0).toLocaleString()}G
              </span>
            </div>
            <div className="currency-item currency-gem">
              <FaGem className="currency-icon" />
              <span className="currency-amount">
                {loadingStats ? '...' : userStats?.gem_count || 0}
              </span>
            </div>
          </div>

          <div className="user-profile-mini">
            <Link to="/profile" className="profile-link">
              <img
                src={user?.profile_picture || '/default-avatar.png'}
                alt={user?.full_name || 'User'}
                className="card-user-avatar"
              />
              <div className="profile-info">
                <span className="profile-greeting">{getGreeting()},</span>
                <span className="profile-name">
                  {user?.full_name || 'Chef'}
                </span>
                <div className="level-badge badge">
                  <FaTrophy /> Lvl {userStats?.level || 1}
                </div>
              </div>
            </Link>
          </div>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className={`header-navigation nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" /> Home
          </Link>
          <Link to="/recipes" className="nav-link">
            <FaUtensils className="nav-icon" /> Recipes
          </Link>
          <Link to="/cooking-sessions" className="nav-link">
            <FaUsers className="nav-icon" /> Sessions
          </Link>
          <Link to="/cookbooks" className="nav-link">
            <FaBook className="nav-icon" /> Cookbooks
          </Link>
          <Link to="/discover" className="nav-link">
            <FaUsers className="nav-icon" /> Discover
          </Link>
          <Link to="/shop" className="nav-link">
            <FaStore className="nav-icon" /> Shop
          </Link>
          <Link to="/profile" className="nav-link">
            <FaUser className="nav-icon" /> Profile
          </Link>
        </div>

        <div className="nav-actions">
          <button className="nav-action-button notification-button">
            <FaBell />
          </button>
          <button
            onClick={handleLogout}
            className="btn-rpg btn-rpg-secondary logout-button"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      {/* Progress Bar */}
      {userStats && (
        <div className="header-progress-bar">
          <div className="progress-label">
            <span>Level {userStats.level}</span>
            <span className="progress-value">
              {userStats.current_exp || 0} / {userStats.current_level_ceiling || 100} EXP
            </span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar progress-bar-exp"
              style={{
                width: `${((userStats.current_exp || 0) / (userStats.current_level_ceiling || 100)) * 100}%`
              }}
            >
              <div className="progress-sparkle"></div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;