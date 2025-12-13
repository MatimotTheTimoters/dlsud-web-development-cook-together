import api from '../utils/api';

/**
 * Cookbooks API functions for cookbook operations
 */

/**
 * Gets user's cookbooks
 * @returns {Promise} Promise with cookbooks data
 */
export const getCookbooks = async () => {
    try {
        const response = await api.get('/cookbooks/index.php');
        return response;
    } catch (error) {
        console.error('Error fetching cookbooks:', error);
        throw error;
    }
};

/**
 * Creates new cookbook
 * @param {Object} data - Cookbook data
 * @returns {Promise} Promise with created cookbook data
 */
export const createCookbook = async (data) => {
    try {
        const response = await api.post('/cookbooks/create.php', data);
        return response;
    } catch (error) {
        console.error('Error creating cookbook:', error);
        throw error;
    }
};

/**
 * Gets recipes in cookbook
 * @param {string} cookbookId - Cookbook ID
 * @returns {Promise} Promise with cookbook recipes data
 */
export const getCookbookRecipes = async (cookbookId) => {
    try {
        const response = await api.get(`/cookbooks/show.php?id=${cookbookId}`);
        return response;
    } catch (error) {
        console.error('Error fetching cookbook recipes:', error);
        throw error;
    }
};

/**
 * Adds recipe to cookbook
 * @param {string} cookbookId - Cookbook ID
 * @param {string} recipeId - Recipe ID to add
 * @returns {Promise} Promise with add operation result
 */
export const addRecipeToCookbook = async (cookbookId, recipeId) => {
    try {
        const response = await api.post('/cookbooks/add-recipe.php', {
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
 * Removes recipe from cookbook
 * @param {string} cookbookId - Cookbook ID
 * @param {string} recipeId - Recipe ID to remove
 * @returns {Promise} Promise with remove operation result
 */
export const removeRecipeFromCookbook = async (cookbookId, recipeId) => {
    try {
        const response = await api.delete('/cookbooks/remove-recipe.php', {
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

export default {
    getCookbooks,
    createCookbook,
    getCookbookRecipes,
    addRecipeToCookbook,
    removeRecipeFromCookbook
};