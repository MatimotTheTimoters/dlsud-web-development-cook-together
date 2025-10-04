import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import "../styles/colors.css";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Cook Together — Landing";
  }, []);

  return (
    <>
      <AppNavbar isLoggedIn={false} />

      <main className="bg-ct-surface" role="main">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={7}>
              <Hero/>
              <div className="mt-4 d-flex gap-2">
                <Button
                  className="btn-ct-primary"
                  onClick={() => navigate("/recipes")}
                >
                  Explore Recipes
                </Button>

                <Link to="/registration" className="btn btn-outline-primary btn-lg">
                  Create account
                </Link>
              </div>
            </Col>

            <Col lg={5} className="d-none d-lg-block">
              {/* Optional visual/illustration area — keep empty so Hero controls primary content */}
            </Col>
          </Row>
        </Container>

        <Container fluid className="pb-5">
          <Features />
        </Container>
      </main>

      <Footer />
    </>
  );
}