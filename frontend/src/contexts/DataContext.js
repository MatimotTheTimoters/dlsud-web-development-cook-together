import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { FaDatabase, FaSync } from 'react-icons/fa';
import * as recipeApi from '../api/recipes';

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

  // Loading and error states
  const [loading, setLoading] = useState({
    user: false,
    recipes: false,
    relationships: false,
    cookbooks: false,
    sessions: false,
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
        fetchCookingSessions()
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

  // Fetch user data
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

  // Fetch recipes
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

  // Fetch relationships
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
          setRelationships(data.data.relationships || []);
          setCachedData('relationships', data.data.relationships);
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

  // Fetch cookbooks
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

  // Fetch cooking sessions
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

  // Effect to fetch data on mount if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      fetchAllData();
    }
  }, [fetchAllData]);

  // Context value
  const value = {
    // Data
    userData,
    recipes,
    relationships,
    cookbooks,
    cookingSessions,

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
    }
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