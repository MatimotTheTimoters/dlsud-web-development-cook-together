import React from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";

function AppNavbar({ isLoggedIn }) {
  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: "#FFFFFF", // --ct-paper
        borderBottom: "1px solid #E6E9EE", // --ct-border
      }}
    >
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand
          href="/"
          className="d-flex align-items-center fw-bold"
          style={{ color: "#0F172A" }} // --ct-ink
        >
          <img
            src="/assets/images/logo.png"
            alt="Cook Together"
            width="36"
            height="36"
            className="d-inline-block align-text-top me-2"
          />
          Cook Together
        </Navbar.Brand>

        {/* Toggler */}
        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          {!isLoggedIn ? (
            // === Landing Page Navbar (new user) ===
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="/about" style={{ color: "#64748B" }}>
                About
              </Nav.Link>
              <Nav.Link href="/pricing" style={{ color: "#64748B" }}>
                Pricing
              </Nav.Link>
              <Nav.Link href="/contacts" style={{ color: "#64748B" }}>
                Contacts
              </Nav.Link>
            </Nav>
          ) : (
            // === Logged-in Navbar ===
            <Nav className="ms-auto align-items-center gap-2 flex-wrap">
              {/* Inventory & Shop */}
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  style={{ backgroundColor: "#FF7043", border: "none" }} // --ct-primary
                >
                  INVENTORY
                </Button>
                <Button
                  size="sm"
                  style={{ backgroundColor: "#FF7043", border: "none" }}
                >
                  SHOP
                </Button>
              </div>

              {/* Currency display */}
              <div className="d-flex align-items-center ms-2">
                <span
                  className="badge me-2"
                  style={{
                    backgroundColor: "#F2C94C", // --ct-gold
                    color: "#0F172A",
                  }}
                >
                  🪙 12.5k
                </span>
                <span
                  className="badge"
                  style={{
                    backgroundColor: "#2BC1A9", // --ct-secondary
                    color: "#0F172A",
                  }}
                >
                  💎 1.2k
                </span>
              </div>

              {/* Notifications */}
              <Dropdown align="end">
                <Dropdown.Toggle
                  size="sm"
                  variant="light"
                  id="dropdown-notif"
                  style={{ color: "#64748B" }} // muted
                >
                  🔔
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>Notifications</Dropdown.Header>
                  <Dropdown.Item>No new notifications</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* User buttons */}
              <div className="d-flex gap-2 flex-wrap">
                <Button size="sm" variant="light">
                  👥
                </Button>
                <Button size="sm" variant="light">
                  👤
                </Button>
                <Button size="sm" variant="light">
                  ⚙️
                </Button>
                <Button size="sm" variant="outline-danger">
                  Logout
                </Button>
              </div>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;