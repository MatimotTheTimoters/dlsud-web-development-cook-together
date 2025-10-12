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

  // Fetch users data immediately (needed for login)
  const fetchUsersData = async () => {
    try {
      const usersRes = await fetch(apiSheets.users);
      const users = await usersRes.json();
      setData(prev => ({ ...prev, users }));
    } catch (error) {
      console.error('Failed to fetch users data:', error);
    }
  };

  // Fetch all other data only when authenticated
  const fetchAllData = async () => {
    if (hasFetched) return;

    setLoading(true);
    try {
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

      const newData = {
        users: data.users, // Keep existing users data
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

  // Fetch users data on mount (needed for login validation)
  useEffect(() => {
    fetchUsersData();
  }, []);

  // Fetch all other data only when authenticated
  useEffect(() => {
    if (isAuthenticated && !hasFetched) {
      fetchAllData();
    }
  }, [isAuthenticated, hasFetched]);

  // Get current user's data
  const currentUserData = useMemo(() => {
    if (!user?.id || !data.users) return null;
    return data.users.find((u) => u.id === user.id) || null;
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

  // Get followed users IDs
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

  // Query functions for Searchbar - FIXED VERSION
  const queryData = (page, filter, query) => {
    const lowerQuery = query ? query.toLowerCase().trim() : '';
    
    // REMOVED: if (!lowerQuery) return []; - This was the problem!

    const path = `/${page}`;

    switch (path) {
      case '/feed':
        if (filter === 'recipes') {
          return data.recipes.filter(
            (recipe) =>
              followedUserIds.includes(recipe.userId) &&
              (!lowerQuery || 
                recipe.title?.toLowerCase().includes(lowerQuery) ||
                recipe.description?.toLowerCase().includes(lowerQuery) ||
                recipe.tags?.toLowerCase().includes(lowerQuery))
          );
        }
        if (filter === 'challenges') {
          return data.challengesCookQuota.filter(
            (challenge) =>
              followedUserIds.includes(challenge.author) &&
              (!lowerQuery || challenge.title?.toLowerCase().includes(lowerQuery))
          );
        }
        if (filter === 'users') {
          return data.users.filter(
            (user) =>
              followedUserIds.includes(user.id) &&
              (!lowerQuery ||
                user.fullName?.toLowerCase().includes(lowerQuery) ||
                user.email?.toLowerCase().includes(lowerQuery))
          );
        }
        break;

      case '/discover':
        if (filter === 'recipes') {
          return data.recipes.filter(
            (recipe) =>
              !lowerQuery ||
              recipe.title?.toLowerCase().includes(lowerQuery) ||
              recipe.description?.toLowerCase().includes(lowerQuery) ||
              recipe.tags?.toLowerCase().includes(lowerQuery)
          );
        }
        if (filter === 'challenges') {
          return data.challengesCookQuota.filter((challenge) =>
            !lowerQuery ||
            challenge.title?.toLowerCase().includes(lowerQuery) ||
            challenge.description?.toLowerCase().includes(lowerQuery)
          );
        }
        if (filter === 'users') {
          return data.users.filter(
            (user) =>
              !lowerQuery ||
              user.fullName?.toLowerCase().includes(lowerQuery) ||
              user.email?.toLowerCase().includes(lowerQuery)
          );
        }
        break;

      case '/my-kitchen':
        if (filter === 'user-recipes') {
          return data.recipes.filter(
            (recipe) =>
              recipe.userId === currentUserData?.id &&
              (!lowerQuery ||
                recipe.title?.toLowerCase().includes(lowerQuery) ||
                recipe.description?.toLowerCase().includes(lowerQuery) ||
                recipe.tags?.toLowerCase().includes(lowerQuery))
          );
        }
        if (filter === 'user-challenges') {
          const userChallengeIds = data.challengesCookQuotaParticipants
            .filter(
              (participant) =>
                participant.userId === currentUserData?.id &&
                participant.status === 'joined'
            )
            .map((participant) => participant.challengeId);

          return data.challengesCookQuota.filter(
            (challenge) =>
              userChallengeIds.includes(challenge.challengeId) &&
              (!lowerQuery || challenge.title?.toLowerCase().includes(lowerQuery))
          );
        }
        break;

      default:
        return [];
    }

    return [];
  };

  const value = useMemo(
    () => ({
      ...data,
      loading,
      currentUserData,
      userRewardLimits,
      queryData,
      refetchAll: () => {
        setHasFetched(false);
        fetchAllData();
      },
      refetchUsers: fetchUsersData,
    }),
    [data, loading, currentUserData, userRewardLimits, followedUserIds]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};