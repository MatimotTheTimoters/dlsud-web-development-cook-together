import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Modal, ListGroup, Badge } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

const UnifiedSearch = ({ 
  searchQuery, 
  onSearchChange, 
  activeFilter, 
  onFilterChange 
}) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef(null);

  const {
    getRecipesByFollowing,
    getChallengesByFollowing,
    getUsersByFollowing,
    getAllRecipes,
    getAllChallenges,
    getAllUsers,
    getUserRecipes,
    getUserChallenges,
    getUserCookbooks
  } = useData();

  // Determine current page
  const currentPage = location.pathname.includes('/feed') ? 'feed' : 
                     location.pathname.includes('/my-kitchen') ? 'my-kitchen' : 
                     'discover';

  // Filter options based on current page with dynamic counts
  const getFilterOptions = () => {
    const baseOptions = {
      feed: [
        { 
          key: 'recipes', 
          label: 'Recipes', 
          description: `From people you follow (${getRecipesByFollowing.length})` 
        },
        { 
          key: 'challenges', 
          label: 'Challenges', 
          description: `Active challenges from your network (${getChallengesByFollowing.length})` 
        },
        { 
          key: 'users', 
          label: 'Users', 
          description: `Find people to follow (${getUsersByFollowing.length})` 
        }
      ],
      discover: [
        { 
          key: 'recipes', 
          label: 'Recipes', 
          description: `All public recipes (${getAllRecipes.length})` 
        },
        { 
          key: 'challenges', 
          label: 'Challenges', 
          description: `All active challenges (${getAllChallenges.length})` 
        },
        { 
          key: 'users', 
          label: 'Users', 
          description: `All community users (${getAllUsers.length})` 
        },
        { 
          key: 'cookbooks', 
          label: 'Cookbooks', 
          description: 'Recipe collections' 
        }
      ],
      'my-kitchen': [
        { 
          key: 'user-recipes', 
          label: 'Created Recipes', 
          description: `Recipes you created (${getUserRecipes.length})` 
        },
        { 
          key: 'user-challenges', 
          label: 'Joined Challenges', 
          description: `Challenges you joined (${getUserChallenges.length})` 
        },
        { 
          key: 'user-cookbooks', 
          label: 'Cookbooks', 
          description: `Your recipe collections (${getUserCookbooks.length})` 
        }
      ]
    };

    return baseOptions[currentPage] || baseOptions.discover;
  };

  const currentFilters = getFilterOptions();

  // Get search results count for current active filter
  const getSearchResultsCount = () => {
    if (!localQuery.trim()) return 0;
    
    let dataToSearch = [];
    
    switch (currentPage) {
      case 'feed':
        switch (activeFilter) {
          case 'recipes':
            dataToSearch = getRecipesByFollowing;
            break;
          case 'challenges':
            dataToSearch = getChallengesByFollowing;
            break;
          case 'users':
            dataToSearch = getUsersByFollowing;
            break;
          default:
            return 0;
        }
        break;
        
      case 'discover':
        switch (activeFilter) {
          case 'recipes':
            dataToSearch = getAllRecipes;
            break;
          case 'challenges':
            dataToSearch = getAllChallenges;
            break;
          case 'users':
            dataToSearch = getAllUsers;
            break;
          case 'cookbooks':
            dataToSearch = getUserCookbooks;
            break;
          default:
            return 0;
        }
        break;
        
      case 'my-kitchen':
        switch (activeFilter) {
          case 'user-recipes':
            dataToSearch = getUserRecipes;
            break;
          case 'user-challenges':
            dataToSearch = getUserChallenges;
            break;
          case 'user-cookbooks':
            dataToSearch = getUserCookbooks;
            break;
          default:
            return 0;
        }
        break;
        
      default:
        return 0;
    }
    
    // Filter by search query
    const results = dataToSearch.filter(item => 
      item.title?.toLowerCase().includes(localQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(localQuery.toLowerCase()) ||
      item.username?.toLowerCase().includes(localQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(localQuery.toLowerCase())
    );
    
    return results.length;
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const handleSearchChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleFilterSelect = (filterKey) => {
    onFilterChange(filterKey);
    setShowModal(false);
    inputRef.current?.blur(); // Remove focus from input
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Get modal title based on current state
  const getModalTitle = () => {
    if (!localQuery.trim()) {
      return "Search in...";
    }
    return `Search "${localQuery}" in...`;
  };

  // Get active filter display name
  const getActiveFilterName = () => {
    return currentFilters.find(f => f.key === activeFilter)?.label || activeFilter;
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-4">
        <InputGroup>
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder={`Search in ${currentPage}...`}
            value={localQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <InputGroup.Text>🔍</InputGroup.Text>
        </InputGroup>
        
        {/* Active Filter Badge and Results Count */}
        {activeFilter && (
          <div className="mt-2">
            <Badge bg="primary" className="me-2">
              {getActiveFilterName()}
            </Badge>
            <small className="text-muted">
              {localQuery ? 
                `Found ${getSearchResultsCount()} results for "${localQuery}"` : 
                `Showing all ${getSearchResultsCount()} items`
              }
            </small>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        animation={false}
        dialogClassName="search-modal"
        backdropClassName="search-modal-backdrop"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="small fw-normal">
            {getModalTitle()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <ListGroup variant="flush">
            {currentFilters.map((filter) => (
              <ListGroup.Item
                key={filter.key}
                action
                onClick={() => handleFilterSelect(filter.key)}
                className="border-0 px-0 py-3"
                active={activeFilter === filter.key}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold">{filter.label}</h6>
                    <small className="text-muted">{filter.description}</small>
                  </div>
                  {activeFilter === filter.key && (
                    <Badge bg="primary" className="ms-2">✓</Badge>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UnifiedSearch;