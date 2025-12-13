import React, { createContext, useState, useContext } from 'react';

/**
 * Context for managing application data state and caching
 */

// Create Data Context
export const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // State for different data types
  const [userData, setUserData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [cache, setCache] = useState({});

  /**
   * Updates user data in context
   * @param {Object} data - User data to update
   */
  const updateUserData = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  /**
   * Updates recipes in context
   * @param {Array} data - Recipes data
   */
  const updateRecipes = (data) => {
    setRecipes(data);
  };

  /**
   * Updates relationships in context
   * @param {Array} data - Relationships data
   */
  const updateRelationships = (data) => {
    setRelationships(data);
  };

  /**
   * Clears all context data
   */
  const clearData = () => {
    setUserData(null);
    setRecipes([]);
    setRelationships([]);
    setCache({});
  };

  /**
   * Retrieves cached data with timestamp validation
   * @param {string} key - Cache key
   * @returns {mixed} Cached data or null
   */
  const getCachedData = (key) => {
    const cachedItem = cache[key];
    if (cachedItem && Date.now() - cachedItem.timestamp < 300000) { // 5 minutes
      return cachedItem.data;
    }
    return null;
  };

  /**
   * Sets data in cache with current timestamp
   * @param {string} key - Cache key
   * @param {mixed} data - Data to cache
   */
  const setCachedData = (key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  };

  // Convenience properties
  const currentUserData = userData;
  const userRewardLimits = userData?.stats ? {
    maxExp: userData.stats.max_exp_reward || 100,
    maxGold: userData.stats.max_gold_reward || 50,
    maxGem: userData.stats.max_gem_reward || 5
  } : { maxExp: 100, maxGold: 50, maxGem: 5 };

  const contextValue = {
    // Data
    userData,
    recipes,
    relationships,

    // Convenience properties
    currentUserData,
    userRewardLimits,

    // Update functions
    updateUserData,
    updateRecipes,
    updateRelationships,

    // Cache functions
    getCachedData,
    setCachedData,

    // Utility
    clearData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;