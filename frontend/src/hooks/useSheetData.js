import { useState, useEffect, useRef } from 'react';
import apiSheets from '../constants/api.js'; // Import API configuration containing sheet URLs

/**
 * Simple in-memory cache implementation using JavaScript Map
 * Stores data with timestamps for cache invalidation
 */
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute cache duration in milliseconds

/**
 * Custom React hook for fetching and caching data from Google Sheets via SheetDB.io
 * 
 * @param {string} sheetName - The name of the sheet to fetch data from (must exist in apiSheets config)
 * @param {Object} queryParams - Optional query parameters to filter or modify the data request
 * @param {boolean} enabled - Flag to control whether the hook should fetch data (useful for conditional fetching)
 * 
 * @returns {Object} Hook return object containing:
 *   - data: The fetched data or null if not yet loaded
 *   - loading: Boolean indicating if a fetch is in progress
 *   - error: Error message string if fetch failed, null otherwise
 *   - refetch: Function to manually trigger a data refetch
 * 
 * @example
 * // Basic usage - fetch all recipes
 * const { data, loading, error } = useSheetData('recipes');
 * 
 * @example
 * // With query parameters - fetch specific user's recipes
 * const { data, loading, error } = useSheetData('recipes', { author: 'john_doe' });
 * 
 * @example
 * // Conditional fetching - only fetch when user is logged in
 * const { data, loading, error } = useSheetData('users', {}, isLoggedIn);
 */
export const useSheetData = (sheetName, queryParams = {}, enabled = true) => {
  // State management for data, loading status, and errors
  const [data, setData] = useState(null);        // Holds the successfully fetched data
  const [loading, setLoading] = useState(false); // Tracks whether a fetch operation is in progress
  const [error, setError] = useState(null);      // Stores any error messages from failed requests

  // Generate a unique cache key based on sheet name and query parameters
  // This ensures different queries are cached separately
  const cacheKey = `${sheetName}-${JSON.stringify(queryParams)}`;

  /**
   * Fetches data from the specified sheet with optional caching
   * This function handles the entire data fetching lifecycle:
   * 1. Cache checking
   * 2. API request construction
   * 3. Error handling
   * 4. Cache population
   * 
   * @async
   * @returns {Promise<void>}
   */
  const fetchData = async () => {
    // Early return if hook is disabled (for conditional fetching)
    if (!enabled) return;

    // Check cache first - if valid cached data exists, use it and skip API call
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      return; // Exit early since we have valid cached data
    }

    // Begin loading sequence
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      // Get the sheet URL from API configuration
      const sheetUrl = apiSheets[sheetName];
      if (!sheetUrl) {
        throw new Error(`Sheet "${sheetName}" not found in api configuration`);
      }

      // Construct the full URL with query parameters
      let url = sheetUrl;
      const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
      
      // Append query string to URL, handling existing query parameters
      if (queryString) {
        // Check if the base URL already has query parameters
        url += sheetUrl.includes('?') ? `&${queryString}` : `?${queryString}`;
      }

      console.log(`Fetching from: ${url}`); // Debug logging - can be removed in production

      // Execute the API request
      const response = await fetch(url);
      
      // Check if the response was successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parse the JSON response
      const result = await response.json();
      
      // Cache the successful result with current timestamp
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      // Update state with the fetched data
      setData(result);
      
    } catch (err) {
      // Handle any errors that occurred during fetching
      setError(err.message);
      console.error(`Error fetching ${sheetName}:`, err);
    } finally {
      // Always execute - reset loading state regardless of success/failure
      setLoading(false);
    }
  };

  /**
   * useEffect hook to automatically fetch data when dependencies change
   * Dependencies:
   * - sheetName: Re-fetch when the sheet name changes
   * - JSON.stringify(queryParams): Re-fetch when query parameters change (deep comparison)
   * - enabled: Re-fetch when the enabled flag changes
   */
  useEffect(() => {
    fetchData();
  }, [sheetName, JSON.stringify(queryParams), enabled]);

  // Return the hook's public interface
  return { 
    data,      // The fetched data (null until first successful fetch)
    loading,   // Boolean indicating if data is currently being fetched
    error,     // Error message string (null if no error)
    refetch: fetchData // Function to manually trigger a refetch (bypasses cache)
  };
};