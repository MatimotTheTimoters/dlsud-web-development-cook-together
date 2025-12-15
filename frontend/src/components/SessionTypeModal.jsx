import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import SessionShareModal from './SessionShareModal';
import '../styles/components.css';

// Add these props to your SessionTypeModal component
function SessionTypeModal({ 
  open, 
  onClose, 
  recipeId, 
  recipeTitle, 
  userId, // ADD THIS
  onSessionCreated // ADD THIS - callback function from parent
}) {
    const [loading, setLoading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [sessionData, setSessionData] = useState(null);
    const navigate = useNavigate();
    

    const createSession = async (sessionType) => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const userIdToUse = userId || (user ? user.id : null);
            
            if (!userIdToUse) {
                alert('Please log in to start cooking');
                onClose();
                return;
            }

            // Make sure the URL is correct
            const response = await api.post('/session/create.php', {
                recipe_id: recipeId,
                user_id: userIdToUse, // Use userId prop or from localStorage
                session_type: sessionType
            });

            console.log('Response:', response.data); // Add this for debugging

            if (response.data.success) {
                const sessionInfo = {
                    session_type: sessionType,
                    session_id: response.data.session_id,
                    join_code: response.data.join_code
                };
                
                // Call the parent callback if provided
                if (onSessionCreated) {
                    onSessionCreated(sessionInfo);
                }
                
                if (sessionType === 'solo') {
                    navigate(`/cooking-session/${response.data.session_id}`);
                } else if (sessionType === 'multiplayer') {
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
            console.error('Error details:', error.response?.data); // Log more details
            alert('Error starting cooking session. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    // ADD THIS FUNCTION - it handles navigation when user clicks "Go to Session Lobby"
    const handleSessionCreated = () => {
        if (sessionData && sessionData.sessionId) {
            navigate(`/cooking-session/${sessionData.sessionId}`);
            setShowShareModal(false);
            onClose();
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
                    onSessionCreated={handleSessionCreated} 
                />
            )}
        </>
    );
}

export default SessionTypeModal;