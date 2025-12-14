import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🍳 CookTogether
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/register" className="nav-link">Register</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/about" className="nav-link">About</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} /> {/* Uses actual LoginPage */}
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2024 CookTogether - Level up your cooking!</p>
        </footer>
      </div>
    </Router>
  );
}

// HomePage with login status check
function HomePage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="home-page">
      <h1>Welcome to CookTogether! 🍳</h1>
      {user ? (
        <>
          <p>Welcome back, <strong>{user.username}</strong>! Ready to cook?</p>
          <div className="user-stats">
            <p>🏆 Level 1 | 💰 Gold: 100 | 💎 Gems: 10</p>
          </div>
          <Link to="/" className="cta-button">
            Start Cooking
          </Link>
        </>
      ) : (
        <>
          <p>Start your cooking journey with us.</p>
          <div className="auth-buttons">
            <Link to="/register" className="cta-button">
              Get Started
            </Link>
            <Link to="/login" className="cta-button secondary">
              Sign In
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// AboutPage remains the same
function AboutPage() {
  return (
    <div className="about-page">
      <h1>About CookTogether</h1>
      <p>A gamified cooking platform where you can cook with friends and earn rewards!</p>
    </div>
  );
}

export default App;