import React, { useState, useMemo } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../contexts/DataContext";
import SearchFilter from "./SearchFilter";
import RecipeCard from "./cards/RecipeCard";
import ChallengeCard from "./cards/ChallengeCard";
import UserCard from "./cards/UserCard";
import CookbookCard from "./cards/CookbookCard";

function BodyComponent() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("recipes");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { 
    recipes, 
    challenges, 
    users, 
    loading, 
    userRecipes,
    getUserById 
  } = useData();

  // Determine current page from URL
  const currentPage = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/feed")) return "feed";
    if (path.includes("/discover")) return "discover";
    if (path.includes("/my-kitchen")) return "my-kitchen";
    return "discover";
  }, [location.pathname]);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get appropriate data based on current page and filter
  const getDataForContext = () => {
    if (!isAuthenticated && currentPage !== "discover") {
      return [];
    }

    switch (currentPage) {
      case "feed":
        // For feed, show content from friends (simplified for now)
        // In a real app, you'd filter by friendships data
        switch (activeFilter) {
          case "recipes":
            return recipes || [];
          case "challenges":
            return challenges || [];
          case "users":
            return (users || []).filter(u => u.id !== user?.id);
          default:
            return [];
        }

      case "my-kitchen":
        // Show user's own content
        switch (activeFilter) {
          case "recipes":
            return userRecipes || [];
          case "challenges":
            // Filter challenges where user is participant (simplified)
            return (challenges || []).filter(challenge => 
              challenge.author === user?.id || 
              challenge.participants?.includes(user?.id)
            );
          case "users":
            return []; // Don't show users in "my kitchen"
          default:
            return [];
        }

      case "discover":
      default:
        // Show all public content
        switch (activeFilter) {
          case "recipes":
            return recipes || [];
          case "challenges":
            return challenges || [];
          case "users":
            return (users || []).filter(u => u.id !== user?.id);
          case "cookbooks":
            return []; // Placeholder for cookbooks
          default:
            return [];
        }
    }
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    const contextData = getDataForContext();
    if (!contextData || contextData.length === 0) return [];

    let data = [...contextData];

    // Apply search filter
    if (debouncedQuery) {
      data = data.filter((item) => {
        const searchFields = [];
        switch (activeFilter) {
          case "recipes":
            searchFields.push(item.title, item.description, item.tags, item.origin);
            break;
          case "challenges":
            searchFields.push(item.title, item.description, item.tags);
            break;
          case "users":
            searchFields.push(item.fullName, item.email);
            break;
          case "cookbooks":
            searchFields.push(item.title, item.description);
            break;
          default:
            searchFields.push(item.title, item.description);
        }

        return searchFields.some(
          (field) =>
            field && String(field).toLowerCase().includes(debouncedQuery.toLowerCase())
        );
      });
    }

    return data;
  }, [getDataForContext, debouncedQuery, activeFilter]);

  // Render cards
  const renderCards = () => {
    if (loading) {
      return (
        <Row>
          {[1, 2, 3].map((i) => (
            <Col key={i} md={6} lg={4} className="mb-4">
              <div className="skeleton-card" style={{ height: "300px" }}>
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            </Col>
          ))}
        </Row>
      );
    }

    if (!isAuthenticated && currentPage !== "discover") {
      return (
        <div className="text-center py-5">
          <h5 className="text-ct-muted">Please log in to view this content</h5>
          <p className="text-muted">This page requires authentication</p>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-5">
          <h5 className="text-ct-muted">
            {debouncedQuery
              ? "No results found"
              : `No ${activeFilter === "recipes" ? "recipes" : activeFilter} found`}
          </h5>
          <p className="text-muted">
            {debouncedQuery
              ? `Try adjusting your search for "${debouncedQuery}"`
              : currentPage === "my-kitchen" 
                ? "Create some content to get started!" 
                : "Check back later for new content"}
          </p>
        </div>
      );
    }

    return (
      <Row>
        {filteredData.map((item) => (
          <Col key={item.id} md={6} lg={4} className="mb-4">
            {activeFilter === "recipes" && <RecipeCard recipe={item} />}
            {activeFilter === "challenges" && <ChallengeCard challenge={item} />}
            {activeFilter === "users" && <UserCard user={item} />}
            {activeFilter === "cookbooks" && <CookbookCard cookbook={item} />}
          </Col>
        ))}
      </Row>
    );
  };

  // Get page title
  const getPageTitle = () => {
    const baseTitle = {
      feed: "Your Feed",
      discover: "Discover",
      "my-kitchen": "My Kitchen",
    }[currentPage] || "Discover";

    if (debouncedQuery) {
      return `Search: "${debouncedQuery}"`;
    }

    return baseTitle;
  };

  return (
    <Container fluid className="body-component py-4">
      <Row>
        {/* Search and Filter Sidebar */}
        <Col lg={3} className="mb-4">
          <div className="sticky-top" style={{ top: "100px" }}>
            {/* Search Bar */}
            <div className="mb-4">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder={`Search ${activeFilter}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <InputGroup.Text>🔍</InputGroup.Text>
              </InputGroup>
            </div>

            {/* Filter Buttons */}
            <SearchFilter
              currentPage={currentPage}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-ct-ink mb-0">{getPageTitle()}</h4>
            {!loading && (
              <span className="text-muted">
                {filteredData.length} {activeFilter}
                {filteredData.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>

          {renderCards()}
        </Col>
      </Row>
    </Container>
  );
}

export default BodyComponent;