import api from '../utils/api';

/**
 * Inventory API functions for inventory operations
 */

/**
 * Gets user's inventory items
 * @param {string} category - Optional category filter
 * @returns {Promise} Promise with inventory data
 */
export const getUserInventory = async (category = null) => {
    try {
        const params = category ? { category } : {};
        const response = await api.get('/api/inventory/list.php', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error.response?.data || error;
    }
};

/**
 * Uses a consumable item from inventory
 * @param {string} inventoryId - Inventory item ID
 * @returns {Promise} Promise with use result and effect data
 */
export const useConsumable = async (inventoryId) => {
    try {
        const response = await api.post('/api/inventory/use.php', {
            inventory_id: inventoryId
        });
        return response.data;
    } catch (error) {
        console.error('Error using consumable:', error);
        throw error.response?.data || error;
    }
};

/**
 * Gets inventory item categories
 * @returns {Promise} Promise with category data
 */
export const getItemCategories = async () => {
    try {
        const response = await api.get('/api/inventory/list.php', {
            params: { categories: true }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching item categories:', error);
        throw error.response?.data || error;
    }
};

/**
 * Gets equipped items
 * @returns {Promise} Promise with equipped items data
 */
export const getEquippedItems = async () => {
    try {
        const response = await api.get('/api/inventory/list.php', {
            params: { equipped: true }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching equipped items:', error);
        throw error.response?.data || error;
    }
};

export default {
    getUserInventory,
    useConsumable,
    getItemCategories,
    getEquippedItems
};