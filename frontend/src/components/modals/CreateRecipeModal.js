import React, { useState } from 'react';
import { Modal, Button, Form, Toast, ToastContainer, ListGroup } from 'react-bootstrap';
import { generateBatchIds } from '../../hooks/uuidHelper.js';
import { useData } from '../../contexts/DataContext.js';
import IngredientAdder from './IngredientAdder';
import StepsAdder from './StepsAdder';

// API endpoints 
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost/backend/api';
const RECIPES_API = `${API_BASE}/recipes`;

export default function CreateRecipeModal({ show, onHide, onCreated }) {
  const { currentUserData, userRewardLimits, refetchRecipes } = useData();

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
    difficulty: 'medium', 
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
      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to create a recipe');
        setLoading(false);
        return;
      }

      // Convert preparation time to minutes if in hours
      let preparationTime = null;
      if (recipeValues.preparationTimeValue) {
        preparationTime = recipeValues.preparationTimeUnit === 'hours' 
          ? recipeValues.preparationTimeValue * 60 
          : recipeValues.preparationTimeValue;
      }

      // Format ingredients 
      const formattedIngredients = ingredients.map((ingredient, index) => ({
        name: ingredient.name || ingredient.recipeContent || '',
        amount: ingredient.amount || ingredient.servingSizeValue || 0,
        unit: ingredient.unit || ingredient.servingSizeUnit || '',
        notes: ingredient.notes || '',
        order_index: index,
        calories_per_unit: ingredient.calories_per_unit || 0,
        protein_per_unit: ingredient.protein_per_unit || 0,
        carbs_per_unit: ingredient.carbs_per_unit || 0,
        fat_per_unit: ingredient.fat_per_unit || 0,
      }));

      // Format steps 
      const formattedSteps = steps.map((step, index) => ({
        description: step.description || step.stepContent || '',
        order_index: index,
        read_timer_duration: step.read_timer_duration || 10,
        timer_duration: step.timer_duration || null,
        timer_unit: step.timer_unit || 'seconds',
        exp_reward: step.exp_reward || 0,
        gold_reward: step.gold_reward || 0,
        gem_reward: step.gem_reward || 0,
        image: step.image || null,
      }));

      const payload = {
        title: recipeValues.title,
        description: recipeValues.description,
        origin: recipeValues.origin,
        preparation_time: preparationTime,
        cooking_time: null, 
        serving_size: recipeValues.servingSizeValue,
        difficulty: recipeValues.difficulty,
        is_paid: recipeValues.isPaid,
        is_public: recipeValues.isPublic,
        cover_image: null, 
        

        tags: recipeValues.tags ? recipeValues.tags.split(',').map(tag => tag.trim()) : [],
        exp_reward: recipeValues.expReward,
        gold_reward: recipeValues.goldReward,
        gem_reward: recipeValues.gemReward,
        gold_price: recipeValues.goldPrice,
        gem_price: recipeValues.gemPrice,
        total_calories: 0, 
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
        
        // Arrays
        ingredients: formattedIngredients,
        steps: formattedSteps
      };

      // Fetch
      const response = await fetch(`${RECIPES_API}/create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create recipe');
      }

      // Update recipes list
      if (refetchRecipes) {
        refetchRecipes();
      }

      if (typeof onCreated === 'function') {
        onCreated(result.recipe);
      }

      setToastVisible(true);
      
      // Reset form
      setRecipeValues({
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
        difficulty: 'medium',
      });
      setIngredients([]);
      setSteps([]);
      
      onHide();
    } catch (err) {
      console.error('Failed to create recipe:', err);
      alert('Failed to create recipe: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmationVisible(true);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    name="title"
                    value={recipeValues.title}
                    onChange={handleRecipeChange}
                    placeholder="Enter recipe title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
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

                <Form.Group className="mb-3">
                  <Form.Label>Origin</Form.Label>
                  <Form.Control
                    name="origin"
                    value={recipeValues.origin}
                    onChange={handleRecipeChange}
                    placeholder="e.g., Italian, Chinese, etc."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Difficulty *</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={recipeValues.difficulty}
                    onChange={handleRecipeChange}
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preparation Time</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      name="preparationTimeValue"
                      value={recipeValues.preparationTimeValue}
                      onChange={handleRecipeChange}
                      min="0"
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

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Serving Size</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="number"
                      name="servingSizeValue"
                      value={recipeValues.servingSizeValue}
                      onChange={handleRecipeChange}
                      min="1"
                    />
                    <Form.Select
                      name="servingSizeUnit"
                      value={recipeValues.servingSizeUnit}
                      onChange={handleRecipeChange}
                    >
                      <option value="servings">Servings</option>
                      <option value="pieces">Pieces</option>
                    </Form.Select>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma separated)</Form.Label>
                  <Form.Control
                    name="tags"
                    value={recipeValues.tags}
                    onChange={handleRecipeChange}
                    placeholder="e.g., pasta, italian, dinner"
                  />
                </Form.Group>

                <div className="border p-3 mb-3">
                  <h6>Rewards</h6>
                  <Form.Group className="mb-2">
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
                  </Form.Group>

                  <Form.Group className="mb-2">
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
                  </Form.Group>

                  <Form.Group className="mb-2">
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
                  </Form.Group>
                </div>

                <div className="border p-3">
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Paid Recipe"
                      name="isPaid"
                      checked={recipeValues.isPaid}
                      onChange={handleRecipeChange}
                    />
                  </Form.Group>

                  {recipeValues.isPaid && (
                    <>
                      <Form.Group className="mb-2">
                        <Form.Label>Gold Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="goldPrice"
                          value={recipeValues.goldPrice}
                          onChange={handleRecipeChange}
                          min="0"
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Gem Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="gemPrice"
                          value={recipeValues.gemPrice}
                          onChange={handleRecipeChange}
                          min="0"
                        />
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Make Recipe Public"
                      name="isPublic"
                      checked={recipeValues.isPublic}
                      onChange={handleRecipeChange}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <div className="row">
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Ingredients</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setIngredientModalVisible(true)}
                  >
                    Add Ingredient
                  </Button>
                </div>
                <ListGroup className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {ingredients.length === 0 ? (
                    <ListGroup.Item className="text-muted text-center">
                      No ingredients added yet
                    </ListGroup.Item>
                  ) : (
                    ingredients.map((ingredient, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between">
                        <div>
                          <strong>{ingredient.name || ingredient.recipeContent}</strong>
                          {ingredient.amount && ` - ${ingredient.amount} ${ingredient.unit || ingredient.servingSizeUnit}`}
                          {ingredient.notes && <div className="text-muted small">{ingredient.notes}</div>}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                          onClick={() => {
                            setIngredients(ingredients.filter((_, i) => i !== index));
                          }}
                        >
                          Remove
                        </Button>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </div>

              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Steps</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setStepsModalVisible(true)}
                  >
                    Add Step
                  </Button>
                </div>
                <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {steps.length === 0 ? (
                    <ListGroup.Item className="text-muted text-center">
                      No steps added yet
                    </ListGroup.Item>
                  ) : (
                    steps.map((step, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between">
                        <div>
                          <strong>Step {index + 1}:</strong>
                          <div>{step.description || step.stepContent}</div>
                          {step.timer_duration && (
                            <div className="text-muted small">
                              Timer: {step.timer_duration} {step.timer_unit}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                          onClick={() => {
                            setSteps(steps.filter((_, i) => i !== index));
                          }}
                        >
                          Remove
                        </Button>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !recipeValues.title || !recipeValues.description}>
              {loading ? 'Creating...' : 'Create Recipe'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={confirmationVisible} onHide={() => setConfirmationVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Recipe Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to create this recipe?</p>
          <div className="bg-light p-3 rounded">
            <strong>{recipeValues.title}</strong>
            <div className="mt-2">
              <small>
                Difficulty: {recipeValues.difficulty}<br />
                Ingredients: {ingredients.length}<br />
                Steps: {steps.length}
              </small>
            </div>
          </div>
        </Modal.Body>
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
            Confirm Creation
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
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Success!</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            Recipe created successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}