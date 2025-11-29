import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ChallengeCard from "../cards/ChallengeCard";

const ChallengeCardGroup = ({ challenges }) => {
  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center py-5">
        <p>No challenges available right now. Check back later!</p>
      </div>
    );
  }

  return (
    <Container fluid className="py-3">
      <Row className="g-4">
        {challenges.map((challenge) => (
          <Col key={challenge.id} xs={12} sm={6} md={4}>
            <ChallengeCard challenge={challenge} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ChallengeCardGroup;
