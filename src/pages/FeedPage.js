import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AsideComponent from '../components/AsideComponent.js';
import ChallengeBody from '../components/ChallengeBody.js';
import '../styles/colors.css';

const Challenges = () => {
  return (
    <main className="my-4">
      <Container fluid>
        <Row className="g-4">
          <Col xs={12} md={3}>
            <AsideComponent activeKey="/challenges" />
          </Col>
          <Col xs={12} md={9} className="app-main">
          <ChallengeBody />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Challenges;
