import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

function RecipeStepList({ steps }) {
    const stepArray = steps ? steps.split('.').filter(s => s.trim()) : [];

    return (
        <Paper className="recipe-step-list" sx={{ p: 3, bgcolor: 'white' }}>
            <Typography variant="h5" sx={{ color: '#1D3557', mb: 2 }}>👨‍🍳 Steps</Typography>
            {stepArray.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Box className="recipe-step-item" sx={{ display: 'flex', mb: 2 }}>
                        <Box sx={{ bgcolor: '#E63946', color: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, flexShrink: 0 }}>{i + 1}</Box>
                        <Typography>{step.trim()}</Typography>
                    </Box>
                </motion.div>
            ))}
        </Paper>
    );
}

export default RecipeStepList;