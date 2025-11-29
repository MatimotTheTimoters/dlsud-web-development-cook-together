import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserCard from "../cards/UserCard";

const UserCardGroup = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-5">
        <p>No users found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <Container fluid className="py-3">
      <Row className="g-4">
        {users.map((user) => (
          <Col key={user.id} xs={12} sm={6} md={4}>
            <UserCard user={user} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default UserCardGroup;
