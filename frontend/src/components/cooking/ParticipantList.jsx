import React, { useState, useEffect } from 'react';
import { FaUser, FaCrown, FaEye, FaPlus, FaUserCheck } from 'react-icons/fa';
import { getSession } from '../../api/cooking-sessions';

const ParticipantList = ({ sessionId }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadParticipants = async () => {
        setLoading(true);
        try {
            const result = await getSession(sessionId);
            if (result.success) {
                setParticipants(result.data.participants || []);
            }
        } catch (err) {
            console.error('Error loading participants:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            loadParticipants();
            const interval = setInterval(loadParticipants, 15000);
            return () => clearInterval(interval);
        }
    }, [sessionId]);

    if (loading) {
        return (
            <div className="participant-list-loading">
                <FaUser className="spinning-icon" />
                <p>Loading participants...</p>
            </div>
        );
    }

    const host = participants.find(p => p.role === 'host');
    const activeParticipants = participants.filter(p => p.status === 'active');
    const readyParticipants = participants.filter(p => p.status === 'ready');

    return (
        <div className="participant-list">
            <h3 className="list-title">
                <FaUsers /> Participants ({participants.length})
            </h3>

            {/* Host */}
            {host && (
                <div className="host-card">
                    <div className="participant-avatar host-avatar">
                        {host.profile_picture ? (
                            <img src={host.profile_picture} alt={host.full_name} />
                        ) : (
                            <FaUser className="default-avatar" />
                        )}
                        <FaCrown className="crown-icon" />
                    </div>
                    <div className="participant-info">
                        <h5 className="participant-name">{host.full_name}</h5>
                        <span className="participant-role">Host</span>
                    </div>
                </div>
            )}

            {/* Active Participants */}
            <div className="participants-section">
                <h4 className="section-title">Active Cooks</h4>
                <div className="participants-grid">
                    {activeParticipants.map((participant) => (
                        <div key={participant.user_id} className="participant-card">
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
                                <span className="participant-status">
                                    <FaUserCheck /> Active
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ready Participants */}
            {readyParticipants.length > 0 && (
                <div className="participants-section">
                    <h4 className="section-title">Ready</h4>
                    <div className="participants-grid">
                        {readyParticipants.map((participant) => (
                            <div key={participant.user_id} className="participant-card">
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
                                    <span className="participant-status">Ready</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantList;