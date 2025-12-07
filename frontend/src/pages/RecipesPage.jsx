import React, { useState } from 'react';
import RecipeList from '../components/recipes/RecipeList';
import RecipeFilters from '../components/recipes/RecipeFilters';
import { FaFilter, FaSortAmountDown, FaSearch, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const RecipesPage = () => {
  const { recipes, loading, fetchRecipes } = useData();
  const [filters, setFilters] = useState({
    difficulty: '',
    sortBy: 'recent',
    timeRange: '',
    cuisine: '',
    showPublic: true
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // The RecipeList component will handle the actual search
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // The RecipeList component will handle filtering
  };

  const loadAllRecipes = async () => {
    await fetchRecipes();
  };

  return (
    <div className="recipes-page animate__animated animate__fadeIn">
      {/* Hero Section */}
      <div className="recipes-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-icon">🍳</span> Recipe Discovery
          </h1>
          <p className="hero-subtitle">
            Explore thousands of delicious recipes shared by our community of chefs.
            Cook, earn rewards, and level up your culinary skills!
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-icon">📖</span>
              <div className="stat-info">
                <div className="stat-value">{recipes.length || 0}</div>
                <div className="stat-label">Recipes</div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <div className="stat-info">
                <div className="stat-value">2.5K+</div>
                <div className="stat-label">Daily Cooks</div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <div className="stat-info">
                <div className="stat-value">500+</div>
                <div className="stat-label">Active Chefs</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-actions">
          <Link to="/recipes/create" className="create-recipe-btn">
            <FaPlus /> Create Recipe
          </Link>
          <button 
            className="refresh-recipes-btn"
            onClick={loadAllRecipes}
            disabled={loading.recipes}
          >
            {loading.recipes ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="quick-filters-section">
        <h3 className="filters-title">
          <FaFilter /> Quick Filters
        </h3>
        
        <div className="quick-filters">
          <button 
            className={`quick-filter-btn ${filters.difficulty === 'easy' ? 'active' : ''}`}
            onClick={() => handleFilterChange({ ...filters, difficulty: 'easy' })}
          >
            🍃 Easy
          </button>
          <button 
            className={`quick-filter-btn ${filters.difficulty === 'medium' ? 'active' : ''}`}
            onClick={() => handleFilterChange({ ...filters, difficulty: 'medium' })}
          >
            🔥 Medium
          </button>
          <button 
            className={`quick-filter-btn ${filters.difficulty === 'hard' ? 'active' : ''}`}
            onClick={() => handleFilterChange({ ...filters, difficulty: 'hard' })}
          >
            ⚡ Hard
          </button>
          <button 
            className={`quick-filter-btn ${filters.timeRange === 'quick' ? 'active' : ''}`}
            onClick={() => handleFilterChange({ ...filters, timeRange: 'quick' })}
          >
            ⏱️ Under 30min
          </button>
          <button 
            className={`quick-filter-btn ${filters.sortBy === 'popular' ? 'active' : ''}`}
            onClick={() => handleFilterChange({ ...filters, sortBy: 'popular' })}
          >
            🔥 Trending
          </button>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setFilters({
                difficulty: '',
                sortBy: 'recent',
                timeRange: '',
                cuisine: '',
                showPublic: true
              });
              setSearchQuery('');
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes by name, ingredients, or cuisine..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="search-action-btn"
              onClick={() => handleSearch(searchQuery)}
            >
              Search
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="recipes-main-content">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <RecipeFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <div className="sidebar-widget">
            <h4 className="widget-title">🎮 Cooking Challenges</h4>
            <div className="challenge-list">
              <div className="challenge-item">
                <span className="challenge-icon">🌱</span>
                <div className="challenge-info">
                  <div className="challenge-name">Vegan Week</div>
                  <div className="challenge-participants">342 participants</div>
                </div>
              </div>
              <div className="challenge-item">
                <span className="challenge-icon">🍝</span>
                <div className="challenge-info">
                  <div className="challenge-name">Pasta Masters</div>
                  <div className="challenge-participants">189 participants</div>
                </div>
              </div>
              <div className="challenge-item">
                <span className="challenge-icon">🔥</span>
                <div className="challenge-info">
                  <div className="challenge-name">Spicy Challenge</div>
                  <div className="challenge-participants">76 participants</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="sidebar-widget">
            <h4 className="widget-title">🏆 Top Chefs This Week</h4>
            <div className="top-chefs">
              {[1, 2, 3].map((chef) => (
                <div key={chef} className="chef-item">
                  <div className="chef-rank">{chef}</div>
                  <div className="chef-avatar">
                    {chef === 1 ? '👑' : chef === 2 ? '🥈' : '🥉'}
                  </div>
                  <div className="chef-info">
                    <div className="chef-name">Chef {['Mario', 'Luigi', 'Peach'][chef - 1]}</div>
                    <div className="chef-level">Level {25 - chef * 5}</div>
                  </div>
                  <div className="chef-recipes">+{150 - chef * 30} recipes</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe List */}
        <div className="recipes-list-container">
          <div className="list-header">
            <h3 className="list-title">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Recipes'}
            </h3>
            <div className="list-sort">
              <FaSortAmountDown className="sort-icon" />
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                className="sort-select"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="cooked">Most Cooked</option>
                <option value="exp">Highest EXP</option>
              </select>
            </div>
          </div>

          <RecipeList 
            title=""
            showFilters={false}
            showSearch={false}
            filters={filters}
            searchQuery={searchQuery}
          />

          {/* Create Recipe CTA */}
          {recipes.length > 0 && (
            <div className="create-cta-section">
              <div className="cta-content">
                <h3 className="cta-title">Share Your Culinary Magic!</h3>
                <p className="cta-description">
                  Create your own recipe and earn rewards. Every recipe you share helps others 
                  discover new flavors and cooking techniques.
                </p>
                <div className="cta-rewards">
                  <span className="reward-badge">⭐ +50 EXP</span>
                  <span className="reward-badge">💰 +25 Gold</span>
                  <span className="reward-badge">💎 +5 Gems</span>
                </div>
                <Link to="/recipes/create" className="cta-button">
                  <FaPlus /> Create Your Recipe
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="page-stats-footer">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🍳</div>
            <div className="stat-details">
              <div className="stat-value">{recipes.length || 0}</div>
              <div className="stat-label">Total Recipes</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👨‍🍳</div>
            <div className="stat-details">
              <div className="stat-value">250+</div>
              <div className="stat-label">Active Chefs</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-details">
              <div className="stat-value">1.2K</div>
              <div className="stat-label">Hours Cooked</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-details">
              <div className="stat-value">15K</div>
              <div className="stat-label">Rewards Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;