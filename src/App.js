import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import FooterComponent from './components/FooterComponent';
import AsideComponent from './components/AsideComponent';

import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';

import FeedPage from './pages/FeedPage'; // Corrected from RecipesPage
import DiscoverPage from './pages/DiscoverPage'; // Corrected from Challenges
import MyKitchenPage from './pages/MyKitchenPage'; // Corrected from KitchensPage
import InventoryPage from './pages/InventoryPage'; // Corrected from Inventory

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        {/* Homepage routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipes" element={<FeedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* AsideComponent routes */}
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/challenges" element={<DiscoverPage />} />
        <Route path="/kitchens" element={<MyKitchenPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
      <FooterComponent />
    </Router>
  );
}

export default App;