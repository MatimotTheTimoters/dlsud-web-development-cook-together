import React from 'react';

function RecipeCard({ recipe }) {
    // Convert to numbers and calculate total time
    const prepTime = Number(recipe.prep_time) || 0;
    const cookTime = Number(recipe.cook_time) || 0;
    const totalTime = prepTime + cookTime;

    return (
        <div className="recipe-card">
            <div className="recipe-header">
                <h3>{recipe.title}</h3>
                <span className={`difficulty ${recipe.difficulty?.toLowerCase() || 'medium'}`}>
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
                <button className="view-btn">View Recipe</button>
            </div>
        </div>
    );
}

export default RecipeCard;