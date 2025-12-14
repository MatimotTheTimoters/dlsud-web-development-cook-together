import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
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
            <Route path="/login" element={<LoginPage />} />
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

// Simple placeholder components for now
function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to CookTogether! 🍳</h1>
      <p>Start your cooking journey with us.</p>
      <Link to="/register" className="cta-button">
        Get Started
      </Link>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="login-page">
      <h1>Login (Coming Soon)</h1>
      <p>Feature 2 will be implemented next!</p>
      <Link to="/register" className="cta-button">
        Go to Registration
      </Link>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="about-page">
      <h1>About CookTogether</h1>
      <p>A gamified cooking platform where you can cook with friends and earn rewards!</p>
    </div>
  );
}

export default App;