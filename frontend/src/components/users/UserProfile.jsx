import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaEdit, FaCamera, FaChartLine, FaCrown, FaBook, FaUsers,
  FaCoins, FaGem, FaStar, FaFire, FaClock, FaTrophy, FaAward
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import * as usersApi from '../../api/users';
import * as recipesApi from '../../api/recipes';
import * as cookbooksApi from '../../api/cookbooks';
import * as relationshipsApi from '../../api/relationships';
import FollowButton from './FollowButton';
import StatsDisplay from './StatsDisplay';
import LoadingSpinner from '../common/LoadingSpinner';

const UserProfile = ({ userId: propUserId }) => {
  const { id: paramUserId } = useParams();
  const userId = propUserId || paramUserId;
  const { currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userCookbooks, setUserCookbooks] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState('recipes');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    age: '',
    gender: ''
  });
  const [loading, setLoading] = useState({
    profile: true,
    recipes: false,
    cookbooks: false,
    relationships: false
  });

  const isOwnProfile = currentUser && currentUser.id === userId;

  const loadUserProfile = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    try {
      const profile = await usersApi.getProfile(userId);
      setProfileData(profile);
      setEditForm({
        full_name: profile.full_name || '',
        age: profile.age || '',
        gender: profile.gender || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await usersApi.getUserStats(userId);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUserRecipes = async () => {
    setLoading(prev => ({ ...prev, recipes: true }));
    try {
      const recipes = await recipesApi.getAllRecipes({ user_id: userId });
      setUserRecipes(recipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  const loadUserCookbooks = async () => {
    setLoading(prev => ({ ...prev, cookbooks: true }));
    try {
      const cookbooks = await cookbooksApi.getCookbooks(userId);
      setUserCookbooks(cookbooks);
    } catch (error) {
      console.error('Error loading cookbooks:', error);
    } finally {
      setLoading(prev => ({ ...prev, cookbooks: false }));
    }
  };

  const loadRelationships = async () => {
    setLoading(prev => ({ ...prev, relationships: true }));
    try {
      const [followersData, followingData] = await Promise.all([
        relationshipsApi.getFollowers(userId),
        relationshipsApi.getFollowing(userId)
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
    } catch (error) {
      console.error('Error loading relationships:', error);
    } finally {
      setLoading(prev => ({ ...prev, relationships: false }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await usersApi.updateProfile(userId, editForm);
      await loadUserProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserProfile();
      loadUserStats();
      loadUserRecipes();
      loadUserCookbooks();
      loadRelationships();
    }
  }, [userId]);

  if (loading.profile) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!profileData) {
    return (
      <div className="error-container">
        <h3>Profile Not Found</h3>
        <p>The user profile could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="user-profile-container animate__animated animate__fadeIn">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-actions">
          {isOwnProfile ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="game-button"
              >
                <FaEdit /> Edit Profile
              </button>
            </>
          ) : (
            <FollowButton targetUserId={userId} />
          )}
        </div>

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
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">
              {profileData.full_name}
              {userStats && (
                <span className="level-badge">
                  <FaCrown /> Level {userStats.level}
                </span>
              )}
            </h1>

            <div className="profile-meta">
              {profileData.age && (
                <span className="meta-item">
                  Age: {profileData.age}
                </span>
              )}
              {profileData.gender && (
                <span className="meta-item">
                  Gender: {profileData.gender}
                </span>
              )}
              {userStats && userStats.login_streak > 0 && (
                <span className="meta-item">
                  <FaFire /> {userStats.login_streak}-Day Login Streak
                </span>
              )}
            </div>

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
            <span>
              {userStats.current_exp || 0}/{userStats.current_level_ceiling || 100} EXP
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${((userStats.current_exp || 0) / (userStats.current_level_ceiling || 100)) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <FaBook /> Recipes ({userRecipes.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'cookbooks' ? 'active' : ''}`}
          onClick={() => setActiveTab('cookbooks')}
        >
          <FaBook /> Cookbooks ({userCookbooks.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <FaChartLine /> Stats
        </button>
        <button
          className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          <FaUsers /> Following ({following.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
        >
          <FaUsers /> Followers ({followers.length})
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
                <FaBook size={48} />
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
                    <span>👍 {recipe.like_count || 0}</span>
                    <span>👁️ {recipe.view_count || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'cookbooks' && (
          <div className="cookbooks-grid">
            {loading.cookbooks ? (
              <LoadingSpinner text="Loading cookbooks..." />
            ) : userCookbooks.length === 0 ? (
              <div className="empty-state">
                <FaBook size={48} />
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

        {activeTab === 'stats' && (
          <StatsDisplay userId={userId} />
        )}

        {activeTab === 'following' && (
          <div className="following-section">
            {loading.relationships ? (
              <LoadingSpinner text="Loading following..." />
            ) : following.length === 0 ? (
              <div className="empty-state">
                <FaUsers size={48} />
                <h3>Not Following Anyone</h3>
                <p>Follow other users to see their cooking activities!</p>
              </div>
            ) : (
              <div className="users-grid">
                {following.map(user => (
                  <div key={user.id} className="user-card-mini">
                    <img src={user.profile_picture || '/default-avatar.png'} alt={user.full_name} />
                    <div className="user-info-mini">
                      <Link to={`/profile/${user.id}`}>{user.full_name}</Link>
                      <span className="user-level-mini">Lvl {user.level || 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'followers' && (
          <div className="followers-section">
            {loading.relationships ? (
              <LoadingSpinner text="Loading followers..." />
            ) : followers.length === 0 ? (
              <div className="empty-state">
                <FaUsers size={48} />
                <h3>No Followers Yet</h3>
                <p>Share your recipes and cooking sessions to get followers!</p>
              </div>
            ) : (
              <div className="users-grid">
                {followers.map(user => (
                  <div key={user.id} className="user-card-mini">
                    <img src={user.profile_picture || '/default-avatar.png'} alt={user.full_name} />
                    <div className="user-info-mini">
                      <Link to={`/profile/${user.id}`}>{user.full_name}</Link>
                      <span className="user-level-mini">Lvl {user.level || 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  className="game-input"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
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
                >
                  Save Changes
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