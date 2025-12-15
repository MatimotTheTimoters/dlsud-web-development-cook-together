import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Divider, Avatar, Paper } from '@mui/material';
import { Send } from '@mui/icons-material';
import { motion } from 'framer-motion';

function CommentSection({ recipeId }) {
    const [comment, setComment] = useState('');
    const comments = [
        { id: 1, user: 'Chef Maria', text: 'Great recipe! Loved it!', time: '2 hours ago' },
        { id: 2, user: 'Baker John', text: 'Perfect instructions!', time: '1 day ago' }
    ];

    const submitComment = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            alert('Comment posted: ' + comment);
            setComment('');
        }
    };

    return (
        <Box className="comment-section">
            <Typography variant="h5" sx={{ color: '#1D3557', mb: 3 }}>💬 Comments</Typography>

            <Box component="form" onSubmit={submitComment} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField fullWidth value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#A8DADC' } } }} />
                    <Button type="submit" variant="contained" endIcon={<Send />} sx={{ bgcolor: '#457B9D', '&:hover': { bgcolor: '#1D3557' } }}>Post</Button>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {comments.map((comment, i) => (
                <motion.div key={comment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Paper className="comment-item" sx={{ p: 2, mb: 2, bgcolor: '#F9F9F9' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#E63946' }}>{comment.user.charAt(0)}</Avatar>
                            <Typography sx={{ color: '#457B9D', fontWeight: 'bold' }}>{comment.user}</Typography>
                            <Typography sx={{ color: '#757575', ml: 2, fontSize: '0.8rem' }}>{comment.time}</Typography>
                        </Box>
                        <Typography>{comment.text}</Typography>
                    </Paper>
                </motion.div>
            ))}
        </Box>
    );
}

export default CommentSection;