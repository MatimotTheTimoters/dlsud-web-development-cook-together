import api from '../utils/api';

/**
 * Cookbooks API module for interacting with PHP backend
 */

/**
 * Get user's cookbooks
 * @param {string} userId - User ID
 * @param {boolean} includePublic - Include public cookbooks from other users
 * @param {number} limit - Number of cookbooks to return
 * @param {number} offset - Pagination offset
 * @returns {Promise} Promise with cookbooks data
 */
export const getCookbooks = async (userId, includePublic = false, limit = 50, offset = 0) => {
    try {
        const response = await api.get('/cookbooks/index.php', {
            params: {
                user_id: userId,
                include_public: includePublic,
                limit,
                offset
            }
        });
        return response;
    } catch (error) {
        console.error('Error fetching cookbooks:', error);
        throw error;
    }
};

/**
 * Create a new cookbook
 * @param {Object} cookbookData - Cookbook data
 * @param {string} cookbookData.name - Cookbook name (required)
 * @param {string} cookbookData.description - Cookbook description
 * @param {boolean} cookbookData.is_public - Whether cookbook is public
 * @returns {Promise} Promise with created cookbook data
 */
export const createCookbook = async (cookbookData) => {
    try {
        const response = await api.post('/cookbooks/create.php', cookbookData);
        return response;
    } catch (error) {
        console.error('Error creating cookbook:', error);
        throw error;
    }
};

/**
 * Get recipes in a specific cookbook
 * @param {string} cookbookId - Cookbook ID
 * @param {number} limit - Number of recipes to return
 * @param {number} offset - Pagination offset
 * @returns {Promise} Promise with cookbook recipes data
 */
export const getCookbookRecipes = async (cookbookId, limit = 50, offset = 0) => {
    try {
        const response = await api.get(`/cookbooks/show.php?id=${cookbookId}`, {
            params: { limit, offset }
        });
        return response;
    } catch (error) {
        console.error('Error fetching cookbook recipes:', error);
        throw error;
    }
};

/**
 * Add recipe to cookbook
 * @param {string} cookbookId - Cookbook ID
 * @param {string} recipeId - Recipe ID to add
 * @returns {Promise} Promise with add operation result
 */
export const addRecipeToCookbook = async (cookbookId, recipeId) => {
    try {
        const response = await api.post(`/cookbooks/add-recipe.php`, {
            cookbook_id: cookbookId,
            recipe_id: recipeId
        });
        return response;
    } catch (error) {
        console.error('Error adding recipe to cookbook:', error);
        throw error;
    }
};

/**
 * Remove recipe from cookbook
 * @param {string} cookbookId - Cookbook ID
 * @param {string} recipeId - Recipe ID to remove
 * @returns {Promise} Promise with remove operation result
 */
export const removeRecipeFromCookbook = async (cookbookId, recipeId) => {
    try {
        const response = await api.delete(`/cookbooks/remove-recipe.php`, {
            params: {
                cookbook_id: cookbookId,
                recipe_id: recipeId
            }
        });
        return response;
    } catch (error) {
        console.error('Error removing recipe from cookbook:', error);
        throw error;
    }
};

/**
 * Get cookbook details (alias for getCookbookRecipes without recipes)
 * @param {string} cookbookId - Cookbook ID
 * @returns {Promise} Promise with cookbook details
 */
export const getCookbook = async (cookbookId) => {
    try {
        const response = await getCookbookRecipes(cookbookId, 1, 0);
        return {
            ...response,
            recipes: response.recipes || []
        };
    } catch (error) {
        console.error('Error fetching cookbook:', error);
        throw error;
    }
};

export default {
    getCookbooks,
    createCookbook,
    getCookbookRecipes,
    getCookbook,
    addRecipeToCookbook,
    removeRecipeFromCookbook
};