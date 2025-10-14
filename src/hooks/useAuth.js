import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import apiSheets from '../constants/api.js';
import { calculateAllUserLimits } from '../utils/userCalculations.js';

const STORAGE_KEY = 'ct_user';
const USER_LIMITS_KEY = 'ct_user_limits';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRewardLimits, setUserRewardLimits] = useState({
    maxExp: 100,
    maxGold: 50,
    maxGem: 5,
    maxGoldPrice: 100,
    maxGemPrice: 10,
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateUserLimits = useCallback((userData) => {
    if (!userData) {
      return {
        maxExp: 100,
        maxGold: 50,
        maxGem: 5,
        maxGoldPrice: 100,
        maxGemPrice: 10,
      };
    }
    return calculateAllUserLimits(userData);
  }, []);

  const fetchUserLimits = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      const userRes = await fetch(`${apiSheets.users}&id=${userId}`);
      const userData = await userRes.json();

      if (userData.length > 0) {
        const userStats = userData[0];
        const newLimits = calculateUserLimits(userStats);
        
        setUserRewardLimits(newLimits);
        localStorage.setItem(USER_LIMITS_KEY, JSON.stringify(newLimits));
        return newLimits;
      }
    } catch (error) {
      console.warn('Failed to fetch user limits:', error);
      const cached = localStorage.getItem(USER_LIMITS_KEY);
      if (cached) {
        setUserRewardLimits(JSON.parse(cached));
      }
    }
  }, [calculateUserLimits]);

  // Refresh user limits
  const refreshUserLimits = useCallback(async () => {
    if (user?.id) {
      return await fetchUserLimits(user.id);
    }
  }, [user?.id, fetchUserLimits]);

  // Update user limits in database
  const updateUserLimitsInDB = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const userRes = await fetch(`${apiSheets.users}&id=${user.id}`);
      const userData = await userRes.json();

      if (userData.length > 0) {
        const userStats = userData[0];
        const allLimits = calculateAllUserLimits(userStats);
        
        // Update in database
        await fetch(apiSheets.users, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              id: user.id,
              maxExpReward: allLimits.maxExp,
              maxGoldReward: allLimits.maxGold,
              maxGemReward: allLimits.maxGem,
              maxGoldPrice: allLimits.maxGoldPrice,
              maxGemPrice: allLimits.maxGemPrice,
              creatorTier: allLimits.creatorTier,
              lastLimitUpdate: new Date().toISOString()
            }
          })
        });
        
        // Update local state
        setUserRewardLimits(allLimits);
        localStorage.setItem(USER_LIMITS_KEY, JSON.stringify(allLimits));
        
        return allLimits;
      }
    } catch (error) {
      console.error('Failed to update user limits in DB:', error);
    }
  }, [user?.id]);

  // Initialize auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const cachedLimits = localStorage.getItem(USER_LIMITS_KEY);
        
        if (cachedLimits) {
          setUserRewardLimits(JSON.parse(cachedLimits));
        }

        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) {
            setUser(parsed);
            await fetchUserLimits(parsed.id);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_LIMITS_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchUserLimits]);

  // Persist user to localStorage
  useEffect(() => {
    try {
      if (user && user.id) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_LIMITS_KEY);
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }, [user]);

  const login = async (userObj) => {
    if (userObj && userObj.id) {
      setUser(userObj);
      await fetchUserLimits(userObj.id);
    } else {
      console.error('Invalid user object provided to login');
    }
  };

  const logout = () => {
    setUser(null);
    setUserRewardLimits({
      maxExp: 100,
      maxGold: 50,
      maxGem: 5,
      maxGoldPrice: 100,
      maxGemPrice: 10,
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_LIMITS_KEY);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRewardLimits,
      login, 
      logout, 
      refreshUserLimits,
      updateUserLimitsInDB,
      isAuthenticated: !!(user && user.id),
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}