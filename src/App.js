// Updated App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import FloatingActionMenu from './components/FloatingActionMenu';
import FooterComponent from './components/FooterComponent';
import AsideComponent from './components/AsideComponent';

import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import DiscoverPage from './pages/DiscoverPage';
import MyKitchenPage from './pages/MyKitchenPage';
import InventoryPage from './pages/InventoryPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavbarComponent />
        <AsideComponent />
        <main className="main-content">
          <Routes>
            {/* Homepage routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* AsideComponent routes */}
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/my-kitchen" element={<MyKitchenPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Routes>
        </main>
        <FloatingActionMenu />
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;