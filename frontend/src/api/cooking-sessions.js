// frontend/src/api/cooking-sessions.js
// Required Imports: api from '../utils/api'

import api from '../utils/api';

/**
 * Creates a new cooking session
 * @param {Object} sessionData - Session data including recipe_id, mode, visibility, etc.
 * @returns {Promise} Promise with created session data
 */
export const createSession = async (sessionData) => {
    try {
        const response = await api.post('/api/cooking-sessions/create.php', sessionData);
        return response.data;
    } catch (error) {
        console.error('Error creating cooking session:', error);
        throw error;
    }
};

/**
 * Gets detailed information about a specific cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} Promise with session data
 */
export const getSession = async (sessionId) => {
    try {
        const response = await api.get(`/api/cooking-sessions/show.php?id=${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting cooking session:', error);
        throw error;
    }
};

/**
 * Lists cooking sessions with optional filters
 * @param {Object} params - Filter parameters (status, visibility, mode, recipe_id, host_id, limit, offset)
 * @returns {Promise} Promise with list of sessions
 */
export const getSessions = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key]);
            }
        });
        
        const url = `/api/cooking-sessions/index.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error listing cooking sessions:', error);
        throw error;
    }
};

/**
 * Updates an existing cooking session
 * @param {string} sessionId - Session ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Promise with updated session data
 */
export const updateSession = async (sessionId, updates) => {
    try {
        const response = await api.put('/api/cooking-sessions/update.php', {
            session_id: sessionId,
            updates
        });
        return response.data;
    } catch (error) {
        console.error('Error updating cooking session:', error);
        throw error;
    }
};

/**
 * Joins a cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} Promise with updated session data
 */
export const joinSession = async (sessionId) => {
    try {
        const response = await api.post('/api/cooking-sessions/join.php', {
            session_id: sessionId
        });
        return response.data;
    } catch (error) {
        console.error('Error joining cooking session:', error);
        throw error;
    }
};

/**
 * Leaves a cooking session
 * @param {string} sessionId - Session ID
 * @returns {Promise} Promise with success message
 */
export const leaveSession = async (sessionId) => {
    try {
        const response = await api.post('/api/cooking-sessions/leave.php', {
            session_id: sessionId
        });
        return response.data;
    } catch (error) {
        console.error('Error leaving cooking session:', error);
        throw error;
    }
};

/**
 * Completes a cooking step
 * @param {string} sessionId - Session ID
 * @param {string} stepId - Step ID
 * @param {Object} completionData - Additional completion data
 * @returns {Promise} Promise with updated session and rewards
 */
export const completeStep = async (sessionId, stepId, completionData = {}) => {
    try {
        const response = await api.post('/api/cooking-sessions/complete-step.php', {
            session_id: sessionId,
            step_id: stepId,
            completion_data: completionData
        });
        return response.data;
    } catch (error) {
        console.error('Error completing cooking step:', error);
        throw error;
    }
};

/**
 * Votes in a cooking session (skip step, skip timer, etc.)
 * @param {string} sessionId - Session ID
 * @param {string} voteType - Type of vote ('skip_read_timer', 'skip_step', 'other')
 * @param {boolean} voteValue - Vote value (true/false)
 * @returns {Promise} Promise with vote results
 */
export const voteSkip = async (sessionId, voteType, voteValue) => {
    try {
        const response = await api.post('/api/cooking-sessions/vote.php', {
            session_id: sessionId,
            vote_type: voteType,
            vote_value: voteValue
        });
        return response.data;
    } catch (error) {
        console.error('Error voting in cooking session:', error);
        throw error;
    }
};

/**
 * Gets user's cooking session history
 * @param {Object} params - Parameters (limit, offset, status, etc.)
 * @returns {Promise} Promise with session history
 */
export const getSessionHistory = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key]);
            }
        });
        
        const url = `/api/sessions/history.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error getting session history:', error);
        throw error;
    }
};

/**
 * Gets cooking session statistics for a user
 * @param {string} userId - User ID (optional, defaults to current user)
 * @returns {Promise} Promise with session statistics
 */
export const getSessionStatistics = async (userId = null) => {
    try {
        const url = userId 
            ? `/api/sessions/history.php?stats=true&user_id=${userId}`
            : '/api/sessions/history.php?stats=true';
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error getting session statistics:', error);
        throw error;
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