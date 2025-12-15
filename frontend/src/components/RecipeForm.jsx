import React, { useState } from 'react';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    Grid,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import { Timer, Restaurant, AttachMoney } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';
import IngredientList from './IngredientList';
import StepList from './StepList';
import ImageUpload from './ImageUpload';
import SaveRecipeButton from './SaveRecipeButton';
import CancelButton from './CancelButton';

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
        category: '',
        price: '',
        currency: 'USD'
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const uploadImage = async (imageData) => {
        if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
            return imageData;
        }
        if (imageData instanceof Blob) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(imageData);
            });
        }
        return '';
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
            enqueueSnackbar('❌ Add at least one ingredient', { variant: 'error' });
            setLoading(false);
            return;
        }

        try {
            // Get user ID from localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{"id": 1}');

            let imageUrl = '';
            if (image) {
                imageUrl = await uploadImage(image);
            }

            // Send recipe data
            const response = await api.post('/recipe/create.php', {
                ...form,
                prep_time: parseInt(form.prep_time) || 0,
                cook_time: parseInt(form.cook_time) || 0,
                servings: parseInt(form.servings) || 1,
                price: parseFloat(form.price) || 0,
                user_id: user.id || 1,
                image_url: imageUrl
            });

            if (response.data.success) {
                enqueueSnackbar(`✅ Recipe created! ID: ${response.data.recipe_id}`, {
                    variant: 'success',
                    autoHideDuration: 3000
                });

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
                    category: '',
                    price: '',
                    currency: 'USD'
                });
                setImage(null);
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
                sx={{ mb: 3 }}
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

            {/* Time & Difficulty Row */}
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
                        >
                            <MenuItem value="Easy">Easy</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Price and Currency */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Price (gold)"
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AttachMoney />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="50"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Currency</InputLabel>
                        <Select
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                            label="Currency"
                        >
                            <MenuItem value="USD">USD ($)</MenuItem>
                            <MenuItem value="EUR">EUR (€)</MenuItem>
                            <MenuItem value="GBP">GBP (£)</MenuItem>
                            <MenuItem value="PHP">PHP (₱)</MenuItem>
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

            {/* Image Upload */}
            <ImageUpload onImageSelect={setImage} />

            {/* Ingredients */}
            <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
                INGREDIENTS *
            </Typography>
            <IngredientList
                value={form.ingredients}
                onChange={(value) => setForm({ ...form, ingredients: value })}
            />

            {/* Steps */}
            <Typography variant="h6" sx={{ color: '#1D3557', mb: 2, mt: 3 }}>
                STEPS
            </Typography>
            <StepList
                value={form.steps}
                onChange={(value) => setForm({ ...form, steps: value })}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                <CancelButton />
                <SaveRecipeButton loading={loading} onClick={handleSubmit} />
            </Box>
        </Box>
    );
}

export default RecipeForm;