import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeDetail from '../components/recipes/RecipeDetail';
import CookingSession from '../components/cooking/CookingSession';
import { FaUtensils, FaUsers, FaHeart, FaArrowLeft, FaPlay } from 'react-icons/fa';
import { useData } from '../contexts/DataContext';
import { getRecipe } from '../api/recipes';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useData();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCookingSession, setShowCookingSession] = useState(false);
  const [sessionId, setSessionId] = useState(null);

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
    if (!userData) {
      navigate('/login');
      return;
    }

    if (recipe?.recipe?.is_paid && !recipe?.user_interaction?.purchase) {
      alert('🔒 This is a premium recipe. Please purchase it first.');
      return;
    }

    try {
      // In a real implementation, this would create a cooking session via API
      // For now, we'll simulate session creation
      const mockSessionId = `session_${Date.now()}`;
      setSessionId(mockSessionId);
      setShowCookingSession(true);
      
      // Show success message
      alert('🎉 Cooking session started! Follow the steps and earn rewards!');
    } catch (err) {
      console.error('Error starting cooking session:', err);
      alert('Failed to start cooking session: ' + err.message);
    }
  };

  const handleSessionComplete = () => {
    setShowCookingSession(false);
    setSessionId(null);
    
    // Refresh recipe data to update cook count
    loadRecipe();
    
    // Show completion message
    alert('🎊 Cooking session completed! Rewards have been added to your account.');
  };

  const handleStepComplete = () => {
    // This would be handled by the CookingSession component
    console.log('Step completed');
  };

  useEffect(() => {
    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="recipe-detail-page-loading">
        <div className="loading-overlay">
          <div className="loading-content">
            <FaUtensils className="spinning-icon" />
            <h3>Loading Recipe Details...</h3>
            <p>Gathering ingredients and preparing instructions</p>
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill indeterminate"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail-page-error">
        <div className="error-container">
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
              <button 
                className="retry-button"
                onClick={loadRecipe}
              >
                🔄 Retry
              </button>
            </div>
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
            onStepComplete={handleStepComplete}
          />
        </div>
      ) : (
        <div className="recipe-detail-view">
          <RecipeDetail />
          
          {/* Quick Actions Bar */}
          <div className="quick-actions-bar">
            <div className="actions-container">
              <button 
                className="primary-action"
                onClick={handleStartCooking}
              >
                <FaPlay /> Start Cooking
              </button>
              
              <button className="secondary-action">
                <FaUsers /> Cook with Friends
              </button>
              
              <button className="secondary-action">
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
        </div>
      )}

      {/* Related Recipes Section */}
      {!showCookingSession && recipe && (
        <div className="related-recipes-section">
          <h3 className="section-title">You Might Also Like</h3>
          <p className="section-subtitle">
            Discover similar recipes based on ingredients and difficulty
          </p>
          
          <div className="related-recipes-grid">
            {/* This would be populated with actual related recipes from API */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="related-recipe-card">
                <div className="recipe-image-placeholder">
                  {['🍕', '🥗', '🍣'][index - 1]}
                </div>
                <div className="recipe-info">
                  <h4 className="recipe-title">
                    {['Margherita Pizza', 'Greek Salad', 'Salmon Sushi'][index - 1]}
                  </h4>
                  <div className="recipe-meta">
                    <span className="meta-item">⏱️ {[25, 15, 40][index - 1]} min</span>
                    <span className="meta-item">🔥 {['Medium', 'Easy', 'Hard'][index - 1]}</span>
                  </div>
                  <div className="recipe-rewards">
                    <span className="reward">⭐ {[30, 20, 50][index - 1]} EXP</span>
                    <span className="reward">💰 {[15, 10, 25][index - 1]} Gold</span>
                  </div>
                  <button 
                    className="view-recipe-btn"
                    onClick={() => navigate(`/recipes/recipe_${index}`)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cooking Tips Section */}
      {!showCookingSession && (
        <div className="cooking-tips-section">
          <h3 className="section-title">🎮 Pro Cooking Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">⏱️</div>
              <h4 className="tip-title">Time Management</h4>
              <p className="tip-content">
                Prepare all ingredients before starting to cook. This is called "mise en place" 
                and saves time during cooking.
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💰</div>
              <h4 className="tip-title">Earn More Rewards</h4>
              <p className="tip-content">
                Complete cooking sessions without pausing to earn a 25% bonus on all rewards.
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">👥</div>
              <h4 className="tip-title">Social Cooking</h4>
              <p className="tip-content">
                Cook with friends to earn double EXP and unlock special achievement badges.
              </p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🏆</div>
              <h4 className="tip-title">Daily Challenges</h4>
              <p className="tip-content">
                Complete daily cooking challenges to earn bonus gems and exclusive items.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;