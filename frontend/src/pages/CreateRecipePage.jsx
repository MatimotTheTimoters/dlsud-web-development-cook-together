import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Paper
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import RecipeForm from '../components/RecipeForm';

function CreateRecipePage() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Container maxWidth="md" sx={{ mt: 0, mb: 4, p: 0 }}>
                {/* Header */}
                <AppBar position="static" sx={{ backgroundColor: '#E63946', mb: 3 }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                            CREATE NEW RECIPE
                        </Typography>
                        <Box sx={{ width: 40 }} />
                    </Toolbar>
                </AppBar>

                {/* Recipe Form */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#FFFFFF' }}>
                    <RecipeForm />
                </Paper>
            </Container>
        </motion.div>
    );
}

export default CreateRecipePage;