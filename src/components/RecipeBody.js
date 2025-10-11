import React, { useEffect, useState } from 'react';
import RecipeCard from './cards/RecipeCard';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../styles/colors.css';
import '../styles/layout.css';

const RecipeItems = [
  { id: 1, title: 'Spaghetti Bolognese', reward: '25g', sold: '1.5k', rating: 4, reviews: 342, end: '06/12/25', img: '/assets/images/placeholder.svg' },
  { id: 2, title: 'Vegan Salad', reward: 'FREE', sold: '980', rating: 3, reviews: 210, end: '09/21/25', img: '/assets/images/placeholder.svg' },
  { id: 3, title: 'Sushi Platter', reward: '50g', sold: '2.3k', rating: 5, reviews: 540, end: '01/01/26', img: '/assets/images/placeholder.svg' },
  { id: 4, title: 'Spaghetti Bolognese', reward: '25g', sold: '1.5k', rating: 4, reviews: 342, end: '06/12/25', img: '/assets/images/placeholder.svg' },
  { id: 5, title: 'Vegan Salad', reward: 'FREE', sold: '980', rating: 3, reviews: 210, end: '09/21/25', img: '/assets/images/placeholder.svg' },
  { id: 6, title: 'Sushi Platter', reward: '50g', sold: '2.3k', rating: 5, reviews: 540, end: '01/01/26', img: '/assets/images/placeholder.svg' },
  { id: 7, title: 'Spaghetti Bolognese', reward: '25g', sold: '1.5k', rating: 4, reviews: 342, end: '06/12/25', img: '/assets/images/placeholder.svg' },
  { id: 8, title: 'Vegan Salad', reward: 'FREE', sold: '980', rating: 3, reviews: 210, end: '09/21/25', img: '/assets/images/placeholder.svg' },
  { id: 9, title: 'Sushi Platter', reward: '50g', sold: '2.3k', rating: 5, reviews: 540, end: '01/01/26', img: '/assets/images/placeholder.svg' },

];

function RecipeBody({ query = '', onQueryChange = () => {} }) {
  const [filteredItems, setFilteredItems] = useState(RecipeItems);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    const filtered = RecipeItems.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.reward.toLowerCase().includes(lowerQuery) ||
        item.rating.toString().includes(lowerQuery)
    );
    setFilteredItems(filtered);
  }, [query]);

  return (
    <div className="recipe-card-grid mt-3">
      {filteredItems.map(item => (
        <RecipeCard key={item.id} recipe={item} />
      ))}
    </div>
  );
}


export default RecipeBody;
