import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Box } from '@mui/material';
import { Favorite, Visibility, Timer, Restaurant, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
    const totalTime = (+recipe.prep_time || 0) + (+recipe.cook_time || 0);

    // SIMPLE FIX: Use a default food image if no image_url
    const imageUrl = recipe.image_url && recipe.image_url !== ''
        ? recipe.image_url
        : 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'; // Default food image

    return (
        <motion.div whileHover={{ y: -5 }}>
            <Card sx={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #A8DADC',
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Recipe Image - FIXED with fallback */}
                <CardMedia
                    component="img"
                    height="160"
                    image={imageUrl}
                    alt={recipe.title}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                    }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                    {/* Recipe Title */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: '#1D3557',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                        }}
                    >
                        {recipe.title || 'Untitled Recipe'}
                    </Typography>

                    {/* Chef Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Person sx={{ fontSize: 16, color: '#457B9D', mr: 0.5 }} />
                        <Typography variant="body2" color="#457B9D">
                            {recipe.username || 'Anonymous Chef'}
                        </Typography>
                    </Box>

                    {/* Time and Servings */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Timer sx={{ fontSize: 16, color: '#457B9D', mr: 0.5 }} />
                            <Typography variant="body2" color="#457B9D">
                                {totalTime}min
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Restaurant sx={{ fontSize: 16, color: '#457B9D', mr: 0.5 }} />
                            <Typography variant="body2" color="#457B9D">
                                {recipe.servings || 1} serving{recipe.servings !== 1 ? 's' : ''}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Category Tag */}
                    <Box sx={{
                        display: 'inline-block',
                        backgroundColor: '#E3F2FD',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        mb: 1
                    }}>
                        <Typography variant="caption" color="#1D3557">
                            🏷️ {recipe.category || 'Uncategorized'}
                        </Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {recipe.description || 'No description available'}
                    </Typography>
                </CardContent>

                {/* Stats and Actions - REMOVED random values */}
                <CardActions sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 2,
                    pb: 2,
                    pt: 0
                }}>
                    {/* Stats - SIMPLE: Just show icons without counts */}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <IconButton size="small">
                            <Favorite sx={{ fontSize: 16, color: '#E63946' }} />
                        </IconButton>
                        <IconButton size="small">
                            <Visibility sx={{ fontSize: 16, color: '#E63946' }} />
                        </IconButton>
                    </Box>

                    {/* View Recipe Link */}
                    <Link
                        to={`/recipe/${recipe.id}`}
                        style={{
                            textDecoration: 'none',
                            color: '#457B9D',
                            fontSize: '0.875rem',
                            fontWeight: 500
                        }}
                        onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                        View Recipe →
                    </Link>
                </CardActions>
            </Card>
        </motion.div>
    );
}

export default RecipeCard;