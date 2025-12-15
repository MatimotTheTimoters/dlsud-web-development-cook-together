import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { Timer, NavigateNext, NavigateBefore, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import api from '../api/axiosConfig';

function CookingSessionPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [recipe, setRecipe] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [checkedIngredients, setCheckedIngredients] = useState([]);

    useEffect(() => {
        // Mock data for now
        setSession({ id: sessionId, type: 'solo' });
        setRecipe({
            title: 'Spaghetti Carbonara',
            steps: ['Boil water for pasta', 'Cook pancetta', 'Mix eggs and cheese', 'Combine everything'].join('.'),
            ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', '100g pecorino cheese'].join(',')
        });
    }, [sessionId]);

    useEffect(() => {
        let timer;
        if (running && !completed) {
            timer = setInterval(() => setTime(t => t + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [running, completed]);

    const steps = recipe?.steps?.split('.').filter(s => s.trim()) || [];
    const ingredients = recipe?.ingredients?.split(',').filter(i => i.trim()) || [];

    const toggleTimer = () => setRunning(!running);
    const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
    const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);
    const toggleIngredient = (index) => {
        setCheckedIngredients(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const completeSession = () => {
        setCompleted(true);
        setTimeout(() => navigate('/'), 3000);
    };

    if (!session || !recipe) return <div>Loading...</div>;

    return (
        <Container maxWidth="md" sx={{ bgcolor: '#FFF8E1', minHeight: '100vh', p: 3 }}>
            {completed && <Confetti />}

            <Typography variant="h4" sx={{ color: '#E63946', mb: 3, textAlign: 'center' }}>
                👨‍🍳 Cooking Session #{sessionId}
            </Typography>

            {/* Timer */}
            <Paper sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: '#457B9D', color: 'white' }}>
                <Timer sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h3">
                    {Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}
                </Typography>
                <Button onClick={toggleTimer} sx={{ color: 'white', mt: 1 }}>
                    {running ? '⏸️ Pause' : '▶️ Resume'}
                </Button>
            </Paper>

            {/* Current Step */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#A8DADC' }}>
                <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
                    Current Step ({currentStep + 1}/{steps.length})
                </Typography>
                <Typography variant="h5" sx={{ color: '#1D3557' }}>
                    {steps[currentStep] || 'No steps available'}
                </Typography>
            </Paper>

            {/* Step Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Button
                    startIcon={<NavigateBefore />}
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    sx={{ color: '#457B9D' }}
                >
                    Previous
                </Button>
                <Button
                    endIcon={<NavigateNext />}
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    sx={{ color: '#457B9D' }}
                >
                    Next
                </Button>
            </Box>

            {/* Ingredients Checklist */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
                    📝 Ingredients Checklist
                </Typography>
                {ingredients.map((ing, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Button
                            size="small"
                            onClick={() => toggleIngredient(i)}
                            sx={{
                                color: checkedIngredients.includes(i) ? '#4CAF50' : '#757575',
                                minWidth: 'auto',
                                mr: 1
                            }}
                        >
                            {checkedIngredients.includes(i) ? <CheckCircle /> : '○'}
                        </Button>
                        <Typography sx={{ textDecoration: checkedIngredients.includes(i) ? 'line-through' : 'none' }}>
                            {ing.trim()}
                        </Typography>
                    </Box>
                ))}
            </Paper>

            {/* Complete Session Button */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={completeSession}
                        sx={{
                            bgcolor: completed ? '#4CAF50' : '#E63946',
                            py: 2,
                            px: 6,
                            fontSize: '1.2rem'
                        }}
                    >
                        {completed ? '🎉 Session Complete!' : 'Complete Session'}
                    </Button>
                </motion.div>
            </Box>
        </Container>
    );
}

export default CookingSessionPage;