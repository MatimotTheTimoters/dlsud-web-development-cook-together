// frontend/src/components/StatsTabs.jsx - UPDATED
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Restaurant, LocalDining, CheckCircle } from '@mui/icons-material';

function StatsTabs({ stats }) {
    const statItems = [
        {
            label: 'Recipes Created',
            value: stats?.recipes_created || 0,
            icon: <Restaurant sx={{ color: '#4CAF50' }} />
        },
        {
            label: 'Recipes Cooked',
            value: stats?.recipes_cooked || 0,
            icon: <LocalDining sx={{ color: '#E63946' }} />
        },
        {
            label: 'Completed',
            value: stats?.challenges_completed || 0,
            icon: <CheckCircle sx={{ color: '#2196F3' }} />
        }
    ];

    return (
        // Use size prop instead of xs
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {statItems.map((item, index) => (
                <Grid key={index} size={{ xs: 4 }}>
                    <Card sx={{
                        bgcolor: '#A8DADC',
                        textAlign: 'center',
                        height: '100%',
                        minHeight: 80
                    }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ color: '#1D3557', fontWeight: 'bold', mb: 0.5 }}>
                                {item.value}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#457B9D', display: 'block' }}>
                                {item.label}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default StatsTabs;