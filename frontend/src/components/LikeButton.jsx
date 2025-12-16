import React, { useState } from 'react';
import { IconButton, Typography, Box, Button, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';

const LikeButton = ({ recipeId, initialLikes = 0, initialLiked = false, compact = false }) => {
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

    // Compact version (icon only with count)
    if (compact) {
        return (
            <Tooltip title={liked ? "Unlike recipe" : "Like recipe"}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                        onClick={handleLike}
                        disabled={loading}
                        size="small"
                        sx={{
                            color: liked ? '#E63946' : '#757575',
                            '&:hover': {
                                color: liked ? '#d32f2f' : '#E63946',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s',
                            padding: '4px'
                        }}
                    >
                        <motion.div
                            animate={{ scale: liked ? 1.2 : 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {liked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                        </motion.div>
                    </IconButton>
                    <Typography
                        variant="caption"
                        sx={{
                            color: liked ? '#E63946' : '#1D3557',
                            fontWeight: liked ? 'bold' : 'normal',
                            minWidth: '20px'
                        }}
                    >
                        {likeCount}
                    </Typography>
                </Box>
            </Tooltip>
        );
    }

    // Regular version (button with text)
    return (
        <Button
            variant="outlined"
            onClick={handleLike}
            disabled={loading}
            startIcon={
                <motion.div
                    animate={{ scale: liked ? 1.2 : 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    {liked ? <Favorite /> : <FavoriteBorder />}
                </motion.div>
            }
            sx={{
                color: liked ? '#E63946' : '#457B9D',
                borderColor: liked ? '#E63946' : '#A8DADC',
                '&:hover': {
                    borderColor: liked ? '#d32f2f' : '#457B9D',
                    backgroundColor: liked ? 'rgba(230, 57, 70, 0.04)' : 'rgba(69, 123, 157, 0.04)'
                }
            }}
        >
            {liked ? 'LIKED' : 'LIKE'} {likeCount > 0 && `(${likeCount})`}
        </Button>
    );
};

export default LikeButton;