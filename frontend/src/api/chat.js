import api from '../utils/api';

/**
 * Chat API functions for chat operations
 */

/**
 * Sends chat message
 * @param {string} sessionId - Session ID
 * @param {string} message - Chat message content
 * @returns {Promise} Promise with send result
 */
export const sendChatMessage = async (sessionId, message) => {
    try {
        const response = await api.post('/api/chat/messages.php', {
            cooking_session_id: sessionId,
            message: message
        });
        return response.data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error.response?.data || error;
    }
};

/**
 * Gets chat history
 * @param {string} sessionId - Session ID
 * @param {number} limit - Number of messages to return
 * @returns {Promise} Promise with chat messages
 */
export const getChatMessages = async (sessionId, limit = 100) => {
    try {
        const response = await api.get('/api/chat/messages.php', {
            params: {
                cooking_session_id: sessionId,
                limit: limit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw error.response?.data || error;
    }
};

/**
 * Marks messages as read
 * @param {string} sessionId - Session ID
 * @returns {Promise} Promise with update result
 */
export const markMessagesAsRead = async (sessionId) => {
    try {
        const response = await api.put('/api/chat/messages.php', {
            cooking_session_id: sessionId,
            action: 'mark_read'
        });
        return response.data;
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error.response?.data || error;
    }
};

export default {
    sendChatMessage,
    getChatMessages,
    markMessagesAsRead
};