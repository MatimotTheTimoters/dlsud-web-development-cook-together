import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaClock, FaFire, FaUser, FaHeart, FaStar, FaCoins, FaGem,
    FaBookmark, FaShare, FaEye, FaSpinner
} from 'react-icons/fa';
import * as recipesApi from '../../api/recipes';
import { useAuth } from '../../contexts/AuthContext';

const RecipeCard = ({ recipe, recipeId, showFull = false }) => {
    const [recipeData, setRecipeData] = useState(recipe);
    const [isLoading, setIsLoading] = useState(!recipe);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If recipe data is not provided, fetch it from the API
        if (!recipe && recipeId) {
            loadRecipe();
        }
    }, [recipeId, recipe]);

    const loadRecipe = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const recipe = await recipesApi.getRecipe(recipeId);
            setRecipeData(recipe);
        } catch (err) {
            console.error('Error loading recipe:', err);
            setError('Failed to load recipe');
        } finally {
            setIsLoading(false);
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'badge-easy';
            case 'medium': return 'badge-medium';
            case 'hard': return 'badge-hard';
            default: return 'badge-medium';
        }
    };

    const truncateText = (text, maxLength = 100) => {
        if (!text) return 'No description available';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleLike = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        setIsLiking(true);
        try {
            await recipesApi.likeRecipe(recipeData.id);
            // Update local state
            setRecipeData(prev => ({
                ...prev,
                like_count: (prev.like_count || 0) + 1
            }));
        } catch (err) {
            console.error('Error liking recipe:', err);
            setError('Failed to like recipe');
        } finally {
            setIsLiking(false);
        }
    };

    const handleSave = async () => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        setIsSaving(true);
        try {
            await recipesApi.saveRecipe(recipeData.id);
            // You could add a visual indicator for saved recipes
        } catch (err) {
            console.error('Error saving recipe:', err);
            setError('Failed to save recipe');
        } finally {
            setIsSaving(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: recipeData.title,
                text: recipeData.description,
                url: window.location.origin + `/recipes/${recipeData.id}`
            });
        } else {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(window.location.origin + `/recipes/${recipeData.id}`);
            alert('Recipe link copied to clipboard!');
        }
    };

    const totalTime = (recipeData?.preparation_time || 0) + (recipeData?.cooking_time || 0);

    if (isLoading) {
        return (
            <div className="card card-recipe animate__animated animate__fadeIn loading">
                <div className="card-recipe-image-container shimmer">
                    <div className="shimmer-placeholder"></div>
                </div>
                <div className="card-body">
                    <div className="loading-content">
                        <div className="shimmer-line shimmer-title"></div>
                        <div className="shimmer-line shimmer-text"></div>
                        <div className="shimmer-line shimmer-text"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !recipeData) {
        return (
            <div className="card card-recipe error">
                <div className="card-body text-center py-6">
                    <FaFire className="text-4xl text-warm-gray-light mb-3" />
                    <p className="text-warm-gray-dark font-medium mb-2">Failed to load recipe</p>
                    <p className="text-warm-gray-medium text-sm mb-3">{error || 'Recipe not found'}</p>
                    <button
                        onClick={loadRecipe}
                        className="btn-rpg btn-rpg-primary"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`card card-recipe animate__animated animate__fadeIn ${showFull ? 'full-width' : ''}`}>
            {/* Recipe Image */}
            <div className="card-recipe-image-container">
                {recipeData.cover_image ? (
                    <img
                        src={recipeData.cover_image}
                        alt={recipeData.title}
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
                    <span className={`card-recipe-badge ${getDifficultyColor(recipeData.difficulty)}`}>
                        <FaFire /> {recipeData.difficulty || 'medium'}
                    </span>
                    {recipeData.is_paid && (
                        <span className="card-recipe-badge badge-info">
                            💎 Premium
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="card-recipe-actions">
                    <button
                        className="card-action-btn"
                        onClick={handleLike}
                        disabled={isLiking}
                    >
                        {isLiking ? <FaSpinner className="animate-spin" /> : <FaHeart />}
                        {recipeData.like_count || 0}
                    </button>
                    <button
                        className="card-action-btn"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <FaSpinner className="animate-spin" /> : <FaBookmark />}
                    </button>
                    <button className="card-action-btn" onClick={handleShare}>
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
                                className={`star ${star <= (recipeData.rating || 4) ? 'filled' : ''}`}
                            />
                        ))}
                    </div>
                    <span className="rating-text">({recipeData.rating || 4.5})</span>
                </div>

                {/* Title */}
                <h3 className="recipe-title text-lg font-bold mb-2">
                    <Link to={`/recipes/${recipeData.id}`} className="text-warm-gray-dark hover:text-chef-red">
                        {recipeData.title}
                    </Link>
                </h3>

                {/* Description */}
                <p className="recipe-description text-sm text-warm-gray-medium mb-3">
                    {truncateText(recipeData.description, showFull ? 250 : 120)}
                </p>

                {/* Metadata */}
                <div className="recipe-metadata mb-3">
                    <div className="metadata-item">
                        <FaClock className="metadata-icon" />
                        <span className="metadata-text">{totalTime} min</span>
                    </div>
                    <div className="metadata-item">
                        <FaUser className="metadata-icon" />
                        <span className="metadata-text">{recipeData.author_name || 'Unknown Chef'}</span>
                    </div>
                    <div className="metadata-item">
                        <FaEye className="metadata-icon" />
                        <span className="metadata-text">{recipeData.cook_count || 0} cooks</span>
                    </div>
                </div>

                {/* Tags */}
                {recipeData.tags && recipeData.tags.length > 0 && (
                    <div className="recipe-tags mb-3">
                        {recipeData.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="recipe-tag">
                                {tag}
                            </span>
                        ))}
                        {recipeData.tags.length > 3 && (
                            <span className="recipe-tag-more">
                                +{recipeData.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Rewards & Pricing */}
                <div className="recipe-rewards">
                    <div className="rewards-section">
                        <span className="reward-item">
                            <FaStar className="text-xp-purple" /> +{recipeData.exp_reward || 0} EXP
                        </span>
                        <span className="reward-item">
                            <FaCoins className="text-gold-coin" /> +{recipeData.gold_reward || 0}
                        </span>
                        <span className="reward-item">
                            <FaGem className="text-rare-gem" /> +{recipeData.gem_reward || 0}
                        </span>
                    </div>

                    {recipeData.is_paid && (
                        <div className="pricing-section">
                            <span className="price-tag">
                                <FaCoins /> {recipeData.gold_price || 0} Gold
                            </span>
                            <span className="price-tag">
                                <FaGem /> {recipeData.gem_price || 0} Gems
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Card Footer */}
            <div className="card-footer">
                <div className="recipe-actions">
                    <Link
                        to={`/recipes/${recipeData.id}`}
                        className="btn-rpg btn-rpg-primary flex-1"
                    >
                        🍴 {showFull ? 'Start Cooking' : 'Cook Recipe'}
                    </Link>
                    {!showFull && (
                        <button
                            className="btn-rpg btn-rpg-secondary"
                            onClick={handleLike}
                            disabled={isLiking}
                        >
                            {isLiking ? <FaSpinner className="animate-spin" /> : <FaHeart />}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="card-error-notice">
                    <p className="text-error text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default RecipeCard;