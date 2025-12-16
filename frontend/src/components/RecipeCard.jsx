import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Box, Chip } from '@mui/material';
import { Visibility, Timer, Restaurant, Person, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import SaveRecipeButton from './SaveRecipeButton';

function RecipeCard({ recipe }) {
    const totalTime = (+recipe.prep_time || 0) + (+recipe.cook_time || 0);

    // Check if recipe is free or has price
    const isFree = !recipe.price || recipe.price === 0 || recipe.price === '0';
    const price = recipe.price || 0;

    const imageUrl = recipe.image_url && recipe.image_url.startsWith('data:image')
        ? recipe.image_url
        : recipe.image_url && recipe.image_url !== ''
            ? recipe.image_url
            : 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    return (
        <motion.div whileHover={{ y: -5 }} style={{ width: '100%', height: '100%' }}>
            <Card className="recipe-card-container">
                {/* Recipe Image with Price Badge */}
                <div style={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        className="recipe-card-image"
                        image={imageUrl}
                        alt={recipe.title}
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                        }}
                    />

                    {/* Price Badge */}
                    {!isFree && (
                        <Chip
                            icon={<AttachMoney sx={{ fontSize: 14 }} />}
                            label={price}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(255, 215, 0, 0.95)',
                                color: '#1D3557',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255, 193, 7, 0.3)',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                zIndex: 10,
                                '& .MuiChip-icon': { color: '#1D3557' }
                            }}
                        />
                    )}

                    {/* Free Badge */}
                    {isFree && (
                        <Chip
                            label="FREE"
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(76, 175, 80, 0.95)',
                                color: 'white',
                                fontWeight: 'bold',
                                border: '1px solid rgba(76, 175, 80, 0.3)',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                zIndex: 10
                            }}
                        />
                    )}
                </div>

                <CardContent className="recipe-card-content">
                    {/* Recipe Title */}
                    <Typography className="recipe-card-title">
                        {recipe.title || 'Untitled Recipe'}
                    </Typography>

                    {/* Chef Name */}
                    <Box className="recipe-card-chef">
                        <Person sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                            {recipe.username || 'Anonymous Chef'}
                        </Typography>
                    </Box>

                    {/* Time and Servings */}
                    <Box className="recipe-card-meta">
                        <Box className="recipe-card-meta-item">
                            <Timer sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">
                                {totalTime}min
                            </Typography>
                        </Box>
                        <Box className="recipe-card-meta-item">
                            <Restaurant sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">
                                {recipe.servings || 1} serving{recipe.servings !== 1 ? 's' : ''}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Category Tag */}
                    <Box className="recipe-card-category">
                        <Typography className="recipe-card-category-text">
                            🏷️ {recipe.category || 'Uncategorized'}
                        </Typography>
                    </Box>

                    {/* Description */}
                    <Typography className="recipe-card-description">
                        {recipe.description || 'No description available'}
                    </Typography>
                </CardContent>

                {/* Stats and Actions */}
                <CardActions className="recipe-card-actions">
                    {/* Left side: Like and Views */}
                    <Box className="recipe-card-stats" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Like Button */}
                        <LikeButton
                            recipeId={recipe.id}
                            initialLikes={recipe.likes || 0}
                            initialLiked={recipe.user_liked || false}
                            compact={true}
                        />

                        {/* Views */}
                        <IconButton size="small" className="recipe-card-stat" disabled>
                            <Visibility sx={{ fontSize: 16, color: '#757575' }} />
                            <Typography variant="caption" sx={{ ml: 0.5, color: '#757575' }}>
                                {recipe.views || 0}
                            </Typography>
                        </IconButton>
                    </Box>

                    {/* Right side: Save Button and View Link */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Save Recipe Button (Compact) */}
                        <SaveRecipeButton
                            recipeId={recipe.id}
                            initialSaved={recipe.user_saved || false}
                            compact={true}
                        />

                        {/* View Recipe Link */}
                        <Link
                            to={`/recipe/${recipe.id}`}
                            className="recipe-card-link"
                        >
                            View →
                        </Link>
                    </Box>
                </CardActions>
            </Card>
        </motion.div>
    );
}

export default RecipeCard;