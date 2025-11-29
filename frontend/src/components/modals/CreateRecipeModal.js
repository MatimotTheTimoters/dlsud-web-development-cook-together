import React, { useState } from 'react';
import { Modal, Button, Form, Toast, ToastContainer, ListGroup } from 'react-bootstrap';
import apiSheets from '../../constants/api.js';
import { generateBatchIds } from '../../hooks/uuidHelper.js';
import { useData } from '../../contexts/DataContext.js';
import IngredientAdder from './IngredientAdder';
import StepsAdder from './StepsAdder';

export default function CreateRecipeModal({ show, onHide, onCreated }) {
  const { currentUserData, userRewardLimits, refetchSheet } = useData();

  const [recipeValues, setRecipeValues] = useState({
    title: '',
    description: '',
    origin: '',
    preparationTimeValue: '',
    preparationTimeUnit: 'minutes',
    servingSizeValue: '',
    servingSizeUnit: 'servings',
    tags: '',
    expReward: 0,
    goldReward: 0,
    gemReward: 0,
    isPaid: false,
    goldPrice: 0,
    gemPrice: 0,
    isPublic: true,
  });
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [ingredientModalVisible, setIngredientModalVisible] = useState(false);
  const [stepsModalVisible, setStepsModalVisible] = useState(false);

  const handleRecipeChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (['expReward', 'goldReward', 'gemReward', 'goldPrice', 'gemPrice'].includes(name)) {
      const limitKey = `max${name.charAt(0).toUpperCase() + name.slice(1)}`;
      const cappedValue = Math.min(Number(value), userRewardLimits[limitKey] || 9999);
      setRecipeValues((prev) => ({ ...prev, [name]: cappedValue }));
      return;
    }

    setRecipeValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const totalIdsNeeded = 1 + ingredients.length + steps.length;
      const batchIds = await generateBatchIds(totalIdsNeeded, 'id');
      const recipeId = batchIds[0];
      const userId = currentUserData?.id;

      const recipePayload = {
        recipeId,
        userId,
        createdAt: new Date().toISOString(),
        ...recipeValues,
      };

      const ingredientPayloads = ingredients.map((ingredient, index) => ({
        ingredientId: batchIds[1 + index],
        recipeId,
        ...ingredient,
      }));

      const stepPayloads = steps.map((step, index) => ({
        stepId: batchIds[1 + ingredients.length + index],
        recipeId,
        ...step,
      }));

      const allPostRequests = [
        fetch(apiSheets.recipes, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: [recipePayload] }),
        }),
        ...(ingredientPayloads.length > 0
          ? [
              fetch(apiSheets.recipesIngredients, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: ingredientPayloads }),
              }),
            ]
          : []),
        ...(stepPayloads.length > 0
          ? [
              fetch(apiSheets.recipesSteps, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: stepPayloads }),
              }),
            ]
          : []),
      ];

      await Promise.all(allPostRequests);

      await refetchSheet('recipes');

      if (typeof onCreated === 'function') onCreated(recipePayload);
      setToastVisible(true);
      onHide();
    } catch (err) {
      alert('Failed to create recipe: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmationVisible(true);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={recipeValues.title}
                onChange={handleRecipeChange}
                placeholder="Enter recipe title"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={recipeValues.description}
                onChange={handleRecipeChange}
                placeholder="Enter recipe description"
                as="textarea"
                rows={3}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Origin</Form.Label>
              <Form.Control
                name="origin"
                value={recipeValues.origin}
                onChange={handleRecipeChange}
                placeholder="Enter recipe origin"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Form.Group className="flex-fill">
                <Form.Label>Preparation Time</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    name="preparationTimeValue"
                    value={recipeValues.preparationTimeValue}
                    onChange={handleRecipeChange}
                    required
                  />
                  <Form.Select
                    name="preparationTimeUnit"
                    value={recipeValues.preparationTimeUnit}
                    onChange={handleRecipeChange}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </div>

            <div className="d-flex gap-2">
              <Form.Group className="flex-fill">
                <Form.Label>Serving Size</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    name="servingSizeValue"
                    value={recipeValues.servingSizeValue}
                    onChange={handleRecipeChange}
                    required
                  />
                  <Form.Select
                    name="servingSizeUnit"
                    value={recipeValues.servingSizeUnit}
                    onChange={handleRecipeChange}
                  >
                    <option value="servings">Servings</option>
                    <option value="lb">Pounds (lb)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="ounces">Ounces</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </div>

            <Form.Group>
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                name="tags"
                value={recipeValues.tags}
                onChange={handleRecipeChange}
                placeholder="Enter recipe tags"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Experience Reward (Max: {userRewardLimits.maxExp})
              </Form.Label>
              <Form.Control
                type="number"
                name="expReward"
                value={recipeValues.expReward}
                onChange={handleRecipeChange}
                min="0"
                max={userRewardLimits.maxExp}
              />
              <Form.Text className="text-muted">
                Available: {userRewardLimits.maxExp - recipeValues.expReward}
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Gold Reward (Max: {userRewardLimits.maxGold})
              </Form.Label>
              <Form.Control
                type="number"
                name="goldReward"
                value={recipeValues.goldReward}
                onChange={handleRecipeChange}
                min="0"
                max={userRewardLimits.maxGold}
              />
              <Form.Text className="text-muted">
                Available: {userRewardLimits.maxGold - recipeValues.goldReward}
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Gem Reward (Max: {userRewardLimits.maxGem})
              </Form.Label>
              <Form.Control
                type="number"
                name="gemReward"
                value={recipeValues.gemReward}
                onChange={handleRecipeChange}
                min="0"
                max={userRewardLimits.maxGem}
              />
              <Form.Text className="text-muted">
                Available: {userRewardLimits.maxGem - recipeValues.gemReward}
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Paid Recipe"
                name="isPaid"
                checked={recipeValues.isPaid}
                onChange={handleRecipeChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Gold Price</Form.Label>
              <Form.Control
                type="number"
                name="goldPrice"
                value={recipeValues.goldPrice}
                onChange={handleRecipeChange}
                disabled={!recipeValues.isPaid}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Gem Price</Form.Label>
              <Form.Control
                type="number"
                name="gemPrice"
                value={recipeValues.gemPrice}
                onChange={handleRecipeChange}
                disabled={!recipeValues.isPaid}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Public"
                name="isPublic"
                checked={recipeValues.isPublic}
                onChange={handleRecipeChange}
              />
            </Form.Group>

            <Button
              variant="outline-primary"
              className="w-100 my-2"
              onClick={() => setIngredientModalVisible(true)}
            >
              Add Ingredients
            </Button>
            <ListGroup className="mb-3">
              {ingredients.map((ingredient, index) => (
                <ListGroup.Item key={index}>
                  {ingredient.recipeContent} - {ingredient.servingSizeValue}{' '}
                  {ingredient.servingSizeUnit}
                </ListGroup.Item>
              ))}
            </ListGroup>

            <Button
              variant="outline-primary"
              className="w-100 my-2"
              onClick={() => setStepsModalVisible(true)}
            >
              Add Steps
            </Button>
            <ListGroup>
              {steps.map((step, index) => (
                <ListGroup.Item key={index}>{step.stepContent}</ListGroup.Item>
              ))}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={confirmationVisible} onHide={() => setConfirmationVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Recipe Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to create this recipe?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmationVisible(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setConfirmationVisible(false);
              handleSubmit();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <IngredientAdder
        show={ingredientModalVisible}
        onHide={() => setIngredientModalVisible(false)}
        ingredients={ingredients}
        setIngredients={setIngredients}
      />

      <StepsAdder
        show={stepsModalVisible}
        onHide={() => setStepsModalVisible(false)}
        steps={steps}
        setSteps={setSteps}
      />

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setToastVisible(false)}
          show={toastVisible}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Recipe Created</strong>
          </Toast.Header>
          <Toast.Body>Your recipe has been successfully created!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}