import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import apiSheets from '../constants/api.js'; // API configuration for SheetDB endpoints
import { calculateAllUserLimits } from '../utils/userCalculations.js'; // Utility for calculating user reward limits

// LocalStorage keys for persisting user data and limits
const STORAGE_KEY = 'ct_user'; // Stores authenticated user object
const USER_LIMITS_KEY = 'ct_user_limits'; // Stores calculated user reward limits

/**
 * Authentication Context for managing user state, authentication, and reward limits
 * Provides global access to user data and authentication methods throughout the app
 */
const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Manages user authentication state, reward limits, and provides authentication methods
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that need access to auth context
 * 
 * @example
 * // Wrap your app with AuthProvider
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {
  // State for current authenticated user (null when logged out)
  const [user, setUser] = useState(null);
  
  // State for user's reward limits based on their level and progress
  const [userRewardLimits, setUserRewardLimits] = useState({
    maxExp: 100,        // Maximum EXP user can earn/give per recipe/challenge
    maxGold: 50,        // Maximum Gold user can earn/give per recipe/challenge
    maxGem: 5,          // Maximum Gems user can earn/give per recipe/challenge
    maxGoldPrice: 100,  // Maximum Gold price for paid recipes
    maxGemPrice: 10,    // Maximum Gem price for paid recipes
  });
  
  // Loading state for initial auth initialization
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Calculates user reward limits based on user data (level, stats, etc.)
   * Uses memoized callback to prevent unnecessary recalculations
   * 
   * @param {Object} userData - User object containing level, stats, etc.
   * @returns {Object} Calculated limits object
   */
  const calculateUserLimits = useCallback((userData) => {
    if (!userData) {
      // Return default limits when no user data is available
      return {
        maxExp: 100,
        maxGold: 50,
        maxGem: 5,
        maxGoldPrice: 100,
        maxGemPrice: 10,
      };
    }
    // Use utility function to calculate comprehensive limits
    return calculateAllUserLimits(userData);
  }, []);

  /**
   * Fetches fresh user data from API and calculates updated limits
   * Used when user levels up or when limits need refresh
   * 
   * @param {string} userId - Unique identifier for the user
   * @returns {Promise<Object|void>} Promise resolving to new limits or void if failed
   */
  const fetchUserLimits = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      // Fetch latest user data from API
      const userRes = await fetch(`${apiSheets.users}&id=${userId}`);
      const userData = await userRes.json();

      if (userData.length > 0) {
        const userStats = userData[0];
        const newLimits = calculateUserLimits(userStats);
        
        // Update both state and localStorage
        setUserRewardLimits(newLimits);
        localStorage.setItem(USER_LIMITS_KEY, JSON.stringify(newLimits));
        return newLimits;
      }
    } catch (error) {
      console.warn('Failed to fetch user limits:', error);
      // Fallback to cached limits if API fails
      const cached = localStorage.getItem(USER_LIMITS_KEY);
      if (cached) {
        setUserRewardLimits(JSON.parse(cached));
      }
    }
  }, [calculateUserLimits]);

  /**
   * Refreshes user limits by fetching latest data from API
   * Useful after user completes actions that might change their level/stats
   * 
   * @returns {Promise<Object|void>} Promise resolving to updated limits
   */
  const refreshUserLimits = useCallback(async () => {
    if (user?.id) {
      return await fetchUserLimits(user.id);
    }
  }, [user?.id, fetchUserLimits]);

  /**
   * Updates user limits in the database and syncs locally
   * Used when user's level or stats change significantly
   * 
   * @returns {Promise<Object|void>} Promise resolving to updated limits
   */
  const updateUserLimitsInDB = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Fetch current user data
      const userRes = await fetch(`${apiSheets.users}&id=${user.id}`);
      const userData = await userRes.json();

      if (userData.length > 0) {
        const userStats = userData[0];
        const allLimits = calculateAllUserLimits(userStats);
        
        // Update limits in database via PATCH request
        await fetch(apiSheets.users, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              id: user.id,
              maxExpReward: allLimits.maxExp,    // Update EXP limit in DB
              maxGoldReward: allLimits.maxGold,  // Update Gold limit in DB
              maxGemReward: allLimits.maxGem,    // Update Gem limit in DB
              maxGoldPrice: allLimits.maxGoldPrice, // Update Gold price limit
              maxGemPrice: allLimits.maxGemPrice,   // Update Gem price limit
              creatorTier: allLimits.creatorTier,   // Update creator tier
              lastLimitUpdate: new Date().toISOString() // Track when limits were updated
            }
          })
        });
        
        // Update local state and cache
        setUserRewardLimits(allLimits);
        localStorage.setItem(USER_LIMITS_KEY, JSON.stringify(allLimits));
        
        return allLimits;
      }
    } catch (error) {
      console.error('Failed to update user limits in DB:', error);
    }
  }, [user?.id]);

  /**
   * Initializes authentication on app startup
   * - Loads user from localStorage
   * - Fetches current limits
   * - Sets up initial auth state
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attempt to load cached user and limits
        const raw = localStorage.getItem(STORAGE_KEY);
        const cachedLimits = localStorage.getItem(USER_LIMITS_KEY);
        
        // Restore cached limits if available
        if (cachedLimits) {
          setUserRewardLimits(JSON.parse(cachedLimits));
        }

        // Restore user session if available
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) {
            setUser(parsed);
            // Fetch fresh limits for the restored user
            await fetchUserLimits(parsed.id);
          } else {
            // Clear invalid user data
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_LIMITS_KEY);
      } finally {
        // Mark initialization as complete
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUserLimits]);

  /**
   * Persists user data to localStorage whenever user state changes
   * Automatically saves/removes user data based on authentication state
   */
  useEffect(() => {
    try {
      if (user && user.id) {
        // Save user data to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        // Clear user data on logout
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_LIMITS_KEY);
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }, [user]);

  /**
   * Login function - authenticates a user and sets up their session
   * 
   * @param {Object} userObj - User object from login process
   * @returns {Promise<void>}
   * 
   * @example
   * // Usage in login component
   * const { login } = useAuth();
   * await login(userData);
   */
  const login = async (userObj) => {
    if (userObj && userObj.id) {
      setUser(userObj);
      await fetchUserLimits(userObj.id);
    } else {
      console.error('Invalid user object provided to login');
    }
  };

  /**
   * Logout function - clears user session and resets to default state
   * Removes all user data from memory and storage
   */
  const logout = () => {
    setUser(null);
    // Reset to default limits
    setUserRewardLimits({
      maxExp: 100,
      maxGold: 50,
      maxGem: 5,
      maxGoldPrice: 100,
      maxGemPrice: 10,
    });
    // Clear all stored data
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_LIMITS_KEY);
  };

  // Context value provided to consumers
  const contextValue = { 
    user,                   // Current user object (null if not authenticated)
    userRewardLimits,       // Calculated reward limits based on user level/stats
    login,                  // Function to log in a user
    logout,                 // Function to log out current user
    refreshUserLimits,      // Function to refresh limits from API
    updateUserLimitsInDB,   // Function to update limits in database
    isAuthenticated: !!(user && user.id), // Boolean indicating authentication status
    isLoading               // Boolean indicating if auth is initializing
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context
 * Must be used within an AuthProvider
 * 
 * @returns {Object} Auth context value containing:
 *   - user: Current user object
 *   - userRewardLimits: Calculated reward limits
 *   - login: Login function
 *   - logout: Logout function  
 *   - refreshUserLimits: Refresh limits function
 *   - updateUserLimitsInDB: Update limits in DB function
 *   - isAuthenticated: Authentication status boolean
 *   - isLoading: Loading status boolean
 * 
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * // Usage in any component
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}