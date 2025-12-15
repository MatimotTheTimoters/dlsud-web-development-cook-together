import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, IconButton, Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import RecipeHeader from '../components/RecipeHeader';
import RecipeImage from '../components/RecipeImage';
import RecipeIngredientList from '../components/RecipeIngredientList'; // CHANGED
import RecipeStepList from '../components/RecipeStepList'; // CHANGED
import StartCookingButton from '../components/StartCookingButton';
import SaveRecipeButton from '../components/SaveRecipeButton';
import CommentSection from '../components/CommentSection';

function RecipeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/recipe/get.php?id=${id}`)
            .then(res => {
                if (res.data.success) setRecipe(res.data.recipe);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    return (
        <Container maxWidth="md" className="recipe-detail-page">
            <IconButton onClick={() => navigate(-1)} className="back-button">
                <ArrowBack />
            </IconButton>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <RecipeHeader recipe={recipe} />
            </motion.div>

            <RecipeImage image={recipe.image_url} title={recipe.title} />

            <Box className="recipe-content">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <RecipeIngredientList ingredients={recipe.ingredients} /> {/* CHANGED */}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <RecipeStepList steps={recipe.steps} /> {/* CHANGED */}
                </motion.div>
            </Box>

            <Box className="recipe-actions">
                <StartCookingButton recipeId={id} />
                <SaveRecipeButton recipeId={id} />
            </Box>

            <Divider sx={{ my: 4 }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <CommentSection recipeId={id} />
            </motion.div>
        </Container>
    );
}

export default RecipeDetailPage;