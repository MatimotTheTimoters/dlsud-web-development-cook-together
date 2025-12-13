import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaFolderOpen } from 'react-icons/fa';

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
            // API call would go here
            // const response = await api.getCookbooks();
            // setCookbooks(response.data);

            // Mock data for now
            setTimeout(() => {
                setCookbooks([
                    { id: 1, name: 'Italian Favorites', description: 'My favorite Italian recipes', is_public: true, recipe_count: 5 },
                    { id: 2, name: 'Quick Breakfasts', description: 'Easy morning meals', is_public: false, recipe_count: 3 },
                ]);
                setLoading(false);
            }, 1000);

            setError(null);
        } catch (err) {
            setError('Failed to load cookbooks. Please try again.');
            console.error('Error loading cookbooks:', err);
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
            // API call would go here
            // const response = await api.createCookbook(cookbookData);

            // Mock response
            const newCookbook = {
                id: Date.now(),
                name: newCookbookName,
                description: newCookbookDescription,
                is_public: false,
                recipe_count: 0
            };

            setCookbooks([...cookbooks, newCookbook]);

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

    // Load recipes for a specific cookbook
    const loadCookbookRecipes = async (cookbookId) => {
        try {
            setActiveCookbook(cookbookId);
            // API call would go here
            // const response = await api.getCookbookRecipes(cookbookId);

            // Mock data
            const mockRecipes = [
                { id: 1, title: 'Spaghetti Carbonara', description: 'Classic Italian pasta', difficulty: 'Medium', preparation_time: 30 },
                { id: 2, title: 'Margherita Pizza', description: 'Simple and delicious', difficulty: 'Easy', preparation_time: 45 },
            ];
            setRecipes(mockRecipes);
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
                            </div>

                            <div className="recipes-grid">
                                {recipes.length === 0 ? (
                                    <div className="empty-state">
                                        <FaBook />
                                        <p>No recipes in this cookbook yet.</p>
                                    </div>
                                ) : (
                                    recipes.map(recipe => (
                                        <div key={recipe.id} className="recipe-card">
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