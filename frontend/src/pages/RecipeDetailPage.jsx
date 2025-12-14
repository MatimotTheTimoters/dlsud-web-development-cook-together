import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        try {
            const response = await api.get(`/recipe/get.php?id=${id}`);
            if (response.data.success) {
                setRecipe(response.data.recipe);
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading recipe...</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    const totalTime = (+recipe.prep_time || 0) + (+recipe.cook_time || 0);

    return (
        <div className="recipe-detail">
            <div className="recipe-header">
                <h1>{recipe.title}</h1>
                <div className="recipe-meta">
                    <span className="author">👤 By {recipe.username || 'Anonymous'}</span>
                    <span className="difficulty">{recipe.difficulty}</span>
                    <span className="time">⏱️ {totalTime} min</span>
                    <span className="servings">🍽️ {recipe.servings} servings</span>
                    <span className="category">#{recipe.category || 'Uncategorized'}</span>
                </div>
            </div>

            <div className="recipe-description">
                <p>{recipe.description}</p>
            </div>

            <div className="recipe-grid">
                <div className="ingredients">
                    <h2>📝 Ingredients</h2>
                    <ul>
                        {recipe.ingredients && recipe.ingredients.split(',').map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="steps">
                    <h2>👨‍🍳 Steps</h2>
                    <ol>
                        {recipe.steps && recipe.steps.split('.').filter(step => step.trim()).map((step, index) => (
                            <li key={index}>{step.trim()}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="recipe-actions">
                <button className="btn-primary">Start Cooking</button>
                <button className="btn-secondary">Save Recipe</button>
            </div>
        </div>
    );
}

export default RecipeDetailPage;