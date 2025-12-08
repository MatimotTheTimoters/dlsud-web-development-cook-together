import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaEdit, FaCamera, FaTrophy,
  FaChartLine, FaAward, FaCrown,
  FaStar, FaFire, FaSync
} from 'react-icons/fa';
import { useData } from '../../contexts/DataContext.js';
//import LoadingSpinner from '../common/LoadingSpinner';
// import StatsDisplay from './StatsDisplay';

const UserProfile = ({ userId: propUserId }) => {
  const { id: paramUserId } = useParams();
  const userId = propUserId || paramUserId;

  const {
    userData,
    currentUserData,
    loading,
    errors,
    fetchUserData,
    fetchUserRecipes,
    fetchRelationships,
    fetchFollowers,
    fetchFollowing,
    followUser,
    manageFriendRequest,
    syncAllData
  } = useData();

  const [activeTab, setActiveTab] = useState('recipes');
  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userCookbooks, setUserCookbooks] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [areFriends, setAreFriends] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    age: '',
    gender: ''
  });

  // Check if viewing own profile
  const isOwnProfile = currentUserData && currentUserData.id === userId;

  // Load user profile data using DataContext
  const loadUserProfile = async () => {
    try {
      // If it's own profile, use currentUserData from context
      if (isOwnProfile && currentUserData) {
        setProfileData(currentUserData);
        setEditForm({
          full_name: currentUserData.full_name || '',
          age: currentUserData.age || '',
          gender: currentUserData.gender || ''
        });

        // Extract stats from userData
        if (currentUserData.stats) {
          setUserStats(currentUserData.stats);
        }
      } else {
        // For other users, fetch their profile
        const result = await fetchUserProfileById(userId);
        if (result.success) {
          setProfileData(result.data);
          setEditForm({
            full_name: result.data.full_name || '',
            age: result.data.age || '',
            gender: result.data.gender || ''
          });

          if (result.data.stats) {
            setUserStats(result.data.stats);
          }

          // Check follow status
          if (result.data.is_following !== undefined) {
            setIsFollowing(result.data.is_following);
          }

          // Check friend status
          if (result.data.is_friend !== undefined) {
            setAreFriends(result.data.is_friend);
          }
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  // Fetch user profile by ID (helper function since DataContext doesn't have this directly)
  const fetchUserProfileById = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost/api/users/profile.php?user_id=${targetUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message || 'Failed to fetch user profile' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Load user's recipes using DataContext
  const loadUserRecipes = async () => {
    try {
      const result = await fetchUserRecipes(userId);
      if (result.success) {
        setUserRecipes(result.data.recipes || []);
      }
    } catch (err) {
      console.error('Error loading recipes:', err);
    }
  };

  // Load user's cookbooks
  const loadUserCookbooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost/api/cookbooks/user.php?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserCookbooks(data.data.cookbooks || []);
        }
      }
    } catch (err) {
      console.error('Error loading cookbooks:', err);
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

    try {
      // Use DataContext update method
      const result = await updateUserProfile(editForm);

      if (result.success) {
        // DataContext will automatically refresh user data
        setIsEditing(false);
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.message);
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (file) => {
    try {
      // Use DataContext upload method
      const result = await uploadProfilePicture(file);

      if (result.success) {
        // DataContext will automatically refresh user data
      } else {
        throw new Error(result.error || 'Failed to upload profile picture');
      }
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      alert(err.message);
    }
  };

  // Handle follow/unfollow
  const handleFollow = async () => {
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      const result = await followUser(userId, action);

      if (result.success) {
        setIsFollowing(!isFollowing);
        // Refresh relationship data
        await fetchRelationships();
        await fetchFollowers();
        await fetchFollowing();
      }
    } catch (err) {
      console.error('Error following user:', err);
      alert(err.message);
    }
  };

  // Handle friend request
  const handleFriendRequest = async (action) => {
    try {
      const result = await manageFriendRequest(userId, action);

      if (result.success) {
        if (action === 'accept_request') {
          setAreFriends(true);
        } else if (action === 'remove_friend') {
          setAreFriends(false);
        }
        // Refresh relationship data
        await fetchRelationships();
      }
    } catch (err) {
      console.error('Error managing friend request:', err);
      alert(err.message);
    }
  };

  // Load data on component mount or userId change
  useEffect(() => {
    if (userId) {
      loadUserProfile();
      loadUserRecipes();
      loadUserCookbooks();
    }
  }, [userId]);

  /*
  // Show loading state
  if (loading.user || loading.recipes) {
    return <LoadingSpinner size="large" text="Loading profile..." />;
  }
    */


  // Show error state
  if (errors.user) {
    return (
      <div className="error-container animate__animated animate__shakeX">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Profile</h3>
        <p>{errors.user}</p>
        <button
          onClick={() => {
            loadUserProfile();
            loadUserRecipes();
          }}
          className="game-button"
        >
          <FaSync /> Try Again
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="no-data-container">
        <FaCamera size={64} />
        <h3>No Profile Found</h3>
        <p>The user profile could not be loaded.</p>
      </div>
    );
  }

  const levelProgress = calculateNextLevelProgress();

  return (
    <div className="user-profile-container animate__animated animate__fadeIn">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-actions">
          {isOwnProfile ? (
            <>
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
                    disabled={loading.user}
                  >
                    {loading.user ? 'Saving...' : 'Save Changes'}
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
                  <button
                    onClick={syncAllData}
                    className="game-button"
                    disabled={loading.all}
                  >
                    <FaSync /> Sync Data
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleFollow}
                className={`game-button ${isFollowing ? 'secondary' : 'primary'}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>

              {areFriends ? (
                <button
                  onClick={() => handleFriendRequest('remove_friend')}
                  className="game-button warning"
                >
                  Remove Friend
                </button>
              ) : (
                <button
                  onClick={() => handleFriendRequest('send_request')}
                  className="game-button success"
                >
                  Add Friend
                </button>
              )}
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
            {isOwnProfile && (
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
            )}
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
              {profileData.email && (
                <span className="meta-item">
                  📧 {profileData.email}
                </span>
              )}
              {profileData.age && (
                <span className="meta-item">
                  🎂 {profileData.age} years old
                </span>
              )}
              {profileData.gender && (
                <span className="meta-item">
                  👤 {profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1)}
                </span>
              )}
              {userStats && (
                <span className="meta-item">
                  <FaFire /> {userStats.login_streak || 0}-Day Login Streak
                </span>
              )}
            </div>

            {/* Stats Overview */}
            {userStats && (
              <div className="stats-overview">
                <div className="stat-item">
                  <div className="stat-value">{userStats.recipes_created || 0}</div>
                  <div className="stat-label">Recipes Created</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userStats.recipes_cooked || 0}</div>
                  <div className="stat-label">Recipes Cooked</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userStats.challenges_completed || 0}</div>
                  <div className="stat-label">Challenges</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userStats.gold_count || 0}</div>
                  <div className="stat-label">Gold</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userStats.gem_count || 0}</div>
                  <div className="stat-label">Gems</div>
                </div>
              </div>
            )}
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
          📚 Cookbooks ({userCookbooks.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
        <button
          className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          👥 Following
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'recipes' && (
          <div className="recipes-grid">
            {loading.recipes ? (
              //<LoadingSpinner text="Loading recipes..." />
              <div className="loading-text">Loading recipes...</div>
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
                  <div className="recipe-meta">
                    <span>👤 {recipe.creator_name}</span>
                    <span>👍 {recipe.like_count || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'cookbooks' && (
          <div className="cookbooks-grid">
            {userCookbooks.length === 0 ? (
              <div className="empty-state">
                <FaTrophy size={48} />
                <h3>No Cookbooks Yet</h3>
                <p>Create your first cookbook to organize your favorite recipes!</p>
              </div>
            ) : (
              userCookbooks.map(cookbook => (
                <div key={cookbook.id} className="cookbook-card">
                  <div className="cookbook-icon">📚</div>
                  <h4>{cookbook.name}</h4>
                  <p className="cookbook-description">{cookbook.description || 'No description'}</p>
                  <div className="cookbook-meta">
                    <span>{cookbook.recipe_count || 0} recipes</span>
                    <span className={`visibility ${cookbook.is_public ? 'public' : 'private'}`}>
                      {cookbook.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && userStats && (
          <div className="stats-details">
            <div className="stat-category">
              <h4><FaChartLine /> Progress Stats</h4>
              <div className="stat-row">
                <span>Current Level</span>
                <span className="stat-value">{userStats.level}</span>
              </div>
              <div className="stat-row">
                <span>Current EXP</span>
                <span className="stat-value">{userStats.current_exp}/{userStats.current_level_ceiling}</span>
              </div>
              <div className="stat-row">
                <span>Login Streak</span>
                <span className="stat-value">{userStats.login_streak} days</span>
              </div>
            </div>

            <div className="stat-category">
              <h4><FaTrophy /> Achievement Stats</h4>
              <div className="stat-row">
                <span>Recipes Created</span>
                <span className="stat-value">{userStats.recipes_created}</span>
              </div>
              <div className="stat-row">
                <span>Recipes Cooked</span>
                <span className="stat-value">{userStats.recipes_cooked}</span>
              </div>
              <div className="stat-row">
                <span>Challenges Completed</span>
                <span className="stat-value">{userStats.challenges_completed}</span>
              </div>
              <div className="stat-row">
                <span>Recipes Sold</span>
                <span className="stat-value">{userStats.recipes_sold || 0}</span>
              </div>
            </div>

            <div className="stat-category">
              <h4><FaAward /> Currency</h4>
              <div className="stat-row">
                <span>Gold</span>
                <span className="stat-value gold">{userStats.gold_count}</span>
              </div>
              <div className="stat-row">
                <span>Gems</span>
                <span className="stat-value gem">{userStats.gem_count}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'following' && (
          <div className="following-section">
            <div className="follow-tabs">
              <button className="follow-tab active">Following</button>
              <button className="follow-tab">Followers</button>
            </div>
            <div className="follow-list">
              <p className="info-text">
                Connect with other users to see their cooking activities!
              </p>
              {!isOwnProfile && (
                <button className="game-button" onClick={handleFollow}>
                  {isFollowing ? 'Unfollow User' : 'Follow User'}
                </button>
              )}
            </div>
          </div>
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
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="game-button secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="game-button success"
                  disabled={loading.user}
                >
                  {loading.user ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;