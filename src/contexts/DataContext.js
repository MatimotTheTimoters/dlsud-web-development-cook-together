import React, { createContext, useContext, useMemo } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { useAuth } from '../hooks/useAuth';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { user, userRewardLimits } = useAuth();
  
  // Fetch all main data once at top level - ONLY FROM YOUR API SHEETS
  const { data: users, loading: usersLoading } = useSheetData('users');
  const { data: usersRelationships, loading: usersRelationshipsLoading } = useSheetData('usersRelationships');
  const { data: recipes, loading: recipesLoading } = useSheetData('recipes');
  const { data: recipesIngredients, loading: recipesIngredientsLoading } = useSheetData('recipesIngredients');
  const { data: recipesSteps, loading: recipesStepsLoading } = useSheetData('recipesSteps');
  const { data: challengesCookQuota, loading: challengesCookQuotaLoading } = useSheetData('challengesCookQuota');
  const { data: challengesCookQuotaParticipants, loading: challengesCookQuotaParticipantsLoading } = useSheetData('challengesCookQuotaParticipants');

  // Get current user's full data from users sheet
  const currentUserData = useMemo(() => {
    if (!user?.id || !users) return null;
    return users.find(u => u.id === user.id) || null;
  }, [user?.id, users]);

  // Combined loading state
  const loading = useMemo(() => (
    usersLoading || 
    usersRelationshipsLoading || 
    recipesLoading || 
    recipesIngredientsLoading || 
    recipesStepsLoading || 
    challengesCookQuotaLoading || 
    challengesCookQuotaParticipantsLoading
  ), [
    usersLoading, usersRelationshipsLoading, recipesLoading, 
    recipesIngredientsLoading, recipesStepsLoading, 
    challengesCookQuotaLoading, challengesCookQuotaParticipantsLoading
  ]);

  const value = useMemo(() => ({
    // RAW DATA - From API sheets
    users,
    usersRelationships,
    recipes,
    recipesIngredients,
    recipesSteps,
    challengesCookQuota,
    challengesCookQuotaParticipants,
    
    // Loading states
    loading,
    
    // User data
    currentUserData,
    userRewardLimits,
    
    // HELPER FUNCTIONS
    getUserById: (userId) => users?.find(user => user.id === userId),
    getRecipesByUser: (userId) => recipes?.filter(recipe => recipe.author === userId),
    getRecipeIngredients: (recipeId) => recipesIngredients?.filter(ingredient => ingredient.recipeId === recipeId),
    getRecipeSteps: (recipeId) => recipesSteps?.filter(step => step.recipeId === recipeId),
    getChallengeParticipants: (challengeId) => challengesCookQuotaParticipants?.filter(participant => participant.challengeId === challengeId),
    getUserRelationships: (userId) => usersRelationships?.filter(relationship => 
      relationship.userId === userId || relationship.friendId === userId
    ),
    isUserFriend: (userId, friendId) => usersRelationships?.some(relationship => 
      (relationship.userId === userId && relationship.friendId === friendId) ||
      (relationship.userId === friendId && relationship.friendId === userId)
    ),
    
  }), [
    users, usersRelationships, recipes, recipesIngredients, recipesSteps,
    challengesCookQuota, challengesCookQuotaParticipants,
    loading, currentUserData, userRewardLimits
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