import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import apiSheets from '../constants/api.js';
import { calculateAllUserLimits } from '../utils/userCalculations.js';

const STORAGE_KEY = 'ct_user';
const USER_LIMITS_KEY = 'ct_user_limits';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { currentUserData, refetchUsers } = useData(); // GET DATA FROM DATACONTEXT
  
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

  // Sync limits when DataContext user data changes
  useEffect(() => {
    if (currentUserData && user?.id === currentUserData.id) {
      const newLimits = calculateUserLimits(currentUserData);
      setUserRewardLimits(newLimits);
      localStorage.setItem(USER_LIMITS_KEY, JSON.stringify(newLimits));
    }
  }, [currentUserData, user?.id, calculateUserLimits]);

  // Refresh user limits by refetching DataContext
  const refreshUserLimits = useCallback(async () => {
    if (user?.id) {
      await refetchUsers();
    }
  }, [user?.id, refetchUsers]);

  // Update user limits in database after user actions
  const updateUserLimitsInDB = useCallback(async () => {
    if (!user?.id || !currentUserData) return;
    
    try {
      const allLimits = calculateAllUserLimits(currentUserData);
      
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
      
      // Trigger DataContext refresh to get updated data
      await refetchUsers();
      
      return allLimits;
    } catch (error) {
      console.error('Failed to update user limits in DB:', error);
    }
  }, [user?.id, currentUserData, refetchUsers]);

  // Initialize auth from localStorage
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
  }, []);

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