import api from '../utils/api';

/**
 * Authentication API Module
 * Handles all authentication related API calls to PHP backend
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Registration response
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Login response with JWT token
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

/**
 * Get current user data
 * @returns {Promise} Current user data
 */
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
};

/**
 * Logout user
 * @returns {Promise} Logout response
 */
export const logout = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

/**
 * Refresh authentication token
 * @returns {Promise} New token response
 */
export const refreshToken = async () => {
    try {
        const response = await api.post('/auth/refresh-token');
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

export default {
    register,
    login,
    getCurrentUser,
    logout,
    refreshToken
};