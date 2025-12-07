import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';
import { 
  FaFire, FaNewspaper, FaTrophy, FaUsers, 
  FaUtensils, FaBook, FaStore, FaChevronRight,
  FaStar, FaCoins, FaGem, FaChartLine
} from 'react-icons/fa';
import { useData } from '../contexts/DataContext';
import { getTrendingRecipes, getAllRecipes } from '../api/recipes';

const HomePage = () => {
  const { userData, recipes, loading } = useData();
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalCooks: 0,
    activeChefs: 0,
    rewardsEarned: 0
  });

  const getFeaturedRecipes = async () => {
    try {
      const result = await getAllRecipes({ limit: 6, sortBy: 'popular' });
      if (result.success) {
        setFeaturedRecipes(result.data.recipes || []);
      }
    } catch (err) {
      console.error('Error fetching featured recipes:', err);
    }
  };

  const getRecentActivities = () => {
    // Mock recent activities - in real app, this would come from API
    const activities = [
      {
        id: 1,
        type: 'cook',
        user: 'Chef Mario',
        recipe: 'Spaghetti Carbonara',
        exp: 50,
        icon: '🍝',
        time: '10 minutes ago'
      },
      {
        id: 2,
        type: 'level',
        user: 'Sarah',
        level: 20,
        icon: '🎉',
        time: '1 hour ago'
      },
      {
        id: 3,
        type: 'recipe',
        user: 'Alex',
        recipe: 'Vegan Lasagna',
        icon: '🥗',
        time: '2 hours ago'
      },
      {
        id: 4,
        type: 'achievement',
        user: 'Mike',
        achievement: 'Master Chef',
        icon: '🏆',
        time: '5 hours ago'
      },
      {
        id: 5,
        type: 'purchase',
        user: 'Lisa',
        item: 'Golden Spoon',
        icon: '💰',
        time: '1 day ago'
      }
    ];
    setRecentActivities(activities);
  };

  const getTrending = async () => {
    try {
      const result = await getTrendingRecipes(5);
      if (result.success) {
        setTrendingRecipes(result.data.recipes || []);
      }
    } catch (err) {
      console.error('Error fetching trending recipes:', err);
    }
  };

  useEffect(() => {
    getFeaturedRecipes();
    getRecentActivities();
    getTrending();
    
    // Set stats based on available data
    setStats({
      totalRecipes: recipes.length,
      totalCooks: recipes.reduce((sum, recipe) => sum + (recipe.cook_count || 0), 0),
      activeChefs: 250, // Mock data
      rewardsEarned: recipes.reduce((sum, recipe) => sum + (recipe.exp_reward || 0), 0)
    });
  }, [recipes]);

  return (
    <div className="home-page animate__animated animate__fadeIn">
      {/* Hero Section */}
      <div className="home-hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-icon">🍳</span> CookTogether
          </h1>
          <p className="hero-subtitle">
            Level up your cooking skills, earn rewards, and join a community of passionate chefs!
          </p>
          
          <div className="hero-actions">
            <Link to="/recipes" className="primary-hero-btn">
              <FaUtensils /> Start Cooking
            </Link>
            <Link to="/recipes/create" className="secondary-hero-btn">
              <FaBook /> Create Recipe
            </Link>
            <Link to="/discover" className="secondary-hero-btn">
              <FaUsers /> Find Friends
            </Link>
          </div>
          
          {userData && (
            <div className="user-welcome">
              <h3 className="welcome-title">
                Welcome back, <span className="user-name">{userData.full_name}</span>!
              </h3>
              <div className="user-stats">
                <span className="stat-item">
                  <FaStar /> Level {userData.level || 1}
                </span>
                <span className="stat-item">
                  <FaCoins /> {userData.gold_count || 0} Gold
                </span>
                <span className="stat-item">
                  <FaGem /> {userData.gem_count || 0} Gems
                </span>
                <span className="stat-item">
                  <FaChartLine /> {userData.login_streak || 0} Day Streak
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="hero-image">
          <div className="image-placeholder">
            <div className="floating-icon">🍳</div>
            <div className="floating-icon">🥗</div>
            <div className="floating-icon">🍝</div>
            <div className="floating-icon">🎮</div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-details">
              <div className="stat-value">{stats.totalRecipes}</div>
              <div className="stat-label">Recipes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👨‍🍳</div>
            <div className="stat-details">
              <div className="stat-value">{stats.totalCooks}</div>
              <div className="stat-label">Cooks Today</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-details">
              <div className="stat-value">{stats.activeChefs}</div>
              <div className="stat-label">Active Chefs</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-details">
              <div className="stat-value">{stats.rewardsEarned}</div>
              <div className="stat-label">Rewards Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="featured-sections">
        <div className="section-grid">
          <div className="featured-section">
            <div className="section-header">
              <h3 className="section-title">
                <FaFire className="section-icon" /> Trending Recipes
              </h3>
              <Link to="/recipes?sort=popular" className="view-all-link">
                View All <FaChevronRight />
              </Link>
            </div>
            
            <div className="trending-list">
              {trendingRecipes.slice(0, 3).map((recipe, index) => (
                <div key={recipe.id || index} className="trending-item">
                  <div className="trending-rank">{index + 1}</div>
                  <div className="trending-content">
                    <h4 className="trending-title">{recipe.title || 'Sample Recipe'}</h4>
                    <div className="trending-meta">
                      <span className="meta-item">⏱️ {recipe.total_time || 30}min</span>
                      <span className="meta-item">🔥 {recipe.difficulty || 'Medium'}</span>
                      <span className="meta-item">⭐ {recipe.exp_reward || 25} EXP</span>
                    </div>
                  </div>
                  <div className="trending-stats">
                    <span className="stat">+{recipe.like_count || 125}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="featured-section">
            <div className="section-header">
              <h3 className="section-title">
                <FaTrophy className="section-icon" /> Daily Challenges
              </h3>
              <Link to="/challenges" className="view-all-link">
                View All <FaChevronRight />
              </Link>
            </div>
            
            <div className="challenges-list">
              <div className="challenge-card active">
                <div className="challenge-icon">🌱</div>
                <div className="challenge-content">
                  <h4 className="challenge-title">Vegan Week Challenge</h4>
                  <p className="challenge-description">
                    Cook 3 vegan recipes this week
                  </p>
                  <div className="challenge-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                    <span className="progress-text">342 participants</span>
                  </div>
                </div>
                <div className="challenge-reward">
                  <span className="reward-badge">🏆 +100 EXP</span>
                </div>
              </div>
              
              <div className="challenge-card">
                <div className="challenge-icon">🍝</div>
                <div className="challenge-content">
                  <h4 className="challenge-title">Pasta Masters</h4>
                  <p className="challenge-description">
                    Create 2 pasta recipes
                  </p>
                  <div className="challenge-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '30%' }}></div>
                    </div>
                    <span className="progress-text">189 participants</span>
                  </div>
                </div>
                <div className="challenge-reward">
                  <span className="reward-badge">💰 +50 Gold</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="featured-section">
            <div className="section-header">
              <h3 className="section-title">
                <FaUsers className="section-icon" /> Top Chefs
              </h3>
              <Link to="/discover" className="view-all-link">
                View All <FaChevronRight />
              </Link>
            </div>
            
            <div className="top-chefs-list">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="chef-item">
                  <div className="chef-rank">{rank}</div>
                  <div className="chef-avatar">
                    {rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '👨‍🍳'}
                  </div>
                  <div className="chef-info">
                    <h4 className="chef-name">Chef {['Mario', 'Luigi', 'Peach', 'Yoshi', 'Toad'][rank - 1]}</h4>
                    <div className="chef-level">Level {25 - rank * 3}</div>
                  </div>
                  <div className="chef-recipes">
                    <span className="recipe-count">{150 - rank * 20}</span>
                    <span className="recipe-label">recipes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3 className="section-title">Quick Actions</h3>
        
        <div className="actions-grid">
          <Link to="/recipes/create" className="action-card">
            <div className="action-icon">🍳</div>
            <h4 className="action-title">Create Recipe</h4>
            <p className="action-description">
              Share your culinary creation and earn rewards
            </p>
            <div className="action-rewards">
              <span className="reward">⭐ +50 EXP</span>
              <span className="reward">💰 +25 Gold</span>
            </div>
          </Link>
          
          <Link to="/recipes" className="action-card">
            <div className="action-icon">👥</div>
            <h4 className="action-title">Find Friends</h4>
            <p className="action-description">
              Connect with other chefs and cook together
            </p>
            <div className="action-rewards">
              <span className="reward">👥 Social Bonus</span>
              <span className="reward">🎮 +2X EXP</span>
            </div>
          </Link>
          
          <Link to="/challenges" className="action-card">
            <div className="action-icon">🏆</div>
            <h4 className="action-title">View Challenges</h4>
            <p className="action-description">
              Complete challenges for bonus rewards
            </p>
            <div className="action-rewards">
              <span className="reward">⚡ Daily Rewards</span>
              <span className="reward">🏅 Achievements</span>
            </div>
          </Link>
          
          <Link to="/shop" className="action-card">
            <div className="action-icon">🏪</div>
            <h4 className="action-title">Visit Shop</h4>
            <p className="action-description">
              Spend your gold and gems on exclusive items
            </p>
            <div className="action-rewards">
              <span className="reward">🛍️ Exclusive Items</span>
              <span className="reward">🎁 Daily Deals</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="featured-recipes-section">
        <div className="section-header">
          <h3 className="section-title">
            <FaNewspaper className="section-icon" /> Featured Recipes
          </h3>
          <Link to="/recipes" className="view-all-link">
            View All Recipes <FaChevronRight />
          </Link>
        </div>
        
        <div className="featured-recipes-grid">
          {featuredRecipes.slice(0, 4).map((recipe) => (
            <div key={recipe.id} className="featured-recipe-card">
              <div className="recipe-image">
                {recipe.cover_image ? (
                  <img src={recipe.cover_image} alt={recipe.title} />
                ) : (
                  <div className="image-placeholder">
                    {['🍕', '🥗', '🍝', '🍣'][Math.floor(Math.random() * 4)]}
                  </div>
                )}
              </div>
              <div className="recipe-content">
                <h4 className="recipe-title">{recipe.title}</h4>
                <div className="recipe-meta">
                  <span className="meta-item">
                    <FaClock /> {recipe.total_time || 30}min
                  </span>
                  <span className="meta-item">
                    <FaFire /> {recipe.difficulty}
                  </span>
                </div>
                <div className="recipe-rewards">
                  <span className="reward">⭐ {recipe.exp_reward || 0} EXP</span>
                  <span className="reward">💰 {recipe.gold_reward || 0} Gold</span>
                </div>
                <Link to={`/recipes/${recipe.id}`} className="view-recipe-btn">
                  View Recipe
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="activity-feed-section">
        <div className="section-header">
          <h3 className="section-title">Recent Activity</h3>
          <button className="refresh-activities-btn">
            🔄 Refresh
          </button>
        </div>
        
        <div className="activity-list">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p className="activity-text">
                  {activity.type === 'cook' && (
                    <>Chef <strong>{activity.user}</strong> cooked <strong>{activity.recipe}</strong> and earned {activity.exp} EXP</>
                  )}
                  {activity.type === 'level' && (
                    <><strong>{activity.user}</strong> reached Level {activity.level}!</>
                  )}
                  {activity.type === 'recipe' && (
                    <><strong>{activity.user}</strong> created a new recipe: <strong>{activity.recipe}</strong></>
                  )}
                  {activity.type === 'achievement' && (
                    <><strong>{activity.user}</strong> unlocked the <strong>{activity.achievement}</strong> achievement!</>
                  )}
                  {activity.type === 'purchase' && (
                    <><strong>{activity.user}</strong> purchased <strong>{activity.item}</strong> from the shop</>
                  )}
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h3 className="cta-title">Ready to Level Up Your Cooking?</h3>
          <p className="cta-description">
            Join thousands of chefs who are improving their skills and earning rewards every day.
          </p>
          <div className="cta-actions">
            {!userData ? (
              <>
                <Link to="/register" className="cta-btn primary">
                  🎮 Join Now & Get 100 Gold
                </Link>
                <Link to="/login" className="cta-btn secondary">
                  🔥 Login to Continue
                </Link>
              </>
            ) : (
              <>
                <Link to="/recipes" className="cta-btn primary">
                  🍳 Start Cooking Now
                </Link>
                <Link to="/discover" className="cta-btn secondary">
                  👥 Find Cooking Buddies
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;