import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as usersApi from '../../api/users';
import * as relationshipsApi from '../../api/relationships';
import {
  FaUser, FaClock, FaFire, FaStar, FaCoins, FaGem, FaUserPlus, FaUserCheck
} from 'react-icons/fa';

const UserCard = ({ user, compact = false }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const stats = await usersApi.getUserStats(user.id);
        setUserStats(stats);
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    const checkFollowingStatus = async () => {
      try {
        const response = await relationshipsApi.getFollowing();
        const isFollowing = response.some(following => following.id === user.id);
        setIsFollowing(isFollowing);
      } catch (error) {
        console.error('Error checking following status:', error);
      }
    };

    if (user && user.id) {
      loadUserStats();
      checkFollowingStatus();
    }
  }, [user]);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await relationshipsApi.unfollowUser(user.id);
        setIsFollowing(false);
      } else {
        await relationshipsApi.followUser(user.id);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level >= 20) return 'level-legendary';
    if (level >= 10) return 'level-epic';
    if (level >= 5) return 'level-rare';
    return 'level-common';
  };

  if (!user) return null;

  if (compact) {
    return (
      <div className="user-card-compact animate__animated animate__fadeIn">
        <div className="user-card-header">
          <img
            src={user.profile_picture || '/default-avatar.png'}
            alt={user.full_name}
            className="user-avatar-small"
          />
          <div className="user-info-compact">
            <Link to={`/profile/${user.id}`} className="user-name-link">
              {user.full_name}
            </Link>
            {userStats && (
              <span className={`user-level ${getLevelColor(userStats.level)}`}>
                Lvl {userStats.level}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={toggleFollow}
          disabled={loading}
          className={`follow-button-compact ${isFollowing ? 'following' : ''}`}
        >
          {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
        </button>
      </div>
    );
  }

  return (
    <div className="user-card animate__animated animate__fadeInUp">
      <div className="user-card-header">
        <div className="user-avatar-container">
          <img
            src={user.profile_picture || '/default-avatar.png'}
            alt={user.full_name}
            className="user-avatar"
          />
          {userStats && (
            <div className={`level-badge ${getLevelColor(userStats.level)}`}>
              Lvl {userStats.level}
            </div>
          )}
        </div>

        <div className="user-info">
          <h3 className="user-name">
            <Link to={`/profile/${user.id}`}>
              {user.full_name}
            </Link>
          </h3>

          {userStats && (
            <div className="user-stats-preview">
              <div className="stat-item">
                <FaStar className="stat-icon" />
                <span className="stat-value">{userStats.recipes_created || 0}</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat-item">
                <FaFire className="stat-icon" />
                <span className="stat-value">{userStats.recipes_cooked || 0}</span>
                <span className="stat-label">Cooked</span>
              </div>
              <div className="stat-item">
                <FaClock className="stat-icon" />
                <span className="stat-value">{userStats.total_cooking_time || 0}</span>
                <span className="stat-label">min</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="user-card-content">
        {userStats && (
          <div className="user-currency">
            <div className="currency-item">
              <FaCoins className="currency-icon gold" />
              <span className="currency-value">{userStats.gold_count || 0}</span>
            </div>
            <div className="currency-item">
              <FaGem className="currency-icon gem" />
              <span className="currency-value">{userStats.gem_count || 0}</span>
            </div>
          </div>
        )}
      </div>

      <div className="user-card-actions">
        <button
          onClick={toggleFollow}
          disabled={loading}
          className={`game-button follow-button ${isFollowing ? 'following' : ''}`}
        >
          {loading ? (
            <span className="spinner-small"></span>
          ) : isFollowing ? (
            <>
              <FaUserCheck /> Following
            </>
          ) : (
            <>
              <FaUserPlus /> Follow
            </>
          )}
        </button>

        <Link to={`/profile/${user.id}`} className="game-button secondary">
          <FaUser /> View Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;