import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Box,
    CircularProgress
} from '@mui/material';
import { Refresh, Group, Timer, Restaurant, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import JoinSessionButton from '../components/JoinSessionButton';

function SessionsPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/session/list.php');
            if (response.data.success) {
                setSessions(response.data.sessions);
            } else {
                enqueueSnackbar('Failed to load sessions', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Network error', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress sx={{ color: '#457B9D' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                p: 2,
                bgcolor: '#F1FAEE',
                borderRadius: 2
            }}>
                <Typography variant="h4" sx={{ color: '#1D3557', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Group sx={{ color: '#457B9D' }} /> Active Sessions
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                        onClick={fetchSessions}
                        sx={{ color: '#457B9D' }}
                        disabled={loading}
                    >
                        <Refresh />
                    </IconButton>
                    <Link to="/create-recipe" style={{ textDecoration: 'none' }}>
                        <IconButton sx={{ color: '#E63946' }}>
                            <Person />
                        </IconButton>
                    </Link>
                </Box>
            </Box>

            {/* Sessions Grid */}
            <Grid container spacing={3}>
                {sessions.length === 0 ? (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', p: 6, color: '#757575' }}>
                            <Group sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                            <Typography variant="h6">No active sessions found</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Start a session from a recipe page!
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    sessions.map((session, index) => (
                        <Grid item xs={12} sm={6} md={4} key={session.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '2px solid #A8DADC',
                                    '&:hover': { borderColor: '#457B9D', boxShadow: 4 }
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" sx={{ color: '#1D3557', mb: 1 }}>
                                            Session #{session.id}
                                        </Typography>

                                        <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Restaurant sx={{ color: '#E63946', fontSize: 20 }} />
                                            {session.recipe_title}
                                        </Typography>

                                        <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Person sx={{ color: '#457B9D', fontSize: 18 }} />
                                            Host: {session.host_name}
                                        </Typography>

                                        <Typography variant="body2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Timer sx={{ color: '#4CAF50', fontSize: 18 }} />
                                            {session.participant_count}/{session.max_players || 6} players
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mt: 'auto'
                                        }}>
                                            <Typography variant="caption" sx={{ color: '#757575' }}>
                                                Code: <strong>{session.session_code}</strong>
                                            </Typography>
                                        </Box>
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <JoinSessionButton />
                                        <Link to={`/session/${session.id}`} style={{ textDecoration: 'none' }}>
                                            <Typography variant="body2" sx={{ color: '#457B9D', ml: 2, cursor: 'pointer' }}>
                                                View Details →
                                            </Typography>
                                        </Link>
                                    </CardActions>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
}

export default SessionsPage;