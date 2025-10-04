import React from "react";
import { Card, ListGroup, Col } from "react-bootstrap";
import "../styles/colors.css";

export default function Aside() {
  return (
    <Col xs={12} md={3} className="px-3 mb-3">
      <Card className="sticky-top" style={{ top: "1rem" }}>
        <Card.Body className="p-2">
          <ListGroup className="aside-list">
            <ListGroup.Item action href="/home-recipes" active>
              RECIPES
            </ListGroup.Item>
            <ListGroup.Item action href="/home-challenges">
              CHALLENGES
            </ListGroup.Item>
            <ListGroup.Item action href="/home-kitchens">
              KITCHENS
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </Col>
  );
}