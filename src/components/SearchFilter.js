// src/components/SearchFilter.js
import React from 'react';
import { Button, ButtonGroup, Badge } from 'react-bootstrap';

function SearchFilter({ currentPage, activeFilter, onFilterChange }) {
  const getAvailableFilters = () => {
    const baseFilters = {
      recipes: { label: 'Recipes', icon: '📝', enabled: true },
      challenges: { label: 'Challenges', icon: '🏆', enabled: true },
      users: { label: 'Users', icon: '👥', enabled: true }
    };
    
    switch (currentPage) {
      case 'feed':
        return { ...baseFilters, cookbooks: { label: 'Cookbooks', icon: '📚', enabled: false } };
      case 'discover':
        return { ...baseFilters, cookbooks: { label: 'Cookbooks', icon: '📚', enabled: true } };
      case 'my-kitchen':
        return { 
          ...baseFilters, 
          cookbooks: { label: 'My Cookbooks', icon: '📚', enabled: true }
        };
      default:
        return baseFilters;
    }
  };

  const availableFilters = getAvailableFilters();

  const handleFilterClick = (filterKey) => {
    if (availableFilters[filterKey]?.enabled) {
      onFilterChange(filterKey);
    }
  };

  return (
    <div className="search-filter-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="text-ct-ink mb-0">Filter By</h6>
        <Badge bg="secondary" className="text-capitalize">
          {currentPage.replace('-', ' ')}
        </Badge>
      </div>
      
      <ButtonGroup className="w-100 search-filter-buttons">
        {Object.entries(availableFilters).map(([key, filter]) => (
          <Button
            key={key}
            variant={activeFilter === key ? "primary" : "outline-secondary"}
            onClick={() => handleFilterClick(key)}
            disabled={!filter.enabled}
            className="search-filter-button text-nowrap"
            size="sm"
          >
            <span className="me-1">{filter.icon}</span>
            {filter.label}
            {!filter.enabled && (
              <Badge bg="light" text="dark" className="ms-1" style={{ fontSize: '0.5rem' }}>
                soon
              </Badge>
            )}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}

export default SearchFilter;