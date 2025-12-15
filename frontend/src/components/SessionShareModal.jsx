import React, { useState } from 'react';
import '../styles/components.css';

function SessionShareModal({ open, onClose, sessionCode, sessionId }) {
    const [copied, setCopied] = useState(false);

    if (!open) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sessionCode)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Multiplayer Session Created!</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <p>Share this code with friends to join your cooking session:</p>
                    
                    <div className="session-code">
                        <div className="code-display">{sessionCode}</div>
                        <button 
                            className="copy-btn"
                            onClick={copyToClipboard}
                        >
                            {copied ? '✓ Copied!' : 'Copy Code'}
                        </button>
                    </div>
                    
                    <div className="share-options">
                        <p>Or use this link:</p>
                        <div className="share-link">
                            <input 
                                type="text" 
                                readOnly 
                                value={`${window.location.origin}/join/${sessionCode}`}
                            />
                            <button 
                                className="copy-link-btn"
                                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/join/${sessionCode}`)}
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="btn-primary"
                        onClick={() => window.location.href = `/session-lobby/${sessionId}`}
                    >
                        Go to Session Lobby
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SessionShareModal;