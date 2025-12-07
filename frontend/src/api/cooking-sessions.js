import api from '../utils/api';

/**
 * Cooking Sessions API Module
 * Handles all cooking session related API calls
 */

/**
 * Create a new cooking session
 * @param {Object} sessionData - Session data including recipe_id, mode, visibility
 * @returns {Promise} API response
 */
export const createSession = async (sessionData) => {
    try {
        const response = await api.post('cooking-sessions/create.php', sessionData);
        return response;
    } catch (error) {
        console.error('Error creating cooking session:', error);
        throw error;
    }
};

/**
 * Get cooking session details
 * @param {string} sessionId - Session ID
 * @returns {Promise} API response with session details
 */
export const getSession = async (sessionId) => {
    try {
        const response = await api.get(`cooking-sessions/show.php?id=${sessionId}`);
        return response;
    } catch (error) {
        console.error('Error getting cooking session:', error);
        throw error;
    }
};

/**
 * Join an existing cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} API response
 */
export const joinSession = async (sessionId) => {
    try {
        const response = await api.post(`cooking-sessions/join.php`, { session_id: sessionId });
        return response;
    } catch (error) {
        console.error('Error joining cooking session:', error);
        throw error;
    }
};

/**
 * Leave a cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} API response
 */
export const leaveSession = async (sessionId) => {
    try {
        // Note: backend_files.md doesn't have a leave endpoint, we'll use update or custom logic
        const response = await api.put(`cooking-sessions/update.php`, {
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
 * Complete a cooking step in a session
 * @param {string} sessionId - Session ID
 * @param {string} stepId - Step ID to complete
 * @param {Object} stepData - Additional step data (duration, notes, etc.)
 * @returns {Promise} API response with rewards earned
 */
export const completeStep = async (sessionId, stepId, stepData = {}) => {
    try {
        const response = await api.post(`cooking-sessions/complete-step.php`, {
            session_id: sessionId,
            step_id: stepId,
            ...stepData
        });
        return response;
    } catch (error) {
        console.error('Error completing cooking step:', error);
        throw error;
    }
};

/**
 * Update cooking session details
 * @param {string} sessionId - Session ID
 * @param {Object} updates - Session updates (status, current_step, etc.)
 * @returns {Promise} API response
 */
export const updateSession = async (sessionId, updates) => {
    try {
        const response = await api.put(`cooking-sessions/update.php`, {
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
 * Vote to skip a timer or step in cooking session
 * @param {string} sessionId - Session ID
 * @param {string} voteType - Type of vote ('skip_read_timer', 'skip_step', 'other')
 * @param {boolean} voteValue - Vote value (true/false)
 * @returns {Promise} API response
 */
export const voteSkip = async (sessionId, voteType, voteValue = true) => {
    try {
        const response = await api.post(`cooking-sessions/vote.php`, {
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
 * Get list of cooking sessions (with optional filters)
 * @param {Object} params - Filter parameters (status, mode, visibility, etc.)
 * @returns {Promise} API response with sessions list
 */
export const getSessions = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await api.get(`cooking-sessions/index.php${queryParams ? `?${queryParams}` : ''}`);
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