import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Container,
    Box,
    Typography,
    Paper,
} from '@mui/material';
import { LocalDining } from '@mui/icons-material';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-transition"
        >
            <Container maxWidth="sm">
                <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
                    <LocalDining sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h3" component="h1" color="primary" gutterBottom>
                        🍳 CookTogether
                    </Typography>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #FFFAF0 0%, #FFFFFF 100%)',
                    }}
                >
                    <RegisterForm />

                    <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
                        Already have account?{' '}
                        <Link to="/login" style={{ color: '#457B9D', fontWeight: 600, textDecoration: 'none' }}>
                            Login
                        </Link>
                    </Typography>
                </Paper>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Join thousands of home cooks in our gamified cooking community!
                    </Typography>
                </Box>
            </Container>
        </motion.div>
    );
};

export default RegisterPage;