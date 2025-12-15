import React, { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';
import { AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

const PurchaseButton = ({ recipeId, recipeTitle, price = 50 }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handlePurchase = async () => {
        setLoading(true);
        try {
            const response = await api.post('/purchase/recipe.php', { recipe_id: recipeId });
            if (response.data.success) {
                enqueueSnackbar('Recipe purchased successfully!', { variant: 'success' });
                setOpen(false);
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Purchase failed', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<AttachMoney />}
                sx={{ bgcolor: '#FF9800', '&:hover': { bgcolor: '#F57C00' } }}
            >
                💰 {price} GOLD
            </Button>

            <Modal open={open} onClose={() => setOpen(false)}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'white',
                        borderRadius: 12,
                        p: 4,
                        outline: 'none'
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#1D3557' }}>
                            Confirm Purchase?
                        </Typography>
                        <Typography sx={{ mb: 1 }}>Recipe: <strong>{recipeTitle}</strong></Typography>
                        <Typography sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoney sx={{ color: '#FFD700' }} /> Price: <strong>{price} gold</strong>
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                            <Button
                                variant="contained"
                                onClick={handlePurchase}
                                disabled={loading}
                                sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
                            >
                                {loading ? 'Processing...' : 'Confirm'}
                            </Button>
                        </Box>
                    </Box>
                </motion.div>
            </Modal>
        </>
    );
};

export default PurchaseButton;