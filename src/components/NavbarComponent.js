import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import apiLinks from "../constants/api.js";
import logo from "../assets/icons/logo.png";
import goldIcon from "../assets/icons/gold-icon.png";
import gemIcon from "../assets/icons/gem-icon.png";
import profileIcon from "../assets/icons/profile-icon.png";
import usersIcon from "../assets/icons/users-icon.png";
import settingsIcon from "../assets/icons/settings-icon.png";

function NavbarComponent() {
  const { user } = useAuth();

  // If no user is logged in, show a minimal navbar
  if (!user || !user.id) {
    return (
      <Navbar expand="lg" className="navbar-ct" bg="light" variant="light">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center navbar-brand-ink">
            <img
              src={logo}
              alt="Cook Together"
              width="36"
              height="36"
              className="d-inline-block align-text-top me-2"
            />
            <span>Cook Together</span>
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
  } = user;

  const expProgress = Math.min((currentEXP / currentLevelCeiling) * 100, 100);

  return (
    <Navbar expand="lg" className="navbar-ct" bg="light" variant="light">
      <Container fluid className="d-flex align-items-center">
        {/* Group 1: Logo and Logo Text */}
        <div className="d-flex align-items-center">
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center navbar-brand-ink navbar-logo-group">
            <img
              src={logo}
              alt="Cook Together"
              className="navbar-logo-img me-2"
            />
            <span className="navbar-logo-text">Cook Together</span>
          </Navbar.Brand>
        </div>

        {/* Group 2: Shop and Inventory Buttons */}
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

        {/* Group 3: Gold and Gem Currencies */}
        <div className="navbar-currency-group">
          <div className="navbar-currency-item">
            <div className="navbar-currency-icon gold-currency-icon">
              <img src={goldIcon} alt="Gold" className="navbar-currency-img" />
            </div>
            <span className="navbar-currency-text">{goldCount} Gold</span>
          </div>

          <div className="navbar-currency-item">
            <div className="navbar-currency-icon gem-currency-icon">
              <img src={gemIcon} alt="Gems" className="navbar-currency-img" />
            </div>
            <span className="navbar-currency-text">{gemCount} Gems</span>
          </div>
        </div>

        {/* Level Progress - Responsive */}
        <div className="navbar-level-group">
          {/* Ring version for mobile */}
          <div className="navbar-level-ring">
            <div
              className="navbar-level-progress"
              style={{
                background: `conic-gradient(var(--ct-primary) ${expProgress}%, var(--ct-surface) ${expProgress}%)`
              }}
            >
              <div className="navbar-level-inner">
                <span className="navbar-level-text">Lv.{level}</span>
              </div>
            </div>
          </div>

          {/* Bar version for desktop */}
          <div className="navbar-level-bar">
            <div className="navbar-level-info">
              <span className="navbar-level-label">Lv.{level}</span>
              <span className="navbar-level-stats">{currentEXP}/{currentLevelCeiling} EXP</span>
            </div>
            <div className="navbar-level-bar-container">
              <div
                className="navbar-level-bar-progress"
                style={{ width: `${expProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Group 4: Profile, Users and Settings Icons */}
        <div className="navbar-icon-group">
          <Button
            as={Link}
            to="/profile"
            variant="light"
            aria-label="profile"
            className="navbar-icon-button"
          >
            <img src={profileIcon} alt="Profile" className="navbar-icon-img" />
          </Button>

          <Button
            as={Link}
            to="/people"
            variant="light"
            aria-label="users"
            className="navbar-icon-button"
          >
            <img src={usersIcon} alt="Users" className="navbar-icon-img" />
          </Button>

          <Button
            as={Link}
            to="/settings"
            variant="light"
            aria-label="settings"
            className="navbar-icon-button"
          >
            <img src={settingsIcon} alt="Settings" className="navbar-icon-img" />
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;