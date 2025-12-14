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

    const response = await api.get('/users/profile.php', { params });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

/**
 * Update user profile with optional file upload
 * @param {Object} profileData - Profile data to update
 * @param {File} profilePicture - Optional profile picture file
 * @returns {Promise} Updated user data
 */
export const updateProfile = async (profileData, profilePicture = null) => {
  try {
    // If there's a profile picture, upload it first
    if (profilePicture && profilePicture instanceof File) {
      const userId = profileData.id || localStorage.getItem('user_id');
      // Use the uploadImage function from upload.js
      const { uploadImage } = await import('./upload');
      const uploadResponse = await uploadImage(profilePicture, 'profile', userId);

      if (uploadResponse.success) {
        profileData.profile_picture = uploadResponse.data.url;
      } else {
        throw new Error(uploadResponse.message || 'Failed to upload profile picture');
      }
    }

    const response = await api.put('/users/update.php', profileData);
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data || error; // Changed: better error handling
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

    const response = await api.get('/users/stats.php', { params });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error.response?.data || error; // Changed: better error handling
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
    const response = await api.get('/users/search.php', {
      params: { q: query, page, limit }
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error searching users:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

/**
 * Get user's followers
 * @param {string} userId - User ID
 * @returns {Promise} List of followers
 */
export const getFollowers = async (userId) => {
  try {
    const response = await api.get('/relationships/list.php', {
      params: { user_id: userId, type: 'followers' }
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

/**
 * Get users followed by a user
 * @param {string} userId - User ID
 * @returns {Promise} List of followed users
 */
export const getFollowing = async (userId) => {
  try {
    const response = await api.get('/relationships/list.php', {
      params: { user_id: userId, type: 'following' }
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error.response?.data || error; // Changed: better error handling
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
    formData.append('image', file);
    formData.append('type', 'profile_picture');
    formData.append('user_id', userId);

    const response = await api.post('/upload/image.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error.response?.data || error; // Changed: better error handling
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