// src/contexts/DataContext.js - COMPLETE & WORKING
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiSheets from '../constants/api.js'; // 🚀 IMPORT API SHEETS
import { calculateAllUserLimits } from '../utils/userCalculations.js';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState({
    users: null,
    usersRelationships: null,
    recipes: null,
    recipesIngredients: null,
    recipesSteps: null,
    challengesCookQuota: null,
    challengesCookQuotaParticipants: null,
  });
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  // 🚀 Fetch all data in one function
  const fetchAllData = async () => {
    if (hasFetched) return;
    
    setLoading(true);
    try {
      const [
        usersRes,
        usersRelationshipsRes,
        recipesRes,
        recipesIngredientsRes,
        recipesStepsRes,
        challengesCookQuotaRes,
        challengesCookQuotaParticipantsRes
      ] = await Promise.all([
        fetch(apiSheets.users),
        fetch(apiSheets.usersRelationships),
        fetch(apiSheets.recipes),
        fetch(apiSheets.recipesIngredients),
        fetch(apiSheets.recipesSteps),
        fetch(apiSheets.challengesCookQuota),
        fetch(apiSheets.challengesCookQuotaParticipants),
      ]);

      const newData = {
        users: await usersRes.json(),
        usersRelationships: await usersRelationshipsRes.json(),
        recipes: await recipesRes.json(),
        recipesIngredients: await recipesIngredientsRes.json(),
        recipesSteps: await recipesStepsRes.json(),
        challengesCookQuota: await challengesCookQuotaRes.json(),
        challengesCookQuotaParticipants: await challengesCookQuotaParticipantsRes.json(),
      };

      setData(newData);
      setHasFetched(true);
    } catch (error) {
      console.error('Failed to fetch app data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Fetch data only when authenticated
  useEffect(() => {
    if (isAuthenticated && !hasFetched) {
      fetchAllData();
    }
  }, [isAuthenticated, hasFetched]);

  // Get current user's data
  const currentUserData = useMemo(() => {
    if (!user?.id || !data.users) return null;
    return data.users.find(u => u.id === user.id) || null;
  }, [user?.id, data.users]);

  // Calculate user reward limits
  const userRewardLimits = useMemo(() => {
    if (!currentUserData) {
      return {
        maxExp: 100,
        maxGold: 50,
        maxGem: 5,
        maxGoldPrice: 100,
        maxGemPrice: 10,
      };
    }
    return calculateAllUserLimits(currentUserData);
  }, [currentUserData]);

  const value = useMemo(() => ({
    // Raw data
    ...data,
    loading,
    currentUserData,
    userRewardLimits,
    
    // Helper functions
    getUserById: (userId) => data.users?.find(user => user.id === userId),
    getRecipesByUser: (userId) => data.recipes?.filter(recipe => recipe.author === userId),
    getRecipeIngredients: (recipeId) => data.recipesIngredients?.filter(ingredient => ingredient.recipeId === recipeId),
    getRecipeSteps: (recipeId) => data.recipesSteps?.filter(step => step.recipeId === recipeId),
    getChallengeParticipants: (challengeId) => data.challengesCookQuotaParticipants?.filter(participant => participant.challengeId === challengeId),
    getUserRelationships: (userId) => data.usersRelationships?.filter(relationship => 
      relationship.userId === userId || relationship.friendId === userId
    ),
    isUserFriend: (userId, friendId) => data.usersRelationships?.some(relationship => 
      (relationship.userId === userId && relationship.friendId === friendId) ||
      (relationship.userId === friendId && relationship.friendId === userId)
    ),
    
    // Refresh function
    refetchAll: () => {
      setHasFetched(false);
      fetchAllData();
    },
  }), [data, loading, currentUserData, userRewardLimits]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// 🚀 MAKE SURE THIS EXPORT EXISTS
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};