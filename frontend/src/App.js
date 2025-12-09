import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

// Import common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
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
  );
}

export default App;