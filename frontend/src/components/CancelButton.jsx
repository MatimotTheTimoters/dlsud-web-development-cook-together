import React from 'react';
import { Button } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function CancelButton() {
    const navigate = useNavigate();

    return (
        <Button
            variant="outlined"
            startIcon={<Cancel />}
            onClick={() => navigate(-1)}
            sx={{
                color: '#757575',
                borderColor: '#757575',
                '&:hover': {
                    borderColor: '#1D3557',
                    color: '#1D3557'
                }
            }}
        >
            Cancel
        </Button>
    );
}

export default CancelButton;