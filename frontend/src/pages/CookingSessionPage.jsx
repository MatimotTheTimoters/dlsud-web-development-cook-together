import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CookingSession from '../components/cooking/CookingSession';
import SessionTimer from '../components/cooking/SessionTimer';
import { FaPlay, FaUsers, FaTrophy, FaArrowLeft, FaHome, FaUtensils, FaChartLine } from 'react-icons/fa';
import { getSession } from '../api/cooking-sessions';

const CookingSessionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTimer, setShowTimer] = useState(false);

    const loadSessionData = async () => {
        setLoading(true);
        try {
            const result = await getSession(id);
            if (result.success) {
                setSessionData(result.data);
            } else {
                setError(result.message || 'Failed to load session');
            }
        } catch (err) {
            console.error('Error loading cooking session:', err);
            setError(err.message || 'Failed to load session');
        } finally {
            setLoading(false);
        }
    };

    const handleSessionComplete = () => {
        alert('🎊 Cooking session completed successfully! Rewards have been added to your account.');
        navigate('/');
    };

    const handleStepComplete = () => {
        // Refresh session data
        loadSessionData();

        // Show notification
        alert('✅ Step completed! Check your rewards.');
    };

    useEffect(() => {
        if (id) {
            loadSessionData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="cooking-session-page-loading">
                <div className="loading-overlay">
                    <div className="loading-content">
                        <FaUtensils className="spinning-icon-large" />
                        <h2>Preparing Your Kitchen</h2>
                        <p>Gathering all ingredients and tools...</p>
                        <div className="loading-steps">
                            <div className="loading-step active">
                                <span className="step-number">1</span>
                                <span className="step-text">Loading Session</span>
                            </div>
                            <div className="loading-step">
                                <span className="step-number">2</span>
                                <span className="step-text">Preparing Tools</span>
                            </div>
                            <div className="loading-step">
                                <span className="step-number">3</span>
                                <span className="step-text">Ready to Cook</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cooking-session-page-error">
                <div className="error-container">
                    <div className="error-content">
                        <h2 className="error-title">Session Unavailable</h2>
                        <p className="error-message">{error}</p>
                        <div className="error-actions">
                            <button
                                className="back-button"
                                onClick={() => navigate('/')}
                            >
                                <FaHome /> Go Home
                            </button>
                            <button
                                className="retry-button"
                                onClick={loadSessionData}
                            >
                                🔄 Retry Loading
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cooking-session-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <button
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <h1 className="page-title">
                        <FaUtensils /> Cooking Session
                    </h1>
                </div>

                <div className="header-right">
                    <div className="session-info">
                        <span className="info-item">
                            <FaTrophy /> {sessionData?.recipe_title || 'Unknown Recipe'}
                        </span>
                        <span className="info-item">
                            <FaUsers /> {sessionData?.participant_count || 0} Participants
                        </span>
                    </div>

                    <button
                        className="timer-toggle"
                        onClick={() => setShowTimer(!showTimer)}
                    >
                        <FaPlay /> {showTimer ? 'Hide Timer' : 'Show Timer'}
                    </button>
                </div>
            </div>

            {/* Timer Popout */}
            {showTimer && sessionData && (
                <div className="timer-popout">
                    <div className="popout-header">
                        <h3>Session Timer</h3>
                        <button
                            className="close-popout"
                            onClick={() => setShowTimer(false)}
                        >
                            ×
                        </button>
                    </div>
                    <SessionTimer
                        duration={sessionData.total_duration || 1800}
                        active={sessionData.status === 'cooking'}
                    />
                </div>
            )}

            {/* Main Content */}
            <div className="page-content">
                <CookingSession
                    sessionId={id}
                    onSessionComplete={handleSessionComplete}
                    onStepComplete={handleStepComplete}
                />
            </div>

            {/* Sidebar Stats */}
            <div className="sidebar-stats">
                <div className="stats-section">
                    <h3 className="stats-title">
                        <FaChartLine /> Session Stats
                    </h3>

                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-content">
                            <h4>Time Elapsed</h4>
                            <p className="stat-value">{sessionData?.time_elapsed || '0:00'}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <h4>Rewards Earned</h4>
                            <div className="rewards-breakdown">
                                <span className="reward-item">
                                    <span className="reward-icon">⭐</span>
                                    <span className="reward-value">{sessionData?.exp_earned || 0} EXP</span>
                                </span>
                                <span className="reward-item">
                                    <span className="reward-icon">💰</span>
                                    <span className="reward-value">{sessionData?.gold_earned || 0} Gold</span>
                                </span>
                                <span className="reward-item">
                                    <span className="reward-icon">💎</span>
                                    <span className="reward-value">{sessionData?.gems_earned || 0} Gems</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-content">
                            <h4>Efficiency</h4>
                            <p className="stat-value">
                                {sessionData?.efficiency_score ? `${sessionData.efficiency_score}%` : 'Calculating...'}
                            </p>
                            <p className="stat-description">Based on time and accuracy</p>
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="tips-section">
                    <h3 className="tips-title">🎮 Pro Tips</h3>
                    <div className="tips-list">
                        <div className="tip">
                            <div className="tip-icon">⚡</div>
                            <div className="tip-content">
                                <h5>Speed Bonus</h5>
                                <p>Finish 20% faster for extra gold</p>
                            </div>
                        </div>
                        <div className="tip">
                            <div className="tip-icon">👥</div>
                            <div className="tip-content">
                                <h5>Team Bonus</h5>
                                <p>Cook with friends for 2x EXP</p>
                            </div>
                        </div>
                        <div className="tip">
                            <div className="tip-icon">🎯</div>
                            <div className="tip-content">
                                <h5>Accuracy</h5>
                                <p>Follow steps precisely for gem rewards</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <button
                        className="action-btn primary"
                        onClick={() => alert('Feature coming soon!')}
                    >
                        <FaUsers /> Invite Friends
                    </button>
                    <button
                        className="action-btn secondary"
                        onClick={() => navigate(`/recipes/${sessionData?.recipe_id}`)}
                    >
                        View Recipe
                    </button>
                    <button
                        className="action-btn tertiary"
                        onClick={() => navigate('/cooking')}
                    >
                        Browse Sessions
                    </button>
                </div>
            </div>

            {/* Gamified Elements */}
            <div className="gamified-elements">
                <div className="streak-counter">
                    <div className="streak-icon">🔥</div>
                    <div className="streak-content">
                        <h4>Cooking Streak</h4>
                        <p className="streak-value">3 days in a row</p>
                        <p className="streak-bonus">+15% Rewards</p>
                    </div>
                </div>

                <div className="achievement-alert">
                    <div className="achievement-icon">🏆</div>
                    <div className="achievement-content">
                        <h4>Almost There!</h4>
                        <p>Complete 2 more sessions for "Master Chef" achievement</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookingSessionPage;