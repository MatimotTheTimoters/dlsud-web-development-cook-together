import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import {
  FaHeart, FaBookmark, FaShare, FaClock, FaFire,
  FaUtensils, FaUsers, FaStar, FaCoins, FaGem,
  FaCheck, FaPlay, FaPause, FaArrowLeft, FaShoppingCart,
  FaThumbsUp, FaThumbsDown, FaBook, FaPlus, FaTimes
} from 'react-icons/fa';
import { getRecipe, likeRecipe, saveRecipe, purchaseRecipe } from '../../api/recipes';
import { getCookbooks, addRecipeToCookbook } from '../../api/cookbooks';
import formatTime from '../../utils/formatters';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, likeRecipe: likeRecipeInContext } = useData();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [interactionLoading, setInteractionLoading] = useState({
    like: false,
    save: false,
    purchase: false,
    addToCookbook: false
  });

  // Cookbook related states
  const [cookbooks, setCookbooks] = useState([]);
  const [showCookbookModal, setShowCookbookModal] = useState(false);
  const [selectedCookbookId, setSelectedCookbookId] = useState('');
  const [cookbookLoading, setCookbookLoading] = useState(false);
  const [cookbookError, setCookbookError] = useState(null);

  // Load recipe data
  const loadRecipe = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getRecipe(id);

      if (result.success) {
        setRecipe(result.data);

        // Check if user has interacted with this recipe
        if (result.data.user_interaction) {
          // Update UI based on user interactions
          const interactions = result.data.user_interaction;
          console.log('User interactions:', interactions);
        }
      } else {
        setError(result.message || 'Failed to load recipe');
      }
    } catch (err) {
      console.error('Error loading recipe:', err);
      setError(err.message || 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  // Load user's cookbooks
  const loadCookbooks = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }

    setCookbookLoading(true);
    setCookbookError(null);

    try {
      const result = await getCookbooks();
      if (result.success) {
        setCookbooks(result.data);
      } else {
        setCookbookError(result.message || 'Failed to load cookbooks');
      }
    } catch (err) {
      console.error('Error loading cookbooks:', err);
      setCookbookError(err.message || 'Failed to load cookbooks');
    } finally {
      setCookbookLoading(false);
    }
  };

  // Add recipe to cookbook
  const handleAddToCookbook = async (cookbookId) => {
    if (!userData) {
      navigate('/login');
      return;
    }

    setInteractionLoading(prev => ({ ...prev, addToCookbook: true }));

    try {
      const result = await addRecipeToCookbook(cookbookId, id);

      if (result.success) {
        alert('✅ Recipe added to cookbook successfully!');
        setShowCookbookModal(false);
        setSelectedCookbookId('');
      } else {
        alert(result.message || 'Failed to add recipe to cookbook');
      }
    } catch (err) {
      console.error('Error adding recipe to cookbook:', err);
      alert(`Failed to add recipe to cookbook: ${err.message}`);
    } finally {
      setInteractionLoading(prev => ({ ...prev, addToCookbook: false }));
    }
  };

  // Open cookbook modal
  const openCookbookModal = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }

    setShowCookbookModal(true);
    await loadCookbooks();
  };

  // Handle recipe interactions
  const handleInteraction = async (type) => {
    if (!userData) {
      navigate('/login');
      return;
    }

    setInteractionLoading(prev => ({ ...prev, [type]: true }));

    try {
      let result;

      switch (type) {
        case 'like':
          result = await likeRecipe(id);
          break;
        case 'save':
          result = await saveRecipe(id);
          break;
        case 'purchase':
          result = await purchaseRecipe(id);
          break;
        default:
          return;
      }

      if (result.success) {
        // Update recipe data with new counts
        if (recipe) {
          setRecipe(prev => ({
            ...prev,
            recipe: {
              ...prev.recipe,
              like_count: result.data.counts?.like_count || prev.recipe.like_count,
              dislike_count: result.data.counts?.dislike_count || prev.recipe.dislike_count,
              purchase_count: result.data.counts?.purchase_count || prev.recipe.purchase_count
            },
            user_interaction: {
              ...prev.user_interaction,
              [type]: result.data.current_user_has_like || result.data.current_user_has_save || result.data.current_user_has_purchase
            }
          }));
        }

        // Show success notification
        if (type === 'purchase' && result.success) {
          alert('🎉 Recipe purchased successfully!');
        }
      } else {
        alert(result.message || `Failed to ${type} recipe`);
      }
    } catch (err) {
      console.error(`Error in ${type} interaction:`, err);
      alert(`Failed to ${type} recipe: ${err.message}`);
    } finally {
      setInteractionLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Start cooking session
  const startCookingSession = () => {
    if (!userData) {
      navigate('/login');
      return;
    }

    if (recipe?.recipe?.is_paid && !recipe?.user_interaction?.purchase) {
      alert('🔒 This is a premium recipe. Please purchase it first.');
      return;
    }

    navigate(`/cooking-session/new?recipe=${id}`);
  };

  // Format timer display
  const formatTimer = (duration, unit) => {
    if (!duration) return 'No timer';

    const totalSeconds = unit === 'minutes' ? duration * 60 :
      unit === 'hours' ? duration * 3600 : duration;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  // Toggle step completion
  const toggleStepCompletion = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(prev => prev.filter(idx => idx !== stepIndex));
    } else {
      setCompletedSteps(prev => [...prev, stepIndex]);
    }
  };

  // Start/stop timer
  const toggleTimer = () => {
    if (timerActive) {
      setTimerActive(false);
    } else if (recipe?.steps?.[0]?.timer_duration) {
      setTimerActive(true);
      setTimerSeconds(recipe.steps[0].timer_duration *
        (recipe.steps[0].timer_unit === 'minutes' ? 60 :
          recipe.steps[0].timer_unit === 'hours' ? 3600 : 1));
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;

    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  // Load recipe on component mount
  useEffect(() => {
    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="recipe-detail-loading animate__animated animate__fadeIn">
        <div className="loading-content">
          <div className="loading-spinner">
            <FaUtensils className="spinning-icon" />
          </div>
          <p className="loading-text">Cooking up recipe details...</p>
          <p className="loading-subtext">+10 EXP for patience</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail-error animate__animated animate__shakeX">
        <div className="error-content">
          <span className="error-icon">❌</span>
          <h3 className="error-title">Recipe Not Found</h3>
          <p className="error-message">{error || 'The recipe you are looking for does not exist.'}</p>
          <button
            className="back-button"
            onClick={() => navigate('/recipes')}
          >
            <FaArrowLeft /> Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const {
    recipe: recipeData,
    ingredients,
    steps,
    user_interaction
  } = recipe;

  const totalTime = (recipeData.preparation_time || 0) + (recipeData.cooking_time || 0);
  const isOwnRecipe = userData && userData.id === recipeData.user_id;
  const canCook = !recipeData.is_paid || user_interaction?.purchase || isOwnRecipe;

  return (
    <div className="recipe-detail-container animate__animated animate__fadeIn">
      {/* Header */}
      <div className="recipe-detail-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back
        </button>

        <div className="recipe-actions">
          <button
            className={`action-btn ${user_interaction?.like ? 'active' : ''}`}
            onClick={() => handleInteraction('like')}
            disabled={interactionLoading.like}
          >
            <FaHeart /> {recipeData.like_count || 0}
          </button>

          <button
            className="action-btn"
            onClick={openCookbookModal}
            disabled={interactionLoading.addToCookbook}
          >
            <FaBook /> Add to Cookbook
          </button>

          <button
            className={`action-btn ${user_interaction?.save ? 'active' : ''}`}
            onClick={() => handleInteraction('save')}
            disabled={interactionLoading.save}
          >
            <FaBookmark />
          </button>

          <button className="action-btn">
            <FaShare />
          </button>
        </div>
      </div>

      {/* Cookbook Modal */}
      {showCookbookModal && (
        <div className="modal-overlay">
          <div className="modal-content cookbook-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                <FaBook /> Add to Cookbook
              </h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowCookbookModal(false);
                  setCookbookError(null);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {cookbookLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner small">
                    <FaBook className="spinning-icon" />
                  </div>
                  <p>Loading your cookbooks...</p>
                </div>
              ) : cookbookError ? (
                <div className="error-state">
                  <span className="error-icon">❌</span>
                  <p className="error-message">{cookbookError}</p>
                  <button
                    className="btn-secondary"
                    onClick={loadCookbooks}
                  >
                    Try Again
                  </button>
                </div>
              ) : cookbooks.length === 0 ? (
                <div className="empty-state">
                  <FaBook />
                  <p>You don't have any cookbooks yet.</p>
                  <Link
                    to="/cookbooks"
                    className="btn-primary"
                    onClick={() => setShowCookbookModal(false)}
                  >
                    <FaPlus /> Create Cookbook
                  </Link>
                </div>
              ) : (
                <div className="cookbooks-selector">
                  <p className="modal-subtitle">
                    Select a cookbook to add "<strong>{recipeData.title}</strong>" to:
                  </p>

                  <div className="cookbooks-list">
                    {cookbooks.map(cookbook => (
                      <div
                        key={cookbook.id}
                        className={`cookbook-option ${selectedCookbookId === cookbook.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCookbookId(cookbook.id)}
                      >
                        <div className="cookbook-option-info">
                          <h4 className="cookbook-name">{cookbook.name}</h4>
                          <p className="cookbook-description">
                            {cookbook.description || 'No description'}
                          </p>
                          <div className="cookbook-meta">
                            <span className={`visibility-badge ${cookbook.is_public ? 'public' : 'private'}`}>
                              {cookbook.is_public ? 'Public' : 'Private'}
                            </span>
                            <span className="recipe-count">
                              {cookbook.recipe_count || 0} recipes
                            </span>
                          </div>
                        </div>
                        <div className="cookbook-option-check">
                          {selectedCookbookId === cookbook.id && (
                            <FaCheck className="check-icon" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedCookbookId && (
                    <div className="modal-actions">
                      <button
                        className="btn-primary"
                        onClick={() => handleAddToCookbook(selectedCookbookId)}
                        disabled={interactionLoading.addToCookbook}
                      >
                        {interactionLoading.addToCookbook ? (
                          <>
                            <div className="spinner-small"></div> Adding...
                          </>
                        ) : (
                          <>
                            <FaPlus /> Add to Selected Cookbook
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="recipe-hero">
        {recipeData.cover_image ? (
          <img
            src={recipeData.cover_image}
            alt={recipeData.title}
            className="recipe-cover-image"
          />
        ) : (
          <div className="recipe-cover-placeholder">
            <FaUtensils className="placeholder-icon" />
            <span>No image available</span>
          </div>
        )}

        <div className="recipe-hero-overlay">
          <h1 className="recipe-title">{recipeData.title}</h1>
          <div className="recipe-meta">
            <span className="meta-item">
              <FaClock /> {totalTime} min
            </span>
            <span className="meta-item">
              <FaFire /> {recipeData.difficulty}
            </span>
            <span className="meta-item">
              <FaUtensils /> {recipeData.serving_size} servings
            </span>
          </div>
        </div>
      </div>

      {/* Author Info */}
      <div className="recipe-author-section">
        <div className="author-info">
          {recipeData.author_picture ? (
            <img
              src={recipeData.author_picture}
              alt={recipeData.author_name}
              className="author-avatar"
            />
          ) : (
            <div className="author-avatar-placeholder">
              {recipeData.author_name?.charAt(0) || '?'}
            </div>
          )}

          <div className="author-details">
            <h4 className="author-name">👨‍🍳 {recipeData.author_name}</h4>
            <div className="author-stats">
              <span className="author-stat">
                <FaStar /> {recipeData.author_level || 'Level 1'}
              </span>
            </div>
          </div>
        </div>

        <div className="recipe-pricing">
          {recipeData.is_paid ? (
            <div className="price-tags">
              <span className="price-tag gold">
                <FaCoins /> {recipeData.gold_price} Gold
              </span>
              <span className="price-tag gem">
                <FaGem /> {recipeData.gem_price} Gems
              </span>

              {!user_interaction?.purchase && !isOwnRecipe && (
                <button
                  className="purchase-btn"
                  onClick={() => handleInteraction('purchase')}
                  disabled={interactionLoading.purchase}
                >
                  <FaShoppingCart /> Purchase Recipe
                </button>
              )}
            </div>
          ) : (
            <span className="free-badge">FREE</span>
          )}
        </div>
      </div>

      {/* Recipe Stats */}
      <div className="recipe-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{recipeData.exp_reward || 0}</div>
            <div className="stat-label">EXP Reward</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">{recipeData.gold_reward || 0}</div>
            <div className="stat-label">Gold Reward</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💎</div>
          <div className="stat-info">
            <div className="stat-value">{recipeData.gem_reward || 0}</div>
            <div className="stat-label">Gem Reward</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{recipeData.cook_count || 0}</div>
            <div className="stat-label">Times Cooked</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="recipe-tabs">
        <button
          className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          📋 Ingredients
        </button>

        <button
          className={`tab-btn ${activeTab === 'steps' ? 'active' : ''}`}
          onClick={() => setActiveTab('steps')}
        >
          📝 Steps
        </button>

        <button
          className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          🥗 Nutrition
        </button>

        <button
          className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          🏆 Rewards
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Ingredients Tab */}
        {activeTab === 'ingredients' && (
          <div className="ingredients-tab animate__animated animate__fadeIn">
            <h3 className="tab-title">Ingredients</h3>
            <p className="tab-subtitle">For {recipeData.serving_size} servings</p>

            <div className="ingredients-list">
              {ingredients?.map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  <label className="ingredient-checkbox">
                    <input
                      type="checkbox"
                      checked={completedSteps.includes(`ingredient-${index}`)}
                      onChange={() => toggleStepCompletion(`ingredient-${index}`)}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <div className="ingredient-details">
                    <span className="ingredient-name">{ingredient.name}</span>
                    <span className="ingredient-amount">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                    {ingredient.notes && (
                      <span className="ingredient-notes">{ingredient.notes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="shopping-list-actions">
              <button className="secondary-btn">
                <FaPlus /> Add to Shopping List
              </button>
            </div>
          </div>
        )}

        {/* Steps Tab */}
        {activeTab === 'steps' && (
          <div className="steps-tab animate__animated animate__fadeIn">
            <h3 className="tab-title">Cooking Steps</h3>

            <div className="steps-list">
              {steps?.map((step, index) => (
                <div
                  key={index}
                  className={`step-item ${completedSteps.includes(index) ? 'completed' : ''}`}
                >
                  <div className="step-number">{index + 1}</div>

                  <div className="step-content">
                    <p className="step-description">{step.description}</p>

                    {step.image && (
                      <div className="step-image">
                        <img src={step.image} alt={`Step ${index + 1}`} />
                      </div>
                    )}

                    {step.timer_duration && (
                      <div className="step-timer">
                        <span className="timer-icon">⏱️</span>
                        <span className="timer-text">
                          Timer: {formatTimer(step.timer_duration, step.timer_unit)}
                        </span>
                      </div>
                    )}

                    <div className="step-rewards">
                      {step.exp_reward > 0 && (
                        <span className="reward-badge exp">+{step.exp_reward} EXP</span>
                      )}
                      {step.gold_reward > 0 && (
                        <span className="reward-badge gold">+{step.gold_reward} Gold</span>
                      )}
                      {step.gem_reward > 0 && (
                        <span className="reward-badge gem">+{step.gem_reward} Gem</span>
                      )}
                    </div>
                  </div>

                  <button
                    className={`complete-btn ${completedSteps.includes(index) ? 'completed' : ''}`}
                    onClick={() => toggleStepCompletion(index)}
                  >
                    {completedSteps.includes(index) ? (
                      <>
                        <FaCheck /> Completed
                      </>
                    ) : (
                      <>
                        <FaCheck /> Mark Complete
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Timer Display */}
            {timerSeconds > 0 && (
              <div className="active-timer">
                <h4 className="timer-title">Active Timer</h4>
                <div className="timer-display">
                  <div className="timer-time">
                    {formatTimer(timerSeconds, 'seconds')}
                  </div>
                  <button
                    className="timer-control"
                    onClick={toggleTimer}
                  >
                    {timerActive ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div className="nutrition-tab animate__animated animate__fadeIn">
            <h3 className="tab-title">Nutrition Facts</h3>

            <div className="nutrition-facts">
              <div className="nutrition-main">
                <div className="nutrition-item large">
                  <span className="nutrition-label">Calories</span>
                  <span className="nutrition-value">{recipeData.total_calories || 0} kcal</span>
                </div>
              </div>

              <div className="nutrition-details">
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein</span>
                  <span className="nutrition-value">{recipeData.total_protein || 0} g</span>
                </div>

                <div className="nutrition-item">
                  <span className="nutrition-label">Carbohydrates</span>
                  <span className="nutrition-value">{recipeData.total_carbs || 0} g</span>
                </div>

                <div className="nutrition-item">
                  <span className="nutrition-label">Fat</span>
                  <span className="nutrition-value">{recipeData.total_fat || 0} g</span>
                </div>
              </div>
            </div>

            <div className="nutrition-per-serving">
              <p className="serving-note">
                * Per serving ({recipeData.serving_size || 1} serving{recipeData.serving_size !== 1 ? 's' : ''})
              </p>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="rewards-tab animate__animated animate__fadeIn">
            <h3 className="tab-title">Cooking Rewards</h3>

            <div className="rewards-summary">
              <div className="reward-card primary">
                <div className="reward-icon">🏆</div>
                <div className="reward-details">
                  <h4 className="reward-title">Complete Recipe</h4>
                  <div className="reward-values">
                    <span className="reward-value exp">+{recipeData.exp_reward || 0} EXP</span>
                    <span className="reward-value gold">+{recipeData.gold_reward || 0} Gold</span>
                    <span className="reward-value gem">+{recipeData.gem_reward || 0} Gem</span>
                  </div>
                </div>
              </div>

              <div className="step-rewards-list">
                <h4 className="section-title">Step-by-Step Rewards</h4>
                {steps?.map((step, index) => (
                  <div key={index} className="step-reward-item">
                    <span className="step-number">Step {index + 1}</span>
                    <div className="step-rewards">
                      {step.exp_reward > 0 && (
                        <span className="mini-reward exp">+{step.exp_reward} EXP</span>
                      )}
                      {step.gold_reward > 0 && (
                        <span className="mini-reward gold">+{step.gold_reward} Gold</span>
                      )}
                      {step.gem_reward > 0 && (
                        <span className="mini-reward gem">+{step.gem_reward} Gem</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bonus-rewards">
                <h4 className="section-title">Bonus Opportunities</h4>
                <div className="bonus-list">
                  <div className="bonus-item">
                    <span className="bonus-icon">⚡</span>
                    <span className="bonus-text">Complete under target time: +20% Bonus</span>
                  </div>
                  <div className="bonus-item">
                    <span className="bonus-icon">👥</span>
                    <span className="bonus-text">Cook with friends: +50% Bonus</span>
                  </div>
                  <div className="bonus-item">
                    <span className="bonus-icon">🔥</span>
                    <span className="bonus-text">Daily streak bonus: +10% per day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="recipe-action-buttons">
        {canCook ? (
          <button
            className="primary-action-btn"
            onClick={startCookingSession}
          >
            <FaPlay /> Start Cooking Session
          </button>
        ) : (
          <button
            className="primary-action-btn purchase"
            onClick={() => handleInteraction('purchase')}
            disabled={interactionLoading.purchase}
          >
            <FaShoppingCart /> Purchase to Cook ({recipeData.gold_price} Gold)
          </button>
        )}

        <button
          className="secondary-action-btn"
          onClick={openCookbookModal}
          disabled={interactionLoading.addToCookbook}
        >
          <FaBook /> Add to Cookbook
        </button>

        <button className="secondary-action-btn">
          <FaUsers /> Cook with Friends
        </button>

        {isOwnRecipe && (
          <Link to={`/recipes/${id}/edit`} className="edit-btn">
            ✏️ Edit Recipe
          </Link>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;