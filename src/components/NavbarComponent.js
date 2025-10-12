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
  const displayName = fullName.length > 15 ? `${fullName.substring(0, 15)}...` : fullName;

  // Navbar content for logged-in users
  const renderNavbarContent = () => (
    <>
      {/* Shop and Inventory Buttons - Visible on desktop */}
      <div className="navbar-button-group d-none d-lg-flex">
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

      {/* Gold and Gem Currencies - Visible on desktop */}
      <div className="navbar-currency-group d-none d-lg-flex">
        <div className="navbar-currency-item">
          <img src={goldIcon} alt="Gold" className="navbar-currency-img" />
          <span className="navbar-currency-text">{goldCount} Gold</span>
        </div>
        <div className="navbar-currency-item">
          <img src={gemIcon} alt="Gems" className="navbar-currency-img" />
          <span className="navbar-currency-text">{gemCount} Gems</span>
        </div>
      </div>

      {/* Level Progress - Visible on desktop */}
      <div className="navbar-level-group d-none d-lg-flex">
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

      {/* Profile and Navigation Icons - Visible on desktop */}
      <div className="navbar-nav-group d-none d-lg-flex">
        <Button
          as={Link}
          to="/users"
          variant="light"
          aria-label="users"
          className="navbar-nav-button"
          title="Find Users"
        >
          <img src={usersIcon} alt="Users" className="navbar-nav-img" />
        </Button>
        <Button
          as={Link}
          to="/profile"
          variant="light"
          aria-label="profile"
          className="navbar-nav-button"
          title="Profile"
        >
          <img src={profileIcon} alt="Profile" className="navbar-nav-img" />
          <span className="navbar-username ms-1">{displayName}</span>
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
    </>
  );

  return (
    <Navbar expand="lg" className="navbar-ct" bg="light" variant="light">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/feed"
          className="navbar-logo-group"
        >
          <img src={logo} alt="Cook Together" className="navbar-logo-img" />
          <span className="navbar-logo-text">Cook Together</span>
        </Navbar.Brand>

        {/* Desktop Navbar Content */}
        <Navbar.Collapse id="navbar-desktop-content">
          {renderNavbarContent()}
        </Navbar.Collapse>

        {/* Burger Menu Toggle for mobile */}
        <Navbar.Toggle
          aria-controls="navbar-offcanvas"
          className="navbar-burger-toggle d-lg-none"
          onClick={handleOffcanvasToggle}
        />

        {/* Offcanvas Menu for Mobile */}
        <Offcanvas
          id="navbar-offcanvas"
          show={showOffcanvas}
          onHide={handleOffcanvasToggle}
          placement="end"
          className="navbar-offcanvas d-lg-none"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* Mobile version of the navbar content */}
            <div className="navbar-button-group">
              <Button
                as={Link}
                to="/inventory"
                size="sm"
                className="btn-ct-primary navbar-action-button"
                onClick={() => setShowOffcanvas(false)}
              >
                INVENTORY
              </Button>
              <Button
                as={Link}
                to="/shop"
                size="sm"
                className="btn-ct-primary navbar-action-button"
                onClick={() => setShowOffcanvas(false)}
              >
                SHOP
              </Button>
            </div>

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

            <div className="navbar-profile-group">
              <Button
                as={Link}
                to="/profile"
                variant="light"
                aria-label="profile"
                className="navbar-profile-button"
                onClick={() => setShowOffcanvas(false)}
              >
                <img src={profileIcon} alt="Profile" className="navbar-profile-img" />
                <span className="navbar-username">{displayName}</span>
              </Button>
            </div>

            <div className="navbar-nav-group">
              <Button
                as={Link}
                to="/users"
                variant="light"
                aria-label="users"
                className="navbar-nav-button"
                title="Find Users"
                onClick={() => setShowOffcanvas(false)}
              >
                <img src={usersIcon} alt="Users" className="navbar-nav-img" />
                <span className="ms-2">Find Users</span>
              </Button>
              <Button
                as={Link}
                to="/settings"
                variant="light"
                aria-label="settings"
                className="navbar-nav-button"
                title="Settings"
                onClick={() => setShowOffcanvas(false)}
              >
                <img src={settingsIcon} alt="Settings" className="navbar-nav-img" />
                <span className="ms-2">Settings</span>
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;