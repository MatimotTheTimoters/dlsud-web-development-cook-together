import React, { useState } from 'react';
import {
    TextField,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Grid,
    Alert,
    CircularProgress
} from '@mui/material';
import { Add, Timer, Restaurant } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

function RecipeForm() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        prep_time: '',
        cook_time: '',
        servings: '',
        difficulty: 'Medium',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!form.title.trim()) {
            enqueueSnackbar('❌ Recipe title is required', { variant: 'error' });
            setLoading(false);
            return;
        }

        if (!form.ingredients.trim()) {
            enqueueSnackbar('❌ Ingredients are required', { variant: 'error' });
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/recipe/create.php', {
                ...form,
                prep_time: parseInt(form.prep_time) || 0,
                cook_time: parseInt(form.cook_time) || 0,
                servings: parseInt(form.servings) || 1,
                user_id: 1
            });

            if (response.data.success) {
                enqueueSnackbar(`✅ Recipe created! ID: ${response.data.recipe_id}`, { variant: 'success' });

                // Reset form
                setForm({
                    title: '',
                    description: '',
                    ingredients: '',
                    steps: '',
                    prep_time: '',
                    cook_time: '',
                    servings: '',
                    difficulty: 'Medium',
                    category: ''
                });
            } else {
                enqueueSnackbar(`❌ ${response.data.message}`, { variant: 'error' });
            }
        } catch (error) {
            console.error("Error:", error);
            enqueueSnackbar('❌ Failed to create recipe', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const timeFields = [
        { label: 'Prep Time (min)', name: 'prep_time', icon: <Timer /> },
        { label: 'Cook Time (min)', name: 'cook_time', icon: <Timer /> },
        { label: 'Servings', name: 'servings', icon: <Restaurant /> }
    ];

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
            {/* Title */}
            <TextField
                fullWidth
                label="Recipe Title *"
                name="title"
                value={form.title}
                onChange={handleChange}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderColor: '#A8DADC' } }}
                placeholder="e.g., Chocolate Chip Cookies"
                required
            />

            {/* Description */}
            <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={2}
                sx={{ mb: 3 }}
                placeholder="A delicious recipe that everyone will love!"
            />

            {/* Time Fields Row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {timeFields.map((field) => (
                    <Grid item xs={12} sm={4} key={field.name}>
                        <TextField
                            fullWidth
                            label={field.label}
                            name={field.name}
                            type="number"
                            value={form[field.name]}
                            onChange={handleChange}
                            InputProps={{ startAdornment: field.icon }}
                            sx={{ '& .MuiOutlinedInput-root': { borderColor: '#A8DADC' } }}
                        />
                    </Grid>
                ))}
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Difficulty</InputLabel>
                        <Select
                            name="difficulty"
                            value={form.difficulty}
                            onChange={handleChange}
                            label="Difficulty"
                            sx={{ '& .MuiOutlinedInput-root': { borderColor: '#457B9D' } }}
                        >
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Category */}
            <TextField
                fullWidth
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                sx={{ mb: 3 }}
                placeholder="Main Dish, Dessert, etc."
            />

            {/* Ingredients */}
            <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
                INGREDIENTS *
            </Typography>
            <TextField
                fullWidth
                name="ingredients"
                value={form.ingredients}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderColor: '#A8DADC' } }}
                placeholder="Flour, Sugar, Eggs, Butter..."
                required
            />

            {/* Steps */}
            <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
                STEPS
            </Typography>
            <TextField
                fullWidth
                name="steps"
                value={form.steps}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderColor: '#A8DADC' } }}
                placeholder="1. Mix dry ingredients. 2. Add wet ingredients. 3. Bake at 350°F for 20 minutes."
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Add />}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#E63946',
                        '&:hover': { backgroundColor: '#d32f2f' },
                        flex: 1
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Create Recipe'}
                </Button>
            </Box>
        </Box>
    );
}

export default RecipeForm;