import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AsideComponent from '../components/AsideComponent';
import logo from '../assets/icons/logo.png';

function TestPages() {
  return (
    <main className="my-4">
      <Container fluid>
        <Row className="g-4">
          <Col xs={12} md={3}>
            <AsideComponent/>
          </Col>
          <Col>
            <div className="coming-soon-content">
              <div className="text-center">
                <div className="badge">Coming Soon</div>
                <h1 className="display-4 fw-bold mt-3">Coming Soon</h1>
                <p className="lead mt-3">
                  We're working hard to bring you something special. Stay tuned
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default TestPages;