import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Chip } from '@mui/material';
import { LocalDining, Book, Group, TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';

const HomePage = () => {
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isLoggedIn = !!user;

    useEffect(() => {
        // Fetch featured recipes
        api.get('/recipe/list.php?limit=3')
            .then(res => {
                if (res.data.success) setFeaturedRecipes(res.data.recipes);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const quickActions = [
        {
            title: 'Cook Now',
            icon: '🍳',
            path: '/recipes',
            color: '#E63946',
            description: 'Start cooking immediately'
        },
        {
            title: 'My Cookbook',
            icon: '📚',
            path: '/cookbook',
            color: '#457B9D',
            description: 'View saved recipes'
        },
        {
            title: 'Join Session',
            icon: '👥',
            path: '/sessions',
            color: '#4CAF50',
            description: 'Cook with friends'
        },
        {
            title: 'Shop',
            icon: '🏪',
            path: '/shop',
            color: '#FF9800',
            description: 'Buy tools & themes'
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Welcome Section */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" sx={{ color: '#1D3557', mb: 2, fontWeight: 'bold' }}>
                        🍳 Welcome to CookTogether!
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#457B9D', mb: 3 }}>
                        {isLoggedIn
                            ? `Welcome back, Chef ${user.username}! Ready to cook?`
                            : 'Start your cooking journey with friends and earn rewards!'}
                    </Typography>

                    {isLoggedIn && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
                            <Chip icon={<TrendingUp />} label={`🏆 Level 1`} sx={{ bgcolor: '#FFF3E0' }} />
                            <Chip icon={<LocalDining />} label={`💰 100 Gold`} sx={{ bgcolor: '#FFF3E0' }} />
                            <Chip icon={<Book />} label={`📚 0 Recipes`} sx={{ bgcolor: '#FFF3E0' }} />
                        </Box>
                    )}
                </Box>
            </motion.div>

            {/* Quick Actions    */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Typography variant="h5" sx={{ color: '#1D3557', mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    ⚡ Quick Actions
                </Typography>
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {quickActions.map((action, index) => (
                        <Grid item xs={12} sm={6} md={3} key={action.title}>
                            <motion.div
                                whileHover={{ y: -8, scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Paper
                                    component={Link}
                                    to={action.path}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        bgcolor: 'white',
                                        borderRadius: 3,
                                        boxShadow: `0 4px 20px ${action.color}20`,
                                        border: `2px solid ${action.color}30`,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: action.color,
                                            boxShadow: `0 8px 30px ${action.color}40`,
                                            transform: 'translateY(-8px)'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: '50%',
                                        bgcolor: `${action.color}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                        border: `2px solid ${action.color}30`
                                    }}>
                                        <Typography variant="h3" sx={{
                                            fontSize: '2.5rem',
                                            lineHeight: 1,
                                            filter: `drop-shadow(0 2px 4px ${action.color}40)`
                                        }}>
                                            {action.icon}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{
                                        color: '#1D3557',
                                        mb: 1,
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem'
                                    }}>
                                        {action.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        color: '#666',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.4
                                    }}>
                                        {action.description}
                                    </Typography>
                                    <Box sx={{
                                        mt: 2,
                                        pt: 2,
                                        width: '100%',
                                        borderTop: `1px dashed ${action.color}30`
                                    }}>
                                        <Typography variant="caption" sx={{
                                            color: action.color,
                                            fontWeight: 'medium',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 0.5
                                        }}>
                                            Click to explore →
                                        </Typography>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </motion.div>

            {/* Featured Recipes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ color: '#1D3557', mb: 3, fontWeight: 'bold' }}>
                        Featured Recipes
                    </Typography>

                    {loading ? (
                        <Typography>Loading featured recipes...</Typography>
                    ) : featuredRecipes.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#FFF8E1' }}>
                            <Typography sx={{ color: '#666', mb: 2 }}>No recipes yet!</Typography>
                            <Button
                                component={Link}
                                to="/create-recipe"
                                variant="contained"
                                sx={{ bgcolor: '#E63946' }}
                            >
                                Create First Recipe
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {featuredRecipes.map(recipe => (
                                <Grid item xs={12} md={4} key={recipe.id}>
                                    <RecipeCard recipe={recipe} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </motion.div>

            {/* Call to Action */}
            {!isLoggedIn && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#E3F2FD', borderRadius: 3 }}>
                        <Typography variant="h5" sx={{ color: '#1D3557', mb: 2 }}>
                            Ready to Start Cooking?
                        </Typography>
                        <Typography sx={{ color: '#457B9D', mb: 3 }}>
                            Join thousands of chefs cooking together!
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                size="large"
                                sx={{ bgcolor: '#E63946', px: 4 }}
                            >
                                Get Started Free
                            </Button>
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                size="large"
                                sx={{ borderColor: '#457B9D', color: '#457B9D' }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Paper>
                </motion.div>
            )}
        </Container>
    );
};

export default HomePage;