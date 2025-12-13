import React, { useState } from 'react';
import RecipeList from '../components/recipes/RecipeList';
import { FaFilter, FaSortAmountDown, FaSearch, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RecipesPage = () => {
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
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="recipes-page">
      {/* Search & Filter Controls */}
      <div className="recipes-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter />
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange({ ...filters, difficulty: e.target.value })}
              className="filter-select"
            >
              <option value="">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="filter-group">
            <FaSortAmountDown />
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
              className="filter-select"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="cooked">Most Cooked</option>
            </select>
          </div>

          <Link to="/recipes/create" className="create-recipe-btn">
            <FaPlus /> Create Recipe
          </Link>
        </div>
      </div>

      {/* Recipe List */}
      <RecipeList
        filters={filters}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default RecipesPage;