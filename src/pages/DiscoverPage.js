import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AsideComponent from '../components/AsideComponent';
import BodyComponent from '../components/BodyComponent';
import '../styles/colors.css';

const DiscoverPage = () => {
  return (
    <main className="my-4">
      <Container fluid>
        <Row className="g-4">
          <Col xs={12} md={3}>
            <AsideComponent activeKey="/DiscoverPage" />
          </Col>
          <Col xs={12} md={9} className="app-main">
            <h2>Discover Page</h2>
          </Col>
          <BodyComponent/>
        </Row>
      </Container>
    </main>
  );
};

export default DiscoverPage;
