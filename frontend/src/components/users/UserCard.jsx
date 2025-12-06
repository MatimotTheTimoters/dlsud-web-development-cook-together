import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as userAPI from '../../api/users';
import * as relationshipAPI from '../../api/relationships';
import { 
  FaUserCircle, FaPlus, FaCheck, FaStar, FaFire, 
  FaMessage, FaCrown, FaChartLine 
} from 'react-icons/fa';

const UserCard = ({ userId, showActions = true }) => {
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState({ profile: false, stats: false });
  const [actionLoading, setActionLoading] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setLoading({ profile: true, stats: true });
      try {
        // Load profile
        const profileResponse = await userAPI.getProfile(userId);
        if (profileResponse.success) {
          setUserData(profileResponse.data);
        }

        // Load stats
        const statsResponse = await userAPI.getUserStats(userId);
        if (statsResponse.success) {
          setUserStats(statsResponse.data);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading({ profile: false, stats: false });
      }
    };

    if (userId) {
      loadUserData();
    }
  }, [userId]);

  // Handle follow/unfollow
  const handleFollow = async () => {
    if (!userId || actionLoading) return;
    
    setActionLoading(true);
    try {
      if (isFollowing) {
        // Unfollow logic
        await relationshipAPI.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        // Follow logic
        await relationshipAPI.followUser(userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error in follow action:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Get level color
  const getLevelColor = (level) => {
    if (level >= 20) return 'legendary';
    if (level >= 10) return 'epic';
    if (level >= 5) return 'rare';
    return 'common';
  };

  if (loading.profile || !userData) {
    return (
      <div className="user-card-skeleton">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-name"></div>
        <div className="skeleton-stats"></div>
      </div>
    );
  }

  return (
    <div className="user-card animate__animated animate__fadeInUp">
      {/* Profile Picture */}
      <div className="user-card-avatar">
        <img 
          src={userData.profile_picture || '/default-avatar.png'} 
          alt={userData.full_name}
          className="avatar-image"
        />
        {userStats && (
          <div className={`level-badge ${getLevelColor(userStats.level)}`}>
            <FaCrown /> Lvl {userStats.level}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="user-card-info">
        <h3 className="user-name">
          <Link to={`/profile/${userId}`}>
            {userData.full_name}
          </Link>
        </h3>
        
        {userStats && (
          <div className="user-stats">
            <div className="stat-item">
              <FaFire /> {userStats.recipes_created || 0} Recipes
            </div>
            <div className="stat-item">
              <FaStar /> {userStats.recipes_cooked || 0} Cooked
            </div>
            <div className="stat-item">
              <FaChartLine /> Level {userStats.level}
            </div>
          </div>
        )}
        
        {/* User Bio (if available) */}
        {userData.bio && (
          <p className="user-bio">{userData.bio}</p>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="user-card-actions">
          <button 
            onClick={handleFollow}
            className={`game-button follow-button ${isFollowing ? 'following' : ''}`}
            disabled={actionLoading}
          >
            {actionLoading ? (
              '...'
            ) : isFollowing ? (
              <>
                <FaCheck /> Following
              </>
            ) : (
              <>
                <FaPlus /> Follow
              </>
            )}
          </button>
          
          <button className="game-button secondary message-button">
            <FaMessage /> Message
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;