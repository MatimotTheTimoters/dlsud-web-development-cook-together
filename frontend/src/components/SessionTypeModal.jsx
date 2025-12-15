import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { Person, Group } from '@mui/icons-material';
import { motion } from 'framer-motion';

function SessionTypeModal({ open, onClose, onSelect }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
                <Typography variant="h5" sx={{ color: '#1D3557', mb: 3, textAlign: 'center' }}>
                    Start Cooking Session
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Person />}
                            onClick={() => onSelect('solo')}
                            sx={{
                                bgcolor: '#457B9D',
                                py: 2,
                                fontSize: '1.1rem'
                            }}
                        >
                            👤 SOLO
                        </Button>
                        <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center', mt: 1 }}>
                            Cook by yourself
                        </Typography>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Group />}
                            onClick={() => onSelect('multiplayer')}
                            sx={{
                                bgcolor: '#E63946',
                                py: 2,
                                fontSize: '1.1rem'
                            }}
                        >
                            👥 MULTIPLAYER
                        </Button>
                        <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center', mt: 1 }}>
                            Cook with friends
                        </Typography>
                    </motion.div>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            borderColor: '#757575',
                            color: '#757575',
                            mt: 2
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default SessionTypeModal;