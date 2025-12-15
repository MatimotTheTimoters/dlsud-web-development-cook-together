import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { Timer, Restaurant, Person } from '@mui/icons-material';

function RecipeHeader({ recipe }) {
    const totalTime = (+recipe.prep_time || 0) + (+recipe.cook_time || 0);

    return (
        <Box className="recipe-header">
            <Typography variant="h3" sx={{ color: '#1D3557', mb: 2 }}>{recipe.title}</Typography>
            <Typography sx={{ color: '#1D3557', mb: 3 }}>{recipe.description}</Typography>

            <Box className="recipe-meta">
                <Chip icon={<Person />} label={`By ${recipe.username}`} variant="outlined" sx={{ borderColor: '#457B9D', color: '#1D3557' }} />
                <Chip icon={<Timer />} label={`${totalTime} min`} sx={{ bgcolor: '#A8DADC', color: '#1D3557' }} />
                <Chip icon={<Restaurant />} label={`${recipe.servings} servings`} sx={{ bgcolor: '#E63946', color: 'white' }} />
                <Chip label={recipe.difficulty} variant="outlined" sx={{ borderColor: '#4CAF50', color: '#4CAF50' }} />
            </Box>
        </Box>
    );
}

export default RecipeHeader;