// DataProviderWrapper.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { DataProvider as InnerDataProvider } from '../contexts/DataContext';

const DataProviderWrapper = ({ children }) => {

  const { isAuthenticated, user } = useAuth();
  
  return (
    <InnerDataProvider 
      isAuthenticated={isAuthenticated}
      currentUser={user}
    >
      {children}
    </InnerDataProvider>
  );
};

export default DataProviderWrapper;