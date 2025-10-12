import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';

export default function StepsAdder({ show, onHide, steps, setSteps }) {
  const [newStep, setNewStep] = useState('');

  const handleAddStep = () => {
    setSteps([...steps, { stepContent: newStep }]);
    setNewStep('');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Step</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Step</Form.Label>
          <Form.Control
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
            placeholder="Enter step"
          />
        </Form.Group>
        <ListGroup className="mt-3">
          {steps.map((step, index) => (
            <ListGroup.Item key={index}>{step.stepContent}</ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddStep}>
          Add Step
        </Button>
      </Modal.Footer>
    </Modal>
  );
}