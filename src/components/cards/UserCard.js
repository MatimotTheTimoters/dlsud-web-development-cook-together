import React from "react";
import { Card, ProgressBar, Badge } from "react-bootstrap";

function UserCard({ user }) {
  const {
    id, // hidden
    createdAt, // hidden
    profilePicture,
    fullName,
    email, // hidden
    age,
    gender,
    loginStreak,
    level,
    currentEXP,
    currentLevelCeiling,
    friends, // hidden
    recipesCreated, // hidden
    recipesCooked, // hidden
  } = user;

  // Calculate experience progress percentage
  const expProgress = Math.min(
    (currentEXP / currentLevelCeiling) * 100,
    100
  );

  return (
    <Card className="user-card h-100">
      {/* Profile Picture */}
      <Card.Img
        variant="top"
        src={profilePicture || "/assets/images/placeholder-profile.svg"}
        alt={fullName}
        className="user-card-img"
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body>
        {/* Full Name */}
        <Card.Title className="text-ct-ink">{fullName}</Card.Title>

        {/* Age and Gender */}
        <div className="text-ct-muted small mb-2">
          <strong>Age:</strong> {age || "N/A"} | <strong>Gender:</strong> {gender || "N/A"}
        </div>

        {/* Login Streak */}
        <div className="text-ct-muted small mb-2">
          <strong>Login Streak:</strong> {loginStreak || 0} days
        </div>

        {/* Level and EXP Progress */}
        <div className="mb-3">
          <div className="d-flex justify-content-between small">
            <span>
              <strong>Level:</strong> {level || 1}
            </span>
            <span>
              <strong>EXP:</strong> {currentEXP || 0}/{currentLevelCeiling || 100}
            </span>
          </div>
          <ProgressBar
            now={expProgress}
            label={`${Math.round(expProgress)}%`}
            className="exp-progress-bar"
            style={{ height: "8px" }}
          />
        </div>

        {/* Badges */}
        <div className="mb-3">
          <Badge bg="primary" className="me-1">
            Recipes Created: {recipesCreated || 0}
          </Badge>
          <Badge bg="success" className="me-1">
            Recipes Cooked: {recipesCooked || 0}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
}

export default UserCard;