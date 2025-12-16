import React from 'react';
import { Button, Box } from '@mui/material';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';

function StepNavigation({ currentStep, totalSteps, onPrev, onNext }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
                variant="outlined"
                startIcon={<NavigateBefore />}
                onClick={onPrev}
                disabled={currentStep === 0}
                sx={{
                    borderColor: '#457B9D',
                    color: '#457B9D',
                    '&:hover': { borderColor: '#1D3557' }
                }}
            >
                Previous Step
            </Button>
            <Button
                variant="contained"
                endIcon={<NavigateNext />}
                onClick={onNext}
                disabled={currentStep === totalSteps - 1}
                sx={{
                    bgcolor: '#E63946',
                    '&:hover': { bgcolor: '#d32f2f' }
                }}
            >
                Next Step
            </Button>
        </Box>
    );
}

export default StepNavigation;