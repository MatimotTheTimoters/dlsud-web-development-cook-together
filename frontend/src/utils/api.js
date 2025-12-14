/**
 * API Configuration and Helper Functions
 * Handles all HTTP requests to the PHP backend API
 */

import axios from 'axios';

// Get base URL from environment
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ||
    'http://localhost/dlsud-web-development-cook-together/backend/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Important for sessions/cookies
});

// JWT token storage key
const TOKEN_STORAGE_KEY = 'cooktogether_token';
const REFRESH_TOKEN_STORAGE_KEY = 'cooktogether_refresh_token';

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        // You can transform response here if needed
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired - clear and redirect
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
            // Redirect to login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Set authentication token for all future requests
 * @param {string} token - JWT token
 * @param {string} refreshTokenValue - Refresh token
 */
export const setAuthToken = (token, refreshTokenValue = null) => {
    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        delete api.defaults.headers.common['Authorization'];
    }

    if (refreshTokenValue) {
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshTokenValue);
    } else if (refreshTokenValue === null) {
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
};

/**
 * Get current authentication token
 * @returns {string|null} Current token
 */
export const getAuthToken = () => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Get current refresh token
 * @returns {string|null} Current refresh token
 */
export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Clear all authentication tokens
 */
export const clearAuthTokens = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    delete api.defaults.headers.common['Authorization'];
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem(TOKEN_STORAGE_KEY);
};

/**
 * Upload file with FormData
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with file
 * @returns {Promise<Object>} Response data
 */
export const upload = async (endpoint, formData) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    return api.post(endpoint, formData, config);
};

/**
 * Test API connection
 * @returns {Promise<boolean>} True if API is accessible
 */
export const testApiConnection = async () => {
    try {
        await api.get('/', { timeout: 5000 });
        return true;
    } catch (error) {
        console.warn('API server is not reachable:', error.message);
        return false;
    }
};

/**
 * Initialize API module - check for saved token on page load
 */
export const initializeApi = () => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (savedToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }

    // Test connection on startup
    testApiConnection().then(isConnected => {
        if (!isConnected) {
            console.warn('API server is not reachable. Please ensure the backend is running.');
        }
    });

    console.log('API module initialized with axios');
};

// Auto-initialize when module is loaded
initializeApi();

// Export the axios instance and helper functions
export default api;
export {
    getAuthToken,
    getRefreshToken,
    setAuthToken,
    clearAuthTokens,
    isAuthenticated,
    upload,
    testApiConnection,
    initializeApi,
    API_BASE_URL,
    TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY
};