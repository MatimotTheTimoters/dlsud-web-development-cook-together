import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function HeroComponent() {
  return (
    <header className="hero-ct">
      <Container>
        <Row className="align-items-center">
          <Col md={7}>
            <h1 className="text-ct-ink">Cook Together — Gamified recipe sharing</h1>
            <p className="lead text-ct-muted">
              Share recipes, form parties, create challenges, earn gold & gems, level up and rebirth.
            </p>
            <div className="d-flex u-gap-sm">
              <Button as={Link} to="/registration" className="btn-ct-primary">
                Get Started
              </Button>
              <Button as={Link} to="/home-recipes" variant="outline-secondary">
                Browse Recipes
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}

export default HeroComponent;