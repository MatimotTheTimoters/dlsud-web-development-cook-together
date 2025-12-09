import React from 'react';
import { FaCheckSquare, FaSquare, FaBalanceScale } from 'react-icons/fa';

const IngredientList = ({ ingredients, onToggle, completedIngredients = [] }) => {
    const formatAmount = (amount, unit) => {
        if (!amount) return '';
        return `${amount} ${unit || ''}`.trim();
    };

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
                {ingredients && ingredients.length > 0 ? (
                    ingredients.map((ingredient, index) => {
                        const isCompleted = completedIngredients.includes(ingredient.id || index);

                        return (
                            <div
                                key={ingredient.id || index}
                                className={`list-item ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="list-icon">
                                    <button
                                        className="ingredient-check"
                                        onClick={() => onToggle && onToggle(ingredient.id || index)}
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
                                    {ingredient.calories_per_unit && (
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
            {ingredients && ingredients.length > 0 && (
                <div className="ingredients-summary mt-4">
                    <div className="summary-card card">
                        <div className="card-body p-3">
                            <div className="summary-stats grid grid-cols-2 gap-2">
                                <div className="stat-item">
                                    <div className="stat-label text-xs text-warm-gray-medium">Total</div>
                                    <div className="stat-value font-bold">{ingredients.length} items</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label text-xs text-warm-gray-medium">Completed</div>
                                    <div className="stat-value font-bold text-success-green">
                                        {completedIngredients.length} / {ingredients.length}
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="progress-container mt-2">
                                <div
                                    className="progress-bar progress-bar-success"
                                    style={{
                                        width: `${(completedIngredients.length / ingredients.length) * 100}%`
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