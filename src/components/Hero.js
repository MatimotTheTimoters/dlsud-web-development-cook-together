import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import "../styles/colors.css";

export default function Hero() {
  return (
    <header className="bg-ct-surface py-5">
      <Container>
        <Row className="align-items-center g-4">
          <Col lg={6}>
            <h1 className="display-5 text-ct-ink fw-bold">
              Share recipes. Cook together.
            </h1>

            <p className="lead text-ct-muted mb-4">
              Join challenges, discover community recipes, and earn rewards as you
              level up your cooking. Explore recipes or create an account — it's
              free.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <Button href="/registration" className="btn-ct-primary btn-lg" role="button">
                Register
              </Button>

              <Button href="/login" variant="outline-primary" className="btn-lg">
                Log in
              </Button>
            </div>

            <p className="mt-3 text-ct-muted small">
              No credit card required • Community-moderated recipes • Local & global cuisines
            </p>
          </Col>

          <Col lg={6} className="d-none d-lg-block">
            <div className="bg-ct-paper rounded shadow-sm p-3">
              <Image
                src="/assets/images/placeholder.svg"
                alt="Hero illustration"
                fluid
                rounded
              />
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
}