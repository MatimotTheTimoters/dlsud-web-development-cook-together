import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CookingSession from '../components/cooking/CookingSession';
import { FaPlay, FaUsers, FaTrophy, FaArrowLeft } from 'react-icons/fa';

const CookingSessionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleStartCooking = () => {
        // Start cooking session from recipe
        console.log('Starting cooking session...');
    };

    const handleSessionComplete = () => {
        alert('🎊 Cooking session completed successfully! Rewards have been added to your account.');
        navigate('/');
    };

    const handleStepComplete = () => {
        // Refresh session data
        console.log('Step completed, refreshing data...');
        alert('✅ Step completed! Check your rewards.');
    };

    if (loading) {
        return (
            <div className="cooking-session-page loading">
                <div className="loading-container">
                    <div className="spinning-utensil">🍳</div>
                    <h2>Preparing Your Kitchen</h2>
                    <p>Gathering all ingredients and tools...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cooking-session-page error">
                <div className="error-container">
                    <h2 className="error-title">Session Unavailable</h2>
                    <p className="error-message">{error}</p>
                    <div className="error-actions">
                        <button
                            className="btn-secondary"
                            onClick={() => navigate('/')}
                        >
                            ← Go Home
                        </button>
                        <button
                            className="btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            🔄 Retry
                        </button>
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
                        🍳 Cooking Session
                    </h1>
                </div>

                <div className="header-right">
                    <div className="session-info">
                        <span className="info-item">
                            <FaTrophy /> Recipe Name
                        </span>
                        <span className="info-item">
                            <FaUsers /> 0 Participants
                        </span>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleStartCooking}
                    >
                        <FaPlay /> Start Cooking
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="page-content">
                <CookingSession
                    sessionId={id}
                    onSessionComplete={handleSessionComplete}
                    onStepComplete={handleStepComplete}
                />
            </div>
        </div>
    );
};

export default CookingSessionPage;