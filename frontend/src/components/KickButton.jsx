import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

function KickButton({ participantId, playerName, onKick }) {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleKick = async () => {
        if (!window.confirm(`Kick ${playerName} from session?`)) return;

        setLoading(true);
        try {
            const response = await api.post('/session/kick.php', {
                participant_id: participantId
            });

            if (response.data.success) {
                enqueueSnackbar(`${playerName} has been kicked`, { variant: 'success' });
                onKick();
            }
        } catch (error) {
            enqueueSnackbar('Failed to kick player', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <IconButton
            onClick={handleKick}
            disabled={loading}
            sx={{ color: '#E63946', '&:hover': { color: '#d32f2f' } }}
        >
            <Close />
        </IconButton>
    );
}

export default KickButton;