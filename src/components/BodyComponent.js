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
            <div className="text-center py-5">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-5">No results found</div>
          ) : (
            renderGroup()
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default BodyComponent;
