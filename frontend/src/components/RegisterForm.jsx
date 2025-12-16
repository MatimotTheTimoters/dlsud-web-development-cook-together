import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Divider,
    Box,
    Typography,
} from '@mui/material';
import { Google, Facebook } from '@mui/icons-material';
import api from '../api/axiosConfig';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/register.php', {
                username: data.username,
                email: data.email,
                password: data.password,
                full_name: data.fullName,
            });

            if (response.data.success) {
                enqueueSnackbar('🎉 Account created! Welcome to CookTogether!', {
                    variant: 'success',
                    autoHideDuration: 3000,
                });

                // Store user data
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.rewards) {
                    localStorage.setItem('rewards', JSON.stringify(response.data.rewards));
                }

                // Redirect after short delay
                setTimeout(() => navigate('/login'), 2000);
            } else {
                enqueueSnackbar(response.data.message || 'Registration failed', {
                    variant: 'error',
                });
            }
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message || 'Network error. Please try again.',
                { variant: 'error' }
            );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Typography variant="h5" align="center" color="primary" gutterBottom>
                CREATE ACCOUNT
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <TextField
                    fullWidth
                    label="Username"
                    {...register('username', {
                        required: 'Username is required',
                        minLength: { value: 3, message: 'Minimum 3 characters' },
                        maxLength: { value: 20, message: 'Maximum 20 characters' },
                    })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    margin="normal"
                    disabled={isSubmitting}
                />

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email address',
                        },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    margin="normal"
                    disabled={isSubmitting}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Minimum 8 characters' },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: 'Need uppercase, lowercase, and number',
                        },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    margin="normal"
                    disabled={isSubmitting}
                />

                <TextField
                    fullWidth
                    label="Full Name (Optional)"
                    {...register('fullName')}
                    margin="normal"
                    disabled={isSubmitting}
                />

                <FormControlLabel
                    control={<Checkbox required color="primary" />}
                    label="I agree to terms and conditions"
                    sx={{ mt: 2 }}
                />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={isSubmitting}
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                    >
                        {isSubmitting ? 'Creating Account...' : '🍳 CREATE ACCOUNT'}
                    </Button>
                </motion.div>

                <Divider sx={{ my: 2 }}>or continue with</Divider>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<Google />}
                        sx={{ flex: 1 }}
                        disabled={isSubmitting}
                    >
                        Google
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Facebook />}
                        sx={{ flex: 1 }}
                        disabled={isSubmitting}
                    >
                        Facebook
                    </Button>
                </Box>
            </Box>
        </motion.div>
    );
};

export default RegisterForm;