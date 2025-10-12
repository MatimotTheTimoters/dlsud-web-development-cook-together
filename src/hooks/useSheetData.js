import { useState, useEffect, useRef } from 'react';
import apiSheets from '../constants/api.js'; //

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minute cache

export const useSheetData = (sheetName, queryParams = {}, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheKey = `${sheetName}-${JSON.stringify(queryParams)}`;

  const fetchData = async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sheetUrl = apiSheets[sheetName];
      if (!sheetUrl) {
        throw new Error(`Sheet "${sheetName}" not found in api configuration`);
      }

      let url = sheetUrl;
      const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
      
      if (queryString) {
        // Handle existing query params in sheetUrl (like ?sheet=name)
        url += sheetUrl.includes('?') ? `&${queryString}` : `?${queryString}`;
      }

      console.log(`📡 Fetching from: ${url}`); // Optional: for debugging

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${sheetName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sheetName, JSON.stringify(queryParams), enabled]);

  return { data, loading, error, refetch: fetchData };
};