import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Box } from '@mui/material';
import { Favorite, Visibility, Timer, Restaurant, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
    const totalTime = (+recipe.prep_time || 0) + (+recipe.cook_time || 0);

    const imageUrl = recipe.image_url && recipe.image_url.startsWith('data:image')
        ? recipe.image_url
        : recipe.image_url && recipe.image_url !== ''
            ? recipe.image_url
            : 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    return (
        <motion.div whileHover={{ y: -5 }}>
            <Card className="recipe-card-container">
                {/* Recipe Image */}
                <CardMedia
                    component="img"
                    className="recipe-card-image"
                    image={imageUrl}
                    alt={recipe.title}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                    }}
                />

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
                    {/* Stats */}
                    <Box className="recipe-card-stats">
                        <IconButton size="small" className="recipe-card-stat">
                            <Favorite sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton size="small" className="recipe-card-stat">
                            <Visibility sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>

                    {/* View Recipe Link */}
                    <Link
                        to={`/recipe/${recipe.id}`}
                        className="recipe-card-link"
                    >
                        View Recipe →
                    </Link>
                </CardActions>
            </Card>
        </motion.div>
    );
}

export default RecipeCard;