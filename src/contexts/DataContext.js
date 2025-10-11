// src/contexts/DataContext.js
import React, { createContext, useContext, useMemo } from 'react';
import { useSheetData } from '../hooks/useSheetData';

const DataContext = createContext();

export function DataProvider({ children }) {
  // Fetch all main data once at top level
  const { data: recipes, loading: recipesLoading } = useSheetData('recipes');
  const { data: challenges, loading: challengesLoading } = useSheetData('challengesCookQuota');
  const { data: users, loading: usersLoading } = useSheetData('users');
  const { data: friendships, loading: friendshipsLoading } = useSheetData('friendships');

  const value = useMemo(() => ({
    // Raw data
    recipes,
    challenges, 
    users,
    friendships,
    
    // Loading states
    loading: recipesLoading || challengesLoading || usersLoading || friendshipsLoading,
    
    // Derived data
    userStats: users?.[0] || null, // Assuming first user is current user
    
    // Helper functions
    getUserById: (userId) => users?.find(user => user.id === userId),
    getRecipesByUser: (userId) => recipes?.filter(recipe => recipe.author === userId),
    
  }), [recipes, challenges, users, friendships, recipesLoading, challengesLoading, usersLoading, friendshipsLoading]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};