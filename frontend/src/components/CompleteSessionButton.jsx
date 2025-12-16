import React, { useState } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';

function CompleteSessionButton({ onComplete }) {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setCompleted(true);
            setLoading(false);
            if (onComplete) onComplete();
        }, 1500);
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : completed ? <CheckCircle /> : <CheckCircle />}
                    onClick={handleClick}
                    disabled={loading || completed}
                    sx={{
                        bgcolor: completed ? '#4CAF50' : '#E63946',
                        py: 2,
                        px: 6,
                        fontSize: '1.2rem',
                        '&:hover': {
                            bgcolor: completed ? '#388E3C' : '#d32f2f'
                        }
                    }}
                >
                    {loading ? 'Completing...' : completed ? 'Session Complete! 🎉' : 'Complete Session'}
                </Button>
            </motion.div>
            {completed && (
                <Typography sx={{ color: '#4CAF50', mt: 2 }}>
                    Redirecting in 3 seconds...
                </Typography>
            )}
        </Box>
    );
}

export default CompleteSessionButton;