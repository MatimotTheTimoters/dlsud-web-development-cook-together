import React, { useState } from 'react';
import { Button, Modal, Box, Typography, CircularProgress } from '@mui/material';
import { AttachMoney, ShoppingCart, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

const PurchaseButton = ({ recipeId, recipeTitle, price = 50 }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handlePurchase = async () => {
        setLoading(true);
        try {
            const response = await api.post('/purchase/recipe.php', { recipe_id: recipeId });
            if (response.data.success) {
                setPurchased(true);
                enqueueSnackbar('✅ Recipe purchased successfully! Cooking unlocked!', {
                    variant: 'success',
                    autoHideDuration: 3000
                });

                // Wait 2 seconds then refresh page
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
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
                startIcon={purchased ? <CheckCircle /> : <ShoppingCart />}
                sx={{
                    bgcolor: purchased ? '#4CAF50' : '#FF9800',
                    '&:hover': { bgcolor: purchased ? '#45a049' : '#F57C00' },
                    transition: 'all 0.3s ease'
                }}
            >
                {purchased ? 'PURCHASED' : `💰 ${price} GOLD`}
            </Button>

            <Modal
                open={open}
                onClose={() => !loading && setOpen(false)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: -50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    <Box sx={{
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        border: '3px solid',
                        borderColor: '#FFD700',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Golden accent line */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: 'linear-gradient(90deg, #FFD700, #FFC107)'
                        }} />

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 3,
                            gap: 2
                        }}>
                            <Box sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                bgcolor: '#FFF3E0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {purchased ? (
                                    <CheckCircle sx={{ fontSize: 30, color: '#4CAF50' }} />
                                ) : (
                                    <AttachMoney sx={{ fontSize: 30, color: '#FF9800' }} />
                                )}
                            </Box>
                            <Typography variant="h5" sx={{
                                color: '#1D3557',
                                fontWeight: 'bold',
                                flexGrow: 1
                            }}>
                                {purchased ? 'Purchase Complete!' : 'Confirm Purchase'}
                            </Typography>
                        </Box>

                        {!purchased ? (
                            <>
                                <Typography sx={{ mb: 2, color: '#666' }}>
                                    You are about to purchase:
                                </Typography>
                                <Box sx={{
                                    bgcolor: '#FFF8E1',
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 3,
                                    border: '1px solid #FFECB3'
                                }}>
                                    <Typography sx={{ fontWeight: 'bold', color: '#1D3557', mb: 1 }}>
                                        🍳 {recipeTitle}
                                    </Typography>
                                    <Typography sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        color: '#FF9800',
                                        fontWeight: 'bold'
                                    }}>
                                        <AttachMoney sx={{ color: '#FFD700' }} />
                                        <span style={{ fontSize: '1.2em' }}>{price}</span> gold
                                    </Typography>
                                </Box>

                                <Typography variant="body2" sx={{
                                    color: '#666',
                                    fontStyle: 'italic',
                                    mb: 3,
                                    p: 1.5,
                                    bgcolor: '#F9F9F9',
                                    borderRadius: 1
                                }}>
                                    ✅ Unlocks "Start Cooking" button<br />
                                    ✅ Permanent access to recipe<br />
                                    ✅ Support the chef!
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        onClick={() => setOpen(false)}
                                        disabled={loading}
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#BDBDBD',
                                            color: '#666',
                                            '&:hover': { borderColor: '#9E9E9E' }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handlePurchase}
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                        sx={{
                                            bgcolor: '#4CAF50',
                                            '&:hover': { bgcolor: '#45a049' },
                                            px: 3
                                        }}
                                    >
                                        {loading ? 'Processing...' : 'Purchase Now'}
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <CheckCircle sx={{
                                        fontSize: 60,
                                        color: '#4CAF50',
                                        mb: 2
                                    }} />
                                </motion.div>
                                <Typography variant="h6" sx={{ color: '#1D3557', mb: 2 }}>
                                    🎉 Purchase Successful!
                                </Typography>
                                <Typography sx={{ color: '#666', mb: 3 }}>
                                    The <strong>{recipeTitle}</strong> recipe is now yours!<br />
                                    Refreshing page to unlock cooking...
                                </Typography>
                                <CircularProgress size={30} sx={{ color: '#4CAF50' }} />
                            </Box>
                        )}
                    </Box>
                </motion.div>
            </Modal>
        </>
    );
};

export default PurchaseButton;