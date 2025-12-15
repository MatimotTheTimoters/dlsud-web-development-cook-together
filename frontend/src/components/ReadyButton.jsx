import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Person, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

function ReadyButton({ sessionId, participantId, currentStatus, onStatusChange }) {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const isReady = currentStatus === 'ready';

    const toggleReady = async () => {
        setLoading(true);
        try {
            const newStatus = isReady ? 'not_ready' : 'ready';
            const response = await api.post('/session/ready.php', {
                participant_id: participantId,
                ready_status: newStatus
            });

            if (response.data.success) {
                enqueueSnackbar(`You are ${newStatus === 'ready' ? 'ready!' : 'not ready'}`, {
                    variant: newStatus === 'ready' ? 'success' : 'info'
                });
                onStatusChange();
            }
        } catch (error) {
            enqueueSnackbar('Failed to update status', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Button
                variant="contained"
                startIcon={isReady ? <CheckCircle /> : <Person />}
                onClick={toggleReady}
                disabled={loading}
                sx={{
                    bgcolor: isReady ? '#4CAF50' : '#FF9800',
                    color: 'white',
                    '&:hover': {
                        bgcolor: isReady ? '#45a049' : '#f57c00'
                    },
                    minWidth: 140
                }}
            >
                {loading ? '...' : (isReady ? 'READY!' : 'READY?')}
            </Button>
        </motion.div>
    );
}

export default ReadyButton;