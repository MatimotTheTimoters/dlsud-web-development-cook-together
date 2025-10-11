import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AsideComponent from '../components/AsideComponent.js';
import BodyComponent from '../components/BodyComponent.js';
import '../styles/colors.css';

const FeedPage = () => {
  return (
    <main className="my-4">
      <Container fluid>
        <Row className="g-4">
          <Col xs={12} md={3}>
            <AsideComponent activeKey="/feed" />
          </Col>
          <Col xs={12} md={9} className="app-main">
            <h2>Feed Page</h2>
          </Col>
          <Col xs={12} md={9} className="app-main">
            <BodyComponent />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default FeedPage;
