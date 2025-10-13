import React from "react";
import { Card, Button } from "react-bootstrap";
import "../../styles/colors.css";
import placeholderImage from "../../assets/placeholders/images/new-recipe.png"; // Add this import

function RecipeCard({ recipe = {} }) {
  const {
    recipeId, // hidden
    createdAt, // hidden
    lastUpdated, // hidden
    coverImage,
    title,
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

  const Stars = ({ value = 0 }) => {
    const full = "★".repeat(Math.max(0, Math.floor(value)));
    const empty = "☆".repeat(Math.max(0, 5 - Math.floor(value)));
    return (
      <span className="text-warning" style={{ fontSize: "0.9rem" }}>
        {full}
        {empty}
      </span>
    );
  };

  return (
    <Card className="ct-card h-100" style={{ maxWidth: "320px", margin: "0 auto" }}>
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

        {/* Origin */}
        {origin && (
          <p className="text-ct-muted small mb-2">
            <strong>Origin:</strong> {origin}
          </p>
        )}

        {/* Prep + Serving */}
        {(preparationTime || servingSize) && (
          <div className="d-flex justify-content-between small mb-3">
            <span>
              <strong>Prep Time:</strong> {preparationTime || "N/A"}
            </span>
            <span>
              <strong>Servings:</strong> {servingSize || "N/A"}
            </span>
          </div>
        )}

        {/* Tags */}
        {tags && (
          <div
            className="border rounded p-3 my-3 bg-light d-flex flex-wrap justify-content-center"
            style={{ gap: "8px" }}
          >
            {tags.split(",").map((tag, index) => (
              <Button
                key={index}
                variant="outline-primary"
                className="btn-sm px-3"
                style={{
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                }}
              >
                {tag.trim()}
              </Button>
            ))}
          </div>
        )}

        {/* Rewards */}
        {(expReward || goldReward || gemReward) && (
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
        )}

        {/* Paid Info */}
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

        {/* Public Info */}
        {isPublic && (
          <div className="small mb-3">
            <div>
              <strong>Author:</strong> {author || "Anonymous"}
            </div>
            <div>
              <Stars value={ratingAverage || 0} />{" "}
              <span className="ms-1 text-ct-muted small">
                ({ratingAverage ? ratingAverage.toFixed(1) : "N/A"})
              </span>
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

        {/* Action */}
        <Button className="btn-ct-primary btn-sm w-100">View Recipe</Button>
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;