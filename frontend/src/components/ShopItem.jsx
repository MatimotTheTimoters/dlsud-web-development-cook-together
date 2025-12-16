import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material';
import { Kitchen, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

const ShopItem = ({ item, onPurchase }) => {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleBuy = async () => {
        setLoading(true);
        try {
            const response = await api.post('/shop/purchase.php', { item_id: item.id });
            if (response.data.success) {
                enqueueSnackbar(`${item.name} purchased!`, { variant: 'success' });
                if (onPurchase) onPurchase(response.data.new_balance);
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Purchase failed', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div whileHover={{ y: -5 }}>
            <Card sx={{ bgcolor: 'white', borderRadius: 2, p: 2, height: '100%' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ color: '#1D3557', mb: 1 }}>
                        {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2, minHeight: 40 }}>
                        {item.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#FF9800', mb: 1 }}>
                        {item.effect_description}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FFD700' }}>
                        <AttachMoney /> {item.price_gold} gold
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleBuy}
                        disabled={loading}
                        sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
                    >
                        {loading ? 'BUYING...' : 'BUY'}
                    </Button>
                </CardActions>
            </Card>
        </motion.div>
    );
};

export default ShopItem;