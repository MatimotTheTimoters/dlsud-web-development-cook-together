import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function StartCookingButton({ recipeId }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const startCooking = () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login first');
            navigate('/login');
            setLoading(false);
            return;
        }
        setTimeout(() => {
            alert('Starting cooking session!');
            setLoading(false);
        }, 1000);
    };

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="contained" startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />} onClick={startCooking} disabled={loading} sx={{ bgcolor: '#E63946', '&:hover': { bgcolor: '#d32f2f' }, py: 1.5, px: 4 }}>
                {loading ? 'Starting...' : 'Start Cooking'}
            </Button>
        </motion.div>
    );
}

export default StartCookingButton;