import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, LinearProgress } from '@mui/material';
import { Timer, Pause, PlayArrow } from '@mui/icons-material';

function SessionTimer({ totalTime = 45, onComplete }) {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(true);

    useEffect(() => {
        let timer;
        if (running && time < totalTime * 60) {
            timer = setInterval(() => setTime(t => t + 1), 1000);
        } else if (time >= totalTime * 60 && onComplete) {
            onComplete();
        }
        return () => clearInterval(timer);
    }, [running, time, totalTime, onComplete]);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const progress = totalTime ? (time / (totalTime * 60)) * 100 : 0;

    return (
        <Paper sx={{ p: 3, bgcolor: '#457B9D', color: 'white', textAlign: 'center' }}>
            <Timer sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h3">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </Typography>
            <Button
                onClick={() => setRunning(!running)}
                sx={{ color: 'white', mt: 1 }}
                startIcon={running ? <Pause /> : <PlayArrow />}
            >
                {running ? 'Pause' : 'Resume'}
            </Button>
            {totalTime > 0 && (
                <Box sx={{ mt: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(progress, 100)}
                        sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.3)' }}
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {Math.round(progress)}% complete
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

export default SessionTimer;