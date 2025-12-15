import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Google, Facebook, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../api/axiosConfig';

const LoginForm = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/login.php', {
                email: data.email,
                password: data.password,
            });

            if (response.data.success) {
                // Store authentication data
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.stats) {
                    localStorage.setItem('user_stats', JSON.stringify(response.data.stats));
                }

                // Show success notification with daily bonus
                enqueueSnackbar(
                    `🎉 Welcome back! Daily Bonus: +${response.data.daily_bonus?.gold || 10} Gold, +${response.data.daily_bonus?.gems || 1} Gems`,
                    { variant: 'success', autoHideDuration: 3000 }
                );

                // Redirect to home page
                navigate('/');
            } else {
                enqueueSnackbar(response.data.message || 'Login failed', {
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
                WELCOME BACK!
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
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
                    InputProps={{
                        endAdornment: <Lock color="action" />,
                    }}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                        required: 'Password is required',
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    margin="normal"
                    disabled={isSubmitting}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="Remember me"
                    />
                    <Link to="/forgot-password" style={{ color: '#E63946', textDecoration: 'none' }}>
                        Forgot Password?
                    </Link>
                </Box>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting}
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                    >
                        {isSubmitting ? 'Signing In...' : '🍳 LOGIN'}
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

export default LoginForm;