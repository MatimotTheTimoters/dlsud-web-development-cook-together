// In Searchbar.js - Remove unused imports and simplify
import React, { useState, useEffect, useRef } from "react";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";

/**
 * Searchbar component for searching recipes, challenges, and users.
 * @param {string} searchQuery - The current search query.
 * @param {function} onSearchChange - Callback for when the search query changes.
 * @param {string} activeFilter - The currently selected filter.
 * @param {function} onFilterChange - Callback for when the filter selection changes.
 * @returns {JSX.Element} - A Searchbar component with an input field and a popup filter.
 */
const Searchbar = ({ searchQuery, onSearchChange, activeFilter, onFilterChange }) => {
  const location = useLocation();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showPopup, setShowPopup] = useState(false);
  const inputRef = useRef(null);

  // Determine current page
  const currentPage = location.pathname.includes("/feed")
    ? "feed"
    : location.pathname.includes("/my-kitchen")
    ? "my-kitchen"
    : "discover";

  // Filter options based on current page
  const filterOptions = {
    feed: [
      { key: "recipes", label: "Recipes from followed users" },
      { key: "challenges", label: "Challenges from followed users" },
      { key: "users", label: "Followed users" },
    ],
    discover: [
      { key: "recipes", label: "All recipes" },
      { key: "challenges", label: "All challenges" },
      { key: "users", label: "All users" },
    ],
    "my-kitchen": [
      { key: "user-recipes", label: "Your created recipes" },
      { key: "user-challenges", label: "Your joined challenges" },
    ],
  };

  const currentFilters = filterOptions[currentPage] || filterOptions.discover;

  // Debounced search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const handleSearchChange = (e) => {
    setLocalQuery(e.target.value);
    setShowPopup(true);
  };

  const handleFilterSelect = (filterKey) => {
    onFilterChange(filterKey);
    setShowPopup(false);
    inputRef.current?.blur();
  };

  const handleBlur = () => {
    setTimeout(() => setShowPopup(false), 150); // Delay to allow click events to register
  };

  return (
    <div className="searchbar-container position-relative">
      {/* Search Input */}
      <InputGroup>
        <Form.Control
          ref={inputRef}
          type="text"
          placeholder={`Search ${currentPage}...`}
          value={localQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowPopup(true)}
          onBlur={handleBlur}
          className="search-input"
        />
        <InputGroup.Text>🔍</InputGroup.Text>
      </InputGroup>

      {/* Popup Filter */}
      {showPopup && (
        <ListGroup className="position-absolute w-100 mt-1 shadow-sm z-3">
          {currentFilters.map((filter) => (
            <ListGroup.Item
              key={filter.key}
              action
              onClick={() => handleFilterSelect(filter.key)}
              className={`d-flex justify-content-between align-items-center ${
                activeFilter === filter.key ? "active" : ""
              }`}
            >
              {filter.label}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Searchbar;