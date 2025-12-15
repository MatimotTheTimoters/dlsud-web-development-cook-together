import React from 'react';
import { Fab, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function CreateRecipeButton() {
    const navigate = useNavigate();

    return (
        <Box sx={{ position: 'fixed', bottom: 32, right: 32 }}>
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <Fab
                    color="secondary"
                    aria-label="create recipe"
                    onClick={() => navigate('/create-recipe')}
                    sx={{
                        backgroundColor: '#E63946',
                        '&:hover': {
                            backgroundColor: '#d32f2f',
                        }
                    }}
                >
                    <Add sx={{ color: '#FFFFFF' }} />
                </Fab>
            </motion.div>
        </Box>
    );
}

export default CreateRecipeButton;