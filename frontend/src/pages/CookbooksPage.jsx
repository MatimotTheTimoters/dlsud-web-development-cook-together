import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaFolderOpen, FaTrash, FaEdit } from 'react-icons/fa';
import api from '../api/cookbooks';

const CookbooksPage = () => {
    const [cookbooks, setCookbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCookbookName, setNewCookbookName] = useState('');
    const [newCookbookDescription, setNewCookbookDescription] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [activeCookbook, setActiveCookbook] = useState(null);
    const [recipes, setRecipes] = useState([]);

    // Load user's cookbooks
    const loadCookbooks = async () => {
        try {
            setLoading(true);
            const response = await api.getCookbooks();
            setCookbooks(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load cookbooks. Please try again.');
            console.error('Error loading cookbooks:', err);
        } finally {
            setLoading(false);
        }
    };

    // Create new cookbook
    const createCookbook = async (e) => {
        e.preventDefault();
        if (!newCookbookName.trim()) {
            setError('Cookbook name is required');
            return;
        }

        try {
            const cookbookData = {
                name: newCookbookName,
                description: newCookbookDescription,
                is_public: false // Default to private
            };

            const response = await api.createCookbook(cookbookData);

            // Add the new cookbook to the list
            setCookbooks([...cookbooks, response.data]);

            // Reset form
            setNewCookbookName('');
            setNewCookbookDescription('');
            setShowCreateForm(false);
            setError(null);

            // Show success message
            alert('Cookbook created successfully!');
        } catch (err) {
            setError('Failed to create cookbook. Please try again.');
            console.error('Error creating cookbook:', err);
        }
    };

    // Add recipe to cookbook
    const addRecipeToCookbook = async (cookbookId, recipeId) => {
        try {
            await api.addRecipeToCookbook(cookbookId, recipeId);

            // Update UI - you might want to refresh the recipes list
            if (activeCookbook === cookbookId) {
                // Reload recipes for this cookbook
                const response = await api.getCookbookRecipes(cookbookId);
                setRecipes(response.data);
            }

            alert('Recipe added to cookbook!');
        } catch (err) {
            setError('Failed to add recipe to cookbook. Please try again.');
            console.error('Error adding recipe to cookbook:', err);
        }
    };

    // Remove recipe from cookbook
    const removeRecipeFromCookbook = async (cookbookId, recipeId) => {
        try {
            await api.removeRecipeFromCookbook(cookbookId, recipeId);

            // Update UI
            if (activeCookbook === cookbookId) {
                setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
            }

            alert('Recipe removed from cookbook!');
        } catch (err) {
            setError('Failed to remove recipe from cookbook. Please try again.');
            console.error('Error removing recipe from cookbook:', err);
        }
    };

    // Load recipes for a specific cookbook
    const loadCookbookRecipes = async (cookbookId) => {
        try {
            setActiveCookbook(cookbookId);
            const response = await api.getCookbookRecipes(cookbookId);
            setRecipes(response.data);
        } catch (err) {
            setError('Failed to load cookbook recipes. Please try again.');
            console.error('Error loading cookbook recipes:', err);
        }
    };

    // Initialize on component mount
    useEffect(() => {
        loadCookbooks();
    }, []);

    if (loading) {
        return (
            <div className="cookbooks-page">
                <div className="loading-container">
                    <FaBook className="loading-icon" />
                    <p>Loading your cookbooks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cookbooks-page">
            <div className="page-header">
                <h1><FaBook /> My Cookbooks</h1>
                <p>Organize your favorite recipes into collections</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="cookbooks-layout">
                {/* Left sidebar - Cookbooks list */}
                <div className="cookbooks-sidebar">
                    <div className="sidebar-header">
                        <h3>Your Collections</h3>
                        <button
                            className="btn-primary"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            <FaPlus /> New Cookbook
                        </button>
                    </div>

                    {showCreateForm && (
                        <div className="create-cookbook-form">
                            <h4>Create New Cookbook</h4>
                            <form onSubmit={createCookbook}>
                                <div className="form-group">
                                    <label htmlFor="cookbookName">Name *</label>
                                    <input
                                        type="text"
                                        id="cookbookName"
                                        value={newCookbookName}
                                        onChange={(e) => setNewCookbookName(e.target.value)}
                                        placeholder="e.g., Italian Favorites"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cookbookDescription">Description</label>
                                    <textarea
                                        id="cookbookDescription"
                                        value={newCookbookDescription}
                                        onChange={(e) => setNewCookbookDescription(e.target.value)}
                                        placeholder="Describe your cookbook..."
                                        rows="3"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        <FaPlus /> Create Cookbook
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowCreateForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="cookbooks-list">
                        {cookbooks.length === 0 ? (
                            <div className="empty-state">
                                <FaFolderOpen />
                                <p>No cookbooks yet. Create your first one!</p>
                            </div>
                        ) : (
                            cookbooks.map(cookbook => (
                                <div
                                    key={cookbook.id}
                                    className={`cookbook-item ${activeCookbook === cookbook.id ? 'active' : ''}`}
                                    onClick={() => loadCookbookRecipes(cookbook.id)}
                                >
                                    <div className="cookbook-info">
                                        <h4>{cookbook.name}</h4>
                                        <p className="cookbook-description">
                                            {cookbook.description || 'No description'}
                                        </p>
                                        <div className="cookbook-meta">
                                            <span className={`visibility-badge ${cookbook.is_public ? 'public' : 'private'}`}>
                                                {cookbook.is_public ? 'Public' : 'Private'}
                                            </span>
                                            <span className="recipe-count">
                                                {cookbook.recipe_count || 0} recipes
                                            </span>
                                        </div>
                                    </div>
                                    <div className="cookbook-actions">
                                        <button className="btn-icon">
                                            <FaEdit />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right content - Recipes in selected cookbook */}
                <div className="cookbook-content">
                    {activeCookbook ? (
                        <>
                            <div className="content-header">
                                <h3>
                                    {cookbooks.find(c => c.id === activeCookbook)?.name || 'Cookbook'} Recipes
                                </h3>
                                <div className="content-actions">
                                    <button className="btn-secondary">
                                        <FaPlus /> Add Recipe
                                    </button>
                                </div>
                            </div>

                            <div className="recipes-grid">
                                {recipes.length === 0 ? (
                                    <div className="empty-state">
                                        <FaBook />
                                        <p>No recipes in this cookbook yet.</p>
                                        <button className="btn-primary">
                                            <FaPlus /> Add Your First Recipe
                                        </button>
                                    </div>
                                ) : (
                                    recipes.map(recipe => (
                                        <div key={recipe.id} className="recipe-card">
                                            <div className="recipe-image">
                                                {/* Recipe image would go here */}
                                                <div className="image-placeholder">
                                                    <FaBook />
                                                </div>
                                            </div>
                                            <div className="recipe-info">
                                                <h4>{recipe.title}</h4>
                                                <p className="recipe-description">
                                                    {recipe.description || 'No description available'}
                                                </p>
                                                <div className="recipe-meta">
                                                    <span className="difficulty">
                                                        {recipe.difficulty || 'Medium'}
                                                    </span>
                                                    <span className="time">
                                                        {recipe.preparation_time || '?'} min
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="recipe-actions">
                                                <button
                                                    className="btn-icon danger"
                                                    onClick={() => removeRecipeFromCookbook(activeCookbook, recipe.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="no-selection">
                            <FaFolderOpen />
                            <h3>Select a Cookbook</h3>
                            <p>Choose a cookbook from the sidebar to view its recipes</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CookbooksPage;