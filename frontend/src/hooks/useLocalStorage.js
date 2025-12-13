import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with React state synchronization
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value
 * @returns {Array} [storedValue, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
    // State to store our value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage key:', key, error);
            return initialValue;
        }
    });

    /**
     * Sets value in localStorage and state
     * @param {*} value - Value to store
     */
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error setting localStorage key:', key, error);
        }
    };

    /**
     * Removes value from localStorage and state
     */
    const removeValue = () => {
        try {
            // Remove from state
            setStoredValue(initialValue);

            // Remove from local storage
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing localStorage key:', key, error);
        }
    };

    // Listen for storage events (changes from other tabs/windows)
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === key && event.storageArea === window.localStorage) {
                try {
                    setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
                } catch (error) {
                    console.error('Error handling storage change:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

export default useLocalStorage;