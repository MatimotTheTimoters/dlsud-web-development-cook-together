import React, { useState, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../contexts/DataContext";
import Searchbar from "./ui/Searchbar";
import RecipeCard from "./cards/RecipeCard";
import ChallengeCard from "./cards/ChallengeCard";
import UserCard from "./cards/UserCard";

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
        return <RecipeCard key={item.recipeId} recipe={item} />;
      case "challenges":
      case "user-challenges":
        return <ChallengeCard key={item.challengeId} challenge={item} />;
      case "users":
        return <UserCard key={item.id} user={item} />;
      default:
        return null;
    }
  };

  return (
    <Container fluid className="body-component py-4">
      <Row>
        <Col lg={3}>
          <Searchbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </Col>
        <Col lg={9}>
          {loading ? (
            <div>Loading...</div>
          ) : filteredData.length === 0 ? (
            <div>No results found</div>
          ) : (
            <Row>{filteredData.map(renderCard)}</Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default BodyComponent;