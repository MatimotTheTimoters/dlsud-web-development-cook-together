import React from "react";
import { Card, Button } from "react-bootstrap";
import "../../styles/colors.css";

function UserCard({ user = {} }) {
  const {
    id,
    username,
    displayName,
    avatar,
    bio,
    level,
    experience,
    followers,
    following,
    recipeCount,
  } = user;

  return (
    <Card className="ct-card h-100" style={{ maxWidth: "320px", margin: "0 auto" }}>
      {/* Avatar */}
      <Card.Img
        variant="top"
        src={avatar || "/assets/images/user-placeholder.svg"}
        alt={username}
        className="card-img-top rounded-circle mx-auto mt-3"
        style={{ height: "120px", width: "120px", objectFit: "cover" }}
      />

      <Card.Body className="text-center">
        {/* Display Name */}
        <Card.Title className="text-ct-ink mb-1">{displayName || username}</Card.Title>
        <Card.Subtitle className="text-ct-muted small mb-3">@{username}</Card.Subtitle>

        {/* Bio */}
        {bio && <p className="small text-ct-muted mb-3">{bio}</p>}

        {/* Stats */}
        <div className="d-flex justify-content-around small mb-3">
          <div>
            <strong>{followers || 0}</strong>
            <div className="text-ct-muted">Followers</div>
          </div>
          <div>
            <strong>{following || 0}</strong>
            <div className="text-ct-muted">Following</div>
          </div>
          <div>
            <strong>{recipeCount || 0}</strong>
            <div className="text-ct-muted">Recipes</div>
          </div>
        </div>

        {/* Level and XP */}
        <div className="small mb-3">
          <strong>Level:</strong> {level || 1} <br />
          <strong>EXP:</strong> {experience || 0}
        </div>

        {/* Action */}
        <Button className="btn-ct-primary btn-sm w-100">View Profile</Button>
      </Card.Body>
    </Card>
  );
}

export default UserCard;
