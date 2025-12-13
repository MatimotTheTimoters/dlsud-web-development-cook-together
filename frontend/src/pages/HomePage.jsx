import React from 'react';
import { Link } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';
import {
  FaFire, FaNewspaper, FaUsers,
  FaUtensils, FaBook, FaStore, FaChevronRight
} from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="home-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-icon">🍳</span> CookTogether
          </h1>
          <p className="hero-subtitle">
            Level up your cooking skills, earn rewards, and join a community of passionate chefs!
          </p>

          <div className="hero-actions">
            <Link to="/recipes" className="primary-hero-btn">
              <FaUtensils /> Start Cooking
            </Link>
            <Link to="/recipes/create" className="secondary-hero-btn">
              <FaBook /> Create Recipe
            </Link>
            <Link to="/discover" className="secondary-hero-btn">
              <FaUsers /> Find Friends
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="featured-recipes-section">
        <div className="section-header">
          <h3 className="section-title">
            <FaNewspaper className="section-icon" /> Featured Recipes
          </h3>
          <Link to="/recipes" className="view-all-link">
            View All Recipes <FaChevronRight />
          </Link>
        </div>

        <RecipeList
          showFilters={false}
          limit={6}
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>

        <div className="actions-grid">
          <Link to="/recipes/create" className="action-card">
            <div className="action-icon">🍳</div>
            <h4 className="action-title">Create Recipe</h4>
            <p className="action-description">
              Share your culinary creation and earn rewards
            </p>
          </Link>

          <Link to="/recipes" className="action-card">
            <div className="action-icon">👥</div>
            <h4 className="action-title">Find Friends</h4>
            <p className="action-description">
              Connect with other chefs and cook together
            </p>
          </Link>

          <Link to="/shop" className="action-card">
            <div className="action-icon">🏪</div>
            <h4 className="action-title">Visit Shop</h4>
            <p className="action-description">
              Spend your gold and gems on exclusive items
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;