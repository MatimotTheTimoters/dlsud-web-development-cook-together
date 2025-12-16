import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

function UserAvatar({ user, stats, size = 100 }) {
    const getLevelColor = (level) => {
        if (level >= 20) return '#FFD700'; // Gold
        if (level >= 10) return '#E63946'; // Red
        return '#457B9D'; // Blue
    };

    return (
        <Box sx={{ textAlign: 'center', position: 'relative' }}>
            <Avatar
                src={user.profile_picture}
                sx={{
                    width: size,
                    height: size,
                    border: `3px solid ${getLevelColor(stats?.level || 1)}`,
                    fontSize: size * 0.4,
                    bgcolor: '#A8DADC',
                    mx: 'auto',
                    mb: 1
                }}
            >
                {user.full_name?.charAt(0) || user.username?.charAt(0) || '👤'}
            </Avatar>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <EmojiEvents sx={{ color: '#FFD700', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#1D3557' }}>
                    Level {stats?.level || 1}
                </Typography>
            </Box>
        </Box>
    );
}

export default UserAvatar;