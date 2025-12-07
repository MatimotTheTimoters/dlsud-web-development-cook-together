import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import RecipeCard from '../cards/RecipeCard';
import { 
  FaFilter, FaSort, FaSearch, FaTimes,
  FaClock, FaFire, FaStar, FaUtensils
} from 'react-icons/fa';
import { getAllRecipes, searchRecipes } from '../../api/recipes';

const RecipeList = ({ 
  title = "Recipe Discovery",
  userId = null,
  limit = 20,
  showFilters = true,
  showSearch = true
}) => {
  const { recipes: contextRecipes, fetchRecipes } = useData();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    sortBy: 'recent',
    timeRange: 'all',
    showPublic: true
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: 0,
    totalPages: 1
  });
  
  // Load recipes
  const loadRecipes = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };
      
      if (userId) {
        params.user_id = userId;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Remove 'all' filters
      Object.keys(params).forEach(key => {
        if (params[key] === 'all') {
          delete params[key];
        }
      });
      
      const result = await getAllRecipes(params);
      
      if (result.success) {
        setRecipes(result.data.recipes || []);
        setPagination({
          page: result.data.pagination?.page || page,
          limit: result.data.pagination?.limit || pagination.limit,
          total: result.data.pagination?.total_recipes || 0,
          totalPages: result.data.pagination?.total_pages || 1
        });
        
        // Also update context if this is the main recipe list
        if (!userId && !searchQuery && page === 1) {
          // The context will handle its own updates
        }
      } else {
        setError(result.message || 'Failed to load recipes');
      }
    } catch (err) {
      console.error('Error loading recipes:', err);
      setError(err.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = async (e) => {
    e?.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadRecipes(1);
  };
  
  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Apply filters
  const applyFilters = () => {
    setShowFilterPanel(false);
    loadRecipes(1);
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      difficulty: 'all',
      sortBy: 'recent',
      timeRange: 'all',
      showPublic: true
    });
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
    loadRecipes(1);
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      loadRecipes(newPage);
    }
  };
  
  // Initialize with context recipes or load fresh
  useEffect(() => {
    if (contextRecipes.length > 0 && !userId && !searchQuery && !filters.difficulty && !filters.sortBy) {
      // Use context recipes for initial display
      setRecipes(contextRecipes.slice(0, limit));
      setLoading(false);
    } else {
      // Load fresh data with filters
      loadRecipes(1);
    }
  }, [userId, filters.difficulty, filters.sortBy, searchQuery]);
  
  // Sort recipes locally (for client-side sorting)
  const sortRecipes = (recipesToSort, sortBy) => {
    const sorted = [...recipesToSort];
    
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
      case 'recent':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
      case 'time':
        return sorted.sort((a, b) => {
          const aTime = (a.preparation_time || 0) + (a.cooking_time || 0);
          const bTime = (b.preparation_time || 0) + (b.cooking_time || 0);
          return aTime - bTime;
        });
      default:
        return sorted;
    }
  };
  
  // Filter recipes locally (for client-side filtering)
  const filterRecipes = (recipesToFilter, criteria) => {
    return recipesToFilter.filter(recipe => {
      if (criteria.difficulty && criteria.difficulty !== 'all' && recipe.difficulty !== criteria.difficulty) {
        return false;
      }
      
      if (criteria.timeRange && criteria.timeRange !== 'all') {
        const totalTime = (recipe.preparation_time || 0) + (recipe.cooking_time || 0);
        
        switch (criteria.timeRange) {
          case 'quick':
            if (totalTime > 30) return false;
            break;
          case 'medium':
            if (totalTime <= 30 || totalTime > 60) return false;
            break;
          case 'long':
            if (totalTime <= 60) return false;
            break;
        }
      }
      
      return true;
    });
  };
  
  const sortedAndFilteredRecipes = sortRecipes(
    filterRecipes(recipes, filters),
    filters.sortBy
  );
  
  if (loading && recipes.length === 0) {
    return (
      <div className="recipe-list-loading animate__animated animate__fadeIn">
        <div className="loading-content">
          <div className="loading-spinner">
            <FaUtensils className="spinning-icon" />
          </div>
          <p className="loading-text">Discovering delicious recipes...</p>
          <p className="loading-subtext">+10 EXP for patience</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="recipe-list-error animate__animated animate__shakeX">
        <div className="error-content">
          <span className="error-icon">❌</span>
          <h3 className="error-title">Failed to Load Recipes</h3>
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => loadRecipes(1)}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="recipe-list-container animate__animated animate__fadeIn">
      {/* Header */}
      <div className="recipe-list-header">
        <h2 className="list-title">{title}</h2>
        
        {showSearch && (
          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        )}
        
        {showFilters && (
          <div className="list-controls">
            <button 
              className={`filter-btn ${showFilterPanel ? 'active' : ''}`}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <FaFilter /> Filter
            </button>
            
            <div className="sort-dropdown">
              <FaSort className="sort-icon" />
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="sort-select"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="difficulty">Difficulty</option>
                <option value="time">Cooking Time</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <div className="filter-panel animate__animated animate__slideInDown">
          <div className="filter-panel-header">
            <h3 className="filter-title">Filters</h3>
            <button 
              className="close-filter"
              onClick={() => setShowFilterPanel(false)}
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <h4 className="filter-group-title">
                <FaFire /> Difficulty
              </h4>
              <div className="filter-buttons">
                <button 
                  className={`filter-option ${filters.difficulty === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('difficulty', 'all')}
                >
                  All Levels
                </button>
                <button 
                  className={`filter-option ${filters.difficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('difficulty', 'easy')}
                >
                  Easy
                </button>
                <button 
                  className={`filter-option ${filters.difficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('difficulty', 'medium')}
                >
                  Medium
                </button>
                <button 
                  className={`filter-option ${filters.difficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('difficulty', 'hard')}
                >
                  Hard
                </button>
              </div>
            </div>
            
            <div className="filter-group">
              <h4 className="filter-group-title">
                <FaClock /> Cooking Time
              </h4>
              <div className="filter-buttons">
                <button 
                  className={`filter-option ${filters.timeRange === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('timeRange', 'all')}
                >
                  Any Time
                </button>
                <button 
                  className={`filter-option ${filters.timeRange === 'quick' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('timeRange', 'quick')}
                >
                  &lt; 30 min
                </button>
                <button 
                  className={`filter-option ${filters.timeRange === 'medium' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('timeRange', 'medium')}
                >
                  30-60 min
                </button>
                <button 
                  className={`filter-option ${filters.timeRange === 'long' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('timeRange', 'long')}
                >
                  &gt; 60 min
                </button>
              </div>
            </div>
            
            <div className="filter-group">
              <h4 className="filter-group-title">
                <FaStar /> Status
              </h4>
              <div className="filter-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={filters.showPublic}
                    onChange={(e) => handleFilterChange('showPublic', e.target.checked)}
                  />
                  <span className="checkbox-label">Show public recipes only</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="filter-actions">
            <button 
              className="apply-filters-btn"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
            <button 
              className="clear-filters-btn"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
      
      {/* Recipe Count */}
      <div className="recipe-count-section">
        <p className="recipe-count">
          Showing <span className="highlight">{sortedAndFilteredRecipes.length}</span> of{' '}
          <span className="highlight">{pagination.total}</span> recipes
        </p>
        
        {searchQuery && (
          <div className="search-results-info">
            <span className="search-query">"{searchQuery}"</span>
            <button 
              className="clear-search-btn"
              onClick={clearFilters}
            >
              <FaTimes /> Clear search
            </button>
          </div>
        )}
      </div>
      
      {/* Recipes Grid */}
      {sortedAndFilteredRecipes.length === 0 ? (
        <div className="no-recipes-found animate__animated animate__fadeIn">
          <div className="no-recipes-content">
            <div className="no-recipes-icon">🍳</div>
            <h3 className="no-recipes-title">No Recipes Found</h3>
            <p className="no-recipes-message">
              {searchQuery 
                ? `No recipes found for "${searchQuery}". Try a different search term.`
                : 'No recipes match your filters. Try adjusting your search criteria.'}
            </p>
            {searchQuery || filters.difficulty !== 'all' || filters.timeRange !== 'all' ? (
              <button 
                className="clear-filters-large-btn"
                onClick={clearFilters}
              >
                Clear Filters & Show All
              </button>
            ) : (
              <Link to="/recipes/create" className="create-recipe-btn">
                🍳 Create Your First Recipe
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {sortedAndFilteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe}
                onLike={() => {
                  // Refresh recipes after like
                  loadRecipes(pagination.page);
                }}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              
              <div className="pagination-buttons">
                <button 
                  className={`pagination-btn ${pagination.page === 1 ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                >
                  First
                </button>
                
                <button 
                  className={`pagination-btn ${pagination.page === 1 ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${pagination.page === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  className={`pagination-btn ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </button>
                
                <button 
                  className={`pagination-btn ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Last
                </button>
              </div>
              
              <div className="items-per-page">
                <label>Show:</label>
                <select 
                  value={pagination.limit}
                  onChange={(e) => {
                    setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
                    loadRecipes(1);
                  }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Quick Stats */}
      {recipes.length > 0 && (
        <div className="recipe-stats-footer">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🍳</span>
              <div className="stat-info">
                <div className="stat-value">{recipes.length}</div>
                <div className="stat-label">Recipes</div>
              </div>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <div className="stat-info">
                <div className="stat-value">
                  {Math.round(recipes.reduce((sum, recipe) => 
                    sum + (recipe.preparation_time || 0) + (recipe.cooking_time || 0), 0) / recipes.length)}
                </div>
                <div className="stat-label">Avg. Time (min)</div>
              </div>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <div className="stat-info">
                <div className="stat-value">
                  {recipes.filter(r => r.difficulty === 'hard').length}
                </div>
                <div className="stat-label">Hard Recipes</div>
              </div>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <div className="stat-info">
                <div className="stat-value">
                  {Math.round(recipes.reduce((sum, recipe) => sum + (recipe.exp_reward || 0), 0) / recipes.length)}
                </div>
                <div className="stat-label">Avg. EXP</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeList;