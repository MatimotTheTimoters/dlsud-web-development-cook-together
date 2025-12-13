import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaHeart, FaBookmark, FaShare, FaClock, FaFire,
  FaUtensils, FaUsers, FaStar, FaCoins, FaGem,
  FaCheck, FaPlay, FaPause, FaArrowLeft, FaShoppingCart,
  FaThumbsUp, FaThumbsDown, FaBook, FaPlus, FaTimes,
  FaListOl, FaBalanceScale, FaCalculator, FaFlagCheckered
} from 'react-icons/fa';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getCurrentUser } = useAuth();

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
    purchase: false
  });

  const loadRecipe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/recipes/show.php?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();

      if (result.success) {
        setRecipe(result.data);
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

  const handleInteraction = async (type) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setInteractionLoading(prev => ({ ...prev, [type]: true }));

    try {
      const response = await fetch('/api/recipes/interact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          recipe_id: id,
          interaction_type: type
        })
      });
      const result = await response.json();

      if (result.success) {
        if (recipe) {
          setRecipe(prev => ({
            ...prev,
            recipe: {
              ...prev.recipe,
              like_count: result.data.like_count || prev.recipe.like_count,
              save_count: result.data.save_count || prev.recipe.save_count
            }
          }));
        }

        if (type === 'purchase') {
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

  const startCookingSession = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (recipe?.recipe?.is_paid && !recipe?.user_interaction?.purchase) {
      alert('🔒 This is a premium recipe. Please purchase it first.');
      return;
    }

    navigate(`/cooking-session/new?recipe=${id}`);
  };

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

  const toggleStepCompletion = (stepIndex) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(prev => prev.filter(idx => idx !== stepIndex));
    } else {
      setCompletedSteps(prev => [...prev, stepIndex]);
    }
  };

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
  const currentUser = getCurrentUser();
  const isOwnRecipe = currentUser && currentUser.id === recipeData.user_id;
  const canCook = !recipeData.is_paid || user_interaction?.purchase || isOwnRecipe;

  return (
    <div className="recipe-detail-container animate__animated animate__fadeIn">
      <div className="card-header flex justify-between items-center">
        <button
          className="btn-rpg btn-rpg-secondary"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex gap-2">
          <button
            className={`btn-rpg btn-rpg-sm ${user_interaction?.like ? 'btn-rpg-success' : 'btn-rpg-secondary'}`}
            onClick={() => handleInteraction('like')}
            disabled={interactionLoading.like}
          >
            <FaHeart /> {recipeData.like_count || 0}
          </button>

          <button
            className={`btn-rpg btn-rpg-sm ${user_interaction?.save ? 'btn-rpg-gold' : 'btn-rpg-secondary'}`}
            onClick={() => handleInteraction('save')}
            disabled={interactionLoading.save}
          >
            <FaBookmark />
          </button>

          <button
            className="btn-rpg btn-rpg-sm btn-rpg-primary"
            onClick={() => handleInteraction('share')}
          >
            <FaShare />
          </button>
        </div>
      </div>

      <div className="card-recipe">
        {recipeData.cover_image ? (
          <img
            src={recipeData.cover_image}
            alt={recipeData.title}
            className="card-recipe-image"
          />
        ) : (
          <div className="card-recipe-image bg-gray-200 flex items-center justify-center">
            <FaUtensils className="text-6xl text-gray-400" />
          </div>
        )}
        <div className="card-body relative">
          <h1 className="recipe-title text-3xl md:text-4xl font-bold mb-2">{recipeData.title}</h1>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="flex items-center gap-1">
              <FaClock /> {totalTime} min
            </span>
            <span className={`badge ${recipeData.difficulty === 'easy' ? 'badge-success' : recipeData.difficulty === 'medium' ? 'badge-warning' : 'badge-error'}`}>
              <FaFire /> {recipeData.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <FaUtensils /> {recipeData.serving_size} servings
            </span>
          </div>
        </div>
      </div>

      <div className="two-column-layout mt-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center gap-3">
              {recipeData.author_picture ? (
                <img
                  src={recipeData.author_picture}
                  alt={recipeData.author_name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-chef-red text-white flex items-center justify-center font-bold">
                  {recipeData.author_name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <h4 className="font-bold">👨‍🍳 {recipeData.author_name}</h4>
                <div className="text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaStar /> Level {recipeData.author_level || 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {recipeData.is_paid ? (
              <div>
                <div className="flex gap-4 mb-3">
                  <span className="currency-display currency-gold">
                    <FaCoins className="currency-icon" />
                    <span className="currency-amount">{recipeData.gold_price}</span>
                  </span>
                  <span className="currency-display currency-gem">
                    <FaGem className="currency-icon" />
                    <span className="currency-amount">{recipeData.gem_price}</span>
                  </span>
                </div>
                {!user_interaction?.purchase && !isOwnRecipe && (
                  <button
                    className="btn-rpg btn-rpg-gem w-full"
                    onClick={() => handleInteraction('purchase')}
                    disabled={interactionLoading.purchase}
                  >
                    <FaShoppingCart /> Purchase Recipe
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <span className="badge badge-success text-lg">FREE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="card text-center">
          <div className="card-body">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-2xl font-bold text-xp-purple">{recipeData.exp_reward || 0}</div>
            <div className="text-sm text-gray-600">EXP Reward</div>
          </div>
        </div>
        <div className="card text-center">
          <div className="card-body">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-2xl font-bold text-gold-coin">{recipeData.gold_reward || 0}</div>
            <div className="text-sm text-gray-600">Gold Reward</div>
          </div>
        </div>
        <div className="card text-center">
          <div className="card-body">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-2xl font-bold text-rare-gem">{recipeData.gem_reward || 0}</div>
            <div className="text-sm text-gray-600">Gem Reward</div>
          </div>
        </div>
        <div className="card text-center">
          <div className="card-body">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-2xl font-bold">{recipeData.cook_count || 0}</div>
            <div className="text-sm text-gray-600">Times Cooked</div>
          </div>
        </div>
      </div>

      <div className="tab-container mt-6">
        <div className="tab-header">
          <button
            className={`tab-button ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            <FaListOl /> Ingredients
          </button>
          <button
            className={`tab-button ${activeTab === 'steps' ? 'active' : ''}`}
            onClick={() => setActiveTab('steps')}
          >
            <FaFlagCheckered /> Steps
          </button>
          <button
            className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            <FaBalanceScale /> Nutrition
          </button>
          <button
            className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            <FaCalculator /> Rewards
          </button>
        </div>

        <div className="tab-content card-body">
          {activeTab === 'ingredients' && (
            <div className="animate__animated animate__fadeIn">
              <h3 className="text-xl font-bold mb-2">Ingredients</h3>
              <p className="text-gray-600 mb-4">For {recipeData.serving_size} servings</p>

              <div className="list-layout">
                {ingredients?.map((ingredient, index) => (
                  <div key={index} className="list-item">
                    <label className="form-check flex items-center">
                      <input
                        type="checkbox"
                        checked={completedSteps.includes(`ingredient-${index}`)}
                        onChange={() => toggleStepCompletion(`ingredient-${index}`)}
                        className="form-check-input"
                      />
                    </label>
                    <div className="list-content">
                      <div className="font-medium">{ingredient.name}</div>
                      <div className="text-gray-600">
                        {ingredient.amount} {ingredient.unit}
                        {ingredient.notes && ` (${ingredient.notes})`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="animate__animated animate__fadeIn">
              <h3 className="text-xl font-bold mb-4">Cooking Steps</h3>

              <div className="list-layout">
                {steps?.map((step, index) => (
                  <div
                    key={index}
                    className={`list-item ${completedSteps.includes(index) ? 'border-success-green' : ''}`}
                  >
                    <div className="list-icon font-bold text-lg">{index + 1}</div>
                    <div className="list-content flex-1">
                      <p className="mb-2">{step.description}</p>
                      {step.image && (
                        <div className="my-2">
                          <img src={step.image} alt={`Step ${index + 1}`} className="rounded-lg max-w-xs" />
                        </div>
                      )}
                      {step.timer_duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>⏱️</span>
                          <span>Timer: {formatTimer(step.timer_duration, step.timer_unit)}</span>
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        {step.exp_reward > 0 && (
                          <span className="badge badge-primary">+{step.exp_reward} EXP</span>
                        )}
                        {step.gold_reward > 0 && (
                          <span className="badge badge-warning">+{step.gold_reward} Gold</span>
                        )}
                        {step.gem_reward > 0 && (
                          <span className="badge badge-info">+{step.gem_reward} Gem</span>
                        )}
                      </div>
                    </div>
                    <button
                      className={`btn-rpg btn-rpg-sm ${completedSteps.includes(index) ? 'btn-rpg-success' : 'btn-rpg-secondary'}`}
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
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="animate__animated animate__fadeIn">
              <h3 className="text-xl font-bold mb-4">Nutrition Facts</h3>
              <div className="card">
                <div className="card-body">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-chef-red">{recipeData.total_calories || 0}</div>
                    <div className="text-gray-600">Calories</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">{recipeData.total_protein || 0}g</div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{recipeData.total_carbs || 0}g</div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{recipeData.total_fat || 0}g</div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="animate__animated animate__fadeIn">
              <h3 className="text-xl font-bold mb-4">Cooking Rewards</h3>
              <div className="card bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="card-body text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h4 className="font-bold text-lg">Complete Recipe</h4>
                  <div className="flex justify-center gap-4 mt-2">
                    <span className="text-xp-purple font-bold">+{recipeData.exp_reward || 0} EXP</span>
                    <span className="text-gold-coin font-bold">+{recipeData.gold_reward || 0} Gold</span>
                    <span className="text-rare-gem font-bold">+{recipeData.gem_reward || 0} Gem</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {canCook ? (
          <button
            className="btn-rpg btn-rpg-primary btn-rpg-lg"
            onClick={startCookingSession}
          >
            <FaPlay /> Start Cooking Session
          </button>
        ) : (
          <button
            className="btn-rpg btn-rpg-gem btn-rpg-lg"
            onClick={() => handleInteraction('purchase')}
            disabled={interactionLoading.purchase}
          >
            <FaShoppingCart /> Purchase to Cook ({recipeData.gold_price} Gold)
          </button>
        )}

        <div className="flex flex-col gap-2">
          <Link
            to={`/cookbooks?addRecipe=${id}`}
            className="btn-rpg btn-rpg-secondary"
          >
            <FaBook /> Add to Cookbook
          </Link>
          {isOwnRecipe && (
            <Link to={`/recipes/${id}/edit`} className="btn-rpg btn-rpg-secondary">
              ✏️ Edit Recipe
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;