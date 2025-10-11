import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../styles/colors.css';

function RecipeCard({ recipe = {} }) {
  const { title, reward, sold, rating, reviews, end, img } = recipe;

  const Stars = ({ value = 0 }) => {
    const full = '★'.repeat(Math.max(0, Math.floor(value)));
    const empty = '☆'.repeat(Math.max(0, 5 - Math.floor(value)));
    return <span className="text-warning">{full}{empty}</span>;
  };

  return (
    <Card className="ct-card h-100">
      <Card.Img variant="top" src={img} alt={title} className="card-img-top" />
      <Card.Body>
        <Card.Title className="text-ct-ink">{title}</Card.Title>

        <p className="card-text">
          <span className="fw-bold">{reward}</span> • <span className="text-ct-muted">{sold} sold</span>
        </p>

        <p className="card-text small">
          <Stars value={rating} />{' '}
          <span className="ms-2 text-ct-muted">{reviews} reviews</span>
        </p>

        <Button className="btn-ct-primary btn-sm">Get</Button>{' '}
      </Card.Body>
    </Card>
  );
}

export default RecipeCard;
