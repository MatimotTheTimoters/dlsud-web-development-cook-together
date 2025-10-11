import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../styles/colors.css';

function ChallengeCard({ challenge }) {
  const { title, author, reward, end, tags, img } = challenge;

  const tagColors = {
  tag1: 'warning',
  tag2: 'primary',
  tag3: 'info',
  tag4: 'danger',
  tag5: 'success',
  tag6: 'secondary',
};

 return (
    <Card className="ct-card" style={{ maxWidth: '320px', margin: '0 auto' }}>
      <Card.Img variant="top" src={img} alt={title} className="card-img-top" />
      <Card.Body>
        <Card.Title className="text-ct-ink">{title}</Card.Title>

        <p className="card-text">
          <span className="fw-bold">Created by:</span>{' '}
          <span className="text-ct-muted">{author}</span>
        </p>

        <div className="border rounded p-3 my-3 bg-light d-flex flex-column align-items-center">
          <p className="mb-1 fw-bold">Rewards</p>
          <p className="mb-0 text-ct-muted">{reward}</p>
        </div>

        <Button className="btn-ct-primary btn-sm">Join</Button>{' '}
        Ends at: <span className="text-ct-muted">{end}</span>

        {/* Tags */}
        <div
          className="border rounded p-3 my-3 bg-light d-flex flex-wrap justify-content-center"
          style={{ gap: '8px' }}
        >
          {tags.split(',').map((tag, index) => {
            const trimmedTag = tag.trim();
            const color = tagColors[trimmedTag] || 'primary';

            return (
              <Button
                key={index}
                variant={`outline-${color}`}
                className="btn-sm px-3"
                style={{
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                }}
                onClick={() => challenge.onTagClick(trimmedTag)}
              >
                {trimmedTag}
              </Button>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;
