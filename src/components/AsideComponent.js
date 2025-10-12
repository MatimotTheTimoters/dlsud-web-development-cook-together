import React, { useState } from "react";
import { Nav, Modal, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/aside.css";

// Default navigation items for main app
const defaultItems = [
  { key: "feed", label: "Feed", to: "/feed", badge: null, icon: "📱" },
  { key: "discover", label: "Discover", to: "/discover", badge: null, icon: "🔍" },
  { key: "my-kitchen", label: "My Kitchen", to: "/my-kitchen", badge: null, icon: "👨‍🍳" },
  { key: "test-pages", label: "Test Pages", to: "/TestPages", badge: null, icon: "🧪" },
];

// Settings navigation items
const settingsItems = [
  { key: "profile", label: "Profile", to: "/profile", badge: null, icon: "👤" },
  { key: "account", label: "Account", to: "/settings", badge: null, icon: "⚙️" },
  { key: "logout", label: "Logout", to: "/", badge: null, icon: "🚪" },
];

function AsideComponent({
  items, // Allow overriding items via props
  activeKey,
  className = ""
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentPath = activeKey || location.pathname;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Determine which navigation items to show based on current path
  const getNavigationItems = () => {
    // If custom items are provided via props, use them
    if (items) return items;

    // Show settings navigation when in settings section
    if (currentPath.startsWith('/settings')) {
      return settingsItems;
    }

    // Default navigation for all other pages
    return defaultItems;
  };

  const navigationItems = getNavigationItems();

  // Handle special actions like logout
  const handleItemClick = (item) => {
    if (item.key === 'logout') {
      // Show confirmation modal for logout
      setShowLogoutModal(true);
    }
  };

  const handleLogoutConfirm = () => {
    logout(); // Perform logout
    setShowLogoutModal(false);
    navigate('/'); // Navigate to landing page
  };

  return (
    <>
      <Container fluid className="p-0">
        <Row>
          <Col>
            <aside className={`app-sidebar aside-card ${className}`}>
              <Nav className="flex-column aside-nav" as="nav" aria-label="aside navigation">
                {navigationItems.map((item) => {
                  const isActive = currentPath === item.to || currentPath.startsWith(`${item.to}/`);

                  return (
                    <Nav.Item key={item.key} className="mb-2">
                      <Nav.Link
                        as={item.key === 'logout' ? 'button' : Link}
                        to={item.key === 'logout' ? undefined : item.to}
                        onClick={() => handleItemClick(item)}
                        className={`aside-nav-link d-flex align-items-center ${
                          isActive ? "aside-item--active" : "text-ct-muted"
                        } ${item.key === 'logout' ? 'logout-item' : ''}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.icon && (
                          <span className="aside-item-icon me-3" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        <span className="aside-item-label flex-grow-1">
                          {item.label}
                        </span>
                        {item.badge && (
                          <small className="badge-ct badge-pill">
                            {item.badge}
                          </small>
                        )}
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </aside>
          </Col>
        </Row>
      </Container>

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
        animation
        className="modal-ct"
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="text-ct-ink fs-5">
            Confirm Logout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3 text-ct-muted">
          Are you sure you want to log out?
        </Modal.Body>
        <Modal.Footer className="border-top-0 pt-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowLogoutModal(false)}
            className="flex-grow-1"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleLogoutConfirm}
            className="flex-grow-1"
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AsideComponent;