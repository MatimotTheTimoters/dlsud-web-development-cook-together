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
        return response;
    } catch (error) {
        console.error('Error creating cooking session:', error);
        throw error;
    }
};

/**
 * Gets session details
 * @param {string} sessionId - Session ID
 * @returns {Promise} API response with session details
 */
export const getSession = async (sessionId) => {
    try {
        const response = await api.get(`/cooking-sessions/show.php?id=${sessionId}`);
        return response;
    } catch (error) {
        console.error('Error getting cooking session:', error);
        throw error;
    }
};

/**
 * Joins cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} API response
 */
export const joinSession = async (sessionId) => {
    try {
        const response = await api.post('/cooking-sessions/join.php', { session_id: sessionId });
        return response;
    } catch (error) {
        console.error('Error joining cooking session:', error);
        throw error;
    }
};

/**
 * Leaves cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} API response
 */
export const leaveSession = async (sessionId) => {
    try {
        const response = await api.post('/cooking-sessions/join.php', {
            session_id: sessionId,
            action: 'leave'
        });
        return response;
    } catch (error) {
        console.error('Error leaving cooking session:', error);
        throw error;
    }
};

/**
 * Completes cooking step in session
 * @param {string} sessionId - Session ID
 * @param {string} stepId - Step ID to complete
 * @returns {Promise} API response with rewards earned
 */
export const completeStep = async (sessionId, stepId) => {
    try {
        const response = await api.post('/cooking-sessions/complete-step.php', {
            session_id: sessionId,
            step_id: stepId
        });
        return response;
    } catch (error) {
        console.error('Error completing cooking step:', error);
        throw error;
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
        return response;
    } catch (error) {
        console.error('Error updating cooking session:', error);
        throw error;
    }
};

/**
 * Votes to skip timer or step
 * @param {string} sessionId - Session ID
 * @param {string} voteType - Type of vote
 * @param {boolean} voteValue - Vote value
 * @returns {Promise} API response
 */
export const voteSkip = async (sessionId, voteType, voteValue = true) => {
    try {
        const response = await api.post('/cooking-sessions/vote.php', {
            session_id: sessionId,
            vote_type: voteType,
            vote_value: voteValue
        });
        return response;
    } catch (error) {
        console.error('Error voting to skip:', error);
        throw error;
    }
};

/**
 * Gets list of cooking sessions
 * @returns {Promise} API response with sessions list
 */
export const getSessions = async () => {
    try {
        const response = await api.get('/cooking-sessions/index.php');
        return response;
    } catch (error) {
        console.error('Error getting cooking sessions list:', error);
        throw error;
    }
};

export default {
    createSession,
    getSession,
    joinSession,
    leaveSession,
    completeStep,
    updateSession,
    voteSkip,
    getSessions
};