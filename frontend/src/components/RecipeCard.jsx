import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
    const totalTime = (+recipe.prep_time || 0) + (+recipe.cook_time || 0);

    return (
        <div className="recipe-card">
            <div className="recipe-header">
                <h3>{recipe.title}</h3>
                <span className={`difficulty ${(recipe.difficulty || 'Medium').toLowerCase()}`}>
                    {recipe.difficulty || 'Medium'}
                </span>
            </div>

            <div className="recipe-meta">
                <span>👤 {recipe.username || 'Anonymous'}</span>
                <span>⏱️ {totalTime} min</span>
                <span>🍽️ {recipe.servings || 1} servings</span>
            </div>

            <p className="recipe-description">
                {recipe.description || 'No description available'}
            </p>

            <div className="recipe-footer">
                <span className="category">#{recipe.category || 'Uncategorized'}</span>
                <Link to={`/recipe/${recipe.id}`} className="view-btn">
                    View Recipe
                </Link>
            </div>
        </div>
    );
}

export default RecipeCard;