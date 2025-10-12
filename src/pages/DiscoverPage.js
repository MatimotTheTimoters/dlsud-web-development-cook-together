import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AsideComponent from '../components/AsideComponent';
import BodyComponent from '../components/BodyComponent';
import FloatingActionMenu from '../components/ui/FloatingActionMenu';

const DiscoverPage = () => {
  return (
    <main className="my-4">
      <Container fluid>
        <Row className="g-4">
          <Col xs={12} md={3}>
            <AsideComponent activeKey="/discover" />
          </Col>
          <Col xs={12} md={9} className="app-main">
            <BodyComponent />
          </Col>
        </Row>
      </Container>
      <FloatingActionMenu /> {/* Place outside the Row */}
    </main>
  );
};

export default DiscoverPage;
