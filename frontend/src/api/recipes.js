import api from '../utils/api';

/**
 * Recipe API Module
 * Handles all recipe-related API calls to PHP backend
 */

/**
 * Upload image file
 * @param {File} file - Image file
 * @param {string} type - 'recipe' or 'step'
 * @param {string} userId - User ID
 * @returns {Promise} Upload response
 */
const uploadImage = async (file, type, userId) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    formData.append('user_id', userId);

    const response = await api.post('/api/upload/image.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error(`Error uploading ${type} image:`, error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Get all recipes with optional filtering
export const getAllRecipes = async (params = {}) => {
  try {
    const response = await api.get('/api/recipes/index.php', { params });
    return response.data; // Changed: axios returns data in response.data
  } catch (error) {
    console.error('Error in getAllRecipes:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Get single recipe by ID with full details
export const getRecipe = async (recipeId) => {
  try {
    const response = await api.get(`/api/recipes/show.php?id=${recipeId}`);
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in getRecipe:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Create new recipe
export const createRecipe = async (recipeData) => {
  try {
    // Handle file uploads if present
    if (recipeData.cover_image && recipeData.cover_image instanceof File) {
      // Upload image first
      const uploadResponse = await uploadImage(
        recipeData.cover_image,
        'recipe',
        localStorage.getItem('user_id')
      );

      if (uploadResponse.success) {
        recipeData.cover_image = uploadResponse.data.url;
      } else {
        throw new Error('Failed to upload recipe image');
      }
    }

    // Upload step images if present
    if (recipeData.steps && Array.isArray(recipeData.steps)) {
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        if (step.image && step.image instanceof File) {
          const uploadResponse = await uploadImage(
            step.image,
            'step',
            localStorage.getItem('user_id')
          );

          if (uploadResponse.success) {
            recipeData.steps[i].image = uploadResponse.data.url;
          }
        }
      }
    }

    // Create recipe
    const response = await api.post('/api/recipes/create.php', recipeData);
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in createRecipe:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Update existing recipe
export const updateRecipe = async (recipeId, recipeData) => {
  try {
    // Handle file uploads if present
    if (recipeData.cover_image && recipeData.cover_image instanceof File) {
      const uploadResponse = await uploadImage(
        recipeData.cover_image,
        'recipe',
        localStorage.getItem('user_id')
      );

      if (uploadResponse.success) {
        recipeData.cover_image = uploadResponse.data.url;
      } else {
        throw new Error('Failed to upload recipe image');
      }
    }

    // Upload step images if present
    if (recipeData.steps && Array.isArray(recipeData.steps)) {
      for (let i = 0; i < recipeData.steps.length; i++) {
        const step = recipeData.steps[i];
        if (step.image && step.image instanceof File) {
          const uploadResponse = await uploadImage(
            step.image,
            'step',
            localStorage.getItem('user_id')
          );

          if (uploadResponse.success) {
            recipeData.steps[i].image = uploadResponse.data.url;
          }
        }
      }
    }

    const response = await api.put('/api/recipes/update.php', {
      ...recipeData,
      recipe_id: recipeId
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in updateRecipe:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Delete recipe
export const deleteRecipe = async (recipeId) => {
  try {
    const response = await api.delete(`/api/recipes/delete.php?id=${recipeId}`);
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in deleteRecipe:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Like a recipe
export const likeRecipe = async (recipeId) => {
  try {
    const response = await api.post('/api/recipes/interact.php', {
      recipe_id: recipeId,
      interaction_type: 'like'
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in likeRecipe:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Save recipe to cookbook
export const saveRecipe = async (recipeId, cookbookId = null) => {
  try {
    const response = await api.post('/api/recipes/interact.php', {
      recipe_id: recipeId,
      interaction_type: 'save',
      metadata: cookbookId ? { cookbook_id: cookbookId } : null
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in saveRecipe:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Get recipe interactions
export const getRecipeInteractions = async (recipeId) => {
  try {
    const response = await api.get(`/api/recipes/show.php?id=${recipeId}`);
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in getRecipeInteractions:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Purchase recipe
export const purchaseRecipe = async (recipeId) => {
  try {
    const response = await api.post('/api/recipes/purchase.php', {
      recipe_id: recipeId
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in purchaseRecipe:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Get user's recipes
export const getUserRecipes = async (userId, params = {}) => {
  try {
    const response = await api.get('/api/recipes/index.php', {
      params: { ...params, user_id: userId }
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in getUserRecipes:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Search recipes
export const searchRecipes = async (query, filters = {}) => {
  try {
    const response = await api.get('/api/recipes/index.php', {
      params: { search: query, ...filters }
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in searchRecipes:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

// Get trending recipes
export const getTrendingRecipes = async (limit = 10) => {
  try {
    const response = await api.get('/api/recipes/index.php', {
      params: { limit, sort: 'popular' }
    });
    return response.data; // Changed: use response.data
  } catch (error) {
    console.error('Error in getTrendingRecipes:', error);
    throw error.response?.data || error; // Changed: better error handling
  }
};

export default {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  saveRecipe,
  getRecipeInteractions,
  purchaseRecipe,
  getUserRecipes,
  searchRecipes,
  getTrendingRecipes
};