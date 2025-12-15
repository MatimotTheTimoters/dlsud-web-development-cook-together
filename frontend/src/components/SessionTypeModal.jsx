import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './SessionTypeModal.css'; // We'll create this

function SessionTypeModal({ open, onClose, recipeId }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createSession = async (sessionType) => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                alert('Please log in to start cooking');
                onClose();
                return;
            }

            const response = await api.post('/session/create.php', {
                recipe_id: recipeId,
                user_id: user.id,
                session_type: sessionType // Added session_type parameter
            });

            if (response.data.success) {
                if (sessionType === 'solo') {
                    // Redirect to solo cooking session
                    navigate(`/cooking-session/${response.data.session_id}`);
                } else if (sessionType === 'multiplayer') {
                    // Redirect to session lobby with code
                    navigate(`/session-lobby/${response.data.session_id}?code=${response.data.join_code}`);
                }
            } else {
                alert('Failed to start cooking session: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Error starting cooking session');
        } finally {
            setLoading(false);
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="session-modal-overlay">
            <div className="session-modal">
                <div className="session-modal-header">
                    <h2>Start Cooking Session</h2>
                    <span className="modal-divider">─────────────</span>
                </div>
                
                <div className="session-modal-content">
                    <p>Choose session type:</p>
                    
                    <div className="session-options">
                        <div className="session-option">
                            <button 
                                className="solo-btn"
                                onClick={() => createSession('solo')}
                                disabled={loading}
                            >
                                <span className="session-icon">👤</span>
                                <span className="session-text">SOLO</span>
                            </button>
                            <p className="session-description">Cook by yourself</p>
                        </div>
                        
                        <div className="session-option">
                            <button 
                                className="multiplayer-btn"
                                onClick={() => createSession('multiplayer')}
                                disabled={loading}
                            >
                                <span className="session-icon">👥</span>
                                <span className="session-text">MULTIPLAYER</span>
                            </button>
                            <p className="session-description">Cook with friends</p>
                        </div>
                    </div>
                </div>
                
                <div className="session-modal-footer">
                    <button 
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SessionTypeModal;