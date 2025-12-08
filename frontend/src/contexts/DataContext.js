import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { FaDatabase, FaSync } from 'react-icons/fa';
import * as recipeApi from '../api/recipes';
import * as relationshipsApi from '../api/relationships';

// Create DataContext
const DataContext = createContext();

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
  const [cookbooks, setCookbooks] = useState([]);
  const [cookingSessions, setCookingSessions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState({
    user: false,
    recipes: false,
    relationships: false,
    cookbooks: false,
    sessions: false,
    upload: false,
    all: false
  });

  const [errors, setErrors] = useState({});

  // Cache for storing fetched data
  const [cache, setCache] = useState({});

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  // Fetch all data - waits for authentication
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated()) {
      console.log('Waiting for authentication before fetching data...');
      return;
    }

    setLoading(prev => ({ ...prev, all: true }));

    try {
      // Wait for auth to be ready (simulated delay)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Fetch all data types in parallel
      await Promise.all([
        fetchUserData(),
        fetchRecipes(),
        fetchRelationships(),
        fetchCookbooks(),
        fetchCookingSessions(),
        fetchFriendRequests(),
        fetchFollowers(),
        fetchFollowing()
      ]);

      setErrors({});
    } catch (error) {
      console.error('Error fetching all data:', error);
      setErrors(prev => ({
        ...prev,
        all: error.message || 'Failed to fetch all data'
      }));
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  }, []);

  // ====================
  // USER METHODS
  // ====================

  const fetchUserData = async () => {
    if (!isAuthenticated()) return;

    setLoading(prev => ({ ...prev, user: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api/users/profile.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserData(data.data);
          setCachedData('userData', data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } else {
        throw new Error(`HTTP ${response.status}: Failed to fetch user data`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setErrors(prev => ({ ...prev, user: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  };

  // ====================
  // RECIPE METHODS
  // ====================

  const fetchRecipes = async (params = {}) => {
    if (!isAuthenticated()) return;

    setLoading(prev => ({ ...prev, recipes: true }));

    try {
      const result = await recipeApi.getAllRecipes(params);

      if (result.success) {
        setRecipes(result.data.recipes || []);
        setCachedData('recipes', result.data.recipes);
      } else {
        throw new Error(result.message || 'Failed to fetch recipes');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setErrors(prev => ({ ...prev, recipes: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  const addRecipe = async (recipeData) => {
    setLoading(prev => ({ ...prev, recipes: true }));

    try {
      const result = await recipeApi.createRecipe(recipeData);

      if (result.success) {
        // Add new recipe to state
        setRecipes(prev => [result.data.recipe, ...prev]);
        // Refresh recipes list
        await fetchRecipes();
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'Failed to create recipe');
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  const removeRecipe = async (recipeId) => {
    setLoading(prev => ({ ...prev, recipes: true }));

    try {
      const result = await recipeApi.deleteRecipe(recipeId);

      if (result.success) {
        // Remove recipe from state
        setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error removing recipe:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  const updateRecipeInContext = async (recipeId, updates) => {
    setLoading(prev => ({ ...prev, recipes: true }));

    try {
      const result = await recipeApi.updateRecipe(recipeId, updates);

      if (result.success) {
        // Update recipe in state
        setRecipes(prev => prev.map(recipe =>
          recipe.id === recipeId ? { ...recipe, ...result.data.recipe } : recipe
        ));
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'Failed to update recipe');
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  // ====================
  // RELATIONSHIP METHODS
  // ====================

  const fetchRelationships = async () => {
    if (!isAuthenticated()) return;

    setLoading(prev => ({ ...prev, relationships: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api/relationships/list.php?type=following', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRelationships(data.data.items || []);
          setCachedData('relationships', data.data.items);
        } else {
          throw new Error(data.message || 'Failed to fetch relationships');
        }
      } else {
        throw new Error(`HTTP ${response.status}: Failed to fetch relationships`);
      }
    } catch (error) {
      console.error('Error fetching relationships:', error);
      setErrors(prev => ({ ...prev, relationships: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, relationships: false }));
    }
  };

  const fetchFriendRequests = async () => {
    if (!isAuthenticated()) return;

    setLoading(prev => ({ ...prev, relationships: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api/relationships/list.php?type=friend_requests&request_type=received', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFriendRequests(data.data.items || []);
        } else {
          throw new Error(data.message || 'Failed to fetch friend requests');
        }
      } else {
        throw new Error(`HTTP ${response.status}: Failed to fetch friend requests`);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      setErrors(prev => ({ ...prev, friendRequests: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, relationships: false }));
    }
  };

  const fetchFollowers = async () => {
    if (!isAuthenticated()) return;

    setLoading(prev => ({ ...prev, relationships: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api/relationships/list.php?type=followers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowers(data.data.items || []);
        } else {
          throw new Error(data.message || 'Failed to fetch followers');
        }
      } else {
        throw new Error(`HTTP ${response.status}: Failed to fetch followers`);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      setErrors(prev => ({ ...prev, followers: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, relationships: false }));
    }
  };

  const fetchFollowing = async () => {
    if (!isAuthenticated()) return;

    setLoading(prev => ({ ...prev, relationships: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api/relationships/list.php?type=following', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowing(data.data.items || []);
        } else {
          throw new Error(data.message || 'Failed to fetch following');
        }
      } else {
        throw new Error(`HTTP ${response.status}: Failed to fetch following`);
      }
    } catch (error) {
      console.error('Error fetching following:', error);
      setErrors(prev => ({ ...prev, following: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, relationships: false }));
    }
  };

  const followUser = async (targetUserId, action = 'toggle') => {
    try {
      setLoading(prev => ({ ...prev, relationships: true }));

      const response = await fetch('http://localhost/api/relationships/follow.php', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          target_user_id: targetUserId,
          action: action
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to follow user');
      }

      // Refresh relationships data
      await fetchFollowing();
      await fetchFollowers();

      return data;
    } catch (err) {
      console.error('Follow user error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(prev => ({ ...prev, relationships: false }));
    }
  };

  const manageFriendRequest = async (targetUserId, action, message = null) => {
    try {
      setLoading(prev => ({ ...prev, relationships: true }));

      const response = await fetch('http://localhost/api/relationships/friends.php', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          target_user_id: targetUserId,
          action: action,
          message: message
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to manage friend request');
      }

      // Refresh friend requests
      await fetchFriendRequests();
      await fetchFollowing();

      return data;
    } catch (err) {
      console.error('Manage friend request error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(prev => ({ ...prev, relationships: false }));
    }
  };

  // ====================
  // COOKBOOK METHODS
  // ====================

  const fetchCookbooks = async () => {
    if (!isAuthenticated()) return;

    setLoading(prev => ({ ...prev, cookbooks: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api/cookbooks/index.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCookbooks(data.data.cookbooks || []);
          setCachedData('cookbooks', data.data.cookbooks);
        } else {
          throw new Error(data.message || 'Failed to fetch cookbooks');
        }
      } else {
        throw new Error(`HTTP ${response.status}: Failed to fetch cookbooks`);
      }
    } catch (error) {
      console.error('Error fetching cookbooks:', error);
      setErrors(prev => ({ ...prev, cookbooks: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, cookbooks: false }));
    }
  };

  // ====================
  // COOKING SESSION METHODS
  // ====================

  const fetchCookingSessions = async () => {
    if (!isAuthenticated()) return;

    setLoading(prev => ({ ...prev, sessions: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api/cooking-sessions/index.php', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCookingSessions(data.data.sessions || []);
          setCachedData('cookingSessions', data.data.sessions);
        } else {
          throw new Error(data.message || 'Failed to fetch cooking sessions');
        }
      } else {
        throw new Error(`HTTP ${response.status}: Failed to fetch cooking sessions`);
      }
    } catch (error) {
      console.error('Error fetching cooking sessions:', error);
      setErrors(prev => ({ ...prev, sessions: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, sessions: false }));
    }
  };

  // ====================
  // UTILITY METHODS
  // ====================

  // Update user data
  const updateUserData = (data) => {
    setUserData(prev => ({ ...prev, ...data }));
    setCachedData('userData', { ...userData, ...data });
  };

  // Update recipes
  const updateRecipes = (data) => {
    setRecipes(data);
    setCachedData('recipes', data);
  };

  // Update relationships
  const updateRelationships = (data) => {
    setRelationships(data);
    setCachedData('relationships', data);
  };

  // Clear all data
  const clearData = () => {
    setUserData(null);
    setRecipes([]);
    setRelationships([]);
    setCookbooks([]);
    setCookingSessions([]);
    setFriendRequests([]);
    setFollowers([]);
    setFollowing([]);
    setCache({});
    setErrors({});
  };

  // Get cached data
  const getCachedData = (key) => {
    return cache[key] || null;
  };

  // Set data in cache
  const setCachedData = (key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now()
      }
    }));
  };

  // Check cache validity (5 minutes)
  const isCacheValid = (key) => {
    const cached = cache[key];
    if (!cached) return false;
    return Date.now() - cached.timestamp < 5 * 60 * 1000; // 5 minutes
  };

  // Sync all data
  const syncAllData = async () => {
    setLoading(prev => ({ ...prev, all: true }));

    try {
      await fetchAllData();

      // Show sync success notification
      console.log('🔄 Data synced successfully!');
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  // ====================
  // FILE UPLOAD METHODS
  // ====================

  /**
   * Uploads an image to the server
   * @param {File} file - Image file to upload
   * @param {string} type - Type of image ('profile_picture', 'recipe_cover', 'step_image')
   * @param {string} userId - User ID
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  const uploadImage = async (file, type, userId = null, options = {}) => {
    setLoading(prev => ({ ...prev, upload: true }));

    try {
      // Validate image
      const validation = uploadUtils.validateImageFile(file, options);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }

      // Prepare form data
      const formData = uploadUtils.prepareFormData(file, 'image', {
        type,
        user_id: userId,
        ...options.additionalData
      });

      // Get auth token
      const token = localStorage.getItem('token');

      // Upload to backend API
      const response = await fetch('http://localhost/api/upload/image.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type header for FormData
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, upload: false }));
    }
  };

  /**
 * Uploads profile picture
 * @param {File} file - Profile picture file
 * @returns {Promise<Object>} Upload result with image URL
 */
  const uploadProfilePicture = async (file) => {
    try {
      // Upload image using the general uploadImage function
      const uploadResult = await uploadImage(file, 'profile_picture', userData?.id);

      return uploadResult;
    } catch (error) {
      console.error('Profile picture upload error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Uploads recipe cover image
   * @param {File} file - Recipe cover image file
   * @param {string} recipeId - Recipe ID (optional, for existing recipes)
   * @returns {Promise<Object>} Upload result with image URL
   */
  const uploadRecipeCoverImage = async (file, recipeId = null) => {
    try {
      const uploadResult = await uploadImage(file, 'recipe_cover', userData?.id, {
        additionalData: { recipe_id: recipeId }
      });

      return uploadResult;
    } catch (error) {
      console.error('Recipe cover upload error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
 * Updates user profile (with file upload support)
 * @param {Object} updates - Profile updates
 * @param {File} profilePictureFile - New profile picture file (optional)
 * @returns {Promise<Object>} Update result
 */
  const updateUserProfile = async (updates, profilePictureFile = null) => {
    setLoading(prev => ({ ...prev, user: true }));

    try {
      let imageUrl = updates.profile_picture;

      // Upload new profile picture if provided
      if (profilePictureFile) {
        const uploadResult = await uploadImage(profilePictureFile, 'profile_picture', userData?.id);
        if (!uploadResult.success) {
          return uploadResult;
        }
        imageUrl = uploadResult.data?.image_url || uploadResult.data?.url;
      }

      // Prepare update data
      const updateData = {
        ...updates,
        ...(imageUrl && { profile_picture: imageUrl })
      };

      // Send update request
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/api/users/update.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Refresh user data
      await fetchUserData();

      return { success: true, data };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  };

  /**
   * Creates recipe with image upload support
   * @param {Object} recipeData - Recipe data
   * @param {File} coverImageFile - Cover image file (optional)
   * @returns {Promise<Object>} Create result
   */
  const createRecipeWithImage = async (recipeData, coverImageFile = null) => {
    try {
      // Upload cover image if provided
      let coverImageUrl = recipeData.cover_image;

      if (coverImageFile) {
        const uploadResult = await uploadRecipeCoverImage(coverImageFile);
        if (!uploadResult.success) {
          return uploadResult;
        }
        coverImageUrl = uploadResult.data.image_url;
      }

      // Prepare recipe data with image URL
      const recipeWithImage = {
        ...recipeData,
        ...(coverImageUrl && { cover_image: coverImageUrl })
      };

      // Create recipe using existing addRecipe function
      return await addRecipe(recipeWithImage);
    } catch (error) {
      console.error('Create recipe with image error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Updates recipe with image upload support
   * @param {string} recipeId - Recipe ID
   * @param {Object} updates - Recipe updates
   * @param {File} coverImageFile - New cover image file (optional)
   * @returns {Promise<Object>} Update result
   */
  const updateRecipeWithImage = async (recipeId, updates, coverImageFile = null) => {
    try {
      // Upload new cover image if provided
      let coverImageUrl = updates.cover_image;

      if (coverImageFile) {
        const uploadResult = await uploadRecipeCoverImage(coverImageFile, recipeId);
        if (!uploadResult.success) {
          return uploadResult;
        }
        coverImageUrl = uploadResult.data.image_url;
      }

      // Prepare update data with image URL
      const recipeUpdates = {
        ...updates,
        ...(coverImageUrl && { cover_image: coverImageUrl })
      };

      // Update recipe using existing updateRecipeInContext function
      return await updateRecipeInContext(recipeId, recipeUpdates);
    } catch (error) {
      console.error('Update recipe with image error:', error);
      return { success: false, error: error.message };
    }
  };

  // Effect to fetch data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      fetchAllData();
    }
  }, [fetchAllData]);

  // ====================
  // CONTEXT VALUE
  // ====================

  const value = {
    // Data
    userData,
    recipes,
    relationships,
    cookbooks,
    cookingSessions,
    friendRequests,
    followers,
    following,

    // Loading states
    loading,
    errors,

    // Functions
    fetchAllData,
    fetchUserData,
    fetchRecipes,
    fetchRelationships,
    fetchCookbooks,
    fetchCookingSessions,
    updateUserData,
    updateRecipes,
    updateRelationships,
    clearData,
    getCachedData,
    setCachedData,
    syncAllData,
    isAuthenticated,

    // Recipe management functions
    addRecipe,
    removeRecipe,
    updateRecipeInContext,
    searchRecipes: async (query, filters) => {
      const result = await recipeApi.searchRecipes(query, filters);
      return result;
    },
    getTrendingRecipes: async (limit) => {
      const result = await recipeApi.getTrendingRecipes(limit);
      return result;
    },
    getUserRecipes: async (userId, params) => {
      const result = await recipeApi.getUserRecipes(userId, params);
      return result;
    },
    likeRecipe: async (recipeId) => {
      const result = await recipeApi.likeRecipe(recipeId);
      if (result.success) {
        // Update recipe in context
        setRecipes(prev => prev.map(recipe => {
          if (recipe.id === recipeId) {
            return {
              ...recipe,
              like_count: result.data.counts?.like_count || recipe.like_count,
              dislike_count: result.data.counts?.dislike_count || recipe.dislike_count
            };
          }
          return recipe;
        }));
      }
      return result;
    },
    saveRecipe: async (recipeId, cookbookId) => {
      const result = await recipeApi.saveRecipe(recipeId, cookbookId);
      return result;
    },
    purchaseRecipe: async (recipeId) => {
      const result = await recipeApi.purchaseRecipe(recipeId);
      return result;
    },
    // Add these functions inside the value object (around line 348-400)

    // Relationship management functions
    followUser: async (targetUserId) => {
      try {
        const result = await relationshipsApi.followUser(targetUserId);
        if (result.success) {
          // Update relationships in context
          await fetchRelationships();
          return result;
        }
        return result;
      } catch (error) {
        console.error('Error following user:', error);
        return { success: false, error: error.message };
      }
    },

    unfollowUser: async (targetUserId) => {
      try {
        const result = await relationshipsApi.unfollowUser(targetUserId);
        if (result.success) {
          // Update relationships in context
          await fetchRelationships();
          return result;
        }
        return result;
      } catch (error) {
        console.error('Error unfollowing user:', error);
        return { success: false, error: error.message };
      }
    },

    getFriendRequests: async () => {
      try {
        const result = await relationshipsApi.getFriendRequests();
        return result;
      } catch (error) {
        console.error('Error getting friend requests:', error);
        return { success: false, error: error.message };
      }
    },

    acceptFriendRequest: async (requestId) => {
      try {
        const result = await relationshipsApi.acceptFriendRequest(requestId);
        if (result.success) {
          // Update relationships in context
          await fetchRelationships();
        }
        return result;
      } catch (error) {
        console.error('Error accepting friend request:', error);
        return { success: false, error: error.message };
      }
    },

    rejectFriendRequest: async (requestId) => {
      try {
        const result = await relationshipsApi.rejectFriendRequest(requestId);
        if (result.success) {
          // Update relationships in context
          await fetchRelationships();
        }
        return result;
      } catch (error) {
        console.error('Error rejecting friend request:', error);
        return { success: false, error: error.message };
      }
    },

    removeFriend: async (friendId) => {
      try {
        const result = await relationshipsApi.removeFriend(friendId);
        if (result.success) {
          // Update relationships in context
          await fetchRelationships();
        }
        return result;
      } catch (error) {
        console.error('Error removing friend:', error);
        return { success: false, error: error.message };
      }
    },

    // Relationship functions
    followUser,
    manageFriendRequest,
    fetchFriendRequests,
    fetchFollowers,
    fetchFollowing,

    // Alias for compatibility with BuildChallengeModal
    currentUserData: userData,
    userRewardLimits: userData?.stats ? {
      maxExp: userData.stats.max_exp_reward || 100,
      maxGold: userData.stats.max_gold_reward || 50,
      maxGem: userData.stats.max_gem_reward || 5
    } : { maxExp: 100, maxGold: 50, maxGem: 5 },

    // Legacy method for compatibility
    refetchSheet: (sheetName) => {
      // Map old sheet names to new API calls
      switch (sheetName) {
        case 'challengesCookQuota':
          return Promise.resolve(); // Not implemented yet
        case 'recipes':
          return fetchRecipes();
        case 'users':
          return fetchUserData();
        case 'relationships':
          return fetchRelationships();
        default:
          console.warn(`Unknown sheet name: ${sheetName}`);
          return Promise.resolve();
      }
    },

    // Upload functions
    uploadImage,
    uploadProfilePicture,
    uploadRecipeCoverImage,
    updateUserProfile,
    createRecipeWithImage,
    updateRecipeWithImage,
    addRecipe,
    updateRecipeInContext
  };
};

return (
  <DataContext.Provider value={value}>
    {children}

    {/* Sync status indicator */}
    {loading.all && (
      <div className="sync-status-overlay animate__animated animate__fadeIn">
        <div className="sync-status-content">
          <FaSync className="spinning-icon" />
          <span className="sync-text">Syncing data...</span>
          <div className="sync-progress">
            <div className="progress-bar">
              <div className="progress-fill indeterminate"></div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Database status indicator */}
    <div className="database-status-fixed">
      <FaDatabase className={`database-icon ${loading.all ? 'pulsing' : ''}`} />
      <div className="status-tooltip">
        Data Context Active
        {loading.all && <div className="tooltip-status">🔄 Syncing...</div>}
      </div>
    </div>
  </DataContext.Provider>
);

export default DataContext;