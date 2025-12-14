import React from 'react';
import RecipeForm from '../components/RecipeForm';

function CreateRecipePage() {
    return (
        <div className="create-recipe-page">
            <h1>📝 Create Recipe</h1>
            <RecipeForm />
        </div>
    );
}

export default CreateRecipePage;