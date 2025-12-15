import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Avatar, Typography, CircularProgress } from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const EditProfileForm = ({ onCancel }) => {
    const [form, setForm] = useState({
        username: '',
        full_name: '',
        bio: '',
        location: '',
        cooking_since: new Date().getFullYear()
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            setForm({
                username: user.username || '',
                full_name: user.full_name || '',
                bio: user.bio || '',
                location: user.location || '',
                cooking_since: user.cooking_since || new Date().getFullYear()
            });
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const response = await api.post('/user/update.php', {
                ...form,
                user_id: user?.id
            });

            if (response.data.success) {
                enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
                // Update localStorage
                localStorage.setItem('user', JSON.stringify({
                    ...user,
                    ...form
                }));

                if (onCancel) onCancel();
                navigate('/profile');
            }
        } catch (error) {
            enqueueSnackbar('Error updating profile', { variant: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
            <Typography variant="h5" sx={{ color: '#1D3557', mb: 3, fontWeight: 'bold' }}>
                Edit Profile
            </Typography>

            {/* Avatar Section */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: '#457B9D',
                        fontSize: '2.5rem'
                    }}
                >
                    {form.username?.charAt(0)?.toUpperCase() || 'C'}
                </Avatar>
                <Button startIcon={<Edit />} size="small">
                    Change Photo
                </Button>
            </Box>

            {/* Form Fields */}
            <TextField
                fullWidth
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                sx={{ mb: 3 }}
                required
            />

            <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                sx={{ mb: 3 }}
            />

            <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                multiline
                rows={3}
                sx={{ mb: 3 }}
                placeholder="Tell us about your cooking journey..."
            />

            <TextField
                fullWidth
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                sx={{ mb: 3 }}
                placeholder="e.g., New York, USA"
            />

            <TextField
                fullWidth
                label="Cooking Since"
                name="cooking_since"
                type="number"
                value={form.cooking_since}
                onChange={handleChange}
                sx={{ mb: 4 }}
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                    onClick={onCancel}
                    startIcon={<Cancel />}
                    sx={{ color: '#757575' }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    disabled={saving}
                    sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Box>
    );
};

export default EditProfileForm;