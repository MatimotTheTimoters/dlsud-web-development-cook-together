import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { CheckCircle, CheckCircleOutline } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';

function CompleteStepButton({ sessionId, stepId, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleComplete = async () => {
        setLoading(true);
        try {
            const response = await api.post('/session/complete-step.php', {
                session_id: sessionId,
                step_id: stepId
            });

            if (response.data.success) {
                setCompleted(true);
                if (onComplete) onComplete();
            }
        } catch (error) {
            console.error('Error completing step:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                variant={completed ? "contained" : "outlined"}
                startIcon={completed ? <CheckCircle /> : <CheckCircleOutline />}
                onClick={handleComplete}
                disabled={loading || completed}
                sx={{
                    borderColor: '#457B9D',
                    color: completed ? 'white' : '#457B9D',
                    backgroundColor: completed ? '#4CAF50' : 'transparent',
                    '&:hover': {
                        borderColor: completed ? '#45a049' : '#1D3557',
                        backgroundColor: completed ? '#45a049' : 'rgba(69, 123, 157, 0.1)'
                    },
                    px: 3,
                    py: 1
                }}
            >
                {loading ? <CircularProgress size={20} /> : (completed ? 'Completed' : 'Mark Complete')}
            </Button>
        </motion.div>
    );
}

export default CompleteStepButton;