import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
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

  const handleOffcanvasToggle = () => setShowOffcanvas(!showOffcanvas);

  // If no user is logged in, show a minimal navbar
  if (!user || !user.id) {
    return (
      <Navbar expand="lg" className="navbar-ct" bg="light" variant="light">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="navbar-logo-group">
            <img src={logo} alt="Cook Together" className="navbar-logo-img" />
            <span className="navbar-logo-text">Cook Together</span>
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/registration">Register</Nav.Link>
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

  // Truncate long usernames
  const displayName = fullName.length > 15 ? `${fullName.substring(0, 15)}...` : fullName;

  return (
    <Navbar expand="lg" className="navbar-ct" bg="light" variant="light">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="navbar-logo-group">
          <img src={logo} alt="Cook Together" className="navbar-logo-img" />
          <span className="navbar-logo-text">Cook Together</span>
        </Navbar.Brand>

        {/* Burger Menu Toggle */}
        <Navbar.Toggle
          aria-controls="navbar-offcanvas"
          className="navbar-burger-toggle"
          onClick={handleOffcanvasToggle}
        />

        {/* Offcanvas Menu for Small Screens */}
        <Offcanvas
          id="navbar-offcanvas"
          show={showOffcanvas}
          onHide={handleOffcanvasToggle}
          placement="end"
          className="navbar-offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* Shop and Inventory Buttons */}
            <div className="navbar-button-group">
              <Button
                as={Link}
                to="/inventory"
                size="sm"
                className="btn-ct-primary navbar-action-button"
              >
                INVENTORY
              </Button>
              <Button
                as={Link}
                to="/shop"
                size="sm"
                className="btn-ct-primary navbar-action-button"
              >
                SHOP
              </Button>
            </div>

            {/* Gold and Gem Currencies */}
            <div className="navbar-currency-group">
              <div className="navbar-currency-item">
                <img src={goldIcon} alt="Gold" className="navbar-currency-img" />
                <span className="navbar-currency-text">{goldCount} Gold</span>
              </div>
              <div className="navbar-currency-item">
                <img src={gemIcon} alt="Gems" className="navbar-currency-img" />
                <span className="navbar-currency-text">{gemCount} Gems</span>
              </div>
            </div>

            {/* Level Progress */}
            <div className="navbar-level-group">
              <div className="navbar-level-bar">
                <div className="navbar-level-info">
                  <span className="navbar-level-label">Lv.{level}</span>
                  <span className="navbar-level-stats">
                    {currentEXP}/{currentLevelCeiling} EXP
                  </span>
                </div>
                <div className="navbar-level-bar-container">
                  <div
                    className="navbar-level-bar-progress"
                    style={{ width: `${expProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Profile Group */}
            <div className="navbar-profile-group">
              <Button
                as={Link}
                to="/profile"
                variant="light"
                aria-label="profile"
                className="navbar-profile-button"
              >
                <img src={profileIcon} alt="Profile" className="navbar-profile-img" />
                <span className="navbar-username">{displayName}</span>
              </Button>
            </div>

            {/* Navigation Icons Group */}
            <div className="navbar-nav-group">
              <Button
                as={Link}
                to="/people"
                variant="light"
                aria-label="users"
                className="navbar-nav-button"
                title="Find Users"
              >
                <img src={usersIcon} alt="Users" className="navbar-nav-img" />
              </Button>
              <Button
                as={Link}
                to="/settings"
                variant="light"
                aria-label="settings"
                className="navbar-nav-button"
                title="Settings"
              >
                <img src={settingsIcon} alt="Settings" className="navbar-nav-img" />
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Desktop View */}
        <Navbar.Collapse id="navbar-content">
          {/* Shop and Inventory Buttons */}
          <div className="navbar-button-group">
            <Button
              as={Link}
              to="/inventory"
              size="sm"
              className="btn-ct-primary navbar-action-button"
            >
              INVENTORY
            </Button>
            <Button
              as={Link}
              to="/shop"
              size="sm"
              className="btn-ct-primary navbar-action-button"
            >
              SHOP
            </Button>
          </div>

          {/* Gold and Gem Currencies */}
          <div className="navbar-currency-group">
            <div className="navbar-currency-item">
              <img src={goldIcon} alt="Gold" className="navbar-currency-img" />
              <span className="navbar-currency-text">{goldCount} Gold</span>
            </div>
            <div className="navbar-currency-item">
              <img src={gemIcon} alt="Gems" className="navbar-currency-img" />
              <span className="navbar-currency-text">{gemCount} Gems</span>
            </div>
          </div>

          {/* Level Progress */}
          <div className="navbar-level-group">
            <div className="navbar-level-bar">
              <div className="navbar-level-info">
                <span className="navbar-level-label">Lv.{level}</span>
                <span className="navbar-level-stats">
                  {currentEXP}/{currentLevelCeiling} EXP
                </span>
              </div>
              <div className="navbar-level-bar-container">
                <div
                  className="navbar-level-bar-progress"
                  style={{ width: `${expProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Profile Group */}
          <div className="navbar-profile-group">
            <Button
              as={Link}
              to="/profile"
              variant="light"
              aria-label="profile"
              className="navbar-profile-button"
            >
              <img src={profileIcon} alt="Profile" className="navbar-profile-img" />
              <span className="navbar-username">{displayName}</span>
            </Button>
          </div>

          {/* Navigation Icons Group */}
          <div className="navbar-nav-group">
            <Button
              as={Link}
              to="/people"
              variant="light"
              aria-label="users"
              className="navbar-nav-button"
              title="Find Users"
            >
              <img src={usersIcon} alt="Users" className="navbar-nav-img" />
            </Button>
            <Button
              as={Link}
              to="/settings"
              variant="light"
              aria-label="settings"
              className="navbar-nav-button"
              title="Settings"
            >
              <img src={settingsIcon} alt="Settings" className="navbar-nav-img" />
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;