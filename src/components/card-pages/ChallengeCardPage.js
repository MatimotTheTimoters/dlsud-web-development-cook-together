import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ChallengeCard from "../cards/ChallengeCard";

const ChallengeCardPage = () => {
  const challenges = [
    {
      id: 1,
      title: "30-Minute Meals",
      description: "Create a delicious dish in under 30 minutes!",
      image: "/assets/challenges/fast-food.jpg",
      participants: 24,
      difficulty: "Easy",
      timeLimit: "30 mins",
    },
    {
      id: 2,
      title: "Plant-Based Power",
      description: "Cook your best plant-based meal!",
      image: "/assets/challenges/vegan.jpg",
      participants: 42,
      difficulty: "Medium",
      timeLimit: "45 mins",
    },
    {
      id: 3,
      title: "Sweet Treats",
      description: "Show off your dessert skills!",
      image: "/assets/challenges/dessert.jpg",
      participants: 30,
      difficulty: "Hard",
      timeLimit: "1 hour",
    },
  ];

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4 text-center">Cooking Challenges</h2>
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

export default ChallengeCardPage;
