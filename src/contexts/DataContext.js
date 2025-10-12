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

  // Fetch all data
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
        challengesCookQuotaParticipantsRes,
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

  // Fetch data only when authenticated
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

  // Query functions for Searchbar
  const queryData = (path, filter, query) => {
    const lowerQuery = query.toLowerCase();

    switch (path) {
      case '/feed':
        if (filter === 'recipes') {
          return data.recipes.filter(
            (recipe) =>
              followedUserIds.includes(recipe.author) &&
              (recipe.title?.toLowerCase().includes(lowerQuery) ||
                recipe.description?.toLowerCase().includes(lowerQuery))
          );
        }
        if (filter === 'challenges') {
          return data.challengesCookQuota.filter(
            (challenge) =>
              followedUserIds.includes(challenge.creatorId) &&
              challenge.title?.toLowerCase().includes(lowerQuery)
          );
        }
        if (filter === 'users') {
          return data.users.filter(
            (user) =>
              followedUserIds.includes(user.id) &&
              (user.fullName?.toLowerCase().includes(lowerQuery) ||
                user.email?.toLowerCase().includes(lowerQuery))
          );
        }
        break;

      case '/discover':
        if (filter === 'recipes') {
          return data.recipes.filter(
            (recipe) =>
              recipe.title?.toLowerCase().includes(lowerQuery) ||
              recipe.description?.toLowerCase().includes(lowerQuery)
          );
        }
        if (filter === 'challenges') {
          return data.challengesCookQuota.filter((challenge) =>
            challenge.title?.toLowerCase().includes(lowerQuery)
          );
        }
        if (filter === 'users') {
          return data.users.filter(
            (user) =>
              user.fullName?.toLowerCase().includes(lowerQuery) ||
              user.email?.toLowerCase().includes(lowerQuery)
          );
        }
        break;

      case '/my-kitchen':
        if (filter === 'user-recipes') {
          return data.recipes.filter(
            (recipe) =>
              recipe.author === currentUserData?.id &&
              (recipe.title?.toLowerCase().includes(lowerQuery) ||
                recipe.description?.toLowerCase().includes(lowerQuery))
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
              userChallengeIds.includes(challenge.id) &&
              challenge.title?.toLowerCase().includes(lowerQuery)
          );
        }
        break;

      default:
        return [];
    }
  };

  const value = useMemo(
    () => ({
      ...data,
      loading,
      currentUserData,
      userRewardLimits,
      queryData, // Expose queryData for Searchbar
      refetchAll: () => {
        setHasFetched(false);
        fetchAllData();
      },
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