import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import SessionShareModal from './SessionShareModal';
import '../styles/components.css';
import SessionShareModal from './SessionShareModal';

function SessionTypeModal({ open, onClose, recipeId, recipeTitle }) {
    const [loading, setLoading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [sessionData, setSessionData] = useState(null);
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
                session_type: sessionType
            });

            if (response.data.success) {
                if (sessionType === 'solo') {
                    navigate(`/cooking-session/${response.data.session_id}`);
                } else if (sessionType === 'multiplayer') {
                // Store session data and show share modal
                setSessionData({
                sessionId: response.data.session_id,
                joinCode: response.data.join_code
                });
                setShowShareModal(true);
                }
            } else {
                alert('Failed to start cooking session: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Error starting cooking session');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <>
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

            {/* Session Share Modal for multiplayer */}
            {showShareModal && sessionData && (
                <SessionShareModal 
                    open={showShareModal}
                    onClose={() => {
                        setShowShareModal(false);
                        onClose();
                    }}
                    sessionCode={sessionData.joinCode}
                    sessionId={sessionData.sessionId}
                    recipeTitle={recipeTitle}
                />
            )}
        </>
    );
}

export default SessionTypeModal;