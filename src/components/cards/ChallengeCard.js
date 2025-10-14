import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import "../../styles/colors.css";
import "../../styles/cards.css";
import placeholderImage from "../../assets/placeholders/images/new-challenge.png"; // Add this import

function ChallengeCard({ challenge }) {
  const {
    challengeId, // hidden
    createdAt, // hidden
    lastUpdated, // hidden
    coverImage,
    title,
    tags,
    totalCookQuota,
    author,
    participantCount,
    status,
    startDate,
    endDate,
    expReward,
    goldReward,
    gemReward,
    onTagClick, // optional handler
  } = challenge;

  const tagColors = {
    tag1: "warning",
    tag2: "primary",
    tag3: "info",
    tag4: "danger",
    tag5: "success",
    tag6: "secondary",
  };

  return (
    <Card className="ct-card card-fade-in" style={{ maxWidth: "320px", margin: "0 auto" }}>
      {/* Cover Image - Use imported placeholder */}
      <Card.Img
        variant="top"
        src={coverImage || placeholderImage} // Use imported image
        alt={title}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => {
          // Fallback if coverImage fails to load
          e.target.src = placeholderImage;
        }}
      />

      <Card.Body>
        {/* Title */}
        <Card.Title className="text-ct-ink">{title}</Card.Title>

        {/* Tags */}
        {tags && (
          <div
            className="border rounded p-3 my-3 bg-light d-flex flex-wrap justify-content-center"
            style={{ gap: "8px" }}
          >
            {tags.split(",").map((tag, index) => {
              const trimmedTag = tag.trim();
              const color = tagColors[trimmedTag] || "primary";

              return (
                <Button
                  key={index}
                  variant={`outline-${color}`}
                  className="btn-sm px-3 challenge-tag"
                  style={{
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => onTagClick?.(trimmedTag)}
                >
                  {trimmedTag}
                </Button>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="text-ct-muted small mb-2">
          <strong>Total Cook Quota:</strong> {totalCookQuota || "N/A"}
        </div>
        <div className="text-ct-muted small mb-2">
          <strong>Author:</strong> {author || "Anonymous"}
        </div>
        <div className="text-ct-muted small mb-2">
          <strong>Participants:</strong> {participantCount || 0}
        </div>
        <div className="text-ct-muted small mb-2">
          <strong>Status:</strong> {status || "Unknown"}
        </div>

        {/* Dates */}
        <div className="d-flex justify-content-between small mb-3">
          <span>
            <strong>Start:</strong> {startDate || "N/A"}
          </span>
          <span>
            <strong>End:</strong> {endDate || "N/A"}
          </span>
        </div>

        {/* Rewards */}
        <div className="d-flex justify-content-between small mb-3">
          <span>
            <strong>EXP:</strong> {expReward || 0}
          </span>
          <span>
            <strong>Gold:</strong> {goldReward || 0}
          </span>
          <span>
            <strong>Gems:</strong> {gemReward || 0}
          </span>
        </div>

        {/* Action */}
        <Button className="btn-ct-primary btn-sm w-100">View Challenge</Button>
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;