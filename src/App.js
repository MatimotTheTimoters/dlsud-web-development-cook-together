// Updated App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import FloatingActionMenu from './components/FloatingActionMenu';
import FooterComponent from './components/FooterComponent';

import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import TestPages from './pages/TestPages';

import FeedPage from './pages/FeedPage';
import DiscoverPage from './pages/DiscoverPage';
import MyKitchenPage from './pages/MyKitchenPage';

import InventoryPage from './pages/InventoryPage';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

// App.js - Add bottom padding class
function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Navbar routes */}
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* AsideComponent routes */}
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/my-kitchen" element={<MyKitchenPage />} />
        <Route path="/TestPages" element={<TestPages />} />
      </Routes>
      <FloatingActionMenu />
      <FooterComponent />
    </Router>
  );
}

export default App;