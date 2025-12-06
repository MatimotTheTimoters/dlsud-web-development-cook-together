/**
 * User API Module
 * Handles all user-related API calls to PHP backend
 */

import api from '../utils/api';

/**
 * Get user profile
 * @param {string} userId - Optional user ID (defaults to current user)
 * @returns {Promise} User profile data
 */
export const getProfile = async (userId = null) => {
  try {
    const params = {};
    if (userId) {
      params.user_id = userId;
    }
    
    const response = await api.get('/users/profile', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} Updated user data
 */
export const updateProfile = async (profileData) => {
  try {
    // Handle file upload separately if needed
    const response = await api.put('/users/update', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Get user statistics
 * @param {string} userId - Optional user ID (defaults to current user)
 * @returns {Promise} User statistics
 */
export const getUserStats = async (userId = null) => {
  try {
    const params = {};
    if (userId) {
      params.user_id = userId;
    }
    
    const response = await api.get('/users/stats', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

/**
 * Search for users
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} limit - Results per page
 * @returns {Promise} Search results
 */
export const searchUsers = async (query, page = 1, limit = 20) => {
  try {
    const response = await api.get('/users/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Get user's followers
 * @param {string} userId - User ID
 * @returns {Promise} List of followers
 */
export const getFollowers = async (userId) => {
  try {
    // This will be implemented when relationships API is ready
    // For now, return empty array
    console.warn('getFollowers not yet implemented - relationships API pending');
    return { followers: [] };
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

/**
 * Get users followed by a user
 * @param {string} userId - User ID
 * @returns {Promise} List of followed users
 */
export const getFollowing = async (userId) => {
  try {
    // This will be implemented when relationships API is ready
    // For now, return empty array
    console.warn('getFollowing not yet implemented - relationships API pending');
    return { following: [] };
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @returns {Promise} Upload response
 */
export const uploadProfilePicture = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'profile_picture');
    formData.append('user_id', userId);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

export default {
  getProfile,
  updateProfile,
  getUserStats,
  searchUsers,
  getFollowers,
  getFollowing,
  uploadProfilePicture
};