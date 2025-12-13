import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../../api/auth.js';
import { FaUserShield } from 'react-icons/fa';

/**
 * Context for managing authentication state and actions
 */

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user token exists on mount
        const token = localStorage.getItem('token');
        if (token) {
            fetchCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    /**
     * Authenticates user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Promise with authentication data
     */
    const login = async (email, password) => {
        try {
            setLoading(true);
            const result = await api.login(email, password);

            if (result.token) {
                localStorage.setItem('token', result.token);
                setUser(result.user);
                return result;
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logs out user and clears session
     */
    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    /**
     * Checks if user is authenticated
     * @returns {boolean} True if user is authenticated
     */
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    /**
     * Returns current user data
     * @returns {Object} Current user data
     */
    const getCurrentUser = () => {
        return user;
    };

    /**
     * Refreshes authentication token
     * @returns {boolean} True if token was refreshed
     */
    const refreshToken = async () => {
        try {
            const result = await api.refreshToken();
            if (result.token) {
                localStorage.setItem('token', result.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Refresh token error:', error);
            return false;
        }
    };

    /**
     * Fetches current user from API
     */
    const fetchCurrentUser = async () => {
        try {
            setLoading(true);
            const result = await api.getCurrentUser();
            setUser(result);
        } catch (error) {
            console.error('Fetch current user error:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        refreshToken,
        fetchCurrentUser
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Export a hook for easy access to context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;