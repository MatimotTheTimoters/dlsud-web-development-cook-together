import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaStop, FaStepForward, FaUsers, FaTrophy, FaCheckCircle, FaHourglassHalf, FaCoins, FaGem, FaFire } from 'react-icons/fa';
import {
    getSession,
    updateSession,
    completeStep,
    voteSkip
} from '../../api/cooking-sessions';
import SessionTimer from './SessionTimer';
import ParticipantList from './ParticipantList';
import StepProgress from './StepProgress';

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
                alert('🍳 Cooking session started! Timer is running...');
            }
        } catch (err) {
            console.error('Error starting session:', err);
            alert('Failed to start session: ' + err.message);
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
                    duration_seconds: 60, // This should come from actual timer
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

                    // Show reward notification
                    if (result.data.exp_earned || result.data.gold_earned || result.data.gems_earned) {
                        alert(`🎉 Step completed! Rewards: 
              \n⭐ +${result.data.exp_earned || 0} EXP
              \n💰 +${result.data.gold_earned || 0} Gold
              \n💎 +${result.data.gems_earned || 0} Gems`);
                    }
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
                alert('✅ Vote submitted! Need majority to skip.');
            }
        } catch (err) {
            console.error('Error voting to skip:', err);
        }
    };

    useEffect(() => {
        if (sessionId) {
            loadSession();

            // Poll for updates every 30 seconds
            const interval = setInterval(loadSession, 30000);
            return () => clearInterval(interval);
        }
    }, [sessionId]);

    if (loading) {
        return (
            <div className="cooking-session-loading">
                <div className="loading-container">
                    <FaHourglassHalf className="spinning-icon" />
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
    const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

    return (
        <div className="cooking-session">
            {/* Session Header */}
            <div className="session-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <h2 className="session-title">{session.recipe_title || 'Cooking Session'}</h2>
                </div>
                <div className="header-right">
                    <div className="session-status">
                        <span className={`status-badge status-${session.status}`}>
                            {session.status?.toUpperCase()}
                        </span>
                    </div>
                    <div className="session-timer">
                        <SessionTimer
                            duration={currentStepData?.timer_duration || 300}
                            active={timerActive}
                            onComplete={() => handleVoteSkip('skip_step')}
                        />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="session-progress">
                <StepProgress current={currentStep + 1} total={totalSteps} />
                <div className="progress-stats">
                    <span className="stat">
                        <FaCheckCircle /> Step {currentStep + 1} of {totalSteps}
                    </span>
                    <span className="stat">
                        <FaFire /> {Math.round(progressPercentage)}% Complete
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div className="session-content">
                {/* Left Column - Ingredients */}
                <div className="ingredients-panel">
                    <h3 className="panel-title">
                        <FaTrophy /> Ingredients Checklist
                    </h3>
                    <div className="ingredients-list">
                        {session.ingredients?.map((ingredient, index) => (
                            <div key={index} className="ingredient-item">
                                <input
                                    type="checkbox"
                                    id={`ingredient-${index}`}
                                    className="ingredient-checkbox"
                                />
                                <label htmlFor={`ingredient-${index}`}>
                                    <span className="ingredient-amount">{ingredient.amount} {ingredient.unit}</span>
                                    <span className="ingredient-name">{ingredient.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="nutrition-info">
                        <h4>Nutrition Facts</h4>
                        <div className="nutrition-grid">
                            <div className="nutrition-item">
                                <span className="label">Calories</span>
                                <span className="value">{session.total_calories || 0} kcal</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="label">Protein</span>
                                <span className="value">{session.total_protein || 0}g</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="label">Carbs</span>
                                <span className="value">{session.total_carbs || 0}g</span>
                            </div>
                            <div className="nutrition-item">
                                <span className="label">Fat</span>
                                <span className="value">{session.total_fat || 0}g</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Column - Current Step */}
                <div className="step-panel">
                    <div className="step-header">
                        <h3 className="step-title">
                            Step {currentStep + 1}: {currentStepData?.title || 'Prepare Ingredients'}
                        </h3>
                        <div className="step-rewards">
                            <span className="reward">
                                <FaCoins /> +{currentStepData?.exp_reward || 5} EXP
                            </span>
                            <span className="reward">
                                <FaGem /> +{currentStepData?.gold_reward || 2} Gold
                            </span>
                        </div>
                    </div>

                    <div className="step-content">
                        <p className="step-description">
                            {currentStepData?.description || 'No description available'}
                        </p>

                        {currentStepData?.image && (
                            <div className="step-image">
                                <img src={currentStepData.image} alt={`Step ${currentStep + 1}`} />
                            </div>
                        )}

                        <div className="step-actions">
                            <button
                                className="complete-step-btn"
                                onClick={nextStep}
                            >
                                <FaCheckCircle /> Complete Step
                            </button>

                            <button
                                className="skip-step-btn"
                                onClick={() => handleVoteSkip('skip_step')}
                            >
                                <FaStepForward /> Skip Step
                            </button>

                            <button
                                className="read-timer-btn"
                                onClick={() => handleVoteSkip('skip_read_timer')}
                            >
                                <FaHourglassHalf /> Skip Read Timer
                            </button>
                        </div>
                    </div>

                    {/* Session Controls */}
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
                </div>

                {/* Right Column - Participants & Rewards */}
                <div className="right-panel">
                    <ParticipantList sessionId={sessionId} />

                    <div className="rewards-panel">
                        <h3 className="panel-title">
                            <FaTrophy /> Session Rewards
                        </h3>
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

                        <div className="bonus-info">
                            <h4>🎯 Bonuses Available</h4>
                            <ul className="bonus-list">
                                <li className="bonus-item">
                                    <span className="bonus-icon">⚡</span>
                                    <span className="bonus-text">Perfect Timing: +20% EXP</span>
                                </li>
                                <li className="bonus-item">
                                    <span className="bonus-icon">👥</span>
                                    <span className="bonus-text">Multiplayer: +50% Gold</span>
                                </li>
                                <li className="bonus-item">
                                    <span className="bonus-icon">🏆</span>
                                    <span className="bonus-text">First Attempt: +10 Gems</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookingSession;