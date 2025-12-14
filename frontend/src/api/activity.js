import api from '../utils/api';

/**
 * Activity API functions for activity feed operations
 */

/**
 * Gets activity feed
 * @param {number} limit - Number of activities to return
 * @param {number} offset - Pagination offset
 * @returns {Promise} Promise with activity feed data
 */
export const getActivityFeed = async (limit = 20, offset = 0) => {
    try {
        const response = await api.get('/activity/feed.php', {
            params: { limit, offset }
        });
        return response.data; // axios returns data in response.data
    } catch (error) {
        console.error('Error fetching activity feed:', error);
        throw error.response?.data || error;
    }
};

/**
 * Gets specific user activities
 * @param {string} userId - User ID
 * @returns {Promise} Promise with user activity data
 */
export const getUserActivities = async (userId) => {
    try {
        const response = await api.get('/activity/feed.php', {
            params: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user activities:', error);
        throw error.response?.data || error;
    }
};

export default {
    getActivityFeed,
    getUserActivities
};