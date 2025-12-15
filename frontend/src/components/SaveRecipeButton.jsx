import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

const SaveRecipeButton = ({ recipeId, initialSaved = false }) => {
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleSave = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await api.post('/cookbook/save.php', {
                recipe_id: recipeId
            });

            if (response.data.success) {
                setSaved(response.data.saved);
                enqueueSnackbar(
                    response.data.saved ? 'Recipe saved to cookbook!' : 'Recipe removed from cookbook',
                    { variant: response.data.saved ? 'success' : 'info' }
                );
            }
        } catch (error) {
            console.error('Error saving recipe:', error);
            enqueueSnackbar('Error saving recipe', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            startIcon={
                <motion.div
                    animate={{ rotate: saved ? 360 : 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    {saved ? <Bookmark /> : <BookmarkBorder />}
                </motion.div>
            }
            sx={{
                bgcolor: saved ? '#4CAF50' : '#457B9D',
                '&:hover': {
                    bgcolor: saved ? '#45a049' : '#1D3557'
                }
            }}
        >
            {saved ? 'SAVED' : 'SAVE'}
        </Button>
    );
};

export default SaveRecipeButton;