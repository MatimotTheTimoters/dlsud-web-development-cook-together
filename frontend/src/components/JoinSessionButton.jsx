import React, { useState } from 'react';
import api from '../api/axiosConfig';

function JoinSessionButton({ sessionId }) {
    const [joined, setJoined] = useState(false);
    const [loading, setLoading] = useState(false);

    const joinSession = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                alert('Please log in to join a session');
                return;
            }

            const response = await api.post('/session/join.php', {
                session_id: sessionId,
                user_id: user.id
            });

            if (response.data.success) {
                setJoined(true);
                alert('✅ Successfully joined the cooking session!');
            } else {
                alert(response.data.message || 'Failed to join session');
            }
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Error joining cooking session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={joinSession}
            disabled={joined || loading}
            className="join-session-btn"
            style={{
                padding: '10px 20px',
                background: joined ? '#4CAF50' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: joined ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1
            }}
        >
            {loading ? 'Joining...' : joined ? '✅ Joined' : '👥 Join Session'}
        </button>
    );
}

export default JoinSessionButton;