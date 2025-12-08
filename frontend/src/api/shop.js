import api from '../utils/api';

/**
 * Shop API module for handling shop-related operations
 * Backend Endpoint: api/shop/items.php, api/shop/purchase.php
 */

/**
 * Get available shop items with optional filters
 * @param {Object} filters - Filter criteria (category, etc.)
 * @param {number} limit - Number of items per page
 * @param {number} offset - Pagination offset
 * @returns {Promise<Object>} Shop items data
 */
export const getShopItems = async (filters = {}, limit = 50, offset = 0) => {
    try {
        const params = new URLSearchParams();

        // Add filters to params
        if (filters.category) params.append('category', filters.category);
        params.append('limit', limit.toString());
        params.append('offset', offset.toString());

        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await api.get(`/shop/items${queryString}`);

        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Failed to fetch shop items');
    } catch (error) {
        console.error('Error fetching shop items:', error);
        throw error;
    }
};

/**
 * Purchase a shop item
 * @param {string} itemId - ID of the item to purchase
 * @returns {Promise<Object>} Purchase result
 */
export const purchaseItem = async (itemId) => {
    try {
        if (!itemId) {
            throw new Error('Item ID is required');
        }

        const response = await api.post('/shop/purchase', { item_id: itemId });

        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'Purchase failed');
    } catch (error) {
        console.error('Error purchasing item:', error);
        throw error;
    }
};

/**
 * Get user's purchased items
 * Note: This endpoint needs to be implemented in backend
 * For now, we'll use a placeholder or get from user stats
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User's purchases
 */
export const getUserPurchases = async (userId) => {
    try {
        // TODO: Implement backend endpoint for user purchases
        // For now, return empty array or fetch from local storage
        console.warn('getUserPurchases backend endpoint not yet implemented');

        // Check localStorage for cached purchases
        const cachedPurchases = localStorage.getItem(`user_purchases_${userId}`);
        if (cachedPurchases) {
            return JSON.parse(cachedPurchases);
        }

        return [];
    } catch (error) {
        console.error('Error fetching user purchases:', error);
        return [];
    }
};

/**
 * Get shop item categories
 * @returns {Promise<Array>} List of item categories
 */
export const getItemCategories = async () => {
    try {
        // This data is returned with shop items
        const shopData = await getShopItems({}, 1, 0);
        return shopData.categories || [];
    } catch (error) {
        console.error('Error fetching item categories:', error);
        // Return default categories as fallback
        return [
            { id: 'cosmetic', name: 'Cosmetics', icon: '🎨' },
            { id: 'tool', name: 'Tools', icon: '🔧' },
            { id: 'recipe', name: 'Recipes', icon: '📚' },
            { id: 'boost', name: 'Boosts', icon: '⚡' },
            { id: 'ingredient', name: 'Ingredients', icon: '🥕' }
        ];
    }
};

/**
 * Cache user purchase locally
 * @param {string} userId - User ID
 * @param {Object} purchase - Purchase data
 */
export const cacheUserPurchase = (userId, purchase) => {
    try {
        const cachedPurchases = localStorage.getItem(`user_purchases_${userId}`);
        let purchases = cachedPurchases ? JSON.parse(cachedPurchases) : [];

        // Add new purchase to cache
        purchases.push({
            ...purchase,
            cached_at: new Date().toISOString()
        });

        localStorage.setItem(`user_purchases_${userId}`, JSON.stringify(purchases));
    } catch (error) {
        console.error('Error caching purchase:', error);
    }
};

export default {
    getShopItems,
    purchaseItem,
    getUserPurchases,
    getItemCategories,
    cacheUserPurchase
};