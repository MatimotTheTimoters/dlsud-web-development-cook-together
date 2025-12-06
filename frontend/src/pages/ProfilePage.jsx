import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfile from '../components/users/UserProfile';
import UserRecipes from '../components/users/UserRecipes';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as userAPI from '../api/users';
import * as recipeAPI from '../api/recipes';
import * as cookbookAPI from '../api/cookbooks';
import { 
  FaUserCircle, FaCog, FaChartLine, FaArrowLeft,
  FaTrophy, FaBook, FaUsers 
} from 'react-icons/fa';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');

  // Load user data
  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load profile data
      const profileResponse = await userAPI.getProfile(id);
      if (profileResponse.success) {
        setUserData(profileResponse.data);
      } else {
        throw new Error(profileResponse.message || 'Failed to load profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user data');
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update success
  const handleProfileUpdate = async () => {
    await loadUserData();
  };

  useEffect(() => {
    if (id) {
      loadUserData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="profile-page-loading">
        <LoadingSpinner 
          size="large" 
          text={`Loading profile data...`}
        />
        <div className="loading-bonus">
          <FaTrophy /> +10 EXP for patience!
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page-error animate__animated animate__shakeX">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Profile Not Found</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              onClick={() => navigate(-1)}
              className="game-button secondary"
            >
              <FaArrowLeft /> Go Back
            </button>
            <button 
              onClick={loadUserData}
              className="game-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Profile Header */}
      <div className="profile-page-header">
        <button 
          onClick={() => navigate(-1)}
          className="back-button game-button secondary"
        >
          <FaArrowLeft /> Back
        </button>
        
        <h1 className="page-title animate__animated animate__bounceIn">
          <FaUserCircle /> Profile
          {userData && (
            <span className="profile-title-user">
              {userData.full_name}
            </span>
          )}
        </h1>
        
        <div className="header-actions">
          <button className="game-button">
            <FaCog /> Settings
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="profile-sections-nav">
        <button 
          className={`section-button ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          <FaUserCircle /> Profile
        </button>
        <button 
          className={`section-button ${activeSection === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveSection('recipes')}
        >
          <FaBook /> Recipes
        </button>
        <button 
          className={`section-button ${activeSection === 'cookbooks' ? 'active' : ''}`}
          onClick={() => setActiveSection('cookbooks')}
        >
          <FaBook /> Cookbooks
        </button>
        <button 
          className={`section-button ${activeSection === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveSection('stats')}
        >
          <FaChartLine /> Stats
        </button>
        <button 
          className={`section-button ${activeSection === 'following' ? 'active' : ''}`}
          onClick={() => setActiveSection('following')}
        >
          <FaUsers /> Following
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-page-content">
        {activeSection === 'profile' && (
          <UserProfile userId={id} />
        )}
        
        {activeSection === 'recipes' && userData && (
          <div className="profile-recipes-section">
            <h2>
              <FaBook /> {userData.full_name}'s Recipes
            </h2>
            <UserRecipes userId={id} />
          </div>
        )}
        
        {activeSection === 'stats' && userData && (
          <div className="profile-stats-section">
            <h2>
              <FaChartLine /> {userData.full_name}'s Statistics
            </h2>
            {/* StatsDisplay component would go here */}
            <div className="stats-placeholder">
              <FaTrophy size={64} />
              <p>Detailed statistics coming soon!</p>
            </div>
          </div>
        )}
      </div>

      {/* Gamification Banner */}
      <div className="gamification-banner animate__animated animate__pulse">
        <div className="banner-content">
          <FaTrophy className="banner-icon" />
          <div className="banner-text">
            <h3>Level Up Your Profile!</h3>
            <p>Complete your profile, upload a picture, and create recipes to earn rewards!</p>
          </div>
          <button className="game-button banner-action">
            Earn More EXP →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;