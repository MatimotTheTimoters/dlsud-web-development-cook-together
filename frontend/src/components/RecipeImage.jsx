import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function RecipeImage({ image, title }) {
    return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="recipe-image">
            {image && image.startsWith('data:image') ? (
                <img src={image} alt={title} style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 10 }} />
            ) : (
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F1FAEE', borderRadius: 2 }}>
                    <Typography>🍳 No image</Typography>
                </Box>
            )}
        </motion.div>
    );
}

export default RecipeImage;