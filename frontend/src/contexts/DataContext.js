import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { FaDatabase, FaSync } from 'react-icons/fa';
// Import API modules - The "Messengers"
import * as recipeApi from '../api/recipes';
import * as relationshipsApi from '../api/relationships';
import * as cookbooksApi from '../api/cookbooks';
import * as userApi from '../api/users';
import * as cookingSessionApi from '../api/cooking-sessions';
import { useAuth } from '../hooks/useAuth';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Access Auth Context to check login status
  const { isAuthenticated } = useAuth();

  // State
  const [userData, setUserData] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [cookbooks, setCookbooks] = useState([]);
  const [cookingSessions, setCookingSessions] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState({
    user: false,
    recipes: false,
    relationships: false,
    all: false
  });
  const [errors, setErrors] = useState({});

  // ==========================================
  // 1. DATA FETCHING (Delegates to API files)
  // ==========================================

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated()) return; // Auth Check
    setLoading(prev => ({ ...prev, user: true }));
    try {
      // CALL API FILE, NOT FETCH DIRECTLY
      const response = await userApi.getProfile(); 
      if (response.success) {
        setUserData(response.data.profile || response.data.user); // Handle response structure
      }
    } catch (error) {
      console.error('User fetch error:', error);
      setErrors(prev => ({ ...prev, user: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  }, [isAuthenticated]);

  const fetchRecipes = useCallback(async (params = {}) => {
    if (!isAuthenticated()) return;
    setLoading(prev => ({ ...prev, recipes: true }));
    try {
      const response = await recipeApi.getAllRecipes(params);
      if (response.success) {
        setRecipes(response.data.recipes || []);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, recipes: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  }, [isAuthenticated]);

  // ==========================================
  // 2. MASTER SYNC FUNCTION
  // ==========================================
  
  const fetchAllData = useCallback(async () => {
    // STOP if not logged in. This matches your checklist "Update DataContext for auth dependency"
    if (!isAuthenticated()) {
      return; 
    }

    setLoading(prev => ({ ...prev, all: true }));
    try {
      await Promise.all([
        fetchUserData(),
        fetchRecipes(),
        // Add others as you implement their API files:
        // fetchRelationships(),
        // fetchCookbooks()
      ]);
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  }, [isAuthenticated, fetchUserData, fetchRecipes]);

  // Trigger fetch when auth state changes
  useEffect(() => {
    if (isAuthenticated()) {
      fetchAllData();
    } else {
      // Clear data on logout
      setUserData(null);
      setRecipes([]);
    }
  }, [isAuthenticated, fetchAllData]);

  // ==========================================
  // 3. ACTION METHODS (Update State & Call API)
  // ==========================================

  const addRecipe = async (recipeData) => {
    setLoading(prev => ({ ...prev, recipes: true }));
    try {
      const result = await recipeApi.createRecipe(recipeData);
      if (result.success) {
        // Optimistic update or refetch
        fetchRecipes(); 
        return { success: true, data: result.data };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  const value = {
    userData,
    recipes,
    loading,
    errors,
    fetchAllData,
    fetchUserData,
    fetchRecipes,
    addRecipe
    // Add other methods as you build Features 3, 4, 5
  };

  return (
    <DataContext.Provider value={value}>
      {children}
      {/* Visual loaders can go here */}
      {loading.all && <div className="sync-indicator">Syncing...</div>}
    </DataContext.Provider>
  );
};

export default DataContext;