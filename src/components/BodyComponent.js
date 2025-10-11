// src/components/BodyComponent.js
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSheetData } from '../hooks/useSheetData';
import SearchFilter from './SearchFilter';
import '../styles/colors.css';

// Temporary simple card until we fix the card components
const TempCard = ({ item, type }) => {
  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={item.coverImage || '/assets/images/placeholder.svg'} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{item.title || item.fullName || 'Untitled'}</Card.Title>
        <Card.Text>
          {item.description || 'No description available'}
        </Card.Text>
        <Button variant="primary" size="sm">
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

function BodyComponent() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('recipes');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Determine current page from URL
  const currentPage = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/feed')) return 'feed';
    if (path.includes('/discover')) return 'discover';
    if (path.includes('/my-kitchen')) return 'my-kitchen';
    return 'discover';
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
      case 'my-kitchen':
        return user ? { createdBy: user.id } : {};
      case 'feed':
      case 'discover':
      default:
        return {};
    }
  }, [currentPage, user]);

  // Get sheet name based on active filter
  const getSheetName = () => {
    const sheetMap = {
      recipes: 'recipes',
      challenges: 'challengesCookQuota',
      users: 'users',
      cookbooks: 'cookbooks'
    };
    return sheetMap[activeFilter] || 'recipes';
  };

  // Fetch main data
  const { data: mainData, loading: mainLoading, error: mainError } = useSheetData(
    getSheetName(),
    getQueryParams,
    !!user || currentPage === 'discover'
  );

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!mainData) return [];

    let data = [...mainData];

    // Apply search filter
    if (debouncedQuery) {
      data = data.filter(item => {
        const searchFields = [];
        switch (activeFilter) {
          case 'recipes':
            searchFields.push(item.title, item.description, item.tags, item.origin);
            break;
          case 'challenges':
            searchFields.push(item.title, item.description, item.tags);
            break;
          case 'users':
            searchFields.push(item.fullName, item.email);
            break;
          case 'cookbooks':
            searchFields.push(item.title, item.description);
            break;
          default:
            searchFields.push(item.title, item.description);
        }
        
        return searchFields.some(field => 
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
          {[1, 2, 3].map(i => (
            <Col key={i} md={6} lg={4} className="mb-4">
              <Card className="skeleton-card" style={{ height: '300px' }}>
                <div className="skeleton-image"></div>
                <Card.Body>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </Card.Body>
              </Card>
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
            {debouncedQuery ? 'No results found' : `No ${activeFilter} found`}
          </h5>
          <p className="text-muted">
            {debouncedQuery 
              ? `Try adjusting your search for "${debouncedQuery}"`
              : 'Check back later for new content'
            }
          </p>
        </div>
      );
    }

    return (
      <Row>
        {filteredData
          .filter(item => activeFilter !== 'users' || item.id !== user?.id) // Don't show current user in user list
          .map(item => (
          <Col key={item.id} md={6} lg={4} className="mb-4">
            <TempCard item={item} type={activeFilter} />
          </Col>
        ))}
      </Row>
    );
  };

  // Get page title
  const getPageTitle = () => {
    const baseTitle = {
      feed: 'Your Feed',
      discover: 'Discover',
      'my-kitchen': 'My Kitchen'
    }[currentPage] || 'Discover';

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
          <div className="sticky-top" style={{ top: '100px' }}>
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
                {filteredData.length} {activeFilter}{filteredData.length !== 1 ? 's' : ''} found
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