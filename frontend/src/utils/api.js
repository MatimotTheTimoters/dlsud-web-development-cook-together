/**
 * API Configuration and Helper Functions
 * Handles all HTTP requests to the PHP backend API
 * Used by ALL frontend API modules
 */

// Base URL for the PHP backend
const API_BASE_URL = 'http://localhost/backend/api';

// JWT token storage key
const TOKEN_STORAGE_KEY = 'cooktogether_token';
const REFRESH_TOKEN_STORAGE_KEY = 'cooktogether_refresh_token';

// Store current token in memory
let authToken = localStorage.getItem(TOKEN_STORAGE_KEY) || null;
let refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || null;

/**
 * Set authentication token for all future requests
 * @param {string} token - JWT token
 * @param {string} refreshTokenValue - Refresh token
 */
export const setAuthToken = (token, refreshTokenValue = null) => {
    authToken = token;
    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    if (refreshTokenValue) {
        refreshToken = refreshTokenValue;
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshTokenValue);
    } else if (refreshTokenValue === null) {
        refreshToken = null;
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
};

/**
 * Get current authentication token
 * @returns {string|null} Current token
 */
export const getAuthToken = () => {
    return authToken;
};

/**
 * Get current refresh token
 * @returns {string|null} Current refresh token
 */
export const getRefreshToken = () => {
    return refreshToken;
};

/**
 * Clear all authentication tokens
 */
export const clearAuthTokens = () => {
    authToken = null;
    refreshToken = null;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

/**
 * Build full URL for API endpoint
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full URL
 */
const buildUrl = (endpoint) => {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Get default headers for API requests
 * @returns {Object} Headers object
 */
const getDefaultHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    // Add authorization header if token exists
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Parsed response data
 */
const handleResponse = async (response) => {
    // Try to parse response as JSON
    let data;
    try {
        data = await response.json();
    } catch (error) {
        // If response is not JSON, create error
        throw {
            success: false,
            message: 'Invalid response from server',
            status: response.status,
            statusText: response.statusText
        };
    }

    // Check if response indicates success
    if (!response.ok) {
        // Extract error message from response
        const errorMessage = data.message || `HTTP error ${response.status}`;
        const errorDetails = data.errors || data.details;

        throw {
            success: false,
            message: errorMessage,
            details: errorDetails,
            status: response.status,
            statusText: response.statusText,
            data: data
        };
    }

    // Return successful response
    return {
        success: true,
        data: data.data || data,
        message: data.message || 'Request successful',
        status: response.status,
        originalResponse: data
    };
};

/**
 * Handle API error
 * @param {Error} error - Error object
 * @returns {Object} Formatted error
 */
const handleError = (error) => {
    // Check if it's a network error
    if (error.message === 'Failed to fetch') {
        return {
            success: false,
            message: 'Network error: Cannot connect to server',
            details: 'Please check if the backend server is running',
            status: 0,
            statusText: 'Network Error'
        };
    }

    // Check if it's already a formatted error from handleResponse
    if (error.success === false) {
        return error;
    }

    // Generic error
    return {
        success: false,
        message: error.message || 'An unknown error occurred',
        details: error,
        status: 500,
        statusText: 'Internal Error'
    };
};

/**
 * Attempt to refresh token and retry original request
 * @param {Function} requestFn - Original request function
 * @param {Array} args - Arguments for the request function
 * @returns {Promise} Retried request result
 */
const retryWithRefresh = async (requestFn, args) => {
    try {
        // Attempt to refresh token
        const refreshResult = await post('/auth/refresh-token', {
            refresh_token: refreshToken
        });

        if (refreshResult.success && refreshResult.data.token) {
            // Update tokens
            setAuthToken(refreshResult.data.token, refreshResult.data.refresh_token);

            // Retry original request with new token
            return await requestFn(...args);
        }
    } catch (refreshError) {
        // Refresh failed - clear tokens and throw original error
        clearAuthTokens();
        throw new Error('Session expired. Please login again.');
    }

    // If we get here, refresh didn't work
    clearAuthTokens();
    throw new Error('Session expired. Please login again.');
};

/**
 * Make HTTP request with error handling and token refresh
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
const makeRequest = async (method, endpoint, data = null, options = {}) => {
    const url = buildUrl(endpoint);
    const headers = getDefaultHeaders();

    // Merge custom headers if provided
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    // Prepare request config
    const config = {
        method: method,
        headers: headers,
        credentials: 'include',
        ...options
    };

    // Add body for methods that support it
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        const result = await handleResponse(response);

        // Check for token expiration (401 Unauthorized)
        if (response.status === 401 && refreshToken && endpoint !== '/auth/refresh-token') {
            return retryWithRefresh(makeRequest, [method, endpoint, data, options]);
        }

        return result;
    } catch (error) {
        throw handleError(error);
    }
};

/**
 * GET request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const get = async (endpoint, params = null, options = {}) => {
    let url = endpoint;

    // Add query parameters if provided
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        url += `?${queryString}`;
    }

    return makeRequest('GET', url, null, options);
};

/**
 * POST request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const post = async (endpoint, data = {}, options = {}) => {
    return makeRequest('POST', endpoint, data, options);
};

/**
 * PUT request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const put = async (endpoint, data = {}, options = {}) => {
    return makeRequest('PUT', endpoint, data, options);
};

/**
 * PATCH request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const patch = async (endpoint, data = {}, options = {}) => {
    return makeRequest('PATCH', endpoint, data, options);
};

/**
 * DELETE request helper
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const del = async (endpoint, options = {}) => {
    return makeRequest('DELETE', endpoint, null, options);
};

/**
 * Upload file with FormData
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with file
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
export const upload = async (endpoint, formData, options = {}) => {
    const url = buildUrl(endpoint);
    const headers = getDefaultHeaders();

    // Remove Content-Type for FormData
    delete headers['Content-Type'];

    const config = {
        method: 'POST',
        headers: headers,
        body: formData,
        ...options
    };

    try {
        const response = await fetch(url, config);
        return await handleResponse(response);
    } catch (error) {
        throw handleError(error);
    }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
    return !!authToken;
};

/**
 * Test API connection
 * @returns {Promise<boolean>} True if API is accessible
 */
export const testApiConnection = async () => {
    try {
        const response = await fetch(buildUrl(''), {
            method: 'HEAD',
            headers: getDefaultHeaders()
        });
        return response.ok;
    } catch (error) {
        return false;
    }
};

/**
 * Initialize API module - check for saved token on page load
 */
export const initializeApi = () => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

    if (savedToken) {
        authToken = savedToken;
        refreshToken = savedRefreshToken;
    }

    testApiConnection().then(isConnected => {
        if (!isConnected) {
            console.warn('API server is not reachable. Please ensure the backend is running.');
        }
    });

    console.log('API module initialized with PHP backend');
};

// Auto-initialize when module is loaded
initializeApi();

export default {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    setAuthToken,
    getAuthToken,
    getRefreshToken,
    clearAuthTokens,
    isAuthenticated,
    testApiConnection,
    initializeApi,
    API_BASE_URL,
    TOKEN_STORAGE_KEY,
    REFRESH_TOKEN_STORAGE_KEY
};