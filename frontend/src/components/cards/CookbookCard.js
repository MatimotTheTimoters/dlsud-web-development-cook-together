import React from "react";
import { Card, Button } from "react-bootstrap";
import "../../styles/colors.css";
import "../../styles/cards.css";
import placeholderImage from "../../assets/placeholders/images/new-cookbook.png";

function CookbookCard({ cookbook = {} }) {
  const { coverImage, title, author, recipeCount } = cookbook;

  return (
    <Card className="ct-card card-fade-in h-100" style={{ maxWidth: "320px", margin: "0 auto" }}>
      <Card.Img
        variant="top"
        src={coverImage || placeholderImage}
        alt={title}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title className="text-ct-ink">{title}</Card.Title>
        <div className="text-ct-muted small mb-2">
          <strong>Author:</strong> {author || "Anonymous"}
        </div>
        <div className="text-ct-muted small mb-3">
          <strong>Recipes:</strong> {recipeCount || 0}
        </div>
        <Button className="btn-ct-primary btn-sm w-100">View Cookbook</Button>
      </Card.Body>
    </Card>
  );
}

export default CookbookCard;
