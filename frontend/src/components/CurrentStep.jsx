import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

function CurrentStep({ step, currentIndex, totalSteps }) {
    return (
        <Paper sx={{ p: 3, bgcolor: '#A8DADC', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#1D3557', mb: 1 }}>
                Step {currentIndex + 1} of {totalSteps}
            </Typography>
            <Typography variant="h5" sx={{ color: '#1D3557', fontWeight: 'bold' }}>
                {step}
            </Typography>
            <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                {[...Array(totalSteps)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            flex: 1,
                            height: 4,
                            bgcolor: i <= currentIndex ? '#E63946' : 'rgba(0,0,0,0.1)',
                            borderRadius: 2
                        }}
                    />
                ))}
            </Box>
        </Paper>
    );
}

export default CurrentStep;