// frontend/src/api/recipes.js

import api from '../utils/api';

/**
 * Recipe API Module
 * Handles all recipe-related API calls to PHP backend
 */

// Get all recipes with optional filtering
export const getAllRecipes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/api/recipes?${queryParams}` : '/api/recipes';
    const response = await api.get(endpoint);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to fetch recipes',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in getAllRecipes:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch recipes',
      error: error
    };
  }
};

// Get single recipe by ID with full details
export const getRecipe = async (recipeId) => {
  try {
    const response = await api.get(`/api/recipes/${recipeId}`);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Recipe not found',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in getRecipe:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch recipe',
      error: error
    };
  }
};

// Create new recipe
export const createRecipe = async (recipeData) => {
  try {
    // Handle file uploads if present
    if (recipeData.cover_image && recipeData.cover_image instanceof File) {
      // Upload image first
      const formData = new FormData();
      formData.append('image', recipeData.cover_image);
      formData.append('type', 'recipe');
      formData.append('user_id', localStorage.getItem('user_id'));
      
      const uploadResponse = await api.post('/api/upload/image', formData, true);
      
      if (uploadResponse.success) {
        recipeData.cover_image = uploadResponse.data.url;
      } else {
        return {
          success: false,
          message: 'Failed to upload recipe image',
          error: uploadResponse.error
        };
      }
    }
    
    // Upload step images if present
    if (recipeData.steps && Array.isArray(recipeData.steps)) {
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        if (step.image && step.image instanceof File) {
          const formData = new FormData();
          formData.append('image', step.image);
          formData.append('type', 'step');
          formData.append('user_id', localStorage.getItem('user_id'));
          
          const uploadResponse = await api.post('/api/upload/image', formData, true);
          
          if (uploadResponse.success) {
            recipeData.steps[i].image = uploadResponse.data.url;
          }
        }
      }
    }
    
    // Create recipe
    const response = await api.post('/api/recipes', recipeData);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to create recipe',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in createRecipe:', error);
    return {
      success: false,
      message: error.message || 'Failed to create recipe',
      error: error
    };
  }
};

// Update existing recipe
export const updateRecipe = async (recipeId, recipeData) => {
  try {
    // Handle file uploads if present
    if (recipeData.cover_image && recipeData.cover_image instanceof File) {
      const formData = new FormData();
      formData.append('image', recipeData.cover_image);
      formData.append('type', 'recipe');
      formData.append('user_id', localStorage.getItem('user_id'));
      
      const uploadResponse = await api.post('/api/upload/image', formData, true);
      
      if (uploadResponse.success) {
        recipeData.cover_image = uploadResponse.data.url;
      } else {
        return {
          success: false,
          message: 'Failed to upload recipe image',
          error: uploadResponse.error
        };
      }
    }
    
    // Upload step images if present
    if (recipeData.steps && Array.isArray(recipeData.steps)) {
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        if (step.image && step.image instanceof File) {
          const formData = new FormData();
          formData.append('image', step.image);
          formData.append('type', 'step');
          formData.append('user_id', localStorage.getItem('user_id'));
          
          const uploadResponse = await api.post('/api/upload/image', formData, true);
          
          if (uploadResponse.success) {
            recipeData.steps[i].image = uploadResponse.data.url;
          }
        }
      }
    }
    
    const response = await api.put(`/api/recipes/${recipeId}`, recipeData);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to update recipe',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in updateRecipe:', error);
    return {
      success: false,
      message: error.message || 'Failed to update recipe',
      error: error
    };
  }
};

// Delete recipe
export const deleteRecipe = async (recipeId) => {
  try {
    const response = await api.delete(`/api/recipes/${recipeId}`);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to delete recipe',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in deleteRecipe:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete recipe',
      error: error
    };
  }
};

// Like a recipe
export const likeRecipe = async (recipeId) => {
  try {
    const response = await api.post(`/api/recipes/${recipeId}/interact`, {
      interaction_type: 'like'
    });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to like recipe',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in likeRecipe:', error);
    return {
      success: false,
      message: error.message || 'Failed to like recipe',
      error: error
    };
  }
};

// Save recipe to cookbook
export const saveRecipe = async (recipeId, cookbookId = null) => {
  try {
    const response = await api.post(`/api/recipes/${recipeId}/interact`, {
      interaction_type: 'save',
      metadata: cookbookId ? { cookbook_id: cookbookId } : null
    });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to save recipe',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in saveRecipe:', error);
    return {
      success: false,
      message: error.message || 'Failed to save recipe',
      error: error
    };
  }
};

// Get recipe interactions
export const getRecipeInteractions = async (recipeId) => {
  try {
    // Note: Interactions are included in the recipe detail response
    // This function is for getting specific interaction stats
    const response = await api.get(`/api/recipes/${recipeId}`);
    
    if (response.success) {
      const { counts, user_interaction } = response.data;
      return {
        success: true,
        data: {
          counts,
          user_interaction
        },
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to get recipe interactions',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in getRecipeInteractions:', error);
    return {
      success: false,
      message: error.message || 'Failed to get recipe interactions',
      error: error
    };
  }
};

// Purchase recipe
export const purchaseRecipe = async (recipeId) => {
  try {
    const response = await api.post(`/api/recipes/${recipeId}/interact`, {
      interaction_type: 'purchase'
    });
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to purchase recipe',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in purchaseRecipe:', error);
    return {
      success: false,
      message: error.message || 'Failed to purchase recipe',
      error: error
    };
  }
};

// Get user's recipes
export const getUserRecipes = async (userId, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...params,
      user_id: userId
    }).toString();
    
    const endpoint = `/api/recipes?${queryParams}`;
    const response = await api.get(endpoint);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to fetch user recipes',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in getUserRecipes:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch user recipes',
      error: error
    };
  }
};

// Search recipes
export const searchRecipes = async (query, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      search: query,
      ...filters
    }).toString();
    
    const endpoint = `/api/recipes?${queryParams}`;
    const response = await api.get(endpoint);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to search recipes',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in searchRecipes:', error);
    return {
      success: false,
      message: error.message || 'Failed to search recipes',
      error: error
    };
  }
};

// Get trending recipes
export const getTrendingRecipes = async (limit = 10) => {
  try {
    // For now, use recent recipes as trending
    // In a real app, this would be based on views/likes/cooks
    const response = await api.get(`/api/recipes?limit=${limit}&sort=recent`);
    
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to fetch trending recipes',
        error: response.error
      };
    }
  } catch (error) {
    console.error('Error in getTrendingRecipes:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch trending recipes',
      error: error
    };
  }
};