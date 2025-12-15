import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import SessionTypeModal from '../components/SessionTypeModal';
import { useNavigate } from 'react-router-dom';

function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const navigate = useNavigate();

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
            <button 
                onClick={() => navigate(-1)}
                className="back-button"
            >
                ← Back
            </button>

            <div className="recipe-header">
                <h1>{recipe.title}</h1>
                <div className="recipe-meta">
                    <span className="author" style={{ background: '#457B9D', color: 'white' }}>
                        👤 {recipe.username || 'Anonymous'}
                    </span>
                    <span className="difficulty" style={{ background: '#FF9800', color: 'white' }}>
                        {recipe.difficulty}
                    </span>
                    <span className="time" style={{ background: '#E63946', color: 'white' }}>
                        ⏱️ {totalTime} min
                    </span>
                    <span className="servings" style={{ background: '#4CAF50', color: 'white' }}>
                        🍽️ {recipe.servings} servings
                    </span>
                    {recipe.category && (
                        <span className="category" style={{ background: '#A8DADC', color: '#1D3557' }}>
                            #{recipe.category}
                        </span>
                    )}
                </div>
            </div>

            <div className="recipe-description">
                <p>{recipe.description || 'No description available.'}</p>
            </div>

            <div className="recipe-grid">
                <div className="ingredients">
                    <h2>📝 Ingredients</h2>
                    <ul>
                        {recipe.ingredients && recipe.ingredients.split(',').map((item, index) => (
                            <li key={index}>
                                <span className="ingredient-checkbox"></span>
                                {item.trim()}
                            </li>
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
                {/* UPDATED: Changed from direct API call to modal trigger */}
                <button 
                    className="btn-primary" 
                    onClick={() => setShowSessionModal(true)}
                    style={{ background: '#E63946' }}
                >
                    Start Cooking
                </button>
                <button className="btn-secondary">Save Recipe</button>
            </div>

            {/* ADDED: Session Type Modal */}
            <SessionTypeModal 
                open={showSessionModal}
                onClose={() => setShowSessionModal(false)}
                recipeId={id}
            />
        </div>
    );
}

export default RecipeDetailPage;