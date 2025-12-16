import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Tabs, Tab } from '@mui/material';
import { Store, AttachMoney } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api/axiosConfig';
import ShopItem from '../components/ShopItem';

function ShopPage() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState('all');
    const [userGold, setUserGold] = useState(100);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchShopData();
    }, []);

    const fetchShopData = async () => {
        try {
            const [itemsRes, userRes] = await Promise.all([
                api.get('/shop/items.php'),
                api.get('/user/gold.php')
            ]);
            if (itemsRes.data.success) setItems(itemsRes.data.items);
            if (userRes.data.success) setUserGold(userRes.data.gold);
        } catch (error) {
            console.error('Error fetching shop data:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', 'tool', 'icon', 'theme', 'other'];
    const filteredItems = category === 'all'
        ? items
        : items.filter(item => item.category === category);

    return (
        <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#E3F2FD', minHeight: '100vh' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Store sx={{ fontSize: 40, color: '#1D3557' }} />
                        <Typography variant="h4" sx={{ color: '#1D3557', fontWeight: 'bold' }}>
                            Shop
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoney sx={{ color: '#FFD700' }} />
                        <Typography variant="h6" sx={{ color: '#1D3557' }}>
                            {userGold} gold
                        </Typography>
                    </Box>
                </Box>
            </motion.div>

            <Tabs
                value={category}
                onChange={(e, newValue) => setCategory(newValue)}
                sx={{ mb: 4, bgcolor: '#90CAF9', borderRadius: 2, p: 1 }}
            >
                {categories.map(cat => (
                    <Tab
                        key={cat}
                        label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                        value={cat}
                        sx={{
                            color: category === cat ? '#2196F3' : '#1D3557',
                            fontWeight: category === cat ? 'bold' : 'normal'
                        }}
                    />
                ))}
            </Tabs>

            {loading ? (
                <Typography>Loading shop...</Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredItems.map(item => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <ShopItem item={item} onPurchase={(newBalance) => setUserGold(newBalance)} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default ShopPage;