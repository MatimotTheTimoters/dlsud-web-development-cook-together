// src/hooks/useSheetData.js
import { useState, useEffect } from 'react';
import apiLinks from '../constants/api.js';

/**
 * Custom hook for fetching data from SheetDB API
 * @param {string} sheetName - The sheet to fetch from (e.g., 'users', 'recipes')
 * @param {Object} queryParams - Query parameters for filtering
 * @param {boolean} enabled - Whether to enable the fetch
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useSheetData = (sheetName, queryParams = {}, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQueryString = (params) => {
    if (!params || Object.keys(params).length === 0) return '';
    
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    return `?${queryString}`;
  };

  const fetchData = async () => {
    if (!enabled || !apiLinks[sheetName]) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryString = buildQueryString(queryParams);
      const url = `${apiLinks[sheetName]}${queryString}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching from ${sheetName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sheetName, JSON.stringify(queryParams), enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

/**
 * Specialized hook for fetching single user data
 * @param {string} userId - The user ID to fetch
 * @param {boolean} enabled - Whether to enable the fetch
 * @returns {Object} - { userData, loading, error, refetch }
 */
export const useUserData = (userId, enabled = true) => {
  const { data, loading, error, refetch } = useSheetData(
    'users', 
    { id: userId }, 
    enabled && !!userId
  );

  return {
    userData: data && data.length > 0 ? data[0] : null,
    loading,
    error,
    refetch
  };
};

/**
 * Specialized hook for fetching user reward limits
 * @param {string} userId - The user ID to fetch
 * @returns {Object} - { rewardLimits, loading, error, refetch }
 */
export const useRewardLimits = (userId) => {
  const { userData, loading, error, refetch } = useUserData(userId);

  const rewardLimits = {
    maxExpReward: userData?.maxExpReward || 100,
    maxGoldReward: userData?.maxGoldReward || 50,
    maxGemReward: userData?.maxGemReward || 10,
  };

  return {
    rewardLimits,
    loading,
    error,
    refetch
  };
};