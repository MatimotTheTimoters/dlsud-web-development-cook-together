import React, { useState, useMemo } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSheetData } from "../hooks/useSheetData";
import SearchFilter from "./SearchFilter";
import RecipeCard from "./cards/RecipeCard";
import ChallengeCard from "./cards/ChallengeCard";
import UserCard from "./cards/UserCard";
import CookbookCard from "./cards/CookbookCard";

function BodyComponent() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("recipes");
  const [debouncedQuery, setDebouncedQuery] = useState("");

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

  // Get query parameters based on current page
  const getQueryParams = useMemo(() => {
    switch (currentPage) {
      case "my-kitchen":
        if (activeFilter === "challenges") {
          return user ? { participantId: user.id } : {};
        }
        return user ? { createdBy: user.id } : {};
      case "feed":
        return user ? { followerId: user.id } : {};
      case "discover":
      default:
        return {};
    }
  }, [currentPage, activeFilter, user]);

  // Get sheet name based on active filter
  const getSheetName = () => {
    const sheetMap = {
      recipes: "recipes",
      challenges: currentPage === "my-kitchen" ? "challengesCookQuotaParticipants" : "challengesCookQuota",
      users: "users",
      cookbooks: "cookbooks",
    };
    return sheetMap[activeFilter] || "recipes";
  };

  // Fetch main data
  const { data: mainData, loading: mainLoading, error: mainError } = useSheetData(
    getSheetName(),
    getQueryParams,
    !!user || currentPage === "discover"
  );

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!mainData) return [];

    let data = [...mainData];

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
  }, [mainData, debouncedQuery, activeFilter]);

  // Render cards
  const renderCards = () => {
    if (mainLoading) {
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

    if (mainError) {
      return (
        <div className="text-center py-5">
          <h5 className="text-ct-muted">Error loading data</h5>
          <p className="text-muted">Please try again later</p>
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
              : "Check back later for new content"}
          </p>
        </div>
      );
    }

    return (
      <Row>
        {filteredData
          .filter((item) => activeFilter !== "users" || item.id !== user?.id) // Don't show current user in user list
          .map((item) => (
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
            {!mainLoading && (
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