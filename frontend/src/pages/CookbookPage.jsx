import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Tabs, Tab } from '@mui/material';
import { Book } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';

function CookbookPage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');

    useEffect(() => {
        api.get('/cookbook/list.php')
            .then(res => {
                if (res.data.success) setRecipes(res.data.recipes);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredRecipes = category === 'all'
        ? recipes
        : recipes.filter(recipe => recipe.category === category);

    const categories = ['all', ...new Set(recipes.map(r => r.category).filter(Boolean))];

    return (
        <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#FFF8E1', minHeight: '100vh' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                    <Book sx={{ fontSize: 40, color: '#1D3557' }} />
                    <Typography variant="h4" sx={{ color: '#1D3557', fontWeight: 'bold' }}>
                        My Cookbook
                    </Typography>
                </Box>
            </motion.div>

            <Tabs
                value={category}
                onChange={(e, newValue) => setCategory(newValue)}
                sx={{ mb: 4, bgcolor: '#A8DADC', borderRadius: 2, p: 1 }}
            >
                {categories.map(cat => (
                    <Tab
                        key={cat}
                        label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                        value={cat}
                        sx={{
                            color: category === cat ? '#1D3557' : '#457B9D',
                            fontWeight: category === cat ? 'bold' : 'normal'
                        }}
                    />
                ))}
            </Tabs>

            {loading ? (
                <Typography>Loading saved recipes...</Typography>
            ) : filteredRecipes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                        {category === 'all' ? 'No saved recipes yet!' : `No ${category} recipes saved`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                        Save recipes to see them here
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredRecipes.map(recipe => (
                        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RecipeCard recipe={recipe} />
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default CookbookPage;