import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import apiSheets from '../../constants/api.js';
import { generateBatchIds } from '../../hooks/uuidHelper.js';
import { useAuth } from '../../hooks/useAuth.js';
import { calculateMaxRewards } from '../../utils/rewardCalculator.js';

export default function CreateRecipeModal({ show, onHide, onCreated }) {
  const { user } = useAuth();
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
  const [userRewardLimits, setUserRewardLimits] = useState({
    maxExp: 100,
    maxGold: 50,
    maxGem: 5,
    maxGoldPrice: 100,
    maxGemPrice: 10,
  });

  useEffect(() => {
    const fetchUserLimits = async () => {
      if (!user?.id) return;

      try {
        const userRes = await fetch(`${apiSheets.users}&id=${user.id}`);
        const userData = await userRes.json();

        if (userData.length > 0) {
          const userStats = userData[0];
          const limits = calculateMaxRewards(userStats);
          setUserRewardLimits({
            ...limits,
            maxGoldPrice: userStats.maxGoldPrice || 100,
            maxGemPrice: userStats.maxGemPrice || 10,
          });
        }
      } catch (error) {
        console.warn('Failed to fetch user limits:', error);
      }
    };

    if (show) {
      fetchUserLimits();
    }
  }, [user?.id, show]);

  const handleRecipeChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Auto-cap reward values to user limits
    if (name === 'expReward' && Number(value) > userRewardLimits.maxExp) {
      setRecipeValues((prev) => ({ ...prev, [name]: userRewardLimits.maxExp }));
      return;
    }
    if (name === 'goldReward' && Number(value) > userRewardLimits.maxGold) {
      setRecipeValues((prev) => ({ ...prev, [name]: userRewardLimits.maxGold }));
      return;
    }
    if (name === 'gemReward' && Number(value) > userRewardLimits.maxGem) {
      setRecipeValues((prev) => ({ ...prev, [name]: userRewardLimits.maxGem }));
      return;
    }
    if (name === 'goldPrice' && Number(value) > userRewardLimits.maxGoldPrice) {
      setRecipeValues((prev) => ({ ...prev, [name]: userRewardLimits.maxGoldPrice }));
      return;
    }
    if (name === 'gemPrice' && Number(value) > userRewardLimits.maxGemPrice) {
      setRecipeValues((prev) => ({ ...prev, [name]: userRewardLimits.maxGemPrice }));
      return;
    }

    setRecipeValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { ingredientId: '', recipeContent: '', servingSizeValue: '', servingSizeUnit: 'grams' },
    ]);
  };

  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { stepId: '', stepContent: '' }]);
  };

  const handleStepChange = (index, value) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, stepContent: value } : step))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalIdsNeeded = 1 + ingredients.length + steps.length;
      const batchIds = await generateBatchIds(totalIdsNeeded, 'id');
      
      const recipeId = batchIds[0];
      const ingredientIds = batchIds.slice(1, 1 + ingredients.length);
      const stepIds = batchIds.slice(1 + ingredients.length);

      const coverImageUrl = '/src/assets/placeholders/new-recipe.png';

      // Prepare recipe data
      const preparationTime = `${recipeValues.preparationTimeValue} ${recipeValues.preparationTimeUnit}`;
      const servingSize = `${recipeValues.servingSizeValue} ${recipeValues.servingSizeUnit}`;
      const recipePayload = {
        id: recipeId,
        createdAt: new Date().toISOString(),
        coverImage: coverImageUrl,
        title: recipeValues.title,
        description: recipeValues.description,
        origin: recipeValues.origin.split(',').map((o) => o.trim()).join(','),
        preparationTime,
        servingSize,
        tags: recipeValues.tags.split(',').map((tag) => tag.trim()).join(','),
        expReward: recipeValues.expReward,
        goldReward: recipeValues.goldReward,
        gemReward: recipeValues.gemReward,
        isPaid: recipeValues.isPaid,
        goldPrice: recipeValues.isPaid ? recipeValues.goldPrice : 0,
        gemPrice: recipeValues.isPaid ? recipeValues.gemPrice : 0,
        isPublic: recipeValues.isPublic,
        author: user?.fullName || '',
      };

      const allPostRequests = [];

      // Post recipe to SheetDB
      allPostRequests.push(
        fetch(apiSheets.recipes, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: [recipePayload] }),
        })
      );

      // Prepare and post ingredients
      if (ingredients.length > 0) {
        const ingredientPayloads = ingredients.map((ingredient, index) => ({
          ingredientId: ingredientIds[index],
          createdAt: new Date().toISOString(),
          recipeId,
          recipeContent: ingredient.recipeContent,
          servingSize: `${ingredient.servingSizeValue} ${ingredient.servingSizeUnit}`,
        }));

        allPostRequests.push(
          fetch(apiSheets.recipesIngredients, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: ingredientPayloads }),
          })
        );
      }

      // Prepare and post steps
      if (steps.length > 0) {
        const stepPayloads = steps.map((step, index) => ({
          stepId: stepIds[index],
          createdAt: new Date().toISOString(),
          recipeId,
          stepContent: step.stepContent,
        }));

        allPostRequests.push(
          fetch(apiSheets.recipesSteps, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: stepPayloads }),
          })
        );
      }

      // Execute all POST requests in parallel
      await Promise.all(allPostRequests);

      // Notify parent and close modal
      if (typeof onCreated === 'function') onCreated(recipePayload);
      onHide();
    } catch (err) {
      alert('Failed to create recipe: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="modal-ct">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* 🚀 REMOVED file upload input from the form */}
          
          {/* Recipe Fields */}
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={recipeValues.title}
              onChange={handleRecipeChange}
              placeholder="Enter recipe title"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              value={recipeValues.description}
              onChange={handleRecipeChange}
              placeholder="Enter recipe description"
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

          {/* Ingredients */}
          <Button variant="link" onClick={addIngredient}>
            + Add Ingredient
          </Button>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="mb-2">
              <Form.Control
                placeholder="Ingredient content"
                value={ingredient.recipeContent}
                onChange={(e) =>
                  handleIngredientChange(index, 'recipeContent', e.target.value)
                }
              />
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Serving size"
                  value={ingredient.servingSizeValue}
                  onChange={(e) =>
                    handleIngredientChange(index, 'servingSizeValue', e.target.value)
                  }
                />
                <Form.Select
                  value={ingredient.servingSizeUnit}
                  onChange={(e) =>
                    handleIngredientChange(index, 'servingSizeUnit', e.target.value)
                  }
                >
                  <option value="grams">Grams</option>
                  <option value="oz">Ounces</option>
                  <option value="lb">Pounds</option>
                  <option value="kg">Kilograms</option>
                </Form.Select>
              </div>
            </div>
          ))}

          {/* Steps */}
          <Button variant="link" onClick={addStep}>
            + Add Step
          </Button>
          {steps.map((step, index) => (
            <div key={index} className="mb-2">
              <Form.Control
                placeholder="Step content"
                value={step.stepContent}
                onChange={(e) => handleStepChange(index, e.target.value)}
              />
            </div>
          ))}
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
  );
}