import api from '../utils/api';

/**
 * Cooking Sessions API functions for cooking session operations
 */

/**
 * Creates cooking session
 * @param {Object} sessionData - Session data
 * @returns {Promise} API response
 */
export const createSession = async (sessionData) => {
    try {
        const response = await api.post('/cooking-sessions/create.php', sessionData);
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error creating cooking session:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Gets session details
 * @param {string} sessionId - Session ID
 * @returns {Promise} Promise with session data
 */
export const getSession = async (sessionId) => {
    try {
        const response = await api.get(`/cooking-sessions/show.php?id=${sessionId}`);
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error getting cooking session:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Join an existing cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} Promise with updated session data
 */
export const joinSession = async (sessionId) => {
    try {
        const response = await api.post('/cooking-sessions/join.php', { session_id: sessionId });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error joining cooking session:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Leave a cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} Promise with success message
 */
export const leaveSession = async (sessionId) => {
    try {
        const response = await api.post('/cooking-sessions/join.php', {
            session_id: sessionId,
            action: 'leave'
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error leaving cooking session:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Completes cooking step in session
 * @param {string} sessionId - Session ID
 * @param {string} stepId - Step ID to complete
 * @param {Object} stepData - Additional step data (duration, notes, etc.)
 * @returns {Promise} API response with rewards earned
 */
export const completeStep = async (sessionId, stepId) => {
    try {
        const response = await api.post('/cooking-sessions/complete-step.php', {
            session_id: sessionId,
            step_id: stepId
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error completing cooking step:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Votes to skip timer or step
 * @param {string} sessionId - Session ID
 * @param {string} voteType - Type of vote
 * @param {boolean} voteValue - Vote value
 * @returns {Promise} API response
 */
export const voteSkip = async (sessionId, voteType, voteValue) => {
    try {
        const response = await api.post('/cooking-sessions/vote.php', {
            session_id: sessionId,
            vote_type: voteType,
            vote_value: voteValue
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error voting in cooking session:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Gets user's cooking session history
 * @param {Object} params - Query parameters (user_id, limit, offset, etc.)
 * @returns {Promise} API response with session history
 */
export const getSessionHistory = async (params = {}) => {
    try {
        const response = await api.get('/sessions/history.php', { params });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error getting session history:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Gets cooking session statistics
 * @param {string} userId - User ID to get stats for
 * @returns {Promise} API response with session statistics
 */
export const getSessionStatistics = async (userId) => {
    try {
        const response = await api.get('/sessions/history.php', {
            params: { user_id: userId, stats: true }
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error getting session statistics:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Gets list of cooking sessions
 * @returns {Promise} API response with sessions list
 */
export const getSessions = async () => {
    try {
        const response = await api.get('/cooking-sessions/index.php');
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error getting sessions:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

/**
 * Updates cooking session
 * @param {string} sessionId - Session ID
 * @param {Object} updates - Session updates
 * @returns {Promise} API response
 */
export const updateSession = async (sessionId, updates) => {
    try {
        const response = await api.put('/cooking-sessions/update.php', {
            session_id: sessionId,
            ...updates
        });
        return response.data; // Changed: use response.data
    } catch (error) {
        console.error('Error updating cooking session:', error);
        throw error.response?.data || error; // Changed: better error handling
    }
};

export default {
    createSession,
    getSession,
    getSessions,
    updateSession,
    joinSession,
    leaveSession,
    completeStep,
    voteSkip,
    getSessionHistory,
    getSessionStatistics
};