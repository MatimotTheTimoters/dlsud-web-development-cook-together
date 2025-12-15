import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import { motion } from 'framer-motion';

function SaveRecipeButton({ recipeId }) {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(!saved);
        alert(saved ? 'Recipe removed from cookbook' : 'Recipe saved to cookbook!');
    };

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" startIcon={<Bookmark />} onClick={handleSave} sx={{ borderColor: saved ? '#4CAF50' : '#457B9D', color: saved ? '#4CAF50' : '#457B9D', py: 1.5, px: 4 }}>
                {saved ? 'Saved' : 'Save Recipe'}
            </Button>
        </motion.div>
    );
}

export default SaveRecipeButton;