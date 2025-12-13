import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/recipes/RecipeForm';
import { FaPlusCircle, FaLightbulb, FaAward, FaArrowLeft } from 'react-icons/fa';

const CreateRecipePage = () => {
  const navigate = useNavigate();

  const handleRecipeCreated = (recipeId) => {
    alert('🎉 Recipe created successfully!');

    setTimeout(() => {
      navigate(`/recipes/${recipeId}`);
    }, 2000);
  };

  return (
    <div className="create-recipe-page">
      {/* Header */}
      <div className="create-recipe-header">
        <button
          className="back-button"
          onClick={() => navigate('/recipes')}
        >
          <FaArrowLeft /> Back to Recipes
        </button>

        <div className="header-content">
          <h1 className="page-title">
            <FaPlusCircle className="title-icon" /> Create New Recipe
          </h1>
          <p className="page-subtitle">
            Share your culinary creation with the CookTogether community and earn rewards!
          </p>
        </div>
      </div>

      <RecipeForm onRecipeCreated={handleRecipeCreated} />
    </div>
  );
};

export default CreateRecipePage;