import api, { setAuthToken, clearAuthTokens } from '../utils/api';

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
        const response = await api.post('/api/auth/login.php', { email, password });
        if (response.data.token) {
            // Store the token using the helper function
            setAuthToken(response.data.token, response.data.refresh_token);
        }
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error.response?.data || error;
    }
};

/**
 * Registers new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Promise with registration data
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/api/auth/register.php', userData);
        if (response.data.token) {
            // Store the token using the helper function
            setAuthToken(response.data.token, response.data.refresh_token);
        }
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error.response?.data || error;
    }
};

/**
 * Logs out user
 * @returns {Promise} Promise with logout result
 */
export const logout = async () => {
    try {
        const response = await api.post('/api/auth/logout.php');
        clearAuthTokens(); // Clear tokens from storage
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        clearAuthTokens(); // Clear tokens even if request fails
        throw error.response?.data || error;
    }
};

/**
 * Gets current user data
 * @returns {Promise} Promise with current user data
 */
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/api/auth/me.php');
        return response.data;
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error.response?.data || error;
    }
};

/**
 * Refreshes authentication token
 * @returns {Promise} Promise with refreshed token data
 */
export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('cooktogether_refresh_token');
        const response = await api.post('/api/auth/refresh-token.php', {
            refresh_token: refreshToken
        });
        if (response.data.token) {
            setAuthToken(response.data.token, response.data.refresh_token);
        }
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        clearAuthTokens(); // Clear tokens if refresh fails
        throw error.response?.data || error;
    }
};

export default {
    login,
    register,
    logout,
    getCurrentUser,
    refreshToken
};