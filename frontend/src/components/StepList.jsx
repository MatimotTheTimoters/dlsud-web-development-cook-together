import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function StepList({ value = '', onChange }) {
    const [step, setStep] = useState('');
    const steps = value ? value.split('\n').filter(s => s.trim()) : [];

    const handleAdd = () => {
        if (step.trim()) {
            const newSteps = [...steps, step.trim()];
            onChange(newSteps.join('\n'));
            setStep('');
        }
    };

    const handleRemove = (index) => {
        const newSteps = steps.filter((_, i) => i !== index);
        onChange(newSteps.join('\n'));
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    fullWidth
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
                    placeholder="Add step (e.g., Preheat oven to 350°F)"
                    size="small"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                />
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAdd}
                    sx={{ backgroundColor: '#457B9D', '&:hover': { backgroundColor: '#1D3557' } }}
                >
                    Add
                </Button>
            </Box>

            <AnimatePresence>
                <List dense>
                    {steps.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ListItem
                                sx={{
                                    borderBottom: '1px solid #A8DADC',
                                    py: 1,
                                    display: 'flex',
                                    gap: 2
                                }}
                            >
                                <Box sx={{
                                    backgroundColor: '#E63946',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    flexShrink: 0
                                }}>
                                    {index + 1}
                                </Box>
                                <Box sx={{ flex: 1 }}>{item}</Box>
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

export default StepList;