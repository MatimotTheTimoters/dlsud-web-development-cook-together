import api from '../utils/api';

/**
 * Authentication API functions for authentication operations
 */

/**
 * Authenticates user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Promise with authentication data
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login.php', { email, password });
        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

/**
 * Registers new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with registration data
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register.php', userData);
        return response;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

/**
 * Logs out user
 * @returns {Promise} Promise with logout result
 */
export const logout = async () => {
    try {
        const response = await api.post('/auth/logout.php');
        return response;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

/**
 * Gets current user data
 * @returns {Promise} Promise with current user data
 */
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/me.php');
        return response;
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
};

/**
 * Refreshes authentication token
 * @returns {Promise} Promise with refreshed token data
 */
export const refreshToken = async () => {
    try {
        const response = await api.post('/auth/refresh-token.php');
        return response;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

export default {
    login,
    register,
    logout,
    getCurrentUser,
    refreshToken
};