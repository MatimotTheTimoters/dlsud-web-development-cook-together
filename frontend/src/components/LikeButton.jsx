import React, { useState } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';

const LikeButton = ({ recipeId, initialLikes = 0, initialLiked = false }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await api.post('/recipe/like.php', {
                recipe_id: recipeId
            });

            if (response.data.success) {
                setLiked(response.data.liked);
                setLikeCount(response.data.like_count);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
                onClick={handleLike}
                disabled={loading}
                sx={{
                    color: liked ? '#E63946' : '#757575',
                    '&:hover': {
                        color: liked ? '#d32f2f' : '#E63946',
                        transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s'
                }}
            >
                <motion.div
                    animate={{ scale: liked ? 1.2 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    {liked ? <Favorite /> : <FavoriteBorder />}
                </motion.div>
            </IconButton>
            <Typography
                variant="body2"
                sx={{
                    color: liked ? '#E63946' : '#1D3557',
                    fontWeight: liked ? 'bold' : 'normal'
                }}
            >
                {likeCount}
            </Typography>
        </Box>
    );
};

export default LikeButton;