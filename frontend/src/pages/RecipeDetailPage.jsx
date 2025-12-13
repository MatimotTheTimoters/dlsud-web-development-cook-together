import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeDetail from '../components/recipes/RecipeDetail';
import CookingSession from '../components/cooking/CookingSession';
import { FaUtensils, FaUsers, FaHeart, FaArrowLeft, FaPlay } from 'react-icons/fa';
import { getRecipe } from '../api/recipes';
import { createSession } from '../api/cooking-sessions';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCookingSession, setShowCookingSession] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [creatingSession, setCreatingSession] = useState(false);

  const loadRecipe = async () => {
    setLoading(true);
    try {
      const result = await getRecipe(id);
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

  const handleStartCooking = async () => {
    setCreatingSession(true);
    try {
      const sessionData = {
        recipe_id: id,
        mode: 'solo',
        visibility: 'private',
        status: 'planned'
      };

      const result = await createSession(sessionData);

      if (result.success) {
        const newSessionId = result.data.session_id;
        setSessionId(newSessionId);
        setShowCookingSession(true);
      } else {
        alert('Failed to start cooking session: ' + result.message);
      }
    } catch (err) {
      console.error('Error starting cooking session:', err);
      alert('Failed to start cooking session: ' + err.message);
    } finally {
      setCreatingSession(false);
    }
  };

  const handleSessionComplete = () => {
    setShowCookingSession(false);
    setSessionId(null);
    loadRecipe();
  };

  useEffect(() => {
    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="recipe-detail-page-loading">
        <div className="loading-content">
          <FaUtensils className="spinning-icon" />
          <h3>Loading Recipe Details...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail-page-error">
        <div className="error-content">
          <h2 className="error-title">Recipe Not Found</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button
              className="back-button"
              onClick={() => navigate('/recipes')}
            >
              <FaArrowLeft /> Back to Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail-page">
      {showCookingSession && sessionId ? (
        <div className="cooking-session-view">
          <div className="session-header">
            <button
              className="back-to-recipe-btn"
              onClick={() => setShowCookingSession(false)}
            >
              <FaArrowLeft /> Back to Recipe
            </button>
            <h2 className="session-title">Cooking Session</h2>
          </div>

          <CookingSession
            sessionId={sessionId}
            onSessionComplete={handleSessionComplete}
          />
        </div>
      ) : (
        <div className="recipe-detail-view">
          <RecipeDetail />

          <div className="recipe-actions">
            <button
              className="primary-action"
              onClick={handleStartCooking}
              disabled={creatingSession}
            >
              {creatingSession ? (
                <>
                  <FaUtensils className="spinning-icon-small" /> Creating Session...
                </>
              ) : (
                <>
                  <FaPlay /> Start Cooking
                </>
              )}
            </button>

            <button
              className="secondary-action"
              onClick={() => alert('👥 Multiplayer cooking coming soon!')}
            >
              <FaUsers /> Cook with Friends
            </button>

            <button
              className="secondary-action"
              onClick={() => alert('❤️ Recipe saved!')}
            >
              <FaHeart /> Save Recipe
            </button>

            <button
              className="back-action"
              onClick={() => navigate('/recipes')}
            >
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;