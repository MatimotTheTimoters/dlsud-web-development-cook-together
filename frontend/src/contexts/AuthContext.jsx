import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

// Create Auth Context
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Provides authentication state and methods to the entire app
 */
export const AuthProvider = ({ children }) => {
    // User state
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Initialize authentication state from localStorage
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check if we have a token
                if (api.isAuthenticated()) {
                    // Try to get user profile
                    await fetchCurrentUser();
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                // Clear invalid tokens
                api.clearAuthTokens();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    /**
     * Fetch current user profile from API
     */
    const fetchCurrentUser = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await api.get('/auth/me');
            
            if (result.success) {
                setUser(result.data.user);
                setStats(result.data.stats);
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Fetch current user error:', error);
            
            // If unauthorized, clear tokens
            if (error.status === 401) {
                api.clearAuthTokens();
                setUser(null);
                setStats(null);
            }
            
            setError(error.message || 'Failed to load user profile');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} User data
     */
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await api.post('/auth/login', { email, password });
            
            if (result.success) {
                // Set authentication tokens
                api.setAuthToken(
                    result.data.token,
                    result.data.refresh_token
                );
                
                // Update user state
                setUser(result.data.user);
                setStats(result.data.stats);
                
                return {
                    user: result.data.user,
                    stats: result.data.stats,
                    token: result.data.token
                };
            } else {
                throw new Error(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Please check your credentials.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Object} New user data
     */
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await api.post('/auth/register', userData);
            
            if (result.success) {
                // Set authentication tokens
                api.setAuthToken(
                    result.data.token,
                    result.data.refresh_token
                );
                
                // Update user state
                setUser(result.data.user);
                
                // Initialize default stats for new user
                const defaultStats = {
                    level: 1,
                    current_exp: 0,
                    current_level_ceiling: 100,
                    gold_count: 0,
                    gem_count: 0,
                    login_streak: 1,
                    recipes_created: 0,
                    recipes_cooked: 0,
                    challenges_completed: 0,
                    recipes_sold: 0
                };
                setStats(defaultStats);
                
                return {
                    user: result.data.user,
                    stats: defaultStats,
                    token: result.data.token
                };
            } else {
                throw new Error(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            // Extract validation errors if available
            if (error.details && typeof error.details === 'object') {
                const validationErrors = Object.entries(error.details)
                    .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                    .join('; ');
                setError(`Validation failed: ${validationErrors}`);
            } else {
                setError(error.message || 'Registration failed. Please try again.');
            }
            
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout user
     */
    const logout = async () => {
        try {
            setLoading(true);
            
            // Call logout endpoint
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with logout even if API call fails
        } finally {
            // Clear tokens and user state
            api.clearAuthTokens();
            setUser(null);
            setStats(null);
            setError(null);
            setLoading(false);
        }
    };

    /**
     * Refresh authentication token
     * @returns {boolean} True if token was refreshed successfully
     */
    const refreshToken = async () => {
        try {
            const refreshToken = api.getRefreshToken();
            
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            
            const result = await api.post('/auth/refresh-token', {
                refresh_token: refreshToken
            });
            
            if (result.success) {
                // Update tokens
                api.setAuthToken(
                    result.data.token,
                    result.data.refresh_token
                );
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            
            // If refresh failed, clear tokens
            api.clearAuthTokens();
            setUser(null);
            setStats(null);
            
            return false;
        }
    };

    /**
     * Refresh user limits/stats from server
     */
    const refreshUserLimits = async () => {
        try {
            if (!api.isAuthenticated()) {
                return;
            }
            
            const result = await api.get('/auth/me');
            
            if (result.success) {
                setUser(result.data.user);
                setStats(result.data.stats);
                return result.data.stats;
            }
        } catch (error) {
            console.error('Refresh limits error:', error);
            
            // If unauthorized, try to refresh token
            if (error.status === 401) {
                const refreshed = await refreshToken();
                if (refreshed) {
                    // Retry fetching user data
                    return await refreshUserLimits();
                }
            }
            
            throw error;
        }
    };

    /**
     * Update user profile
     * @param {Object} updates - Profile updates
     * @returns {Object} Updated user data
     */
    const updateProfile = async (updates) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await api.put('/users/update', updates);
            
            if (result.success) {
                // Update local user state
                setUser(prev => ({
                    ...prev,
                    ...updates,
                    updated_at: new Date().toISOString()
                }));
                
                return result.data.user;
            } else {
                throw new Error(result.message || 'Profile update failed');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            setError(error.message || 'Failed to update profile');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Update user stats
     * @param {Object} updates - Stats updates
     */
    const updateStats = (updates) => {
        setStats(prev => ({
            ...prev,
            ...updates
        }));
    };

    /**
     * Check if user is authenticated
     * @returns {boolean} True if user is authenticated
     */
    const isAuthenticated = () => {
        return !!user && api.isAuthenticated();
    };

    /**
     * Get current user
     * @returns {Object|null} Current user data
     */
    const getCurrentUser = () => {
        return user;
    };

    /**
     * Get current user stats
     * @returns {Object|null} Current user stats
     */
    const getCurrentStats = () => {
        return stats;
    };

    /**
     * Clear any authentication errors
     */
    const clearError = () => {
        setError(null);
    };

    // Context value
    const contextValue = {
        // State
        user,
        stats,
        loading,
        error,
        
        // Methods
        login,
        register,
        logout,
        refreshToken,
        refreshUserLimits,
        updateProfile,
        updateStats,
        fetchCurrentUser,
        isAuthenticated,
        getCurrentUser,
        getCurrentStats,
        clearError
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
/* commenting out dupe of useAuth hook
// Export a hook for easy access to context
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};

// Export as default for backward compatibility
export default AuthContext;

*/