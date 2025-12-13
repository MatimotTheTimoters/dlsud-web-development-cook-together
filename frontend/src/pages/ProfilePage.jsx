import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfile from '../components/users/UserProfile';
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
      // Mock API call - replace with actual API
      setTimeout(() => {
        setUserData({
          profile: {
            id: id || '1',
            full_name: 'Chef Mario',
            email: 'mario@example.com',
            profile_picture: null,
            age: 35,
            gender: 'male'
          },
          stats: {
            level: 24,
            current_exp: 1200,
            gold_count: 1250,
            gem_count: 45,
            recipes_created: 12,
            recipes_cooked: 45,
            login_streak: 7
          }
        });
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError(err.message || 'Failed to load user data');
      console.error('Error loading user data:', err);
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
        <div className="loading-content">
          <FaUserCircle className="spinning-icon" />
          <h2>Loading Profile</h2>
          <p>Getting user information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Profile Not Found</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              <FaArrowLeft /> Go Back
            </button>
            <button
              onClick={loadUserData}
              className="btn-primary"
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
          className="back-button btn-secondary"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="page-title">
          <FaUserCircle /> Profile
          {userData && (
            <span className="profile-title-user">
              {userData.profile?.full_name || 'User'}
            </span>
          )}
        </h1>

        <div className="header-actions">
          <button className="btn-secondary">
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
          <UserProfile userId={id} onUpdate={handleProfileUpdate} />
        )}

        {activeSection === 'recipes' && userData && (
          <div className="profile-recipes-section">
            <h2>
              <FaBook /> {userData.profile?.full_name || 'User'}'s Recipes
            </h2>
            <div className="recipes-placeholder">
              <FaBook size={64} />
              <p>User's recipes will appear here</p>
            </div>
          </div>
        )}

        {activeSection === 'cookbooks' && userData && (
          <div className="profile-cookbooks-section">
            <h2>
              <FaBook /> {userData.profile?.full_name || 'User'}'s Cookbooks
            </h2>
            <div className="cookbooks-placeholder">
              <FaBook size={64} />
              <p>User's cookbooks will appear here</p>
            </div>
          </div>
        )}

        {activeSection === 'stats' && userData && (
          <div className="profile-stats-section">
            <h2>
              <FaChartLine /> {userData.profile?.full_name || 'User'}'s Statistics
            </h2>
            <div className="stats-placeholder">
              <FaTrophy size={64} />
              <p>Detailed statistics coming soon!</p>
            </div>
          </div>
        )}

        {activeSection === 'following' && userData && (
          <div className="profile-following-section">
            <h2>
              <FaUsers /> {userData.profile?.full_name || 'User'}'s Following
            </h2>
            <div className="following-placeholder">
              <FaUsers size={64} />
              <p>Following list coming soon!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;