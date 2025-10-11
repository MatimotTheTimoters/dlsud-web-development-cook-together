import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
<<<<<<< HEAD:src/pages/Challenges.js
import AsideComponent from '../components/AsideComponent';
import ChallengeBody from '../components/ChallengeBody';
=======
import AsideComponent from '../components/AsideComponent.js';
import ChallengeBody from '../components/ChallengeBody.js';
>>>>>>> 6f42a71a074705d92ea22414b920336a9bbd8914:src/pages/FeedPage.js
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
