import React, { useState } from 'react';
import { IconButton, Tooltip, Button } from '@mui/material'; // Added Button import
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

const SaveRecipeButton = ({ recipeId, initialSaved = false, compact = false }) => {
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

    if (compact) {
        return (
            <Tooltip title={saved ? "Remove from cookbook" : "Save to cookbook"}>
                <IconButton
                    onClick={handleSave}
                    disabled={loading}
                    size="small"
                    sx={{
                        color: saved ? '#4CAF50' : '#457B9D',
                        '&:hover': {
                            backgroundColor: saved ? 'rgba(76, 175, 80, 0.1)' : 'rgba(69, 123, 157, 0.1)'
                        }
                    }}
                >
                    <motion.div
                        animate={{ rotate: saved ? 360 : 0 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        {saved ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                    </motion.div>
                </IconButton>
            </Tooltip>
        );
    }

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