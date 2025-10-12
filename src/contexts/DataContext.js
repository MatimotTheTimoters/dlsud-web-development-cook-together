// src/contexts/DataContext.js - FIXED & CLEAN
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiSheets from '../constants/api.js';
import { calculateAllUserLimits } from '../utils/userCalculations.js';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState({
    users: [],
    usersRelationships: [],
    recipes: [],
    recipesIngredients: [],
    recipesSteps: [],
    challengesCookQuota: [],
    challengesCookQuotaParticipants: [],
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

  // 🔍 Get followed users IDs
  const followedUserIds = useMemo(() => {
    if (!currentUserData?.id || !data.usersRelationships) return [];
    
    return data.usersRelationships
      .filter(relationship => 
        relationship.sourceUserId === currentUserData.id && 
        relationship.relationship === 'following'
      )
      .map(relationship => relationship.targetUserId);
  }, [currentUserData?.id, data.usersRelationships]);

  // 🔍 SEARCH HELPER FUNCTIONS
  const getRecipesByFollowing = useMemo(() => {
    if (!data.recipes || !followedUserIds.length) return [];
    return data.recipes.filter(recipe => 
      followedUserIds.includes(recipe.author)
    );
  }, [data.recipes, followedUserIds]);

  const getChallengesByFollowing = useMemo(() => {
    if (!data.challengesCookQuota || !followedUserIds.length) return [];
    return data.challengesCookQuota.filter(challenge => 
      followedUserIds.includes(challenge.creatorId)
    );
  }, [data.challengesCookQuota, followedUserIds]);

  const getUsersByFollowing = useMemo(() => {
    if (!data.users || !followedUserIds.length) return [];
    return data.users.filter(user => 
      followedUserIds.includes(user.id) && user.id !== currentUserData?.id
    );
  }, [data.users, followedUserIds, currentUserData?.id]);

  const getAllRecipes = useMemo(() => {
    return data.recipes || [];
  }, [data.recipes]);

  const getAllChallenges = useMemo(() => {
    return data.challengesCookQuota || [];
  }, [data.challengesCookQuota]);

  const getAllUsers = useMemo(() => {
    if (!data.users) return [];
    return data.users.filter(user => user.id !== currentUserData?.id);
  }, [data.users, currentUserData?.id]);

  const getUserRecipes = useMemo(() => {
    if (!data.recipes || !currentUserData?.id) return [];
    return data.recipes.filter(recipe => recipe.author === currentUserData.id);
  }, [data.recipes, currentUserData?.id]);

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

  const getUserCookbooks = useMemo(() => {
    // Placeholder - implement when you have cookbooks data
    return [];
  }, []);

  // 🔍 FEED DATA FUNCTION
  const getFeedData = useMemo(() => {
    return {
      recipes: getRecipesByFollowing,
      challenges: getChallengesByFollowing,
      users: getUsersByFollowing
    };
  }, [getRecipesByFollowing, getChallengesByFollowing, getUsersByFollowing]);

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
    getFeedData,
    followedUserIds,

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
    getRecipesByFollowing,
    getChallengesByFollowing,
    getUsersByFollowing,
    getAllRecipes,
    getAllChallenges,
    getAllUsers,
    getUserRecipes,
    getUserChallenges,
    getUserCookbooks,
    getFeedData,
    followedUserIds
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