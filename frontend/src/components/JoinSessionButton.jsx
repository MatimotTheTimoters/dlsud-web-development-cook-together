import React, { useState } from 'react';
import { Button, Modal, Box, TextField, Typography } from '@mui/material';
import { Group } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

function JoinSessionButton() {
    const [open, setOpen] = useState(false);
    const [sessionCode, setSessionCode] = useState('');
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleJoin = async () => {
        if (!sessionCode.trim()) {
            enqueueSnackbar('Please enter a session code', { variant: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const response = await api.post('/session/join.php', {
                session_code: sessionCode,
                user_id: user.id
            });

            if (response.data.success) {
                enqueueSnackbar('Successfully joined session!', { variant: 'success' });
                setOpen(false);
                setSessionCode('');
                // Redirect to session page
                window.location.href = `/session/${response.data.session_id}`;
            } else {
                enqueueSnackbar(response.data.message, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Failed to join session', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<Group />}
                onClick={() => setOpen(true)}
                sx={{
                    bgcolor: '#E63946',
                    '&:hover': { bgcolor: '#d32f2f' }
                }}
            >
                JOIN SESSION
            </Button>

            <AnimatePresence>
                {open && (
                    <Modal open={open} onClose={() => !loading && setOpen(false)}>
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'white',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: 24,
                        }}>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <Typography variant="h6" gutterBottom sx={{ color: '#1D3557' }}>
                                    Enter Session Code
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Session Code"
                                    value={sessionCode}
                                    onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#A8DADC' },
                                            '&:hover fieldset': { borderColor: '#457B9D' }
                                        }
                                    }}
                                />

                                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        onClick={() => setOpen(false)}
                                        disabled={loading}
                                        sx={{ color: '#757575' }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleJoin}
                                        disabled={loading}
                                        sx={{ bgcolor: '#457B9D', '&:hover': { bgcolor: '#1D3557' } }}
                                    >
                                        {loading ? 'Joining...' : 'Join'}
                                    </Button>
                                </Box>
                            </motion.div>
                        </Box>
                    </Modal>
                )}
            </AnimatePresence>
        </>
    );
}

export default JoinSessionButton;