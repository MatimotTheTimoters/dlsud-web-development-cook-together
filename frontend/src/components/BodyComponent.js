import React, { useState, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../contexts/DataContext";
import Searchbar from "./ui/Searchbar";

import noRecordsImage from "../assets/icons/no-records-icon.png";

// Card groups
import RecipeCardGroup from "./card-groups/RecipeCardGroup";
import ChallengeCardGroup from "./card-groups/ChallengeCardGroup";
import UserCardGroup from "./card-groups/UserCardGroup";

function BodyComponent() {
  const { user } = useAuth();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("recipes");

  const { queryData, loading } = useData();

  const currentPage = useMemo(() => {
    if (location.pathname.includes("/feed")) return "feed";
    if (location.pathname.includes("/my-kitchen")) return "my-kitchen";
    return "discover";
  }, [location.pathname]);

  const filteredData = useMemo(() => {
    if (!queryData || loading) return [];
    return queryData(currentPage, activeFilter, searchQuery);
  }, [queryData, currentPage, activeFilter, searchQuery, loading]);

  // Get appropriate message based on context
  const getNoResultsMessage = () => {
    if (searchQuery) {
      return `No ${getFilterLabel()} found for "${searchQuery}"`;
    }
    
    switch (currentPage) {
      case "feed":
        return `No ${getFilterLabel()} from followed users yet`;
      case "my-kitchen":
        return `You haven't created any ${getFilterLabel()} yet`;
      default:
        return `No ${getFilterLabel()} available yet`;
    }
  };

  // Get human-readable filter label
  const getFilterLabel = () => {
    switch (activeFilter) {
      case "recipes":
      case "user-recipes":
        return "recipes";
      case "challenges":
      case "user-challenges":
        return "challenges";
      case "users":
        return "users";
      default:
        return "items";
    }
  };

  const renderGroup = () => {
    switch (activeFilter) {
      case "recipes":
      case "user-recipes":
        return <RecipeCardGroup items={filteredData} />;
      case "challenges":
      case "user-challenges":
        return <ChallengeCardGroup challenges={filteredData} />;
      case "users":
        return <UserCardGroup users={filteredData} />;
      default:
        return null;
    }
  };

  return (
    <Container fluid className="body-component py-4">
      <Row>
        {/* Sidebar (Search + Filter) */}
        <Col lg={3} className="mb-4">
          <Searchbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-ct-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-ct-muted">Loading content...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-5 no-results-container">
              <img 
                src={noRecordsImage} 
                alt="No results found" 
                className="no-results-image mb-4"
                style={{ 
                  width: "120px", 
                  height: "120px", 
                  opacity: 0.7 
                }}
              />
              <h4 className="text-ct-muted mb-3">
                {getNoResultsMessage()}
              </h4>
              <p className="text-ct-muted mb-4">
                {searchQuery ? (
                  "Try adjusting your search terms or browse all available content"
                ) : currentPage === "feed" ? (
                  "Follow more users to see their recipes and challenges in your feed"
                ) : currentPage === "my-kitchen" ? (
                  "Start creating content to build your culinary portfolio"
                ) : (
                  "Be the first to create content in our community!"
                )}
              </p>
              {currentPage === "my-kitchen" && activeFilter.includes("recipes") && (
                <button 
                  className="btn btn-ct-primary"
                  onClick={() => {
                    // You can add logic here to open create recipe modal
                    console.log("Create recipe clicked");
                  }}
                >
                  Create Your First Recipe
                </button>
              )}
              {currentPage === "my-kitchen" && activeFilter.includes("challenges") && (
                <button 
                  className="btn btn-ct-primary"
                  onClick={() => {
                    // You can add logic here to open create challenge modal
                    console.log("Create challenge clicked");
                  }}
                >
                  Create Your First Challenge
                </button>
              )}
            </div>
          ) : (
            renderGroup()
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default BodyComponent;