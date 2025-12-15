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

    useEffect(() => {
        fetchRecipes();
    }, [filters]);

    const fetchRecipes = async () => {
        try {
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
        setLoading(true);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = recipes.filter(recipe =>
                recipe.title.toLowerCase().includes(query.toLowerCase()) ||
                recipe.description.toLowerCase().includes(query.toLowerCase()) ||
                (recipe.category && recipe.category.toLowerCase().includes(query.toLowerCase()))
            );
            setRecipes(filtered);
        } else {
            fetchRecipes();
        }
    };

    if (loading) {
        return (
            <Box className="loading-container">
                <Typography className="loading-text">
                    Loading recipes...
                </Typography>
            </Box>
        );
    }

    return (
        <Container className="recipes-container">
            {/* Header with search */}
            <Box className="recipes-header">
                <Typography className="recipes-title">
                    🍳 Recipes
                </Typography>
                <div className="search-container">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </Box>

            {/* Filters */}
            <div className="filters-section">
                <RecipeFilters
                    currentFilters={filters}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Recipe Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Grid container spacing={3} className="recipes-grid">
                    {recipes.length > 0 ? (
                        recipes.map((recipe, index) => (
                            <Grid item xs={12} sm={6} md={4} key={recipe.id} className="recipe-grid-item">
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
                            <Box className="no-recipes-container">
                                <Typography className="no-recipes-message">
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