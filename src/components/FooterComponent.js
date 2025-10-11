import React from "react";
import { Container } from "react-bootstrap";

function FooterComponent() {
  return (
    <footer className="footer-ct sticky-footer">
      <Container className="text-center">
        <h5 className="text-ct-ink mb-2">Cook Together</h5>
        <p className="text-ct-muted small">
          Gamified recipe sharing — form parties, create challenges, earn rewards.
        </p>
        <div className="mt-3 text-ct-muted small">
          © {new Date().getFullYear()} Cook Together — All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

export default FooterComponent;