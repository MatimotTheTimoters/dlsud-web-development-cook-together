import React, { useState, useEffect } from "react";
import { 
  Navbar, 
  Nav, 
  Container, 
  Button, 
  Offcanvas,
  Stack,
  Badge,
  ProgressBar
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import logo from "../assets/icons/logo.png";
import goldIcon from "../assets/icons/gold-icon.png";
import gemIcon from "../assets/icons/gem-icon.png";
import profileIcon from "../assets/icons/profile-icon.png";
import usersIcon from "../assets/icons/users-icon.png";
import settingsIcon from "../assets/icons/settings-icon.png";

function NavbarComponent() {
  const { user } = useAuth();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleOffcanvasToggle = () => setShowOffcanvas(!showOffcanvas);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If no user is logged in, show a minimal navbar
  if (!user || !user.id) {
    return (
      <Navbar 
        expand="lg" 
        className={`navbar-ct ${isScrolled ? 'navbar-scrolled' : ''}`} 
        fixed="top"
      >
        <Container fluid>
          <Navbar.Brand 
            as={Link} 
            to="/" 
            className="d-flex align-items-center text-decoration-none"
          >
            <img 
              src={logo} 
              alt="Cook Together" 
              className="me-2"
              style={{ width: "32px", height: "32px" }}
            />
            <span className="navbar-brand-ink fw-bold fs-5">Cook Together</span>
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/login" 
              className="text-ct-muted fw-medium nav-link-hover"
            >
              Login
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/registration" 
              className="text-ct-muted fw-medium nav-link-hover"
            >
              Register
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
  }

  const {
    goldCount = 0,
    gemCount = 0,
    level = 1,
    currentEXP = 0,
    currentLevelCeiling = 100,
    fullName = "User"
  } = user;

  const expProgress = Math.min((currentEXP / currentLevelCeiling) * 100, 100);
  const displayName = fullName.length > 12 ? `${fullName.substring(0, 12)}...` : fullName;

  return (
    <>
      <Navbar 
        expand="lg" 
        className={`navbar-ct ${isScrolled ? 'navbar-scrolled' : ''}`}
        fixed="top"
      >
        <Container fluid>
          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to="/feed"
            className="d-flex align-items-center text-decoration-none navbar-brand-hover"
          >
            <img 
              src={logo} 
              alt="Cook Together" 
              className="me-2"
              style={{ width: "32px", height: "32px" }}
            />
            <span className="navbar-brand-ink fw-bold fs-5 d-none d-sm-block">
              Cook Together
            </span>
          </Navbar.Brand>

          {/* Desktop Navigation - Only visible on lg screens and up */}
          <Navbar.Collapse id="navbar-desktop-content" className="d-none d-lg-flex justify-content-end">
            <Stack direction="horizontal" gap={3} className="align-items-center">
              {/* Shop and Inventory Buttons */}
              <Stack direction="horizontal" gap={2}>
                <Button
                  as={Link}
                  to="/inventory"
                  size="sm"
                  variant="outline-primary"
                  className="btn-ct-outline fw-medium"
                >
                  📦 INVENTORY
                </Button>
                <Button
                  as={Link}
                  to="/shop"
                  size="sm"
                  className="btn-ct-primary fw-medium"
                >
                  🛍️ SHOP
                </Button>
              </Stack>

              {/* Currency Display */}
              <Stack direction="horizontal" gap={2}>
                <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1 px-2 py-1 currency-badge">
                  <img src={goldIcon} alt="Gold" style={{ width: "16px", height: "16px" }} />
                  {goldCount}
                </Badge>
                <Badge bg="success" className="d-flex align-items-center gap-1 px-2 py-1 currency-badge">
                  <img src={gemIcon} alt="Gems" style={{ width: "16px", height: "16px" }} />
                  {gemCount}
                </Badge>
              </Stack>

              {/* Level Progress */}
              <div className="d-flex flex-column" style={{ minWidth: "120px" }}>
                <div className="d-flex justify-content-between small text-ct-muted mb-1">
                  <span>Lv.{level}</span>
                  <span>{currentEXP}/{currentLevelCeiling}</span>
                </div>
                <ProgressBar 
                  now={expProgress} 
                  className="navbar-progress"
                  style={{ height: "6px" }}
                />
              </div>

              {/* Navigation Icons */}
              <Stack direction="horizontal" gap={2}>
                <Button
                  as={Link}
                  to="/users"
                  variant="light"
                  size="sm"
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center nav-icon-button"
                  style={{ width: "40px", height: "40px" }}
                  title="Find Users"
                >
                  <img src={usersIcon} alt="Users" style={{ width: "20px", height: "20px" }} />
                </Button>
                
                <Button
                  as={Link}
                  to="/profile"
                  variant="light"
                  size="sm"
                  className="rounded-pill px-3 py-2 d-flex align-items-center gap-2 nav-profile-button"
                  title="Profile"
                >
                  <img 
                    src={profileIcon} 
                    alt="Profile" 
                    className="rounded-circle"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <span className="text-ct-ink fw-medium">
                    {displayName}
                  </span>
                </Button>

                <Button
                  as={Link}
                  to="/settings"
                  variant="light"
                  size="sm"
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center nav-icon-button"
                  style={{ width: "40px", height: "40px" }}
                  title="Settings"
                >
                  <img src={settingsIcon} alt="Settings" style={{ width: "20px", height: "20px" }} />
                </Button>
              </Stack>
            </Stack>
          </Navbar.Collapse>

          {/* Mobile Toggle - Only visible on screens smaller than lg */}
          <Navbar.Toggle 
            aria-controls="navbar-offcanvas"
            className="border-0 d-lg-none navbar-toggle-button"
            onClick={handleOffcanvasToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas - Only for mobile screens */}
      <Offcanvas
        show={showOffcanvas}
        onHide={handleOffcanvasToggle}
        placement="end"
        className="navbar-offcanvas d-lg-none"
      >
        <Offcanvas.Header closeButton className="border-bottom-ct">
          <Offcanvas.Title className="text-ct-ink fw-bold">
            Menu
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body>
          <Stack gap={4}>
            {/* User Profile */}
            <div className="text-center">
              <img 
                src={profileIcon} 
                alt="Profile" 
                className="rounded-circle mb-3 profile-image-mobile"
                style={{ width: "80px", height: "80px" }}
              />
              <h5 className="text-ct-ink fw-bold mb-1">{fullName}</h5>
              <div className="text-ct-muted">Level {level}</div>
            </div>

            {/* Action Buttons */}
            <Stack gap={2}>
              <Button
                as={Link}
                to="/inventory"
                variant="outline-primary"
                className="btn-ct-outline fw-medium py-2 mobile-nav-button"
                onClick={() => setShowOffcanvas(false)}
              >
                📦 INVENTORY
              </Button>
              <Button
                as={Link}
                to="/shop"
                className="btn-ct-primary fw-medium py-2 mobile-nav-button"
                onClick={() => setShowOffcanvas(false)}
              >
                🛍️ SHOP
              </Button>
            </Stack>

            {/* Currency */}
            <div className="bg-ct-surface rounded p-3 currency-section-mobile">
              <h6 className="text-ct-muted mb-3">Currency</h6>
              <Stack direction="horizontal" gap={3} className="justify-content-around">
                <div className="text-center currency-item-mobile">
                  <img src={goldIcon} alt="Gold" style={{ width: "32px", height: "32px" }} />
                  <div className="fw-bold text-ct-ink mt-1">{goldCount}</div>
                  <small className="text-ct-muted">Gold</small>
                </div>
                <div className="text-center currency-item-mobile">
                  <img src={gemIcon} alt="Gems" style={{ width: "32px", height: "32px" }} />
                  <div className="fw-bold text-ct-ink mt-1">{gemCount}</div>
                  <small className="text-ct-muted">Gems</small>
                </div>
              </Stack>
            </div>

            {/* Level Progress */}
            <div className="bg-ct-surface rounded p-3 level-section-mobile">
              <div className="d-flex justify-content-between text-ct-muted small mb-2">
                <span>Level Progress</span>
                <span>{currentEXP}/{currentLevelCeiling} EXP</span>
              </div>
              <ProgressBar 
                now={expProgress} 
                className="navbar-progress-mobile"
                style={{ height: "8px" }}
              />
              <div className="text-center mt-2">
                <Badge bg="ct-primary" className="px-2 py-1">
                  Level {level}
                </Badge>
              </div>
            </div>

            {/* Navigation Links */}
            <Stack gap={2}>
              <Button
                as={Link}
                to="/users"
                variant="light"
                className="d-flex align-items-center gap-3 py-2 text-start mobile-nav-link"
                onClick={() => setShowOffcanvas(false)}
              >
                <img src={usersIcon} alt="Users" style={{ width: "24px", height: "24px" }} />
                <span className="flex-grow-1">Find Users</span>
              </Button>
              <Button
                as={Link}
                to="/profile"
                variant="light"
                className="d-flex align-items-center gap-3 py-2 text-start mobile-nav-link"
                onClick={() => setShowOffcanvas(false)}
              >
                <img 
                  src={profileIcon} 
                  alt="Profile" 
                  className="rounded-circle"
                  style={{ width: "24px", height: "24px" }}
                />
                <span className="flex-grow-1">My Profile</span>
              </Button>
              <Button
                as={Link}
                to="/settings"
                variant="light"
                className="d-flex align-items-center gap-3 py-2 text-start mobile-nav-link"
                onClick={() => setShowOffcanvas(false)}
              >
                <img src={settingsIcon} alt="Settings" style={{ width: "24px", height: "24px" }} />
                <span className="flex-grow-1">Settings</span>
              </Button>
            </Stack>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavbarComponent;