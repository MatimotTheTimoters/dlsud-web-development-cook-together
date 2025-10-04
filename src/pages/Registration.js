// src/pages/Registration.js
import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/colors.css";

export default function Registration() {
  return (
    <>
      <AppNavbar isLoggedIn={false} />

      <main className="bg-ct-surface" role="main">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h3 className="mb-3 text-ct-ink">Create an account</h3>

                  <Form action="#" method="post" noValidate>
                    <Form.Group className="mb-3" controlId="fullName">
                      <Form.Label className="text-ct-muted">Full name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your full name"
                        aria-describedby="fullNameHelp"
                      />
                      <Form.Text id="fullNameHelp" className="text-ct-muted">
                        Enter your legal or display full name.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="displayName">
                      <Form.Label className="text-ct-muted">Display name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="What others will see (e.g. ChefAlex)"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label className="text-ct-muted">Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="you@example.com"
                      />
                    </Form.Group>

                    <Row className="g-3">
                      <Col xs={12} md={6}>
                        <Form.Group controlId="password">
                          <Form.Label className="text-ct-muted">Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="At least 8 characters"
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} md={6}>
                        <Form.Group controlId="confirmPassword">
                          <Form.Label className="text-ct-muted">Confirm password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Repeat password"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="my-3" controlId="agree">
                      <Form.Check
                        type="checkbox"
                        label={
                          <>
                            I agree to the{" "}
                            <a href="/terms" className="text-ct-muted">
                              terms of service
                            </a>
                          </>
                        }
                      />
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button type="submit" className="btn-ct-primary" size="lg">
                        Create account
                      </Button>
                    </div>

                    <div className="text-center mt-3 small text-ct-muted">
                      Already have an account? <a href="/login">Log in</a>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </>
  );
}