import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, IconButton, Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import RecipeHeader from '../components/RecipeHeader';
import RecipeImage from '../components/RecipeImage';
import RecipeIngredientList from '../components/RecipeIngredientList';
import RecipeStepList from '../components/RecipeStepList';
import StartCookingButton from '../components/StartCookingButton';
import SaveRecipeButton from '../components/SaveRecipeButton';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import PurchaseButton from '../components/PurchaseButton';

function RecipeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        // Get current user ID
        const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');
        setCurrentUserId(user.id || 1);

        api.get(`/recipe/get.php?id=${id}&user_id=${user.id || 1}`)
            .then(res => {
                if (res.data.success) {
                    setRecipe(res.data.recipe);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    // Check if user owns recipe OR has purchased it
    const userOwnsRecipe = recipe.user_id === currentUserId;
    const canStartCooking = userOwnsRecipe || recipe.purchased;

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
                    <RecipeIngredientList ingredients={recipe.ingredients} />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <RecipeStepList steps={recipe.steps} />
                </motion.div>
            </Box>

            <Box className="recipe-actions" sx={{ display: 'flex', gap: '20px', mt: 3 }}>
                <StartCookingButton
                    recipeId={id}
                    purchased={canStartCooking}
                    recipePrice={recipe.price}
                    userOwnsRecipe={userOwnsRecipe}
                />
                <SaveRecipeButton recipeId={id} initialSaved={recipe.saved || false} />
                <LikeButton recipeId={id} initialLikes={recipe.likes || 0} />
                {/* Only show purchase button if user doesn't own and hasn't purchased */}
                {!userOwnsRecipe && !recipe.purchased && (
                    <PurchaseButton
                        recipeId={id}
                        recipeTitle={recipe.title}
                        price={recipe.price || 50}
                    />
                )}
            </Box>

            <Divider sx={{ my: 4 }} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <CommentSection recipeId={id} />
            </motion.div>
        </Container>
    );
}

export default RecipeDetailPage;