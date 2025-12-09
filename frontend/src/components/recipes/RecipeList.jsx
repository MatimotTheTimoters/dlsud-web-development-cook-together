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
      <div className="card-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="list-title">{title}</h2>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {showSearch && (
              <div className="flex gap-2">
                <div className="form-with-icon flex-1">
                  <FaSearch className="form-icon" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                  />
                </div>
                <button className="btn-rpg btn-rpg-primary" onClick={handleSearch}>
                  Search
                </button>
              </div>
            )}

            {showFilters && (
              <div className="flex gap-2">
                <button
                  className={`btn-rpg ${showFilterPanel ? 'btn-rpg-success' : 'btn-rpg-secondary'}`}
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                >
                  <FaFilter /> Filter
                </button>

                <div className="relative">
                  <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="form-control pl-10"
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
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <div className="card animate__animated animate__slideInDown">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="filter-title">Filters</h3>
              <button
                className="btn-rpg btn-rpg-sm btn-rpg-secondary"
                onClick={() => setShowFilterPanel(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="filter-group-title flex items-center gap-2 mb-2">
                  <FaFire /> Difficulty
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'easy', 'medium', 'hard'].map(level => (
                    <button
                      key={level}
                      className={`btn-rpg btn-rpg-sm ${filters.difficulty === level ? 'btn-rpg-primary' : 'btn-rpg-secondary'}`}
                      onClick={() => handleFilterChange('difficulty', level)}
                    >
                      {level === 'all' ? 'All Levels' : level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="filter-group-title flex items-center gap-2 mb-2">
                  <FaClock /> Cooking Time
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'quick', 'medium', 'long'].map(time => (
                    <button
                      key={time}
                      className={`btn-rpg btn-rpg-sm ${filters.timeRange === time ? 'btn-rpg-primary' : 'btn-rpg-secondary'}`}
                      onClick={() => handleFilterChange('timeRange', time)}
                    >
                      {time === 'all' ? 'Any Time' :
                        time === 'quick' ? '< 30 min' :
                          time === 'medium' ? '30-60 min' : '> 60 min'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  checked={filters.showPublic}
                  onChange={(e) => handleFilterChange('showPublic', e.target.checked)}
                  className="form-check-input"
                />
                <label className="form-check-label">Show public recipes only</label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                className="btn-rpg btn-rpg-primary"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
              <button
                className="btn-rpg btn-rpg-secondary"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Count */}
      <div className="card-body border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="recipe-count">
            Showing <span className="font-bold text-chef-red">{sortedAndFilteredRecipes.length}</span> of{' '}
            <span className="font-bold">{pagination.total}</span> recipes
          </p>

          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Search: "{searchQuery}"</span>
              <button
                className="btn-rpg btn-rpg-sm btn-rpg-secondary"
                onClick={clearFilters}
              >
                <FaTimes /> Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recipes Grid */}
      {sortedAndFilteredRecipes.length === 0 ? (
        <div className="center-layout">
          <div className="center-content">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="no-recipes-title mb-2">No Recipes Found</h3>
            <p className="no-recipes-message text-gray-600 mb-6">
              {searchQuery
                ? `No recipes found for "${searchQuery}". Try a different search term.`
                : 'No recipes match your filters. Try adjusting your search criteria.'}
            </p>
            {searchQuery || filters.difficulty !== 'all' || filters.timeRange !== 'all' ? (
              <button
                className="btn-rpg btn-rpg-primary"
                onClick={clearFilters}
              >
                Clear Filters & Show All
              </button>
            ) : (
              <Link to="/recipes/create" className="btn-rpg btn-rpg-primary">
                🍳 Create Your First Recipe
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="recipe-grid p-4">
            {sortedAndFilteredRecipes.map((recipe) => (
              <div key={recipe.id} className="card-recipe card">
                {recipe.cover_image && (
                  <img src={recipe.cover_image} alt={recipe.title} className="card-recipe-image" />
                )}
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg truncate">{recipe.title}</h3>
                    <span className="card-recipe-badge">
                      {recipe.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="flex items-center gap-1 text-sm">
                      <FaClock /> {((recipe.preparation_time || 0) + (recipe.cooking_time || 0))}min
                    </span>
                    <span className="text-sm">{recipe.origin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="currency-display currency-gold">
                      <FaCoins className="currency-icon" />
                      <span className="currency-amount">{recipe.gold_reward || 0}</span>
                    </div>
                    <button className="btn-rpg btn-rpg-primary btn-rpg-sm">
                      Cook
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="card-footer">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="pagination-info text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </div>

                <div className="flex gap-1">
                  <button
                    className={`btn-rpg btn-rpg-sm ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                  >
                    First
                  </button>

                  <button
                    className={`btn-rpg btn-rpg-sm ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </button>

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
                        className={`btn-rpg btn-rpg-sm ${pagination.page === pageNum ? 'btn-rpg-primary' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className={`btn-rpg btn-rpg-sm ${pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </button>

                  <button
                    className={`btn-rpg btn-rpg-sm ${pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Last
                  </button>
                </div>

                <div className="items-per-page">
                  <label className="mr-2">Show:</label>
                  <select
                    value={pagination.limit}
                    onChange={(e) => {
                      setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }));
                      loadRecipes(1);
                    }}
                    className="form-control w-20"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Stats */}
      {recipes.length > 0 && (
        <div className="card-body border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">🍳</div>
              <div className="text-xl font-bold">{recipes.length}</div>
              <div className="text-sm text-gray-600">Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-xl font-bold">
                {Math.round(recipes.reduce((sum, recipe) =>
                  sum + (recipe.preparation_time || 0) + (recipe.cooking_time || 0), 0) / recipes.length)}
              </div>
              <div className="text-sm text-gray-600">Avg. Time (min)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xl font-bold">
                {recipes.filter(r => r.difficulty === 'hard').length}
              </div>
              <div className="text-sm text-gray-600">Hard Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-xl font-bold">
                {Math.round(recipes.reduce((sum, recipe) => sum + (recipe.exp_reward || 0), 0) / recipes.length)}
              </div>
              <div className="text-sm text-gray-600">Avg. EXP</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeList;