import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaStop, FaStepForward, FaUsers, FaTrophy } from 'react-icons/fa';
import {
    getSession,
    updateSession,
    completeStep,
    voteSkip
} from '../../api/cooking-sessions';
import SessionTimer from './SessionTimer';
import ParticipantList from './ParticipantList';
import StepProgress from './StepProgress';
import SessionChat from './SessionChat';

const CookingSession = ({ sessionId, onSessionComplete, onStepComplete }) => {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [rewards, setRewards] = useState({ exp: 0, gold: 0, gems: 0 });

    const loadSession = async () => {
        setLoading(true);
        try {
            const result = await getSession(sessionId);
            if (result.success) {
                setSession(result.data);
                setCurrentStep(result.data.current_step || 0);
                setRewards({
                    exp: result.data.exp_earned || 0,
                    gold: result.data.gold_earned || 0,
                    gems: result.data.gems_earned || 0
                });
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

    const startSession = async () => {
        try {
            const result = await updateSession(sessionId, { status: 'cooking', started_at: new Date().toISOString() });
            if (result.success) {
                setSession(prev => ({ ...prev, status: 'cooking', started_at: new Date().toISOString() }));
                setTimerActive(true);
            }
        } catch (err) {
            console.error('Error starting session:', err);
        }
    };

    const pauseSession = async () => {
        try {
            const result = await updateSession(sessionId, { status: 'paused', paused_at: new Date().toISOString() });
            if (result.success) {
                setSession(prev => ({ ...prev, status: 'paused', paused_at: new Date().toISOString() }));
                setTimerActive(false);
            }
        } catch (err) {
            console.error('Error pausing session:', err);
        }
    };

    const completeSession = async () => {
        try {
            const result = await updateSession(sessionId, {
                status: 'completed',
                completed_at: new Date().toISOString()
            });
            if (result.success) {
                setSession(prev => ({ ...prev, status: 'completed', completed_at: new Date().toISOString() }));
                setTimerActive(false);
                if (onSessionComplete) onSessionComplete();
            }
        } catch (err) {
            console.error('Error completing session:', err);
        }
    };

    const nextStep = async () => {
        if (!session || !session.recipe_steps || currentStep >= session.recipe_steps.length - 1) {
            completeSession();
            return;
        }

        const nextStepIndex = currentStep + 1;
        const stepId = session.recipe_steps[currentStep]?.id;

        if (stepId) {
            try {
                const result = await completeStep(sessionId, stepId, {
                    duration_seconds: 60,
                    step_index: currentStep
                });

                if (result.success) {
                    setCurrentStep(nextStepIndex);
                    setRewards(prev => ({
                        exp: prev.exp + (result.data.exp_earned || 0),
                        gold: prev.gold + (result.data.gold_earned || 0),
                        gems: prev.gems + (result.data.gems_earned || 0)
                    }));

                    if (onStepComplete) onStepComplete();
                }
            } catch (err) {
                console.error('Error completing step:', err);
            }
        } else {
            setCurrentStep(nextStepIndex);
        }
    };

    const handleVoteSkip = async (voteType) => {
        try {
            const result = await voteSkip(sessionId, voteType, true);
            if (result.success) {
                // Vote submitted - UI will update via polling
            }
        } catch (err) {
            console.error('Error voting to skip:', err);
        }
    };

    useEffect(() => {
        if (sessionId) {
            loadSession();
            const interval = setInterval(loadSession, 30000);
            return () => clearInterval(interval);
        }
    }, [sessionId]);

    if (loading) {
        return (
            <div className="cooking-session-loading">
                <div className="loading-container">
                    <div className="spinning-utensil">🍳</div>
                    <h3>Loading Cooking Session...</h3>
                    <p>Preparing your kitchen setup</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cooking-session-error">
                <div className="error-container">
                    <h2>Session Error</h2>
                    <p>{error}</p>
                    <button onClick={loadSession}>🔄 Retry</button>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="cooking-session-not-found">
                <h2>Session not found</h2>
                <button onClick={() => navigate('/')}>🏠 Go Home</button>
            </div>
        );
    }

    const currentStepData = session.recipe_steps?.[currentStep];
    const totalSteps = session.recipe_steps?.length || 0;

    return (
        <div className="cooking-session">
            {/* Left Panel - Ingredients */}
            <div className="left-panel">
                <div className="ingredients-section">
                    <h3 className="section-title">🛒 Ingredients</h3>
                    <div className="ingredients-list">
                        {session.ingredients?.map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                                <input type="checkbox" id={`ingredient-${index}`} />
                                <label htmlFor={`ingredient-${index}`}>
                                    <span className="ingredient-amount">{ingredient.amount} {ingredient.unit}</span>
                                    <span className="ingredient-name">{ingredient.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="participants-section">
                    <ParticipantList sessionId={sessionId} />
                </div>
            </div>

            {/* Right Panel - Current Step */}
            <div className="right-panel">
                <div className="current-step-section">
                    <h3 className="section-title">👨‍🍳 Current Step</h3>
                    <div className="step-content">
                        <h4 className="step-title">
                            Step {currentStep + 1}: {currentStepData?.description || 'Prepare Ingredients'}
                        </h4>

                        {currentStepData?.image && (
                            <div className="step-image">
                                <img src={currentStepData.image} alt={`Step ${currentStep + 1}`} />
                            </div>
                        )}

                        <div className="step-timer">
                            <SessionTimer
                                duration={currentStepData?.timer_duration || 300}
                                active={timerActive}
                                onComplete={() => handleVoteSkip('skip_step')}
                            />
                        </div>

                        <div className="step-actions">
                            <button className="complete-step-btn" onClick={nextStep}>
                                <FaCheckCircle /> Complete Step
                            </button>
                            <button className="skip-step-btn" onClick={() => handleVoteSkip('skip_step')}>
                                <FaStepForward /> Skip Step
                            </button>
                        </div>
                    </div>
                </div>

                <div className="session-controls">
                    {session.status === 'planned' || session.status === 'paused' ? (
                        <button className="start-btn" onClick={startSession}>
                            <FaPlay /> Start Cooking
                        </button>
                    ) : session.status === 'cooking' ? (
                        <button className="pause-btn" onClick={pauseSession}>
                            <FaPause /> Pause Session
                        </button>
                    ) : null}

                    <button className="complete-btn" onClick={completeSession}>
                        <FaStop /> Finish Session
                    </button>
                </div>

                <div className="progress-section">
                    <StepProgress current={currentStep + 1} total={totalSteps} />
                </div>

                <div className="rewards-section">
                    <h3 className="section-title"><FaTrophy /> Session Rewards</h3>
                    <div className="rewards-display">
                        <div className="reward-item">
                            <div className="reward-icon">⭐</div>
                            <div className="reward-info">
                                <div className="reward-label">Experience</div>
                                <div className="reward-value">{rewards.exp} EXP</div>
                            </div>
                        </div>
                        <div className="reward-item">
                            <div className="reward-icon">💰</div>
                            <div className="reward-info">
                                <div className="reward-label">Gold</div>
                                <div className="reward-value">{rewards.gold} Gold</div>
                            </div>
                        </div>
                        <div className="reward-item">
                            <div className="reward-icon">💎</div>
                            <div className="reward-info">
                                <div className="reward-label">Gems</div>
                                <div className="reward-value">{rewards.gems} Gems</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Panel - Chat */}
            <div className="bottom-panel">
                <SessionChat sessionId={sessionId} />
            </div>
        </div>
    );
};

export default CookingSession;