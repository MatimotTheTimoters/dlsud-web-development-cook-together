// frontend/src/App.jsx

// Required imports per frontend_files.md
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import './styles/index.css';

// Import page components as specified in frontend_files.md
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import ProfilePage from './pages/ProfilePage';
import CookingSessionPage from './pages/CookingSessionPage';
import ShopPage from './pages/ShopPage';
import DiscoverPage from './pages/DiscoverPage';
import CookbooksPage from './pages/CookbooksPage';
import SessionHistoryPage from './pages/SessionHistoryPage';

// Import common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Import gamification icons as specified in layouts.md
import { FaGamepad, FaCookieBite } from 'react-icons/fa';

/**
 * Main App Component
 * Sets up routing, providers, and application layout
 */
function App() {
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialize app state on mount
  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        // App initialization logic
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  // Handle route changes
  const handleRouteChange = () => {
    // Route change handling logic
  };

  if (!isInitialized) {
    return (
      <div className="app-loading">
        <LoadingSpinner type="default" size="large" />
        <h2>Loading CookTogether...</h2>
        <div className="loading-icons">
          <FaGamepad className="gamepad-icon" />
          <FaCookieBite className="cookie-icon" />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <BrowserRouter>
              <div className="app-container">
                <Header />
                <main className="main-content">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                    <Route path="/discover" element={<DiscoverPage />} />

                    {/* Protected routes */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/create-recipe" element={
                      <ProtectedRoute>
                        <CreateRecipePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/cooking/:sessionId" element={
                      <ProtectedRoute>
                        <CookingSessionPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/shop" element={
                      <ProtectedRoute>
                        <ShopPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/cookbooks" element={
                      <ProtectedRoute>
                        <CookbooksPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                      <ProtectedRoute>
                        <SessionHistoryPage />
                      </ProtectedRoute>
                    } />

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;