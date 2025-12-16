import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { LocalDining, EmojiEvents, People, MenuBook, Store } from '@mui/icons-material';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-transition"
        >
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <LocalDining sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" component="h1" color="primary" gutterBottom>
                        🍳 CookTogether
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Sign in to cook with friends and earn rewards!
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #F1FAEE 0%, #FFFFFF 100%)',
                            }}
                        >
                            <LoginForm />

                            <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
                                New here?{' '}
                                <Link to="/register" style={{ color: '#E63946', fontWeight: 600, textDecoration: 'none' }}>
                                    Create Account
                                </Link>
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h6" gutterBottom color="primary">
                                Continue where you left off:
                            </Typography>

                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <EmojiEvents color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Track your cooking level" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <People color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Join cooking sessions" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <MenuBook color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Access your cookbooks" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Store color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Spend your earned currency" />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </motion.div>
    );
};

export default LoginPage;