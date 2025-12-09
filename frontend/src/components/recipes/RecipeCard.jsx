import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaClock, FaFire, FaUser, FaHeart, FaStar, FaCoins, FaGem,
    FaBookmark, FaShare, FaEye
} from 'react-icons/fa';

const RecipeCard = ({ recipe, onLike }) => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'badge-easy';
            case 'medium': return 'badge-medium';
            case 'hard': return 'badge-hard';
            default: return 'badge-medium';
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const totalTime = (recipe.preparation_time || 0) + (recipe.cooking_time || 0);

    return (
        <div className="card card-recipe animate__animated animate__fadeIn">
            {/* Recipe Image */}
            <div className="card-recipe-image-container">
                {recipe.cover_image ? (
                    <img
                        src={recipe.cover_image}
                        alt={recipe.title}
                        className="card-recipe-image"
                    />
                ) : (
                    <div className="card-recipe-image-placeholder">
                        <FaFire className="placeholder-icon" />
                        <span>No image</span>
                    </div>
                )}

                {/* Recipe Badges */}
                <div className="card-recipe-badges">
                    <span className={`card-recipe-badge ${getDifficultyColor(recipe.difficulty)}`}>
                        <FaFire /> {recipe.difficulty}
                    </span>
                    {recipe.is_paid && (
                        <span className="card-recipe-badge badge-info">
                            💎 Premium
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card-recipe-actions">
                    <button className="card-action-btn" onClick={onLike}>
                        <FaHeart /> {recipe.like_count || 0}
                    </button>
                    <button className="card-action-btn">
                        <FaBookmark />
                    </button>
                    <button className="card-action-btn">
                        <FaShare />
                    </button>
                </div>
            </div>

            {/* Card Body */}
            <div className="card-body">
                {/* Rating */}
                <div className="recipe-rating mb-2">
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`star ${star <= (recipe.rating || 4) ? 'filled' : ''}`}
                            />
                        ))}
                    </div>
                    <span className="rating-text">({recipe.rating || 4.5})</span>
                </div>

                {/* Title */}
                <h3 className="recipe-title text-lg font-bold mb-2">
                    <Link to={`/recipes/${recipe.id}`} className="text-warm-gray-dark hover:text-chef-red">
                        {recipe.title}
                    </Link>
                </h3>

                {/* Description */}
                <p className="recipe-description text-sm text-warm-gray-medium mb-3">
                    {truncateText(recipe.description || 'No description available', 120)}
                </p>

                {/* Metadata */}
                <div className="recipe-metadata mb-3">
                    <div className="metadata-item">
                        <FaClock className="metadata-icon" />
                        <span className="metadata-text">{totalTime} min</span>
                    </div>
                    <div className="metadata-item">
                        <FaUser className="metadata-icon" />
                        <span className="metadata-text">{recipe.author_name || 'Unknown Chef'}</span>
                    </div>
                    <div className="metadata-item">
                        <FaEye className="metadata-icon" />
                        <span className="metadata-text">{recipe.cook_count || 0} cooks</span>
                    </div>
                </div>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                    <div className="recipe-tags mb-3">
                        {recipe.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="recipe-tag">
                                {tag}
                            </span>
                        ))}
                        {recipe.tags.length > 3 && (
                            <span className="recipe-tag-more">
                                +{recipe.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Rewards & Pricing */}
                <div className="recipe-rewards">
                    <div className="rewards-section">
                        <span className="reward-item">
                            <FaStar className="text-xp-purple" /> +{recipe.exp_reward || 0} EXP
                        </span>
                        <span className="reward-item">
                            <FaCoins className="text-gold-coin" /> +{recipe.gold_reward || 0}
                        </span>
                        <span className="reward-item">
                            <FaGem className="text-rare-gem" /> +{recipe.gem_reward || 0}
                        </span>
                    </div>

                    {recipe.is_paid && (
                        <div className="pricing-section">
                            <span className="price-tag">
                                <FaCoins /> {recipe.gold_price || 0} Gold
                            </span>
                            <span className="price-tag">
                                <FaGem /> {recipe.gem_price || 0} Gems
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Card Footer */}
            <div className="card-footer">
                <div className="recipe-actions">
                    <Link
                        to={`/recipes/${recipe.id}`}
                        className="btn-rpg btn-rpg-primary flex-1"
                    >
                        🍴 Cook Recipe
                    </Link>
                    <button className="btn-rpg btn-rpg-secondary">
                        <FaHeart /> Like
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;