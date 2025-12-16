import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Paper
} from '@mui/material';
import {
    ArrowBack,
    CheckCircle,
    Cancel,
    Person,
    Restaurant,
    Timer
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ReadyButton from '../components/ReadyButton';
import KickButton from '../components/KickButton';
import StartSessionButton from '../components/StartSessionButton';

function SessionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const fetchSessionDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/session/detail.php?session_id=${id}`);
            if (response.data.success) {
                setSession(response.data.session);
                setParticipants(response.data.participants);

                // Check if current user is host
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                setIsHost(user.id === response.data.session.host_id);
            } else {
                enqueueSnackbar(response.data.message, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Failed to load session', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionDetails();

        // Refresh every 5 seconds for real-time updates
        const interval = setInterval(fetchSessionDetails, 5000);
        return () => clearInterval(interval);
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress sx={{ color: '#457B9D' }} />
            </Box>
        );
    }

    if (!session) {
        return (
            <Container sx={{ textAlign: 'center', mt: 10 }}>
                <Typography variant="h6" sx={{ color: '#757575' }}>
                    Session not found
                </Typography>
                <Link to="/sessions" style={{ color: '#457B9D', textDecoration: 'none' }}>
                    Back to Sessions
                </Link>
            </Container>
        );
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentPlayer = participants.find(p => p.user_id === user.id);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <ArrowBack
                        sx={{
                            fontSize: 30,
                            color: '#457B9D',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/sessions')}
                    />
                </motion.div>

                <Typography variant="h4" sx={{ color: '#1D3557' }}>
                    Session Lobby: <strong>{session.session_code}</strong>
                </Typography>
            </Box>

            {/* Session Info Card */}
            <Paper sx={{
                p: 3,
                mb: 4,
                bgcolor: '#FFF8E1',
                border: '2px solid #FFD700'
            }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Restaurant sx={{ color: '#E63946', fontSize: 24 }} />
                        <Typography variant="h6">
                            {session.recipe_title}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ color: '#457B9D', fontSize: 24 }} />
                        <Typography variant="body1">
                            Host: <strong>{session.host_name}</strong>
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer sx={{ color: '#4CAF50', fontSize: 24 }} />
                        <Typography variant="body1">
                            Created: {new Date(session.created_at).toLocaleTimeString()}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Players List */}
            <Typography variant="h5" sx={{ mb: 3, color: '#1D3557' }}>
                PLAYERS ({participants.length}/{session.max_players})
            </Typography>

            <Paper sx={{ bgcolor: 'white', p: 2, mb: 4 }}>
                <List>
                    {participants.map((player, index) => (
                        <div key={player.id}>
                            <ListItem
                                sx={{
                                    borderBottom: '1px solid #E0E0E0',
                                    '&:last-child': { borderBottom: 'none' }
                                }}
                                secondaryAction={
                                    isHost && player.user_id !== user.id ? (
                                        <KickButton
                                            participantId={player.id}
                                            playerName={player.username}
                                            onKick={fetchSessionDetails}
                                        />
                                    ) : null
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: player.is_host ? '#457B9D' : '#757575' }}>
                                        <Person />
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="body1" component="span">
                                                {player.username}
                                                {player.is_host && (
                                                    <Chip
                                                        label="HOST"
                                                        size="small"
                                                        sx={{ ml: 1, bgcolor: '#457B9D', color: 'white' }}
                                                    />
                                                )}
                                            </Typography>

                                            <Chip
                                                icon={player.ready_status === 'ready' ?
                                                    <CheckCircle /> : <Cancel />}
                                                label={player.ready_status === 'ready' ? 'READY' : 'NOT READY'}
                                                size="small"
                                                sx={{
                                                    bgcolor: player.ready_status === 'ready' ? '#4CAF50' : '#E63946',
                                                    color: 'white'
                                                }}
                                            />
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: session.max_players - participants.length }).map((_, index) => (
                        <ListItem key={`empty-${index}`} sx={{ opacity: 0.5 }}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#E0E0E0' }}>
                                    <Person />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Waiting for player..."
                                primaryTypographyProps={{ fontStyle: 'italic', color: '#757575' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {currentPlayer && (
                        <ReadyButton
                            sessionId={id}
                            participantId={currentPlayer.id}
                            currentStatus={currentPlayer.ready_status}
                            onStatusChange={fetchSessionDetails}
                        />
                    )}

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: '#E63946',
                                color: 'white',
                                borderRadius: 2,
                                cursor: 'pointer',
                                textAlign: 'center',
                                minWidth: 120
                            }}
                            onClick={() => {
                                // Leave session logic would go here
                                enqueueSnackbar('Leave feature coming soon!', { variant: 'info' });
                            }}
                        >
                            Leave Session
                        </Box>
                    </motion.div>
                </Box>

                {isHost && (
                    <StartSessionButton
                        sessionId={id}
                        participants={participants}
                        onStart={() => navigate(`/cooking-session/${id}`)}
                    />
                )}
            </Box>
        </Container>
    );
}

export default SessionDetailPage;