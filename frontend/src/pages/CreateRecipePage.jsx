import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/recipes/RecipeForm';
import { FaPlusCircle, FaLightbulb, FaAward, FaArrowLeft } from 'react-icons/fa';
import { useData } from '../contexts/DataContext';

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const { addRecipe } = useData();
  
  const [showTips, setShowTips] = useState(true);

  const handleRecipeCreated = (recipeId) => {
    // Show success message
    alert('🎉 Recipe created successfully! You earned 50 EXP, 25 Gold, and 5 Gems!');
    
    // Navigate to the new recipe
    setTimeout(() => {
      navigate(`/recipes/${recipeId}`);
    }, 2000);
  };

  return (
    <div className="create-recipe-page animate__animated animate__fadeIn">
      {/* Header */}
      <div className="create-recipe-header">
        <button 
          className="back-button"
          onClick={() => navigate('/recipes')}
        >
          <FaArrowLeft /> Back to Recipes
        </button>
        
        <div className="header-content">
          <h1 className="page-title">
            <FaPlusCircle className="title-icon" /> Create New Recipe
          </h1>
          <p className="page-subtitle">
            Share your culinary creation with the CookTogether community and earn rewards!
          </p>
        </div>
      </div>

      <div className="create-recipe-layout">
        {/* Main Form */}
        <div className="recipe-form-container">
          <RecipeForm onRecipeCreated={handleRecipeCreated} />
        </div>

        {/* Sidebar */}
        <div className="create-recipe-sidebar">
          {/* Tips Toggle */}
          <div className="sidebar-section">
            <div className="tips-toggle">
              <button 
                className={`toggle-btn ${showTips ? 'active' : ''}`}
                onClick={() => setShowTips(true)}
              >
                <FaLightbulb /> Tips
              </button>
              <button 
                className={`toggle-btn ${!showTips ? 'active' : ''}`}
                onClick={() => setShowTips(false)}
              >
                <FaAward /> Rewards
              </button>
            </div>
          </div>

          {/* Tips Section */}
          {showTips && (
            <div className="sidebar-section tips-section animate__animated animate__fadeIn">
              <h3 className="sidebar-title">
                <FaLightbulb /> Recipe Creation Tips
              </h3>
              
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">📸</div>
                  <div className="tip-content">
                    <h4 className="tip-title">Use High-Quality Photos</h4>
                    <p className="tip-text">
                      Clear, well-lit photos increase engagement by up to 300%.
                    </p>
                  </div>
                </div>
                
                <div className="tip-item">
                  <div className="tip-icon">✍️</div>
                  <div className="tip-content">
                    <h4 className="tip-title">Detailed Descriptions</h4>
                    <p className="tip-text">
                      Include personal stories or cooking tips in your description.
                    </p>
                  </div>
                </div>
                
                <div className="tip-item">
                  <div className="tip-icon">🎯</div>
                  <div className="tip-content">
                    <h4 className="tip-title">Accurate Timing</h4>
                    <p className="tip-text">
                      Users appreciate realistic preparation and cooking times.
                    </p>
                  </div>
                </div>
                
                <div className="tip-item">
                  <div className="tip-icon">🏷️</div>
                  <div className="tip-content">
                    <h4 className="tip-title">Use Relevant Tags</h4>
                    <p className="tip-text">
                      Tags like "vegan", "quick", or "family-friendly" help discovery.
                    </p>
                  </div>
                </div>
                
                <div className="tip-item">
                  <div className="tip-icon">💰</div>
                  <div className="tip-content">
                    <h4 className="tip-title">Fair Pricing</h4>
                    <p className="tip-text">
                      Premium recipes with unique value earn more purchases.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="community-guidelines">
                <h4 className="guidelines-title">Community Guidelines</h4>
                <ul className="guidelines-list">
                  <li>✓ Original recipes only</li>
                  <li>✓ Clear, accurate instructions</li>
                  <li>✓ Appropriate content for all ages</li>
                  <li>✓ Proper attribution if inspired by others</li>
                </ul>
              </div>
            </div>
          )}

          {/* Rewards Section */}
          {!showTips && (
            <div className="sidebar-section rewards-section animate__animated animate__fadeIn">
              <h3 className="sidebar-title">
                <FaAward /> Creator Rewards
              </h3>
              
              <div className="rewards-summary">
                <div className="reward-card large">
                  <div className="reward-icon">🎉</div>
                  <div className="reward-details">
                    <h4 className="reward-title">Recipe Creation</h4>
                    <div className="reward-amounts">
                      <span className="reward-amount exp">+50 EXP</span>
                      <span className="reward-amount gold">+25 Gold</span>
                      <span className="reward-amount gem">+5 Gems</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bonus-rewards">
                <h4 className="section-title">Bonus Opportunities</h4>
                
                <div className="bonus-item">
                  <div className="bonus-icon">🔥</div>
                  <div className="bonus-content">
                    <h5 className="bonus-title">First 10 Cooks</h5>
                    <p className="bonus-description">
                      Earn double rewards when your recipe is cooked by the first 10 users.
                    </p>
                    <div className="bonus-reward">+100% Bonus</div>
                  </div>
                </div>
                
                <div className="bonus-item">
                  <div className="bonus-icon">⭐</div>
                  <div className="bonus-content">
                    <h5 className="bonus-title">5-Star Rating</h5>
                    <p className="bonus-description">
                      Maintain a 4.5+ average rating for a week to earn bonus gems.
                    </p>
                    <div className="bonus-reward">+10 Gems</div>
                  </div>
                </div>
                
                <div className="bonus-item">
                  <div className="bonus-icon">👥</div>
                  <div className="bonus-content">
                    <h5 className="bonus-title">Community Favorite</h5>
                    <p className="bonus-description">
                      Get 50+ likes on your recipe to unlock the "Popular Creator" badge.
                    </p>
                    <div className="bonus-reward">🎖️ Exclusive Badge</div>
                  </div>
                </div>
              </div>
              
              <div className="premium-benefits">
                <h4 className="section-title">Premium Recipe Benefits</h4>
                <div className="benefits-list">
                  <div className="benefit-item">
                    <span className="benefit-icon">💰</span>
                    <span className="benefit-text">Earn 70% of all purchases</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">📊</span>
                    <span className="benefit-text">Detailed analytics dashboard</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-icon">🏆</span>
                    <span className="benefit-text">Featured placement in discovery</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Creator Stats */}
          <div className="sidebar-section stats-section">
            <h3 className="sidebar-title">Your Creator Stats</h3>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📖</div>
                <div className="stat-info">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Recipes</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Cooks</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Total EXP</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Gold Earned</div>
                </div>
              </div>
            </div>
            
            <div className="creator-level">
              <div className="level-info">
                <span className="level-label">Creator Level</span>
                <span className="level-value">1</span>
              </div>
              <div className="level-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
                <div className="progress-text">0/100 EXP to next level</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-section actions-section">
            <h3 className="sidebar-title">Quick Actions</h3>
            
            <div className="action-buttons">
              <button className="action-btn">
                📚 View My Recipes
              </button>
              <button className="action-btn">
                📊 View Analytics
              </button>
              <button className="action-btn">
                🏆 View Achievements
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="success-stories-section">
        <h3 className="section-title">🎉 Success Stories</h3>
        
        <div className="stories-grid">
          <div className="story-card">
            <div className="story-avatar">👨‍🍳</div>
            <div className="story-content">
              <h4 className="story-title">Chef Marco's Journey</h4>
              <p className="story-text">
                "Started with one recipe, now I have 50+ creations and earn 500+ gold monthly!"
              </p>
              <div className="story-stats">
                <span className="stat">📖 52 Recipes</span>
                <span className="stat">💰 2.5K Gold</span>
                <span className="stat">🏆 Level 15</span>
              </div>
            </div>
          </div>
          
          <div className="story-card">
            <div className="story-avatar">👩‍🍳</div>
            <div className="story-content">
              <h4 className="story-title">Baking with Sarah</h4>
              <p className="story-text">
                "My vegan chocolate cake recipe has been cooked 1,200+ times!"
              </p>
              <div className="story-stats">
                <span className="stat">🍰 28 Recipes</span>
                <span className="stat">👥 1.2K Cooks</span>
                <span className="stat">⭐ 4.9 Rating</span>
              </div>
            </div>
          </div>
          
          <div className="story-card">
            <div className="story-avatar">🧑‍🍳</div>
            <div className="story-content">
              <h4 className="story-title">Alex's Premium Success</h4>
              <p className="story-text">
                "Earned 500 gems from my exclusive sushi course recipe!"
              </p>
              <div className="story-stats">
                <span className="stat">💎 500 Gems</span>
                <span className="stat">📈 95% Rating</span>
                <span className="stat">🔥 Top 10 Chef</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;