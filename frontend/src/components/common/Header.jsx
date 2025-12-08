import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { useData } from '../../contexts/DataContext';
import * as userAPI from '../../api/users';
import { 
  FaHome, FaUtensils, FaUsers, FaBook, 
  FaUser, FaCoins, FaGem, FaSignOutAlt,
  FaSearch, FaBell, FaStore, FaTrophy
} from 'react-icons/fa';

const Header = () => {
  const { logout, user } = useAuth();
  const { userData, fetchUserData } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Load user stats
  const loadUserStats = async () => {
    if (!user) return;
    
    setLoadingStats(true);
    try {
      const response = await userAPI.getUserStats();
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Load user data on mount
  useEffect(() => {
    if (user) {
      fetchUserData();
      loadUserStats();
    }
  }, [user]);

  if (!user) {
    return (
      <header className="header-container">
        <div className="header-content">
          <div className="header-logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">🍳</span>
              <span className="logo-text">CookTogether</span>
            </Link>
          </div>
          <div className="header-actions">
            <Link to="/login" className="game-button">
              Login
            </Link>
            <Link to="/register" className="game-button primary">
              Register
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header-container gamified-header">
      {/* Top Bar */}
      <div className="header-top-bar">
        <div className="header-logo">
          <Link to="/" className="logo-link animate__animated animate__pulse">
            <span className="logo-icon">🍳</span>
            <span className="logo-text">CookTogether</span>
            <span className="logo-subtitle">Level up your cooking!</span>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, users, cookbooks..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>

        {/* User Info */}
        <div className="user-info-container">
          <div className="currency-display">
            <div className="currency-item">
              <FaCoins className="currency-icon gold" />
              <span className="currency-amount">
                {loadingStats ? '...' : (userStats?.gold_count || 0).toLocaleString()}G
              </span>
            </div>
            <div className="currency-item">
              <FaGem className="currency-icon gem" />
              <span className="currency-amount">
                {loadingStats ? '...' : userStats?.gem_count || 0}
              </span>
            </div>
          </div>

          <div className="user-profile-mini">
            <Link to="/profile" className="profile-link">
              <img 
                src={userData?.profile_picture || '/default-avatar.png'} 
                alt={userData?.full_name || 'User'}
                className="profile-picture-mini"
              />
              <div className="profile-info">
                <span className="profile-greeting">{getGreeting()},</span>
                <span className="profile-name">
                  {userData?.full_name || 'Chef'}
                </span>
                <div className="level-badge-mini">
                  <FaTrophy /> Lvl {userStats?.level || 1}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="header-navigation">
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <FaHome /> Home
          </Link>
          <Link to="/recipes" className="nav-link">
            <FaUtensils /> Recipes
          </Link>
          <Link to="/cooking-sessions" className="nav-link">
            <FaUsers /> Sessions
          </Link>
          <Link to="/cookbooks" className="nav-link">
            <FaBook /> Cookbooks
          </Link>
          <Link to="/discover" className="nav-link">
            <FaUsers /> Discover
          </Link>
          <Link to="/shop" className="nav-link">
            <FaStore /> Shop
          </Link>
          <Link to="/profile" className="nav-link">
            <FaUser /> Profile
          </Link>
        </div>

        <div className="nav-actions">
          <button className="nav-action-button notification-button">
            <FaBell />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="nav-action-button logout-button"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      {/* Progress Bar */}
      {userStats && (
        <div className="header-progress-bar">
          <div className="progress-info">
            <span>Level {userStats.level}</span>
            <span>
              {userStats.current_exp || 0} / {userStats.current_level_ceiling || 100} EXP
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
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