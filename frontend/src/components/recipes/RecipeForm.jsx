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
      // Prepare data for API
      const recipeData = {
        title: formData.title,
        description: formData.description,
        origin: formData.origin,
        preparation_time: parseInt(formData.preparation_time) || null,
        cooking_time: parseInt(formData.cooking_time) || null,
        serving_size: parseInt(formData.serving_size) || null,
        difficulty: formData.difficulty,
        is_paid: formData.is_paid,
        is_public: formData.is_public,
        cover_image: formData.cover_image,
        ingredients: formData.ingredients.map((ing, index) => ({
          ...ing,
          amount: parseFloat(ing.amount) || null,
          order_index: index,
          calories_per_unit: parseFloat(ing.calories_per_unit) || 0,
          protein_per_unit: parseFloat(ing.protein_per_unit) || 0,
          carbs_per_unit: parseFloat(ing.carbs_per_unit) || 0,
          fat_per_unit: parseFloat(ing.fat_per_unit) || 0
        })),
        steps: formData.steps.map((step, index) => ({
          ...step,
          timer_duration: parseInt(step.timer_duration) || null,
          read_timer_duration: 10,
          order_index: index,
          exp_reward: 0,
          gold_reward: 0,
          gem_reward: 0
        })),
        tags: formData.tags,
        exp_reward: parseInt(formData.exp_reward) || 0,
        gold_reward: parseInt(formData.gold_reward) || 0,
        gem_reward: parseInt(formData.gem_reward) || 0,
        gold_price: parseInt(formData.gold_price) || 0,
        gem_price: parseInt(formData.gem_price) || 0,
        total_calories: formData.total_calories || 0,
        total_protein: formData.total_protein || 0,
        total_carbs: formData.total_carbs || 0,
        total_fat: formData.total_fat || 0
      };
      
      let result;
      
      if (recipeId) {
        // Update existing recipe
        result = await updateRecipeInContext(recipeId, recipeData);
      } else {
        // Create new recipe
        result = await addRecipe(recipeData);
      }
      
      if (result.success) {
        setSuccessMessage(recipeId ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        
        // Show success notification with rewards
        if (!recipeId && result.data?.rewards) {
          const rewards = result.data.rewards;
          const rewardMessage = `🎉 Recipe created! You earned: ${rewards.exp} EXP, ${rewards.gold} Gold, ${rewards.gems} Gems`;
          setSuccessMessage(rewardMessage);
        }
        
        // Redirect after delay
        setTimeout(() => {
          if (recipeId) {
            navigate(`/recipes/${recipeId}`);
          } else {
            navigate('/recipes');
          }
        }, 2000);
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
    <div className="recipe-form-container animate__animated animate__fadeIn">
      <div className="recipe-form-header">
        <h2 className="form-title">
          {recipeId ? '✏️ Edit Recipe' : '🍳 Create New Recipe'}
        </h2>
        <p className="form-subtitle">
          {recipeId ? 'Update your recipe details' : 'Share your culinary creation with the community!'}
        </p>
      </div>
      
      {successMessage && (
        <div className="success-message animate__animated animate__bounceIn">
          <div className="success-content">
            <span className="success-icon">🎉</span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {errors.submit && (
        <div className="error-message animate__animated animate__shakeX">
          <span className="error-icon">❌</span>
          <span>{errors.submit}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="recipe-form">
        {/* Basic Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <FaImage className="section-icon" /> Basic Information
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Recipe Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Spaghetti Carbonara"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your recipe..."
                rows="3"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="origin">Cuisine/Origin</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                placeholder="e.g., Italian, Mexican, etc."
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="preparation_time">
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
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cooking_time">
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
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="serving_size">Serving Size</label>
              <input
                type="number"
                id="serving_size"
                name="serving_size"
                value={formData.serving_size}
                onChange={handleInputChange}
                placeholder="4"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Total Time: {totalTime} minutes</label>
              <div className="time-summary">
                <span className="time-badge">⏱️ {totalTime} min</span>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cover_image">Cover Image</label>
            <div className="image-upload-area">
              {formData.cover_image_url ? (
                <div className="image-preview">
                  <img src={formData.cover_image_url} alt="Preview" />
                  <button 
                    type="button" 
                    className="change-image-btn"
                    onClick={() => document.getElementById('cover_image_input').click()}
                  >
                    <FaUpload /> Change Image
                  </button>
                </div>
              ) : (
                <div 
                  className="upload-placeholder"
                  onClick={() => document.getElementById('cover_image_input').click()}
                >
                  <FaImage className="upload-icon" />
                  <span>Click to upload cover image</span>
                </div>
              )}
              <input
                type="file"
                id="cover_image_input"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
        
        {/* Ingredients Section */}
        <div className="form-section">
          <h3 className="section-title">
            <FaListOl className="section-icon" /> Ingredients
            {errors.ingredients && <span className="section-error">{errors.ingredients}</span>}
          </h3>
          
          <div className="ingredients-list">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <div className="ingredient-number">{index + 1}.</div>
                <div className="ingredient-fields">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className={errors[`ingredient_${index}`] ? 'error' : ''}
                  />
                  <input
                    type="text"
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
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
                  />
                </div>
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeIngredient(index)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="ingredients-actions">
            <button type="button" className="add-btn" onClick={addIngredient}>
              <FaPlus /> Add Ingredient
            </button>
            
            <button 
              type="button" 
              className="calculate-btn"
              onClick={calculateNutrition}
            >
              <FaCalculator /> Calculate Nutrition
            </button>
          </div>
          
          {formData.total_calories > 0 && (
            <div className="nutrition-summary">
              <h4>Nutrition Summary</h4>
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-label">Calories:</span>
                  <span className="nutrition-value">{formData.total_calories} kcal</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein:</span>
                  <span className="nutrition-value">{formData.total_protein} g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbs:</span>
                  <span className="nutrition-value">{formData.total_carbs} g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fat:</span>
                  <span className="nutrition-value">{formData.total_fat} g</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Steps Section */}
        <div className="form-section">
          <h3 className="section-title">
            <FaListOl className="section-icon" /> Steps
            {errors.steps && <span className="section-error">{errors.steps}</span>}
          </h3>
          
          <div className="steps-list">
            {formData.steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-number">{index + 1}.</div>
                <div className="step-fields">
                  <textarea
                    placeholder="Step description"
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                    rows="2"
                    className={errors[`step_${index}`] ? 'error' : ''}
                  />
                  <div className="step-timer">
                    <input
                      type="number"
                      placeholder="Timer duration"
                      value={step.timer_duration}
                      onChange={(e) => updateStep(index, 'timer_duration', e.target.value)}
                      min="0"
                    />
                    <select
                      value={step.timer_unit}
                      onChange={(e) => updateStep(index, 'timer_unit', e.target.value)}
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
                    className="remove-btn"
                    onClick={() => removeStep(index)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="steps-actions">
            <button type="button" className="add-btn" onClick={addStep}>
              <FaPlus /> Add Step
            </button>
            
            <div className="steps-summary">
              <span className="summary-text">
                Total: {totalSteps} steps, {totalTime} minutes
              </span>
            </div>
          </div>
        </div>
        
        {/* Settings Section */}
        <div className="form-section">
          <h3 className="section-title">⚙️ Settings</h3>
          
          <div className="settings-grid">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleInputChange}
                />
                <span className="checkbox-label">Make recipe public</span>
              </label>
              <p className="helper-text">Public recipes are visible to all users</p>
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="is_paid"
                  checked={formData.is_paid}
                  onChange={handleInputChange}
                />
                <span className="checkbox-label">Premium recipe</span>
              </label>
              <p className="helper-text">Users need to purchase this recipe</p>
            </div>
          </div>
          
          {formData.is_paid && (
            <div className="pricing-section">
              <h4>Pricing</h4>
              <div className="pricing-grid">
                <div className="form-group">
                  <label>Gold Price</label>
                  <input
                    type="number"
                    name="gold_price"
                    value={formData.gold_price}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Gem Price</label>
                  <input
                    type="number"
                    name="gem_price"
                    value={formData.gem_price}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Rewards Section */}
        <div className="form-section rewards-section">
          <h3 className="section-title">🏆 Cooking Rewards</h3>
          <p className="rewards-description">
            Set the rewards users earn when cooking this recipe
          </p>
          
          <div className="rewards-grid">
            <div className="reward-item">
              <span className="reward-icon">⭐</span>
              <div className="reward-info">
                <label>EXP Reward</label>
                <input
                  type="number"
                  name="exp_reward"
                  value={formData.exp_reward}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            
            <div className="reward-item">
              <span className="reward-icon">💰</span>
              <div className="reward-info">
                <label>Gold Reward</label>
                <input
                  type="number"
                  name="gold_reward"
                  value={formData.gold_reward}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                />
              </div>
            </div>
            
            <div className="reward-item">
              <span className="reward-icon">💎</span>
              <div className="reward-info">
                <label>Gem Reward</label>
                <input
                  type="number"
                  name="gem_reward"
                  value={formData.gem_reward}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                />
              </div>
            </div>
          </div>
          
          <div className="rewards-summary">
            <p className="summary-text">
              Total Rewards: <span className="highlight">{formData.exp_reward} EXP</span> • 
              <span className="highlight"> {formData.gold_reward} Gold</span> • 
              <span className="highlight"> {formData.gem_reward} Gems</span>
            </p>
          </div>
        </div>
        
        {/* Submit Section */}
        <div className="submit-section">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
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
          
          <div className="creation-rewards">
            <p className="rewards-note">
              <span className="reward-badge">🎮</span>
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