import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

// React entry point with gamified imports
// Set up React root and render main app component
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize application error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Performance monitoring for gamification features
if (process.env.NODE_ENV === 'development') {
  console.log('CookTogether app started in development mode');
}