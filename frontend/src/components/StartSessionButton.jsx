import React, { useState } from 'react';
import { Button } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import api from '../api/axiosConfig';

function StartSessionButton({ sessionId, participants, onStart }) {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  
  const allReady = participants.every(p => p.ready_status === 'ready');
  const readyCount = participants.filter(p => p.ready_status === 'ready').length;
  const totalCount = participants.length;
  
  const handleStart = async () => {
    if (!allReady && !window.confirm('Not all players are ready. Start anyway?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/session/start.php', {
        session_id: sessionId
      });
      
      if (response.data.success) {
        enqueueSnackbar('Session started!', { variant: 'success' });
        onStart();
      }
    } catch (error) {
      enqueueSnackbar('Failed to start session', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      animate={allReady ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: allReady ? Infinity : 0, duration: 2 }}
    >
      <Button
        variant="contained"
        startIcon={<PlayArrow />}
        onClick={handleStart}
        disabled={loading || totalCount === 0}
        sx={{
          bgcolor: allReady ? '#4CAF50' : '#2196F3',
          color: 'white',
          '&:hover': { bgcolor: allReady ? '#45a049' : '#1976D2' },
          '&.Mui-disabled': { bgcolor: '#CCCCCC' },
          minWidth: 180
        }}
      >
        {loading ? 'Starting...' : `START SESSION (${readyCount}/${totalCount})`}
      </Button>
    </motion.div>
  );
}

export default StartSessionButton;