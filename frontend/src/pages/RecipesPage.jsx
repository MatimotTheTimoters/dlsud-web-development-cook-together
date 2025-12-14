import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';

function RecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await api.get('/recipe/list.php');
            if (response.data.success) {
                setRecipes(response.data.recipes);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading recipes...</div>;
    }

    return (
        <div className="recipes-page">
            <h1>📚 Recipe Collection</h1>
            <p className="subtitle">{recipes.length} recipes available</p>

            <div className="recipes-grid">
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                ) : (
                    <div className="no-recipes">
                        <p>No recipes found. Be the first to create one!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipesPage;