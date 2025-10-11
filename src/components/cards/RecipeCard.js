import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import "../styles/colors.css";
import "../styles/components.css";

function RecipeCard({ recipe }) {
  const {
    recipeId, // hidden
    createdAt, // hidden
    lastUpdated, // hidden
    coverImage,
    title,
    description, // hidden
    origin,
    preparationTime,
    servingSize,
    tags,
    expReward,
    goldReward,
    gemReward,
    isPaid, // hidden
    goldPrice,
    gemPrice,
    purchaseCount,
    isPublic, // hidden
    author,
    ratingAverage,
    likeCount,
    favoriteCount,
    commentCount,
  } = recipe;

  return (
    <Card className="recipe-card h-100">
      {/* Cover Image */}
      <Card.Img
        variant="top"
        src={coverImage || "/assets/images/placeholder.svg"}
        alt={title}
        className="recipe-card-img"
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body>
        {/* Title */}
        <Card.Title className="text-ct-ink">{title}</Card.Title>

        {/* Origin */}
        <div className="text-ct-muted small mb-2">
          <strong>Origin:</strong> {origin || "Unknown"}
        </div>

        {/* Preparation Time and Serving Size */}
        <div className="d-flex justify-content-between small mb-3">
          <span>
            <strong>Prep Time:</strong> {preparationTime || "N/A"}
          </span>
          <span>
            <strong>Serving Size:</strong> {servingSize || "N/A"}
          </span>
        </div>

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

        {/* Paid Recipe Details */}
        {isPaid && (
          <div className="small mb-3">
            <div>
              <strong>Gold Price:</strong> {goldPrice || "N/A"}
            </div>
            <div>
              <strong>Gem Price:</strong> {gemPrice || "N/A"}
            </div>
            <div>
              <strong>Purchases:</strong> {purchaseCount || 0}
            </div>
          </div>
        )}

        {/* Public Recipe Details */}
        {isPublic && (
          <div className="small mb-3">
            <div>
              <strong>Author:</strong> {author || "Anonymous"}
            </div>
            <div>
              <strong>Rating:</strong> {ratingAverage || "N/A"}
            </div>
            <div>
              <strong>Likes:</strong> {likeCount || 0}
            </div>
            <div>
              <strong>Favorites:</strong> {favoriteCount || 0}
            </div>
            <div>
              <strong>Comments:</strong> {commentCount || 0}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button variant="primary" size="sm">
          View Recipe
        </Button>
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;