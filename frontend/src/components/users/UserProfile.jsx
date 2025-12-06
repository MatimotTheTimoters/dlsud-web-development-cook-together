import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as userAPI from '../../api/users';
import * as recipeAPI from '../../api/recipes';
import * as cookbookAPI from '../../api/cookbooks';
import { 
  FaEdit, FaCamera, FaTrophy, FaChartLine, 
  FaAward, FaCrown, FaStar, FaFire 
} from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import StatsDisplay from './StatsDisplay';

const UserProfile = ({ userId: propUserId }) => {
  const { id: paramUserId } = useParams();
  const userId = propUserId || paramUserId;
  const [activeTab, setActiveTab] = useState('recipes');
  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userCookbooks, setUserCookbooks] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    stats: false,
    recipes: false,
    cookbooks: false
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    age: '',
    gender: ''
  });

  // Load user profile data
  const loadUserProfile = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const response = await userAPI.getProfile(userId);
      if (response.success) {
        setProfileData(response.data);
        setEditForm({
          full_name: response.data.full_name || '',
          age: response.data.age || '',
          gender: response.data.gender || ''
        });
      } else {
        throw new Error(response.message || 'Failed to load profile');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading profile:', err);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Load user statistics
  const loadUserStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const response = await userAPI.getUserStats(userId);
      if (response.success) {
        setUserStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to load stats');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading stats:', err);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Load user's recipes
  const loadUserRecipes = async () => {
    setLoading(prev => ({ ...prev, recipes: true }));
    try {
      const response = await recipeAPI.getAllRecipes({ user_id: userId });
      if (response.success) {
        setUserRecipes(response.data.recipes || []);
      } else {
        throw new Error(response.message || 'Failed to load recipes');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  // Calculate progress to next level
  const calculateNextLevelProgress = () => {
    if (!userStats) return { progress: 0, remaining: 0 };
    
    const currentExp = userStats.current_exp || 0;
    const nextLevelExp = userStats.current_level_ceiling || 100;
    const progress = (currentExp / nextLevelExp) * 100;
    
    return {
      progress: Math.min(progress, 100),
      remaining: Math.max(0, nextLevelExp - currentExp)
    };
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    
    try {
      const response = await userAPI.updateProfile(editForm);
      if (response.success) {
        await loadUserProfile();
        setIsEditing(false);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating profile:', err);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (file) => {
    try {
      const response = await userAPI.uploadProfilePicture(file, userId);
      if (response.success) {
        await loadUserProfile(); // Reload to get new image URL
      } else {
        throw new Error(response.message || 'Failed to upload image');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error uploading profile picture:', err);
    }
  };

  // Load data on component mount or userId change
  useEffect(() => {
    if (userId) {
      loadUserProfile();
      loadUserStats();
      loadUserRecipes();
    }
  }, [userId]);

  if (loading.profile) {
    return <LoadingSpinner size="large" text="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="error-container animate__animated animate__shakeX">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <button 
          onClick={() => {
            setError(null);
            loadUserProfile();
          }}
          className="game-button"
        >
          <FaFire /> Try Again
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="no-data-container">
        <FaCamera size={64} />
        <h3>No Profile Found</h3>
      </div>
    );
  }

  const levelProgress = calculateNextLevelProgress();

  return (
    <div className="user-profile-container animate__animated animate__fadeIn">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="game-button secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleProfileUpdate}
                className="game-button success"
                disabled={loading.profile}
              >
                {loading.profile ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="game-button"
              >
                <FaEdit /> Edit Profile
              </button>
              <button className="game-button">
                <FaTrophy /> View Achievements
              </button>
            </>
          )}
        </div>

        {/* Profile Picture */}
        <div className="profile-picture-section">
          <div className="profile-picture-wrapper">
            <img 
              src={profileData.profile_picture || '/default-avatar.png'} 
              alt={profileData.full_name}
              className="profile-picture-large"
            />
            <label className="upload-profile-picture">
              <FaCamera />
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    handleProfilePictureUpload(e.target.files[0]);
                  }
                }}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name animate__animated animate__bounceIn">
              {profileData.full_name}
              {userStats && (
                <span className="level-badge">
                  <FaCrown /> Level {userStats.level}
                </span>
              )}
            </h1>
            
            <div className="profile-meta">
              <span className="meta-item">
                <FaFire /> {userStats?.login_streak || 0}-Day Login Streak
              </span>
              <span className="meta-item">
                <FaAward /> 12 Achievements Unlocked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress Bar */}
      {userStats && (
        <div className="level-progress-section">
          <div className="progress-header">
            <span>Level {userStats.level} Progress</span>
            <span>{Math.floor(levelProgress.progress)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${levelProgress.progress}%` }}
            >
              <div className="progress-sparkle"></div>
            </div>
          </div>
          <div className="progress-footer">
            <span>{userStats.current_exp || 0} EXP</span>
            <span>{levelProgress.remaining} to Level {userStats.level + 1}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          📖 Recipes ({userRecipes.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'cookbooks' ? 'active' : ''}`}
          onClick={() => setActiveTab('cookbooks')}
        >
          📚 Cookbooks
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'recipes' && (
          <div className="recipes-grid">
            {loading.recipes ? (
              <LoadingSpinner text="Loading recipes..." />
            ) : userRecipes.length === 0 ? (
              <div className="empty-state">
                <FaTrophy size={48} />
                <h3>No Recipes Yet</h3>
                <p>Create your first recipe to start earning rewards!</p>
              </div>
            ) : (
              userRecipes.map(recipe => (
                <div key={recipe.id} className="recipe-card-mini">
                  <img src={recipe.cover_image || '/default-recipe.jpg'} alt={recipe.title} />
                  <h4>{recipe.title}</h4>
                  <span className="recipe-difficulty">{recipe.difficulty}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && userStats && (
          <StatsDisplay stats={userStats} />
        )}
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="edit-profile-modal">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="game-input"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter your age"
                  className="game-input"
                  min="1"
                  max="120"
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                  className="game-select"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;