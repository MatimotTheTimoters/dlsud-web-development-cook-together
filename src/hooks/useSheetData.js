// src/hooks/useSheetData.js - OPTIMIZED VERSION
import { useState, useEffect, useRef } from 'react';

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
      // Your existing fetch logic
      const response = await fetch(url);
      const result = await response.json();
      
      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sheetName, JSON.stringify(queryParams), enabled]);

  return { data, loading, error, refetch: fetchData };
};