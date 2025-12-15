import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import SessionTypeModal from '../components/SessionTypeModal';
import SessionShareModal from '../components/SessionShareModal'; // ADDED
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack'; // ADDED for notifications

function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false); // ADDED
    const [sessionData, setSessionData] = useState(null); // ADDED
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar(); // ADDED

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

    // ADDED: Handle session creation callback
    const handleSessionCreated = (sessionResponse) => {
        if (sessionResponse.session_type === 'multiplayer') {
            // Store session data and show share modal
            setSessionData({
                joinCode: sessionResponse.join_code,
                sessionId: sessionResponse.session_id
            });
            setShowShareModal(true);
            
            // Show success notification
            enqueueSnackbar('Multiplayer session created! Share the code with friends.', { 
                variant: 'success',
                autoHideDuration: 3000 
            });
        } else {
            // For solo sessions, redirect directly to cooking session
            navigate(`/cooking-session/${sessionResponse.session_id}`);
        }
    };

    // ADDED: Handle going to session lobby
    const goToSessionLobby = () => {
        if (sessionData?.sessionId) {
            navigate(`/session-lobby/${sessionData.sessionId}`);
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

            {/* Session Type Modal (Feature 7.1) */}
            <SessionTypeModal 
                open={showSessionModal}
                onClose={() => setShowSessionModal(false)}
                recipeId={id}
                recipeTitle={recipe?.title || 'Recipe'}
                userId={1} // ADDED: You'll need to get current user ID
                onSessionCreated={handleSessionCreated} // ADDED
            />

            {/* ADDED: Session Share Modal (Feature 7.5) */}
            <SessionShareModal
                open={showShareModal}
                onClose={() => setShowShareModal(false)}
                sessionCode={sessionData?.joinCode}
                sessionId={sessionData?.sessionId}
                onGoToLobby={goToSessionLobby} // ADDED
            />
        </div>
    );
}

export default RecipeDetailPage;