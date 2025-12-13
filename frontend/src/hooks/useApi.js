import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * Custom hook for making API calls with loading and error states
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} body - Request body for POST/PUT
 * @returns {Object} Hook state and methods
 */
export const useApi = (endpoint, method = 'GET', body = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetches data from API
     */
    const fetchData = useCallback(async () => {
        if (method !== 'GET') {
            console.error('useApi fetchData can only be used with GET method');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.get(endpoint);
            setData(response);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
            console.error('API fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, method]);

    /**
     * Posts data to API
     * @param {Object} postData - Data to post
     */
    const postData = useCallback(async (postData) => {
        if (method !== 'POST') {
            console.error('useApi postData can only be used with POST method');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.post(endpoint, postData || body);
            setData(response);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to post data');
            console.error('API post error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [endpoint, method, body]);

    /**
     * Updates data via API
     * @param {Object} updateData - Data to update
     */
    const putData = useCallback(async (updateData) => {
        if (method !== 'PUT') {
            console.error('useApi putData can only be used with PUT method');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.put(endpoint, updateData || body);
            setData(response);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to update data');
            console.error('API put error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [endpoint, method, body]);

    /**
     * Deletes data via API
     */
    const deleteData = useCallback(async () => {
        if (method !== 'DELETE') {
            console.error('useApi deleteData can only be used with DELETE method');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.delete(endpoint);
            setData(response);
            return response;
        } catch (err) {
            setError(err.message || 'Failed to delete data');
            console.error('API delete error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [endpoint, method]);

    // Automatically fetch data for GET requests on mount
    useEffect(() => {
        if (method === 'GET' && endpoint) {
            fetchData();
        }
    }, [fetchData, method, endpoint]);

    return {
        data,
        loading,
        error,
        fetchData,
        postData,
        putData,
        deleteData
    };
};

export default useApi;