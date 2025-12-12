import React, { useState, useEffect } from 'react';
import { FaCheckSquare, FaSquare, FaBalanceScale, FaSpinner } from 'react-icons/fa';
import * as recipesApi from '../../api/recipes';

const IngredientList = ({ recipeId, ingredients, onToggle, completedIngredients = [] }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [recipeIngredients, setRecipeIngredients] = useState(ingredients);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If ingredients are not provided, fetch them from the API
        if (!ingredients && recipeId) {
            loadIngredients();
        }
    }, [recipeId, ingredients]);

    const loadIngredients = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const recipe = await recipesApi.getRecipe(recipeId);
            setRecipeIngredients(recipe.ingredients || []);
        } catch (err) {
            console.error('Error loading ingredients:', err);
            setError('Failed to load ingredients');
        } finally {
            setIsLoading(false);
        }
    };

    const formatAmount = (amount, unit) => {
        if (!amount) return '';
        return `${amount} ${unit || ''}`.trim();
    };

    const handleToggle = (ingredientId) => {
        if (onToggle) {
            onToggle(ingredientId);
        }
        // Optional: Update completed status in local state
        // This would be handled by the parent component
    };

    if (isLoading) {
        return (
            <div className="list-layout">
                <div className="loading-state text-center py-8">
                    <FaSpinner className="animate-spin text-4xl text-chef-red mb-3" />
                    <p className="text-warm-gray-medium">Loading ingredients...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="list-layout">
                <div className="error-state text-center py-8">
                    <div className="error-icon mb-3">
                        <FaBalanceScale className="text-4xl text-warm-gray-light" />
                    </div>
                    <p className="text-warm-gray-dark font-medium mb-2">Failed to load ingredients</p>
                    <p className="text-warm-gray-medium text-sm">{error}</p>
                    <button
                        onClick={loadIngredients}
                        className="btn-rpg btn-rpg-primary mt-3"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const displayIngredients = ingredients || recipeIngredients;

    return (
        <div className="list-layout">
            <div className="list-header mb-3">
                <h3 className="text-xl font-bold text-warm-gray-dark">
                    <FaBalanceScale className="inline mr-2" />
                    Ingredients
                </h3>
                <p className="text-sm text-warm-gray-medium">
                    Check off ingredients as you prepare them
                </p>
            </div>

            <div className="ingredients-list">
                {displayIngredients && displayIngredients.length > 0 ? (
                    displayIngredients.map((ingredient, index) => {
                        const ingredientId = ingredient.id || index;
                        const isCompleted = completedIngredients.includes(ingredientId);

                        return (
                            <div
                                key={ingredientId}
                                className={`list-item ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="list-icon">
                                    <button
                                        className="ingredient-check"
                                        onClick={() => handleToggle(ingredientId)}
                                    >
                                        {isCompleted ? (
                                            <FaCheckSquare className="text-success-green" />
                                        ) : (
                                            <FaSquare className="text-warm-gray-light" />
                                        )}
                                    </button>
                                </div>

                                <div className="list-content">
                                    <div className="ingredient-main">
                                        <span className="ingredient-name font-medium">
                                            {ingredient.name}
                                        </span>
                                        <span className="ingredient-amount text-warm-gray-medium">
                                            {formatAmount(ingredient.amount, ingredient.unit)}
                                        </span>
                                    </div>

                                    {ingredient.notes && (
                                        <div className="ingredient-notes text-sm text-warm-gray-medium mt-1">
                                            {ingredient.notes}
                                        </div>
                                    )}

                                    {/* Nutrition info if available */}
                                    {(ingredient.calories_per_unit > 0 ||
                                        ingredient.protein_per_unit > 0 ||
                                        ingredient.carbs_per_unit > 0 ||
                                        ingredient.fat_per_unit > 0) && (
                                            <div className="ingredient-nutrition text-xs text-warm-gray-light mt-1">
                                                {ingredient.calories_per_unit > 0 && (
                                                    <span>{ingredient.calories_per_unit} cal</span>
                                                )}
                                                {ingredient.protein_per_unit > 0 && (
                                                    <span> • {ingredient.protein_per_unit}g protein</span>
                                                )}
                                                {ingredient.carbs_per_unit > 0 && (
                                                    <span> • {ingredient.carbs_per_unit}g carbs</span>
                                                )}
                                                {ingredient.fat_per_unit > 0 && (
                                                    <span> • {ingredient.fat_per_unit}g fat</span>
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-ingredients text-center py-4">
                        <FaBalanceScale className="text-4xl text-warm-gray-light mb-2" />
                        <p className="text-warm-gray-medium">No ingredients listed</p>
                    </div>
                )}
            </div>

            {/* Summary */}
            {displayIngredients && displayIngredients.length > 0 && (
                <div className="ingredients-summary mt-4">
                    <div className="summary-card card">
                        <div className="card-body p-3">
                            <div className="summary-stats grid grid-cols-2 gap-2">
                                <div className="stat-item">
                                    <div className="stat-label text-xs text-warm-gray-medium">Total</div>
                                    <div className="stat-value font-bold">{displayIngredients.length} items</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label text-xs text-warm-gray-medium">Completed</div>
                                    <div className="stat-value font-bold text-success-green">
                                        {completedIngredients.length} / {displayIngredients.length}
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="progress-container mt-2">
                                <div
                                    className="progress-bar progress-bar-success"
                                    style={{
                                        width: `${(completedIngredients.length / displayIngredients.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IngredientList;