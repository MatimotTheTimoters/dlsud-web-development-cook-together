import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import apiLinks from "../constants/api.js";
import "../styles/colors.css";
import logo from "../assets/icons/logo.png";
import goldIcon from "../assets/icons/gold-icon.png";
import gemIcon from "../assets/icons/gem-icon.png";
import profileIcon from "../assets/icons/profile-icon.png";
import usersIcon from "../assets/icons/users-icon.png";
import settingsIcon from "../assets/icons/settings-icon.png";

function NavbarComponent() {
  const { user } = useAuth();

  // If no user is logged in, show a minimal navbar
  if (!user) {
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
        {/* Logo */}
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

        {/* Inventory and Shop Buttons */}
        <div className="d-flex gap-2 ms-auto">
          <Button as={Link} to="/inventory" size="sm" className="btn-ct-primary">
            INVENTORY
          </Button>
          <Button as={Link} to="/shop" size="sm" className="btn-ct-primary">
            SHOP
          </Button>
        </div>

        {/* Gold and Gem Counts */}
        <div className="d-flex align-items-center ms-3">
          <img src={goldIcon} alt="Gold" width="24" height="24" className="me-1" />
          <span className="chip chip-gold me-3">{goldCount}</span>
          <img src={gemIcon} alt="Gems" width="24" height="24" className="me-1" />
          <span className="chip chip-gem">{gemCount}</span>
        </div>

        {/* Level Progress */}
        <div className="d-flex align-items-center ms-3">
          <div
            className="position-relative"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: `conic-gradient(var(--ct-primary) ${expProgress}%, var(--ct-surface) ${expProgress}%)`,
              display: "grid",
              placeItems: "center",
            }}
          >
            <span className="text-ct-ink fw-bold">{level}</span>
          </div>
        </div>

        {/* Profile, Users, and Settings Icons */}
        <div className="d-flex align-items-center gap-2 ms-3">
          <Button as={Link} to="/profile" size="sm" variant="light" aria-label="profile">
            <img src={profileIcon} alt="Profile" width="24" height="24" />
          </Button>
          <Button as={Link} to="/people" size="sm" variant="light" aria-label="users">
            <img src={usersIcon} alt="Users" width="24" height="24" />
          </Button>
          <Button as={Link} to="/settings" size="sm" variant="light" aria-label="settings">
            <img src={settingsIcon} alt="Settings" width="24" height="24" />
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;