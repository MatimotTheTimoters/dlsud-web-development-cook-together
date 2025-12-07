import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DataProvider } from './contexts/DataContext';
import { AuthContext } from './contexts/AuthContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContext>
    <DataProvider>
      <App />
    </DataProvider>
    </AuthContext>
  </React.StrictMode>
);
