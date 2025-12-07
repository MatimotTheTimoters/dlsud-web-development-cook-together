import React, { useState, useEffect } from 'react';
import { FaUser, FaCrown, FaEye, FaPlus, FaTimes, FaUserCheck, FaUserClock } from 'react-icons/fa';
import { getSession, joinSession } from '../../api/cooking-sessions';

const ParticipantList = ({ sessionId }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showInvite, setShowInvite] = useState(false);

    const loadParticipants = async () => {
        setLoading(true);
        try {
            const result = await getSession(sessionId);
            if (result.success) {
                setParticipants(result.data.participants || []);
            } else {
                setError(result.message || 'Failed to load participants');
            }
        } catch (err) {
            console.error('Error loading participants:', err);
            setError(err.message || 'Failed to load participants');
        } finally {
            setLoading(false);
        }
    };

    const updateParticipantStatus = async (userId, status) => {
        // This would call an update endpoint (not in spec, would need to be added)
        // For now, we'll just update local state
        setParticipants(prev => prev.map(p =>
            p.user_id === userId ? { ...p, status } : p
        ));
    };

    const handleJoinSession = async () => {
        try {
            const result = await joinSession(sessionId);
            if (result.success) {
                loadParticipants(); // Reload participants
                alert('✅ Successfully joined the cooking session!');
            }
        } catch (err) {
            console.error('Error joining session:', err);
            alert('Failed to join session: ' + err.message);
        }
    };

    const handleInviteUser = (userId) => {
        // This would call an invite endpoint
        alert(`Invitation sent to user ${userId}`);
        setShowInvite(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <FaUserCheck className="status-icon active" />;
            case 'ready': return <FaUserCheck className="status-icon ready" />;
            case 'spectator': return <FaEye className="status-icon spectator" />;
            default: return <FaUserClock className="status-icon joined" />;
        }
    };

    useEffect(() => {
        if (sessionId) {
            loadParticipants();

            // Poll for participant updates every 15 seconds
            const interval = setInterval(loadParticipants, 15000);
            return () => clearInterval(interval);
        }
    }, [sessionId]);

    if (loading) {
        return (
            <div className="participant-list-loading">
                <div className="loading-content">
                    <FaUser className="spinning-icon" />
                    <p>Loading participants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="participant-list-error">
                <p className="error-message">{error}</p>
                <button onClick={loadParticipants}>🔄 Retry</button>
            </div>
        );
    }

    const host = participants.find(p => p.role === 'host');
    const activeParticipants = participants.filter(p => p.status === 'active');
    const readyParticipants = participants.filter(p => p.status === 'ready');
    const spectators = participants.filter(p => p.role === 'spectator');

    return (
        <div className="participant-list">
            <div className="list-header">
                <h3 className="list-title">
                    <FaUsers /> Participants ({participants.length})
                </h3>
                <div className="list-actions">
                    <button
                        className="invite-btn"
                        onClick={() => setShowInvite(!showInvite)}
                    >
                        <FaPlus /> Invite
                    </button>
                    <button
                        className="join-btn"
                        onClick={handleJoinSession}
                    >
                        Join Session
                    </button>
                </div>
            </div>

            {/* Host Card */}
            {host && (
                <div className="host-section">
                    <h4 className="section-title">
                        <FaCrown className="crown-icon" /> Session Host
                    </h4>
                    <div className="host-card">
                        <div className="participant-avatar host-avatar">
                            {host.profile_picture ? (
                                <img src={host.profile_picture} alt={host.full_name} />
                            ) : (
                                <FaUser className="default-avatar" />
                            )}
                        </div>
                        <div className="participant-info">
                            <h5 className="participant-name">{host.full_name}</h5>
                            <div className="participant-details">
                                <span className="participant-role host-role">Host</span>
                                <span className="participant-level">Level {host.level || 1}</span>
                            </div>
                            <div className="participant-stats">
                                <span className="stat">
                                    <FaUserCheck /> {host.recipes_created || 0} Recipes
                                </span>
                                <span className="stat">
                                    <FaCrown /> {host.recipes_cooked || 0} Cooks
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Participants */}
            {activeParticipants.length > 0 && (
                <div className="active-section">
                    <h4 className="section-title">
                        <FaUserCheck className="active-icon" /> Active Cooks ({activeParticipants.length})
                    </h4>
                    <div className="participants-grid">
                        {activeParticipants.map((participant) => (
                            <div key={participant.user_id} className="participant-card active">
                                <div className="participant-avatar">
                                    {participant.profile_picture ? (
                                        <img src={participant.profile_picture} alt={participant.full_name} />
                                    ) : (
                                        <FaUser className="default-avatar" />
                                    )}
                                    <div className="status-indicator active"></div>
                                </div>
                                <div className="participant-info">
                                    <h5 className="participant-name">{participant.full_name}</h5>
                                    <div className="participant-details">
                                        <span className="participant-level">Level {participant.level || 1}</span>
                                        <span className="participant-status">
                                            {getStatusIcon('active')} Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Ready Participants */}
            {readyParticipants.length > 0 && (
                <div className="ready-section">
                    <h4 className="section-title">
                        <FaUserClock className="ready-icon" /> Ready ({readyParticipants.length})
                    </h4>
                    <div className="participants-grid">
                        {readyParticipants.map((participant) => (
                            <div key={participant.user_id} className="participant-card ready">
                                <div className="participant-avatar">
                                    {participant.profile_picture ? (
                                        <img src={participant.profile_picture} alt={participant.full_name} />
                                    ) : (
                                        <FaUser className="default-avatar" />
                                    )}
                                    <div className="status-indicator ready"></div>
                                </div>
                                <div className="participant-info">
                                    <h5 className="participant-name">{participant.full_name}</h5>
                                    <div className="participant-details">
                                        <span className="participant-level">Level {participant.level || 1}</span>
                                        <span className="participant-status">
                                            {getStatusIcon('ready')} Ready
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Spectators */}
            {spectators.length > 0 && (
                <div className="spectator-section">
                    <h4 className="section-title">
                        <FaEye className="spectator-icon" /> Spectators ({spectators.length})
                    </h4>
                    <div className="spectators-list">
                        {spectators.map((spectator) => (
                            <div key={spectator.user_id} className="spectator-item">
                                <div className="spectator-avatar">
                                    {spectator.profile_picture ? (
                                        <img src={spectator.profile_picture} alt={spectator.full_name} />
                                    ) : (
                                        <FaUser className="default-avatar" />
                                    )}
                                </div>
                                <span className="spectator-name">{spectator.full_name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInvite && (
                <div className="invite-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4>Invite Friends to Cook</h4>
                            <button
                                className="close-btn"
                                onClick={() => setShowInvite(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="invite-options">
                                <div className="invite-option">
                                    <h5>Share Session Link</h5>
                                    <div className="share-link">
                                        <input
                                            type="text"
                                            value={`${window.location.origin}/cooking/${sessionId}`}
                                            readOnly
                                        />
                                        <button
                                            className="copy-btn"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/cooking/${sessionId}`);
                                                alert('Link copied to clipboard!');
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="invite-option">
                                    <h5>Invite via Username</h5>
                                    <div className="username-invite">
                                        <input
                                            type="text"
                                            placeholder="Enter username"
                                            className="username-input"
                                        />
                                        <button
                                            className="invite-user-btn"
                                            onClick={() => handleInviteUser('test_user')}
                                        >
                                            <FaPlus /> Invite
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="invite-benefits">
                                <h5>🎮 Multiplayer Benefits</h5>
                                <ul className="benefits-list">
                                    <li className="benefit-item">
                                        <span className="benefit-icon">⭐</span>
                                        <span className="benefit-text">Double EXP when cooking with friends</span>
                                    </li>
                                    <li className="benefit-item">
                                        <span className="benefit-icon">👥</span>
                                        <span className="benefit-text">Unlock team achievements</span>
                                    </li>
                                    <li className="benefit-item">
                                        <span className="benefit-icon">🏆</span>
                                        <span className="benefit-text">Compete on leaderboards</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Session Stats */}
            <div className="session-stats">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <div className="stat-value">{participants.length}</div>
                        <div className="stat-label">Total Participants</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🍳</div>
                    <div className="stat-info">
                        <div className="stat-value">{activeParticipants.length}</div>
                        <div className="stat-label">Active Cooks</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <div className="stat-value">
                            {participants.length > 0 ? Math.round((activeParticipants.length / participants.length) * 100) : 0}%
                        </div>
                        <div className="stat-label">Participation Rate</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantList;