import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import "../styles/colors.css";
import "../styles/components.css";

function ChallengeCard({ challenge }) {
  const {
    challengeId, // hidden
    createdAt, // hidden
    lastUpdated, // hidden
    coverImage,
    title,
    description, // hidden
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
  } = challenge;

  return (
    <Card className="challenge-card h-100">
      {/* Cover Image */}
      <Card.Img
        variant="top"
        src={coverImage || "/assets/images/placeholder.svg"}
        alt={title}
        className="challenge-card-img"
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body>
        {/* Title */}
        <Card.Title className="text-ct-ink">{title}</Card.Title>

        {/* Tags */}
        {tags && (
          <div className="mb-3">
            {tags.split(",").map((tag, index) => (
              <Badge
                key={index}
                bg="secondary"
                className="me-1 text-ct-muted"
                style={{ fontSize: "0.75rem" }}
              >
                {tag.trim()}
              </Badge>
            ))}
          </div>
        )}

        {/* Total Cook Quota */}
        <div className="text-ct-muted small mb-2">
          <strong>Total Cook Quota:</strong> {totalCookQuota || "N/A"}
        </div>

        {/* Author */}
        <div className="text-ct-muted small mb-2">
          <strong>Author:</strong> {author || "Anonymous"}
        </div>

        {/* Participant Count */}
        <div className="text-ct-muted small mb-2">
          <strong>Participants:</strong> {participantCount || 0}
        </div>

        {/* Status */}
        <div className="text-ct-muted small mb-2">
          <strong>Status:</strong> {status || "Unknown"}
        </div>

        {/* Start and End Dates */}
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
            <strong>EXP:</strong> {expReward}
          </span>
          <span>
            <strong>Gold:</strong> {goldReward}
          </span>
          <span>
            <strong>Gems:</strong> {gemReward}
          </span>
        </div>

        {/* Action Button */}
        <Button variant="primary" size="sm">
          View Challenge
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;