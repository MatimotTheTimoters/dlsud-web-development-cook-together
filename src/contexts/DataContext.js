// src/contexts/DataContext.js - UPDATED
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiSheets from '../constants/api.js';
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

  // 🔍 SEARCH HELPER FUNCTIONS

  // Get users that the current user is following
  const getFollowedUsers = useMemo(() => {
    if (!currentUserData?.id || !data.usersRelationships) return [];
    
    return data.usersRelationships
      .filter(relationship => 
        relationship.sourceUserId === currentUserData.id && 
        relationship.relationship === 'following'
      )
      .map(relationship => relationship.targetUserId);
  }, [currentUserData?.id, data.usersRelationships]);

  // Get recipes from users that the current user follows
  const getRecipesByFollowing = useMemo(() => {
    if (!data.recipes || !getFollowedUsers.length) return [];
    
    return data.recipes.filter(recipe => 
      getFollowedUsers.includes(recipe.author)
    );
  }, [data.recipes, getFollowedUsers]);

  // Get challenges from users that the current user follows
  const getChallengesByFollowing = useMemo(() => {
    if (!data.challengesCookQuota || !getFollowedUsers.length) return [];
    
    return data.challengesCookQuota.filter(challenge => 
      getFollowedUsers.includes(challenge.creatorId)
    );
  }, [data.challengesCookQuota, getFollowedUsers]);

  // Get users that the current user follows (excluding self)
  const getUsersByFollowing = useMemo(() => {
    if (!data.users || !getFollowedUsers.length) return [];
    
    return data.users.filter(user => 
      getFollowedUsers.includes(user.id) && user.id !== currentUserData?.id
    );
  }, [data.users, getFollowedUsers, currentUserData?.id]);

  // Get all recipes (no filtering)
  const getAllRecipes = useMemo(() => {
    return data.recipes || [];
  }, [data.recipes]);

  // Get all challenges (no filtering)
  const getAllChallenges = useMemo(() => {
    return data.challengesCookQuota || [];
  }, [data.challengesCookQuota]);

  // Get all users (no filtering, excluding current user)
  const getAllUsers = useMemo(() => {
    if (!data.users) return [];
    return data.users.filter(user => user.id !== currentUserData?.id);
  }, [data.users, currentUserData?.id]);

  // Get recipes created by the current user
  const getUserRecipes = useMemo(() => {
    if (!data.recipes || !currentUserData?.id) return [];
    
    return data.recipes.filter(recipe => 
      recipe.author === currentUserData.id
    );
  }, [data.recipes, currentUserData?.id]);

  // Get challenges that the current user has joined
  const getUserChallenges = useMemo(() => {
    if (!data.challengesCookQuotaParticipants || !currentUserData?.id) return [];
    
    const userChallengeIds = data.challengesCookQuotaParticipants
      .filter(participant => 
        participant.userId === currentUserData.id && 
        participant.status === 'joined'
      )
      .map(participant => participant.challengeId);
    
    return data.challengesCookQuota.filter(challenge => 
      userChallengeIds.includes(challenge.id)
    );
  }, [data.challengesCookQuota, data.challengesCookQuotaParticipants, currentUserData?.id]);

  // Get user's cookbooks (if you have a cookbooks sheet)
  const getUserCookbooks = useMemo(() => {
    // This would need to be implemented when you have a cookbooks sheet
    // For now, return empty array as placeholder
    return [];
  }, []);

  const value = useMemo(() => ({
    // Raw data
    ...data,
    loading,
    currentUserData,
    userRewardLimits,
    
    // 🔍 SEARCH HELPER FUNCTIONS
    getRecipesByFollowing,
    getChallengesByFollowing,
    getUsersByFollowing,
    getAllRecipes,
    getAllChallenges,
    getAllUsers,
    getUserRecipes,
    getUserChallenges,
    getUserCookbooks,
    getFollowedUsers, // Export this for other components if needed

    // Existing helper functions
    getUserById: (userId) => data.users?.find(user => user.id === userId),
    getRecipesByUser: (userId) => data.recipes?.filter(recipe => recipe.author === userId),
    getRecipeIngredients: (recipeId) => data.recipesIngredients?.filter(ingredient => ingredient.recipeId === recipeId),
    getRecipeSteps: (recipeId) => data.recipesSteps?.filter(step => step.recipeId === recipeId),
    getChallengeParticipants: (challengeId) => data.challengesCookQuotaParticipants?.filter(participant => participant.challengeId === challengeId),
    getUserRelationships: (userId) => data.usersRelationships?.filter(relationship => 
      relationship.sourceUserId === userId || relationship.targetUserId === userId
    ),
    isUserFriend: (userId, friendId) => data.usersRelationships?.some(relationship => 
      (relationship.sourceUserId === userId && relationship.targetUserId === friendId) ||
      (relationship.sourceUserId === friendId && relationship.targetUserId === userId)
    ),
    
    // Refresh function
    refetchAll: () => {
      setHasFetched(false);
      fetchAllData();
    },
  }), [
    data,
    loading,
    currentUserData,
    userRewardLimits,
    // Search helpers dependencies
    getRecipesByFollowing,
    getChallengesByFollowing,
    getUsersByFollowing,
    getAllRecipes,
    getAllChallenges,
    getAllUsers,
    getUserRecipes,
    getUserChallenges,
    getUserCookbooks,
    getFollowedUsers
  ]);

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