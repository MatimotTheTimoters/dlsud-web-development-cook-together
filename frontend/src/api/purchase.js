import api from '../utils/api';

/**
 * Purchase API functions for purchase operations
 */

/**
 * Purchases a recipe
 * @param {string} recipeId - Recipe ID to purchase
 * @param {string} currencyType - Currency type ('gold' or 'gem')
 * @returns {Promise} Promise with purchase result
 */
export const purchaseRecipe = async (recipeId, currencyType) => {
    try {
        const response = await api.post('/api/recipes/purchase.php', {
            recipe_id: recipeId,
            currency_type: currencyType
        });
        return response.data;
    } catch (error) {
        console.error('Error purchasing recipe:', error);
        throw error.response?.data || error;
    }
};

/**
 * Purchases a shop item
 * @param {string} itemId - Shop item ID
 * @param {string} currencyType - Currency type ('gold' or 'gem')
 * @returns {Promise} Promise with purchase result
 */
export const purchaseItem = async (itemId, currencyType) => {
    try {
        const response = await api.post('/api/shop/purchase.php', {
            item_id: itemId,
            currency_type: currencyType
        });
        return response.data;
    } catch (error) {
        console.error('Error purchasing item:', error);
        throw error.response?.data || error;
    }
};

/**
 * Gets user's purchase history
 * @param {Object} params - Query parameters (limit, offset, type)
 * @returns {Promise} Promise with purchase history
 */
export const getPurchaseHistory = async (params = {}) => {
    try {
        const response = await api.get('/api/purchase/item.php', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        throw error.response?.data || error;
    }
};

export default {
    purchaseRecipe,
    purchaseItem,
    getPurchaseHistory
};