import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function IngredientList({ value = '', onChange }) {
    const [ingredient, setIngredient] = useState('');
    const ingredients = value ? value.split('\n').filter(i => i.trim()) : [];

    const handleAdd = () => {
        if (ingredient.trim()) {
            const newIngredients = [...ingredients, ingredient.trim()];
            onChange(newIngredients.join('\n'));
            setIngredient('');
        }
    };

    const handleRemove = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        onChange(newIngredients.join('\n'));
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    fullWidth
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    placeholder="Add ingredient (e.g., 2 cups flour)"
                    size="small"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                />
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAdd}
                    sx={{ backgroundColor: '#E63946', '&:hover': { backgroundColor: '#d32f2f' } }}
                >
                    Add
                </Button>
            </Box>

            <AnimatePresence>
                <List dense>
                    {ingredients.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <ListItem
                                sx={{
                                    borderBottom: '1px solid #A8DADC',
                                    py: 1,
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>{index + 1}. {item}</span>
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemove(index)}
                                    sx={{ color: '#E63946' }}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItem>
                        </motion.div>
                    ))}
                </List>
            </AnimatePresence>
        </Box>
    );
}

export default IngredientList;