import React, { useState, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../contexts/DataContext";
import Searchbar from "./ui/Searchbar";
import RecipeCard from "./cards/RecipeCard";
import ChallengeCard from "./cards/ChallengeCard";
import UserCard from "./cards/UserCard";
import CookbookCard from "./cards/CookbookCard";

function BodyComponent() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("recipes"); // Default filter

  // Data from context
  const { getFeedData, getAllRecipes, getAllChallenges, getAllUsers, getUserRecipes, getUserChallenges } = useData();

  // Determine current page
  const currentPage = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/feed")) return "feed";
    if (path.includes("/my-kitchen")) return "my-kitchen";
    return "discover";
  }, [location.pathname]);

  // Filter data based on current page and filter
  const filteredData = useMemo(() => {
    let baseData = [];
    switch (currentPage) {
      case "feed":
        baseData = getFeedData[activeFilter] || [];
        break;
      case "my-kitchen":
        baseData =
          activeFilter === "user-recipes"
            ? getUserRecipes
            : activeFilter === "user-challenges"
            ? getUserChallenges
            : [];
        break;
      case "discover":
      default:
        baseData =
          activeFilter === "recipes"
            ? getAllRecipes
            : activeFilter === "challenges"
            ? getAllChallenges
            : activeFilter === "users"
            ? getAllUsers
            : [];
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      return baseData.filter((item) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return baseData;
  }, [currentPage, activeFilter, searchQuery, getFeedData, getAllRecipes, getAllChallenges, getAllUsers, getUserRecipes, getUserChallenges]);

  // Render appropriate card based on filter
  const renderCard = (item) => {
    switch (activeFilter) {
      case "recipes":
      case "user-recipes":
        return <RecipeCard key={item.id} recipe={item} />;
      case "challenges":
      case "user-challenges":
        return <ChallengeCard key={item.id} challenge={item} />;
      case "users":
        return <UserCard key={item.id} user={item} />;
      default:
        return null;
    }
  };

  return (
    <Container fluid className="body-component py-4">
      <Row>
        {/* Search Sidebar */}
        <Col lg={3} className="mb-4">
          <div className="sticky-top" style={{ top: "100px" }}>
            <Searchbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-ct-ink mb-0">
              {currentPage === "feed"
                ? "Your Feed"
                : currentPage === "my-kitchen"
                ? "My Kitchen"
                : "Discover"}
            </h4>
            <span className="text-muted">
              {filteredData.length} {activeFilter}
              {filteredData.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* Content Grid */}
          <Row>
            {filteredData.map((item) => renderCard(item))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default BodyComponent;