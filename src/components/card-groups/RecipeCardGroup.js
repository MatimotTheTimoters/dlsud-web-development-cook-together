import React from 'react';
import RecipeCard from '../cards/RecipeCard';
import '../../styles/layout.css';

function RecipeCardGroup({ items }) {
  return (
    <div className="recipe-card-grid">
      {items.map(item => (
        <RecipeCard key={item.id} recipe={item} />
      ))}
    </div>
  );
}

export default RecipeCardGroup;
