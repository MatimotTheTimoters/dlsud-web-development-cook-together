import React, { createContext, useState, useContext } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

/**
 * Context for managing application notifications
 */

// Create Notification Context
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    /**
     * Shows notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        const newNotification = {
            id,
            message,
            type,
            timestamp: new Date()
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto-remove after 5 seconds for success/info, 10 seconds for errors/warnings
        const timeout = type === 'error' || type === 'warning' ? 10000 : 5000;
        setTimeout(() => {
            hideNotification(id);
        }, timeout);
    };

    /**
     * Hides specific notification
     * @param {number} id - Notification ID
     */
    const hideNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    /**
     * Clears all notifications
     */
    const clearNotifications = () => {
        setNotifications([]);
    };

    const contextValue = {
        notifications,
        showNotification,
        hideNotification,
        clearNotifications
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    );
};

// Export a hook for easy access to context
export const useNotification = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }

    return context;
};

export default NotificationContext;