import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth'; // Authentication hook for user info
import apiSheets from '../constants/api.js'; // API configuration for SheetDB endpoints
import { calculateAllUserLimits } from '../utils/userCalculations.js'; // Utility for calculating user limits

/**
 * Data Context for managing global application state and data fetching
 * Provides centralized data management, caching, and querying capabilities
 */
const DataContext = createContext();

/**
 * Data Provider Component
 * Manages global application data state, handles data fetching, and provides query functions
 * Implements optimized data loading with authentication-aware fetching
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that need access to data context
 * 
 * @example
 * // Wrap your app with DataProvider (inside AuthProvider)
 * <AuthProvider>
 *   <DataProvider>
 *     <App />
 *   </DataProvider>
 * </AuthProvider>
 */
export function DataProvider({ children }) {
  // Get authentication state from Auth context
  const { user, isAuthenticated } = useAuth();
  
  // Centralized state for all application data
  const [data, setData] = useState({
    users: [],                              // All user profiles
    usersRelationships: [],                 // Following/follower relationships
    recipes: [],                           // Recipe metadata and details
    recipesIngredients: [],                // Ingredients for each recipe
    recipesSteps: [],                      // Cooking steps for each recipe
    challengesCookQuota: [],               // Challenge definitions and metadata
    challengesCookQuotaParticipants: [],   // User participation in challenges
  });
  
  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);
  
  // Flag to prevent duplicate fetches
  const [hasFetched, setHasFetched] = useState(false);

  /**
   * Fetches users data immediately on app load
   * This is needed for login validation and user lookup
   * Runs independently of authentication status
   */
  const fetchUsersData = async () => {
    try {
      const usersRes = await fetch(apiSheets.users);
      const users = await usersRes.json();
      setData(prev => ({ ...prev, users }));
    } catch (error) {
      console.error('Failed to fetch users data:', error);
    }
  };

  /**
   * Fetches all application data (except users) when user is authenticated
   * Uses Promise.all for parallel fetching to optimize performance
   * Only runs once per session unless explicitly refetched
   */
  const fetchAllData = async () => {
    // Prevent duplicate fetches
    if (hasFetched) return;

    setLoading(true);
    try {
      // Fetch all data sheets in parallel for optimal performance
      const [
        usersRelationshipsRes,
        recipesRes,
        recipesIngredientsRes,
        recipesStepsRes,
        challengesCookQuotaRes,
        challengesCookQuotaParticipantsRes,
      ] = await Promise.all([
        fetch(apiSheets.usersRelationships),
        fetch(apiSheets.recipes),
        fetch(apiSheets.recipesIngredients),
        fetch(apiSheets.recipesSteps),
        fetch(apiSheets.challengesCookQuota),
        fetch(apiSheets.challengesCookQuotaParticipants),
      ]);

      // Combine all fetched data into single object
      const newData = {
        users: data.users, // Preserve existing users data
        usersRelationships: await usersRelationshipsRes.json(),
        recipes: await recipesRes.json(),
        recipesIngredients: await recipesIngredientsRes.json(),
        recipesSteps: await recipesStepsRes.json(),
        challengesCookQuota: await challengesCookQuotaRes.json(),
        challengesCookQuotaParticipants: await challengesCookQuotaParticipantsRes.json(),
      };

      setData(newData);
      setHasFetched(true); // Mark as fetched to prevent duplicates
    } catch (error) {
      console.error('Failed to fetch app data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial data fetching effect
   * Fetches users data immediately on component mount for login purposes
   */
  useEffect(() => {
    fetchUsersData();
  }, []);

  /**
   * Authentication-aware data fetching effect
   * Fetches all application data only when user is authenticated
   * Prevents unnecessary API calls for anonymous users
   */
  useEffect(() => {
    if (isAuthenticated && !hasFetched) {
      fetchAllData();
    }
  }, [isAuthenticated, hasFetched]);

  /**
   * Memoized current user data object
   * Finds and returns the complete user profile for the authenticated user
   */
  const currentUserData = useMemo(() => {
    if (!user?.id || !data.users) return null;
    return data.users.find((u) => u.id === user.id) || null;
  }, [user?.id, data.users]);

  /**
   * Memoized user reward limits calculation
   * Calculates dynamic limits based on user level, progress, and achievements
   * Falls back to default limits if user data is unavailable
   */
  const userRewardLimits = useMemo(() => {
    if (!currentUserData) {
      // Default limits for new/anonymous users
      return {
        maxExp: 100,
        maxGold: 50,
        maxGem: 5,
        maxGoldPrice: 100,
        maxGemPrice: 10,
      };
    }
    // Calculate dynamic limits based on user stats
    return calculateAllUserLimits(currentUserData);
  }, [currentUserData]);

  /**
   * Memoized list of followed user IDs
   * Extracts the IDs of all users that the current user is following
   * Used for filtering feed content and social features
   */
  const followedUserIds = useMemo(() => {
    if (!currentUserData?.id || !data.usersRelationships) return [];
    return data.usersRelationships
      .filter(
        (relationship) =>
          relationship.sourceUserId === currentUserData.id &&
          relationship.relationship === 'following'
      )
      .map((relationship) => relationship.targetUserId);
  }, [currentUserData?.id, data.usersRelationships]);

  /**
   * Universal query function for searching and filtering data
   * Supports multiple pages (feed, discover, my-kitchen) and filters
   * 
   * @param {string} page - The page context: '/feed', '/discover', or '/my-kitchen'
   * @param {string} filter - The data type: 'recipes', 'challenges', 'users', etc.
   * @param {string} query - Search query string for filtering results
   * @param {boolean} forceDefault - If true, returns all results ignoring query (for reset)
   * @returns {Array} Filtered array of data items matching the criteria
   * 
   * @example
   * // Search for pasta recipes in discover page
   * const pastaRecipes = queryData('/discover', 'recipes', 'pasta');
   * 
   * @example
   * // Get all recipes from followed users in feed
   * const feedRecipes = queryData('/feed', 'recipes', '');
   * 
   * @example  
   * // Reset to show all user recipes
   * const allUserRecipes = queryData('/my-kitchen', 'user-recipes', '', true);
   */
  const queryData = (page, filter, query, forceDefault = false) => {
    const lowerQuery = query ? query.toLowerCase().trim() : "";

    const path = `/${page}`;

    switch (path) {
      case "/feed":
        // Feed shows content only from followed users
        if (filter === "recipes") {
          return data.recipes.filter(
            (recipe) =>
              followedUserIds.includes(recipe.userId) &&
              (forceDefault ||
                lowerQuery === "" ||
                recipe.title?.toLowerCase().includes(lowerQuery) ||
                recipe.description?.toLowerCase().includes(lowerQuery) ||
                recipe.tags?.toLowerCase().includes(lowerQuery))
          );
        }
        if (filter === "challenges") {
          return data.challengesCookQuota.filter(
            (challenge) =>
              followedUserIds.includes(challenge.author) &&
              (forceDefault ||
                lowerQuery === "" ||
                challenge.title?.toLowerCase().includes(lowerQuery) ||
                challenge.description?.toLowerCase().includes(lowerQuery) ||
                challenge.tags?.toLowerCase().includes(lowerQuery))
          );
        }
        if (filter === "users") {
          return data.users.filter(
            (user) =>
              followedUserIds.includes(user.id) &&
              (forceDefault ||
                lowerQuery === "" ||
                user.fullName?.toLowerCase().includes(lowerQuery) ||
                user.email?.toLowerCase().includes(lowerQuery))
          );
        }
        break;

      case "/discover":
        // Discover shows all public content
        if (filter === "recipes") {
          return data.recipes.filter(
            (recipe) =>
              forceDefault ||
              lowerQuery === "" ||
              recipe.title?.toLowerCase().includes(lowerQuery) ||
              recipe.description?.toLowerCase().includes(lowerQuery) ||
              recipe.tags?.toLowerCase().includes(lowerQuery)
          );
        }
        if (filter === "challenges") {
          return data.challengesCookQuota.filter(
            (challenge) =>
              forceDefault ||
              lowerQuery === "" ||
              challenge.title?.toLowerCase().includes(lowerQuery) ||
              challenge.description?.toLowerCase().includes(lowerQuery) ||
              challenge.tags?.toLowerCase().includes(lowerQuery)
          );
        }
        if (filter === "users") {
          return data.users.filter(
            (user) =>
              forceDefault ||
              lowerQuery === "" ||
              user.fullName?.toLowerCase().includes(lowerQuery) ||
              user.email?.toLowerCase().includes(lowerQuery)
          );
        }
        break;

      case "/my-kitchen":
        // My Kitchen shows user's own content and participations
        if (filter === "user-recipes") {
          return data.recipes.filter(
            (recipe) =>
              recipe.userId === currentUserData?.id &&
              (forceDefault ||
                lowerQuery === "" ||
                recipe.title?.toLowerCase().includes(lowerQuery) ||
                recipe.description?.toLowerCase().includes(lowerQuery) ||
                recipe.tags?.toLowerCase().includes(lowerQuery))
          );
        }
        if (filter === "user-challenges") {
          // Find challenges where user has participated
          const userChallengeIds = data.challengesCookQuotaParticipants
            .filter(
              (participant) =>
                participant.userId === currentUserData?.id &&
                participant.status === "joined"
            )
            .map((participant) => participant.challengeId);

          return data.challengesCookQuota.filter(
            (challenge) =>
              userChallengeIds.includes(challenge.challengeId) &&
              (forceDefault ||
                lowerQuery === "" ||
                challenge.title?.toLowerCase().includes(lowerQuery) ||
                challenge.description?.toLowerCase().includes(lowerQuery) ||
                challenge.tags?.toLowerCase().includes(lowerQuery))
          );
        }
        break;

      default:
        return [];
    }

    return [];
  };

  /**
   * Refetches a specific data sheet from the API
   * Useful for updating individual data types without refetching everything
   * 
   * @param {string} sheetName - The name of the sheet to refetch (must match apiSheets key)
   * @returns {Promise<void>}
   * 
   * @example
   * // Refetch recipes after adding a new recipe
   * const { refetchSheet } = useData();
   * await refetchSheet('recipes');
   */
  const refetchSheet = async (sheetName) => {
    try {
      const sheetUrl = apiSheets[sheetName];
      if (!sheetUrl) {
        console.error(`Sheet name "${sheetName}" does not exist in apiSheets.`);
        return;
      }

      const response = await fetch(sheetUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from sheet: ${sheetName}`);
      }

      const newData = await response.json();
      setData((prev) => ({
        ...prev,
        [sheetName]: newData,
      }));
    } catch (error) {
      console.error(`Error refetching sheet "${sheetName}":`, error);
    }
  };

  /**
   * Memoized context value to prevent unnecessary re-renders
   * Combines all data, derived values, and functions into single context object
   */
  const value = useMemo(
    () => ({
      // Spread all data arrays for direct access
      ...data,
      
      // State flags
      loading,
      
      // Derived data
      currentUserData,
      userRewardLimits,
      
      // Query functions
      queryData,
      
      // Data refresh functions
      refetchAll: () => {
        setHasFetched(false);
        fetchAllData();
      },
      refetchUsers: fetchUsersData,
      refetchSheet,
    }),
    [data, loading, currentUserData, userRewardLimits, followedUserIds]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * Custom hook to access data context
 * Provides access to global application data and query functions
 * 
 * @returns {Object} Data context value containing:
 *   - All data arrays (users, recipes, challenges, etc.)
 *   - loading: Boolean indicating if initial data is loading
 *   - currentUserData: Complete profile of authenticated user
 *   - userRewardLimits: Calculated reward limits for current user
 *   - queryData: Universal search and filter function
 *   - refetchAll: Function to refetch all application data
 *   - refetchUsers: Function to refetch only users data
 *   - refetchSheet: Function to refetch specific data sheet
 * 
 * @throws {Error} If used outside of DataProvider
 * 
 * @example
 * // Basic usage in components
 * const { recipes, loading, queryData } = useData();
 * 
 * @example
 * // Search functionality
 * const searchResults = queryData('/discover', 'recipes', 'pasta');
 * 
 * @example
 * // Data refresh after mutations
 * const { refetchSheet } = useData();
 * await handleAddRecipe();
 * await refetchSheet('recipes');
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};