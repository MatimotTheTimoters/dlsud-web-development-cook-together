import React, { useState, useEffect, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import {
  FaPlus, FaTrash, FaImage, FaListOl, FaClock,
  FaBalanceScale, FaCalculator, FaSave, FaUpload
} from 'react-icons/fa';

const RecipeForm = ({ recipeId, initialData = null }) => {
  const navigate = useNavigate();
  const { addRecipe, updateRecipeInContext } = useData();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    origin: '',
    preparation_time: '',
    cooking_time: '',
    serving_size: '',
    difficulty: 'medium',
    is_paid: false,
    is_public: true,
    cover_image: null,
    cover_image_url: '',
    ingredients: [{ name: '', amount: '', unit: '', notes: '' }],
    steps: [{ description: '', timer_duration: '', timer_unit: 'seconds' }],
    tags: [],
    exp_reward: 0,
    gold_reward: 0,
    gem_reward: 0,
    gold_price: 0,
    gem_price: 0
  });

  // Load recipe data if editing
  useEffect(() => {
    if (recipeId && initialData) {
      setFormData({
        ...initialData,
        cover_image: null, // File will be re-uploaded if changed
        cover_image_url: initialData.cover_image || ''
      });
    }
  }, [recipeId, initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          cover_image: file,
          cover_image_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '', notes: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { description: '', timer_duration: '', timer_unit: 'seconds' }]
    }));
  };

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const updateStep = (index, field, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index][field] = value;
    setFormData(prev => ({ ...prev, steps: updatedSteps }));
  };

  const calculateNutrition = () => {
    // Calculate total nutrition from ingredients
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    formData.ingredients.forEach(ing => {
      const amount = parseFloat(ing.amount) || 0;
      totalCalories += amount * (ing.calories_per_unit || 0);
      totalProtein += amount * (ing.protein_per_unit || 0);
      totalCarbs += amount * (ing.carbs_per_unit || 0);
      totalFat += amount * (ing.fat_per_unit || 0);
    });

    setFormData(prev => ({
      ...prev,
      total_calories: Math.round(totalCalories),
      total_protein: Math.round(totalProtein),
      total_carbs: Math.round(totalCarbs),
      total_fat: Math.round(totalFat)
    }));

    return { totalCalories, totalProtein, totalCarbs, totalFat };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.ingredients.length === 0) newErrors.ingredients = 'At least one ingredient is required';
    if (formData.steps.length === 0) newErrors.steps = 'At least one step is required';

    // Validate ingredients
    formData.ingredients.forEach((ing, index) => {
      if (!ing.name.trim()) {
        newErrors[`ingredient_${index}`] = 'Ingredient name is required';
      }
    });

    // Validate steps
    formData.steps.forEach((step, index) => {
      if (!step.description.trim()) {
        newErrors[`step_${index}`] = 'Step description is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      let result;

      if (recipeId) {
        // Update existing recipe with image support
        result = await updateRecipeWithImage(
          recipeId,
          {
            title: formData.title,
            description: formData.description,
            // ... other fields ...
          },
          formData.cover_image // Pass the file object
        );
      } else {
        // Create new recipe with image support
        result = await createRecipeWithImage(
          {
            title: formData.title,
            description: formData.description,
            // ... other fields ...
          },
          formData.cover_image // Pass the file object
        );
      }

      if (result.success) {
        // Handle success...
      } else {
        setErrors({ submit: result.error || 'Failed to save recipe' });
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      setErrors({ submit: error.message || 'Failed to save recipe' });
    } finally {
      setLoading(false);
    }
  };

  const totalTime = (parseInt(formData.preparation_time) || 0) + (parseInt(formData.cooking_time) || 0);
  const totalSteps = formData.steps.length;

  return (
    <div className="recipe-form-container form-layout animate__animated animate__fadeIn">
      <div className="card-header">
        <h2 className="form-title">
          {recipeId ? '✏️ Edit Recipe' : '🍳 Create New Recipe'}
        </h2>
        <p className="form-subtitle">
          {recipeId ? 'Update your recipe details' : 'Share your culinary creation with the community!'}
        </p>
      </div>

      {successMessage && (
        <div className="notification notification-success animate__animated animate__bounceIn">
          <div className="notification-content">
            <span className="notification-icon">🎉</span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="notification notification-error animate__animated animate__shakeX">
          <span className="notification-icon">❌</span>
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="recipe-form">
        {/* Basic Information Section */}
        <div className="card-body">
          <h3 className="section-title">
            <FaImage className="section-icon" /> Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Recipe Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Spaghetti Carbonara"
                className={`form-control ${errors.title ? 'form-control-error' : ''}`}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="difficulty" className="form-label">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label htmlFor="description" className="form-label">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your recipe..."
                rows="3"
                className={`form-control ${errors.description ? 'form-control-error' : ''}`}
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="origin" className="form-label">Cuisine/Origin</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                placeholder="e.g., Italian, Mexican, etc."
                className="form-control"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="form-group">
              <label htmlFor="preparation_time" className="form-label">
                <FaClock /> Prep Time (minutes)
              </label>
              <input
                type="number"
                id="preparation_time"
                name="preparation_time"
                value={formData.preparation_time}
                onChange={handleInputChange}
                placeholder="15"
                min="0"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cooking_time" className="form-label">
                <FaClock /> Cook Time (minutes)
              </label>
              <input
                type="number"
                id="cooking_time"
                name="cooking_time"
                value={formData.cooking_time}
                onChange={handleInputChange}
                placeholder="30"
                min="0"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="serving_size" className="form-label">Serving Size</label>
              <input
                type="number"
                id="serving_size"
                name="serving_size"
                value={formData.serving_size}
                onChange={handleInputChange}
                placeholder="4"
                min="1"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Time</label>
              <div className="time-summary">
                <span className="badge badge-info">⏱️ {totalTime} min</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cover_image" className="form-label">Cover Image</label>
            <div className="image-upload-area">
              {formData.cover_image_url ? (
                <div className="card">
                  <div className="card-body">
                    <img src={formData.cover_image_url} alt="Preview" className="rounded-lg w-full h-48 object-cover" />
                    <button
                      type="button"
                      className="btn-rpg btn-rpg-secondary mt-2"
                      onClick={() => document.getElementById('cover_image_input').click()}
                    >
                      <FaUpload /> Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="card border-dashed border-2 border-gray-300 p-8 text-center cursor-pointer hover:border-chef-red"
                  onClick={() => document.getElementById('cover_image_input').click()}
                >
                  <FaImage className="text-4xl text-gray-400 mb-2 mx-auto" />
                  <span className="text-gray-500">Click to upload cover image</span>
                </div>
              )}
              <input
                type="file"
                id="cover_image_input"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="card-body border-t">
          <h3 className="section-title">
            <FaListOl className="section-icon" /> Ingredients
            {errors.ingredients && <span className="text-chef-red ml-2">{errors.ingredients}</span>}
          </h3>

          <div className="list-layout mb-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="list-item">
                <div className="list-icon font-bold">{index + 1}.</div>
                <div className="list-content grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className={`form-control ${errors[`ingredient_${index}`] ? 'form-control-error' : ''}`}
                  />
                  <input
                    type="text"
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    className="form-control"
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="form-control"
                  >
                    <option value="">Unit</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="L">L</option>
                    <option value="tsp">tsp</option>
                    <option value="tbsp">tbsp</option>
                    <option value="cup">cup</option>
                    <option value="piece">piece</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={ingredient.notes}
                    onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                    className="form-control"
                  />
                </div>
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    className="btn-rpg btn-rpg-sm btn-rpg-secondary"
                    onClick={() => removeIngredient(index)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button type="button" className="btn-rpg btn-rpg-primary" onClick={addIngredient}>
              <FaPlus /> Add Ingredient
            </button>

            <button
              type="button"
              className="btn-rpg btn-rpg-gold"
              onClick={calculateNutrition}
            >
              <FaCalculator /> Calculate Nutrition
            </button>
          </div>

          {formData.total_calories > 0 && (
            <div className="card bg-gray-50">
              <div className="card-body">
                <h4 className="font-bold mb-2">Nutrition Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-chef-red">{formData.total_calories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-sizzling-orange">{formData.total_protein}</div>
                    <div className="text-sm text-gray-600">Protein (g)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gold-coin">{formData.total_carbs}</div>
                    <div className="text-sm text-gray-600">Carbs (g)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-rare-gem">{formData.total_fat}</div>
                    <div className="text-sm text-gray-600">Fat (g)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Steps Section */}
        <div className="card-body border-t">
          <h3 className="section-title">
            <FaListOl className="section-icon" /> Steps
            {errors.steps && <span className="text-chef-red ml-2">{errors.steps}</span>}
          </h3>

          <div className="list-layout mb-4">
            {formData.steps.map((step, index) => (
              <div key={index} className="list-item">
                <div className="list-icon font-bold">{index + 1}.</div>
                <div className="list-content flex-1">
                  <textarea
                    placeholder="Step description"
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                    rows="2"
                    className={`form-control mb-2 ${errors[`step_${index}`] ? 'form-control-error' : ''}`}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Timer duration"
                      value={step.timer_duration}
                      onChange={(e) => updateStep(index, 'timer_duration', e.target.value)}
                      min="0"
                      className="form-control w-32"
                    />
                    <select
                      value={step.timer_unit}
                      onChange={(e) => updateStep(index, 'timer_unit', e.target.value)}
                      className="form-control w-32"
                    >
                      <option value="seconds">seconds</option>
                      <option value="minutes">minutes</option>
                      <option value="hours">hours</option>
                    </select>
                  </div>
                </div>
                {formData.steps.length > 1 && (
                  <button
                    type="button"
                    className="btn-rpg btn-rpg-sm btn-rpg-secondary"
                    onClick={() => removeStep(index)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button type="button" className="btn-rpg btn-rpg-primary" onClick={addStep}>
              <FaPlus /> Add Step
            </button>

            <div className="text-gray-600">
              Total: {totalSteps} steps, {totalTime} minutes
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="card-body border-t">
          <h3 className="section-title">⚙️ Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label className="form-check-label">Make recipe public</label>
              <p className="text-sm text-gray-500 mt-1">Public recipes are visible to all users</p>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                name="is_paid"
                checked={formData.is_paid}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label className="form-check-label">Premium recipe</label>
              <p className="text-sm text-gray-500 mt-1">Users need to purchase this recipe</p>
            </div>
          </div>

          {formData.is_paid && (
            <div className="card bg-gray-50">
              <div className="card-body">
                <h4 className="font-bold mb-2">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Gold Price</label>
                    <input
                      type="number"
                      name="gold_price"
                      value={formData.gold_price}
                      onChange={handleInputChange}
                      min="0"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gem Price</label>
                    <input
                      type="number"
                      name="gem_price"
                      value={formData.gem_price}
                      onChange={handleInputChange}
                      min="0"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rewards Section */}
        <div className="card-body border-t">
          <h3 className="section-title">🏆 Cooking Rewards</h3>
          <p className="text-gray-600 mb-4">
            Set the rewards users earn when cooking this recipe
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="card-body text-center">
                <div className="text-3xl mb-2">⭐</div>
                <label className="block font-semibold mb-2">EXP Reward</label>
                <input
                  type="number"
                  name="exp_reward"
                  value={formData.exp_reward}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="form-control text-center"
                />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="card-body text-center">
                <div className="text-3xl mb-2">💰</div>
                <label className="block font-semibold mb-2">Gold Reward</label>
                <input
                  type="number"
                  name="gold_reward"
                  value={formData.gold_reward}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className="form-control text-center"
                />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="card-body text-center">
                <div className="text-3xl mb-2">💎</div>
                <label className="block font-semibold mb-2">Gem Reward</label>
                <input
                  type="number"
                  name="gem_reward"
                  value={formData.gem_reward}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  className="form-control text-center"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">
              Total Rewards: <span className="text-xp-purple">{formData.exp_reward} EXP</span> •
              <span className="text-gold-coin"> {formData.gold_reward} Gold</span> •
              <span className="text-rare-gem"> {formData.gem_reward} Gems</span>
            </p>
          </div>
        </div>

        {/* Submit Section */}
        <div className="card-footer">
          <button
            type="submit"
            className="btn-rpg btn-rpg-primary btn-rpg-lg w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-icon"></span>
                {recipeId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {recipeId ? (
                  <>
                    <FaSave /> Update Recipe
                  </>
                ) : (
                  <>
                    🍳 Create Recipe & Earn Rewards
                  </>
                )}
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              <span className="inline-block mr-2">🎮</span>
              {recipeId ?
                'Update your recipe to keep it fresh!' :
                'Create this recipe to earn creator rewards!'
              }
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;