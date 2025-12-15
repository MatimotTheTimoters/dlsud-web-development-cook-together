import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Box } from '@mui/material';
import { Note, Save } from '@mui/icons-material';

function SessionNotes() {
    const [notes, setNotes] = useState('');
    const [saved, setSaved] = useState(false);

    const saveNotes = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // TODO: Save to API
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1D3557', mb: 2, display: 'flex', alignItems: 'center' }}>
                <Note sx={{ mr: 1 }} /> Session Notes
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during your cooking session..."
                sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#757575' }}>
                    {notes.length} characters
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveNotes}
                    disabled={saved}
                    sx={{
                        bgcolor: saved ? '#4CAF50' : '#457B9D'
                    }}
                >
                    {saved ? 'Saved!' : 'Save Notes'}
                </Button>
            </Box>
        </Paper>
    );
}

export default SessionNotes;