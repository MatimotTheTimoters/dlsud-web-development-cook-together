import React, { useState, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../contexts/DataContext";
import Searchbar from "./ui/Searchbar";
import RecipeCard from "./cards/RecipeCard";
import ChallengeCard from "./cards/ChallengeCard";
import UserCard from "./cards/UserCard";
import noRecordsImage from "../assets/icons/no-records-icon.png";

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

  const renderCard = (item) => {
    switch (activeFilter) {
      case "recipes":
      case "user-recipes":
        return (
          <Col key={item.recipeId} xs={12} sm={6} lg={4} className="mb-4">
            <RecipeCard recipe={item} />
          </Col>
        );
      case "challenges":
      case "user-challenges":
        return (
          <Col key={item.challengeId} xs={12} sm={6} lg={4} className="mb-4">
            <ChallengeCard challenge={item} />
          </Col>
        );
      case "users":
        return (
          <Col key={item.id} xs={12} sm={6} lg={4} className="mb-4">
            <UserCard user={item} />
          </Col>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid className="body-component py-4">
      <Row className="justify-content-center">
        {/* Searchbar - Full width on top */}
        <Col xs={12} lg={10} xl={8} className="mb-4">
          <div className="sticky-top" style={{ top: "80px", zIndex: 100 }}>
            <Searchbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </Col>

        {/* Content Area */}
        <Col xs={12} lg={10} xl={8}>
          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-ct-ink mb-0">
              {currentPage === "feed"
                ? "Your Feed"
                : currentPage === "my-kitchen"
                ? "My Kitchen"
                : "Discover"}
            </h4>
            {!loading && filteredData.length > 0 && (
              <span className="text-muted small">
                {filteredData.length} {activeFilter}
                {filteredData.length !== 1 ? "s" : ""} found
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            )}
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-ct-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-ct-muted">Loading content...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-5">
              <img
                src={noRecordsImage}
                alt="No records found"
                className="mb-3"
                style={{ width: "150px", height: "150px" }}
              />
              <h5 className="text-ct-muted">
                {searchQuery
                  ? `No ${activeFilter} found for "${searchQuery}"`
                  : `No ${activeFilter} available`}
              </h5>
              <p className="text-muted">
                {searchQuery
                  ? "Try adjusting your search terms or browse different categories."
                  : currentPage === "feed"
                  ? "Follow more users to see their content in your feed."
                  : "Check back later for new content."}
              </p>
            </div>
          ) : (
            <Row>
              {filteredData.map(renderCard)}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default BodyComponent;