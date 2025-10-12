import React, { useState, useEffect, useRef } from "react";
import { Form, InputGroup, ListGroup, Badge } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useData } from "../../contexts/DataContext";

const Searchbar = ({ searchQuery, onSearchChange, activeFilter, onFilterChange }) => {
  const location = useLocation();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showPopup, setShowPopup] = useState(false);
  const inputRef = useRef(null);

  const { getRecipesByFollowing, getChallengesByFollowing, getUsersByFollowing, getAllRecipes, getAllChallenges, getAllUsers, getUserRecipes, getUserChallenges } = useData();

  // Determine current page
  const currentPage = location.pathname.includes("/feed")
    ? "feed"
    : location.pathname.includes("/my-kitchen")
    ? "my-kitchen"
    : "discover";

  // Filter options based on current page
  const getFilterOptions = () => {
    const baseOptions = {
      feed: [
        { key: "recipes", label: `Search "${localQuery}" from Recipes` },
        { key: "challenges", label: `Search "${localQuery}" from Challenges` },
        { key: "users", label: `Search "${localQuery}" from Users` },
      ],
      discover: [
        { key: "recipes", label: `Search "${localQuery}" from Recipes` },
        { key: "challenges", label: `Search "${localQuery}" from Challenges` },
        { key: "users", label: `Search "${localQuery}" from Users` },
      ],
      "my-kitchen": [
        { key: "user-recipes", label: `Search "${localQuery}" from Created Recipes` },
        { key: "user-challenges", label: `Search "${localQuery}" from Joined Challenges` },
      ],
    };

    return baseOptions[currentPage] || baseOptions.discover;
  };

  const currentFilters = getFilterOptions();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, onSearchChange]);

  const handleSearchChange = (e) => {
    setLocalQuery(e.target.value);
    setShowPopup(true); // Show popup when typing
  };

  const handleFilterSelect = (filterKey) => {
    onFilterChange(filterKey);
    setShowPopup(false); // Hide popup after selecting a filter
    inputRef.current?.blur(); // Remove focus from input
  };

  const handleBlur = () => {
    // Delay hiding the popup to allow click events to register
    setTimeout(() => setShowPopup(false), 200);
  };

  return (
    <div className="searchbar-container position-relative">
      {/* Search Bar */}
      <InputGroup>
        <Form.Control
          ref={inputRef}
          type="text"
          placeholder={`Search in ${currentPage}...`}
          value={localQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowPopup(true)} // Show popup on focus
          onBlur={handleBlur} // Hide popup on blur
          className="search-input"
        />
        <InputGroup.Text>🔍</InputGroup.Text>
      </InputGroup>

      {/* Popup Filter */}
      {showPopup && (
        <ListGroup className="position-absolute w-100 mt-1 shadow-sm">
          {currentFilters.map((filter) => (
            <ListGroup.Item
              key={filter.key}
              action
              onClick={() => handleFilterSelect(filter.key)}
              className={`d-flex justify-content-between align-items-center ${
                activeFilter === filter.key ? "active" : ""
              }`}
            >
              <span>{filter.label}</span>
              {activeFilter === filter.key && <Badge bg="primary">✓</Badge>}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Searchbar;