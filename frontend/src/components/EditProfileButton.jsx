import React from 'react';
import { Button } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function EditProfileButton() {
    const navigate = useNavigate();

    const handleEdit = () => {
        // This will navigate to edit profile page (Feature 21)
        // For now, just show alert
        alert('Edit Profile feature coming soon!');
        // navigate('/edit-profile');
    };

    return (
        <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
            sx={{
                backgroundColor: '#457B9D',
                '&:hover': { backgroundColor: '#1D3557' },
                width: '100%',
                mt: 2
            }}
        >
            Edit Profile
        </Button>
    );
}

export default EditProfileButton;