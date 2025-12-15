import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

function RecipeIngredientList({ ingredients }) {
    const ingredientArray = ingredients ? ingredients.split(',').filter(i => i.trim()) : [];

    return (
        <Paper className="recipe-ingredient-list" sx={{ p: 3, bgcolor: 'white' }}>
            <Typography variant="h5" sx={{ color: '#1D3557', mb: 2 }}>📝 Ingredients</Typography>
            {ingredientArray.map((ing, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Box className="recipe-ingredient-item" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: '#457B9D', borderRadius: '50%', mr: 2 }} />
                        <Typography>{ing.trim()}</Typography>
                    </Box>
                </motion.div>
            ))}
        </Paper>
    );
}

export default RecipeIngredientList;