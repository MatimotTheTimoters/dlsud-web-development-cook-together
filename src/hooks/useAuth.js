// hooks/useAuth.js - UPDATED VERSION
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'ct_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Validate that the user object has required fields
        if (parsed && parsed.id) {
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY); // Clean up invalid data
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem(STORAGE_KEY); // Clean up corrupted data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      if (user && user.id) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }, [user]);

  const login = (userObj) => {
    if (userObj && userObj.id) {
      setUser(userObj);
    } else {
      console.error('Invalid user object provided to login');
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
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