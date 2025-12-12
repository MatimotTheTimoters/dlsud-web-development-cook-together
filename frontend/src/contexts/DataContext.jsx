import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // State storage
  const [userData, setUserData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [cache, setCache] = useState({});

  // Internal update functions
  const updateUserData = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const updateRecipes = (data) => {
    setRecipes(data);
  };

  const updateRelationships = (data) => {
    setRelationships(data);
  };

  const clearData = () => {
    setUserData(null);
    setRecipes([]);
    setRelationships([]);
    setCache({});
  };

  const getCachedData = (key) => {
    return cache[key] || null;
  };

  const setCachedData = (key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  };

  // Public API value
  const value = {
    // Data
    userData,
    recipes,
    relationships,

    // Convenience aliases (used by components)
    currentUserData: userData,
    userRewardLimits: userData?.stats ? {
      maxExp: userData.stats.max_exp_reward || 100,
      maxGold: userData.stats.max_gold_reward || 50,
      maxGem: userData.stats.max_gem_reward || 5
    } : { maxExp: 100, maxGold: 50, maxGem: 5 },

    // Update functions
    updateUserData,
    updateRecipes,
    updateRelationships,
    updateUsers: updateUserData, // Alias used in DiscoverPage.jsx

    // Cache functions
    getCachedData,
    setCachedData,

    // Utility
    clearData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;