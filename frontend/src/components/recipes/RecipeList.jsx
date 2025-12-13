import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import {
  FaFilter, FaSort, FaSearch, FaTimes,
  FaClock, FaFire, FaStar, FaUtensils
} from 'react-icons/fa';
import { getAllRecipes } from '../../api/recipes';

const RecipeList = ({
  title = "Recipe Discovery",
  userId = null,
  limit = 20,
  showFilters = true,
  showSearch = true
}) => {
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

  // Initialize
  useEffect(() => {
    loadRecipes(1);
  }, [userId, filters.difficulty, filters.sortBy, searchQuery]);

  if (loading && recipes.length === 0) {
    return (
      <div className="recipe-list-loading animate__animated animate__fadeIn">
        <div className="loading-content">
          <div className="loading-spinner">
            <FaUtensils className="spinning-icon" />
          </div>
          <p className="loading-text">Discovering delicious recipes...</p>
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
              <form onSubmit={handleSearch} className="flex gap-2">
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
                <button type="submit" className="btn-rpg btn-rpg-primary">
                  Search
                </button>
              </form>
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
            Showing <span className="font-bold text-chef-red">{recipes.length}</span> of{' '}
            <span className="font-bold">{pagination.total}</span> recipes
          </p>

          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Search: "{searchQuery}"</span>
              <button
                className="btn-rpg btn-rpg-sm btn-rpg-secondary"
                onClick={() => setSearchQuery('')}
              >
                <FaTimes /> Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
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
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
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
    </div>
  );
};

export default RecipeList;