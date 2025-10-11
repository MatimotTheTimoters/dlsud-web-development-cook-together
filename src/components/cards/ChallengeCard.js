import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../styles/colors.css';

function ChallengeCard({ challenge }) {
  const { title, author, reward, difficulty, end, tags, img } = challenge;

  return (
    <Card className="ct-card" style={{ maxWidth: '320px', margin: '0 auto' }}>
      <Card.Img variant="top" src={img} alt={title} className="card-img-top" />
      <Card.Body>
        <Card.Title className="text-ct-ink">{title}</Card.Title>

        <p className="card-text">
          <span className="fw-bold">Created by:</span>{' '}
          <span className="text-ct-muted">{author}</span>
        </p>

        <p className="card-text">
          <span className="fw-bold">Difficulty:</span>{' '}
          <span className="text-ct-muted">{difficulty}</span>
        </p>

        <div className="border rounded p-3 my-3 bg-light d-flex flex-column align-items-center">
          <p className="mb-1 fw-bold">Rewards</p>
          <p className="mb-0">
            <img src={img} style={{ marginRight: '2px' }} alt="reward" />
            <span className="text-ct-muted">{reward}</span>

            <img src={img} style={{ marginLeft: '4px' }} alt="reward" />
            <span className="text-ct-muted">{reward}</span>
          </p>
        </div>

        <Button className="btn-ct-primary btn-sm">Join</Button>{' '}
        Ends at: <span className="text-ct-muted">{end}</span>

        <div
          className="border rounded p-3 my-3 bg-light d-flex flex-row align-items-center"
          style={{ marginLeft: '4px', marginRight: '4px', gap: '6px' }}
        >
          <Button className="btn btn-primary">tags</Button>
          <Button className="btn btn-secondary">tags</Button>
          <Button className="btn btn-success">tags</Button>
          <Button className="btn btn-danger">tags</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ChallengeCard;
