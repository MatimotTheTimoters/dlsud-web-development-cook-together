import api from '../utils/api';

/**
 * Relationships API module
 * Handles user relationships (follow, friends, etc.)
 */

/**
 * Follow a user
 * @param {string} targetUserId - ID of user to follow
 * @param {string} message - Optional message
 * @returns {Promise<Object>} - Response data
 */
export const followUser = async (targetUserId, message = null) => {
    try {
        const response = await api.post('/api/relationships/follow.php', {
            target_user_id: targetUserId,
            action: 'follow',
            message: message
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Follow user error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Unfollow a user
 * @param {string} targetUserId - ID of user to unfollow
 * @returns {Promise<Object>} - Response data
 */
export const unfollowUser = async (targetUserId) => {
    try {
        const response = await api.post('/api/relationships/follow.php', {
            target_user_id: targetUserId,
            action: 'unfollow'
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Unfollow user error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Send friend request
 * @param {string} targetUserId - ID of user to send request to
 * @param {string} message - Optional message
 * @returns {Promise<Object>} - Response data
 */
export const sendFriendRequest = async (targetUserId, message = null) => {
    try {
        const response = await api.post('/api/relationships/friends.php', {
            action: 'send_request',
            target_user_id: targetUserId,
            message: message
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Send friend request error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Get friend requests
 * @param {string} type - 'received' or 'sent'
 * @param {number} limit - Number of requests to get
 * @param {number} offset - Pagination offset
 * @returns {Promise<Object>} - Response data
 */
export const getFriendRequests = async (type = 'received', limit = 50, offset = 0) => {
    try {
        const response = await api.get('/api/relationships/list.php', {
            params: {
                type: type === 'received' ? 'requests_received' : 'requests_sent',
                limit: limit,
                offset: offset
            }
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Get friend requests error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Accept friend request
 * @param {string} requestId - ID of the friend request
 * @returns {Promise<Object>} - Response data
 */
export const acceptFriendRequest = async (requestId) => {
    try {
        const response = await api.post('/api/relationships/friends.php', {
            action: 'respond_request',
            request_id: requestId,
            response: 'accept'
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Accept friend request error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Reject friend request
 * @param {string} requestId - ID of the friend request
 * @returns {Promise<Object>} - Response data
 */
export const rejectFriendRequest = async (requestId) => {
    try {
        const response = await api.post('/api/relationships/friends.php', {
            action: 'respond_request',
            request_id: requestId,
            response: 'reject'
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Reject friend request error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Remove friend
 * @param {string} friendId - ID of friend to remove
 * @returns {Promise<Object>} - Response data
 */
export const removeFriend = async (friendId) => {
    try {
        const response = await api.post('/api/relationships/friends.php', {
            action: 'remove_friend',
            friend_id: friendId
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Remove friend error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Get followers
 * @param {string} userId - User ID
 * @param {number} limit - Number of followers to get
 * @param {number} offset - Pagination offset
 * @returns {Promise<Object>} - Response data
 */
export const getFollowers = async (userId, limit = 50, offset = 0) => {
    try {
        const response = await api.get('/api/relationships/list.php', {
            params: {
                type: 'followers',
                limit: limit,
                offset: offset
            }
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Get followers error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Get following
 * @param {string} userId - User ID
 * @param {number} limit - Number of users to get
 * @param {number} offset - Pagination offset
 * @returns {Promise<Object>} - Response data
 */
export const getFollowing = async (userId, limit = 50, offset = 0) => {
    try {
        const response = await api.get('/api/relationships/list.php', {
            params: {
                type: 'following',
                limit: limit,
                offset: offset
            }
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Get following error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Get friends
 * @param {string} userId - User ID
 * @param {number} limit - Number of friends to get
 * @param {number} offset - Pagination offset
 * @returns {Promise<Object>} - Response data
 */
export const getFriends = async (userId, limit = 50, offset = 0) => {
    try {
        const response = await api.get('/api/relationships/list.php', {
            params: {
                type: 'friends',
                limit: limit,
                offset: offset
            }
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Get friends error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Check if following a user
 * Note: This would need a separate endpoint or we can use the list endpoint
 * For now, we'll get all following and check
 */
export const isFollowing = async (targetUserId) => {
    try {
        // Get following list and check if target is in it
        const response = await getFollowing();
        const followingList = response.following || [];
        return followingList.some(user => user.id === targetUserId);
    } catch (error) {
        console.error('Check following error:', error);
        return false;
    }
};

/**
 * Get all relationships for current user
 * @param {number} limit - Number of items per type
 * @returns {Promise<Object>} - All relationship data
 */
export const getAllRelationships = async (limit = 10) => {
    try {
        const response = await api.get('/api/relationships/list.php', {
            params: {
                type: 'all',
                limit: limit
            }
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Get all relationships error:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};