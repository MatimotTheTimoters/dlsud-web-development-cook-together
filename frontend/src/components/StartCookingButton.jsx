import React, { useState } from 'react';
import { Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import SessionTypeModal from './SessionTypeModal';

function StartCookingButton({ recipeId }) {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const createSession = async (sessionType) => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Please login first');
                navigate('/login');
                return;
            }

            const response = await api.post('/session/create.php', {
                recipe_id: recipeId,
                user_id: user.id,
                session_type: sessionType
            });

            if (response.data.success) {
                const sessionId = response.data.session_id;
                if (sessionType === 'multiplayer' && response.data.session_code) {
                    setMessage(`Multiplayer session created! Code: ${response.data.session_code}`);
                    setTimeout(() => navigate(`/cooking-session/${sessionId}`), 2000);
                } else {
                    navigate(`/cooking-session/${sessionId}`);
                }
            } else {
                setMessage('Failed to create session');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error creating session');
        } finally {
            setLoading(false);
            setModalOpen(false);
        }
    };

    const handleClick = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login first');
            navigate('/login');
            return;
        }
        setModalOpen(true);
    };

    return (
        <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                    onClick={handleClick}
                    disabled={loading}
                    sx={{
                        bgcolor: '#E63946',
                        '&:hover': { bgcolor: '#d32f2f' },
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem'
                    }}
                >
                    Start Cooking
                </Button>
            </motion.div>

            <SessionTypeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={createSession}
            />

            <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage('')}>
                <Alert severity="info">{message}</Alert>
            </Snackbar>
        </>
    );
}

export default StartCookingButton;