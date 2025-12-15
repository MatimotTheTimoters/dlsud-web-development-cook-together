import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Fab, Box } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import RecipeFilters from '../components/RecipeFilters';
import CreateRecipeButton from '../components/CreateRecipeButton';

function RecipesPage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        time: 'all',
        category: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch recipes when filters change
    useEffect(() => {
        fetchRecipes();
    }, [filters]); // Re-fetch when filters change

    const fetchRecipes = async () => {
        try {
            // Build query parameters from filters
            const params = new URLSearchParams();
            if (filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
            if (filters.category !== 'all') params.append('category', filters.category);
            if (filters.time !== 'all') params.append('time', filters.time);

            const queryString = params.toString();
            const url = queryString ? `/recipe/list.php?${queryString}` : '/recipe/list.php';

            const response = await api.get(url);
            if (response.data.success) {
                setRecipes(response.data.recipes);
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setLoading(true); // Show loading when changing filters
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        // SIMPLE SEARCH: Filter client-side for now
        if (query) {
            const filtered = recipes.filter(recipe =>
                recipe.title.toLowerCase().includes(query.toLowerCase()) ||
                recipe.description.toLowerCase().includes(query.toLowerCase()) ||
                recipe.category.toLowerCase().includes(query.toLowerCase())
            );
            setRecipes(filtered);
        } else {
            // If search is cleared, refetch original recipes
            fetchRecipes();
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6" color="#457B9D">
                    Loading recipes...
                </Typography>
            </Box>
        );
    }

    return (
        <Container
            sx={{
                backgroundColor: '#F1FAEE',
                minHeight: '100vh',
                py: 4
            }}
        >
            {/* Header with search */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: '#457B9D',
                        fontWeight: 'bold'
                    }}
                >
                    🍳 Recipes
                </Typography>
                <SearchBar onSearch={handleSearch} />
            </Box>

            {/* Filters - Pass current filters and onChange handler */}
            <RecipeFilters
                currentFilters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Recipe Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {recipes.length > 0 ? (
                        recipes.map((recipe, index) => (
                            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <RecipeCard recipe={recipe} />
                                </motion.div>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{
                                textAlign: 'center',
                                py: 8,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 2,
                                boxShadow: 1
                            }}>
                                <Typography variant="h6" color="#1D3557">
                                    {searchQuery ? 'No recipes match your search' : 'No recipes found. Be the first to create one!'}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </motion.div>

            {/* Create Recipe Button */}
            <CreateRecipeButton />
        </Container>
    );
}

export default RecipesPage;