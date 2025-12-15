import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Save } from '@mui/icons-material';
import { motion } from 'framer-motion';

function SaveRecipeButton({ loading, onClick }) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={loading}
                onClick={onClick}
                sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#388E3C' },
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem'
                }}
            >
                {loading ? 'Saving...' : 'Save Recipe'}
            </Button>
        </motion.div>
    );
}

export default SaveRecipeButton;