import React, { useState, useEffect } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Nav,
  Badge
} from "react-bootstrap";
import { Link } from "react-router-dom";

function FooterComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const footerLinks = [
    { label: "About", to: "/about" },
    { label: "Features", to: "/features" },
    { label: "Support", to: "/support" },
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" }
  ];

  const socialLinks = [
    { label: "Twitter", icon: "🐦", url: "#" },
    { label: "Instagram", icon: "📷", url: "#" },
    { label: "Discord", icon: "💬", url: "#" }
  ];

  return (
    <footer className={`footer-ct ${isVisible ? 'footer-visible' : ''}`}>
      <Container>
        {/* Main Footer Content */}
        <Row className="g-4">
          {/* Brand Section */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="footer-brand">
              <h5 className="text-ct-ink fw-bold mb-3 footer-title">
                Cook Together
                <Badge bg="ct-primary" className="ms-2 footer-badge">
                  Beta
                </Badge>
              </h5>
              <p className="text-ct-muted mb-3 footer-description">
                Gamified recipe sharing — form parties, create challenges, earn rewards. 
                Join our community of passionate home chefs!
              </p>
              <div className="footer-stats">
                <Row className="g-2">
                  <Col xs={6}>
                    <div className="text-center p-2 bg-ct-surface rounded">
                      <div className="text-ct-primary fw-bold">500+</div>
                      <small className="text-ct-muted">Recipes</small>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center p-2 bg-ct-surface rounded">
                      <div className="text-ct-primary fw-bold">1K+</div>
                      <small className="text-ct-muted">Chefs</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-ct-ink fw-semibold mb-3 footer-section-title">Explore</h6>
            <Nav className="flex-column footer-nav">
              {footerLinks.slice(0, 3).map((link, index) => (
                <Nav.Link
                  key={link.label}
                  as={Link}
                  to={link.to}
                  className="text-ct-muted footer-link"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Legal Links */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="text-ct-ink fw-semibold mb-3 footer-section-title">Legal</h6>
            <Nav className="flex-column footer-nav">
              {footerLinks.slice(3).map((link, index) => (
                <Nav.Link
                  key={link.label}
                  as={Link}
                  to={link.to}
                  className="text-ct-muted footer-link"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Social & Contact */}
          <Col lg={4} md={6}>
            <h6 className="text-ct-ink fw-semibold mb-3 footer-section-title">Connect</h6>
            <div className="footer-social mb-3">
              <Row className="g-2">
                {socialLinks.map((social, index) => (
                  <Col xs={4} key={social.label}>
                    <a
                      href={social.url}
                      className="d-flex flex-column align-items-center p-2 bg-ct-surface rounded text-decoration-none footer-social-link"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      <span className="fs-5 mb-1">{social.icon}</span>
                      <small className="text-ct-muted">{social.label}</small>
                    </a>
                  </Col>
                ))}
              </Row>
            </div>
            <div className="footer-newsletter">
              <small className="text-ct-muted d-block mb-2">
                Stay updated with new features
              </small>
              <div className="input-group input-group-sm">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Your email"
                  aria-label="Email for updates"
                />
                <button 
                  className="btn btn-ct-primary" 
                  type="button"
                >
                  Join
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <Row className="align-items-center mt-4 pt-3 border-top-ct">
          <Col md={6}>
            <div className="text-ct-muted small footer-copyright">
              © {currentYear} Cook Together — All rights reserved.
            </div>
          </Col>
          <Col md={6}>
            <div className="text-md-end">
              <small className="text-ct-muted">
                Made with ❤️ for food lovers everywhere
              </small>
            </div>
          </Col>
        </Row>

        {/* Mobile App Badge */}
        <div className="text-center mt-3">
          <Badge bg="outline-ct" text="ct-muted" className="fw-normal mobile-app-badge">
            📱 Mobile app coming soon!
          </Badge>
        </div>
      </Container>
    </footer>
  );
}

export default FooterComponent;