import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function FooterComponent() {
  return (
    <footer className="footer-ct sticky-footer">
      <Container>
        <Row className="align-items-start gy-3">
          <Col md={4}>
            <h5 className="text-ct-ink mb-2">Cook Together</h5>
            <p className="text-ct-muted small">
              Gamified recipe sharing — form parties, create challenges, earn
              rewards.
            </p>
          </Col>

          <Col md={4}>
            <h6 className="text-ct-ink mb-2">Explore</h6>
            <ul className="list-unstyled mb-0">
              <li>
                <Link
                  to="/"
                  className="text-ct-muted text-decoration-none"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/home-recipes"
                  className="text-ct-muted text-decoration-none"
                >
                  Recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/Challenges"
                  className="text-ct-muted text-decoration-none"
                >
                  Challenges
                </Link>
              </li>
              <li>
                <Link
                  to="/KitchensPage"
                  className="text-ct-muted text-decoration-none"
                >
                  Kitchens
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 className="text-ct-ink mb-2">Community</h6>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge-ct">Support</span>
              <span className="badge-ct">Docs</span>
              <span className="badge-ct">Forums</span>
            </div>
            <div className="mt-3 text-ct-muted small">
              © {new Date().getFullYear()} Cook Together — All rights reserved.
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default FooterComponent;