import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CreateRecipePage from './pages/CreateRecipePage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SessionsPage from './pages/SessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';
import CookingSessionPage from './pages/CookingSessionPage';
import CookbookPage from './pages/CookbookPage';
import ShopPage from './pages/ShopPage';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <div className="App">
          <Navbar toggleSidebar={toggleSidebar} />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create-recipe" element={<CreateRecipePage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/cooking-session/:sessionId" element={<CookingSessionPage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/session/:id" element={<SessionDetailPage />} />
              <Route path="/cookbook" element={<CookbookPage />} />
              <Route path="/shop" element={<ShopPage />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>© 2024 CookTogether - Level up your cooking!</p>
          </footer>
        </div>
      </Router>
    </SnackbarProvider>
  );
}

export default App;