import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';

export default function IngredientAdder({ show, onHide, ingredients, setIngredients }) {
  const [newIngredient, setNewIngredient] = useState({
    recipeContent: '',
    servingSizeValue: '',
    servingSizeUnit: 'grams',
  });

  const handleAddIngredient = () => {
    setIngredients([...ingredients, newIngredient]);
    setNewIngredient({ recipeContent: '', servingSizeValue: '', servingSizeUnit: 'grams' });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Ingredient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Ingredient</Form.Label>
          <Form.Control
            value={newIngredient.recipeContent}
            onChange={(e) => setNewIngredient({ ...newIngredient, recipeContent: e.target.value })}
            placeholder="Enter ingredient"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Serving Size</Form.Label>
          <Form.Control
            type="number"
            value={newIngredient.servingSizeValue}
            onChange={(e) => setNewIngredient({ ...newIngredient, servingSizeValue: e.target.value })}
            placeholder="Enter serving size"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Unit</Form.Label>
          <Form.Select
            value={newIngredient.servingSizeUnit}
            onChange={(e) => setNewIngredient({ ...newIngredient, servingSizeUnit: e.target.value })}
          >
            <option value="grams">Grams</option>
            <option value="oz">Ounces</option>
            <option value="lb">Pounds</option>
            <option value="kg">Kilograms</option>
          </Form.Select>
        </Form.Group>
        <ListGroup className="mt-3">
          {ingredients.map((ingredient, index) => (
            <ListGroup.Item key={index}>
              {ingredient.recipeContent} - {ingredient.servingSizeValue} {ingredient.servingSizeUnit}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddIngredient}>
          Add Ingredient
        </Button>
      </Modal.Footer>
    </Modal>
  );
}