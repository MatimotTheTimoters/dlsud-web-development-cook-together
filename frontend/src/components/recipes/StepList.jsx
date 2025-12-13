import React, { useState, useEffect } from 'react';
import {
    FaCheckCircle, FaPlayCircle, FaPauseCircle,
    FaCircle, FaHourglassHalf, FaClock, FaSpinner,
    FaStepForward, FaRedo, FaFlagCheckered
} from 'react-icons/fa';

const StepList = ({ recipeId, steps, onCompleteStep, completedSteps = [], sessionId = null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [recipeSteps, setRecipeSteps] = useState(steps);
    const [activeTimer, setActiveTimer] = useState(null);
    const [timerSeconds, setTimerSeconds] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!steps && recipeId) {
            loadSteps();
        }
    }, [recipeId, steps]);

    const loadSteps = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/recipes/show.php?id=${recipeId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();

            if (result.success) {
                setRecipeSteps(result.data.steps || []);
            } else {
                setError(result.message || 'Failed to load steps');
            }
        } catch (err) {
            console.error('Error loading steps:', err);
            setError('Failed to load cooking steps');
        } finally {
            setIsLoading(false);
        }
    };

    const startTimer = (stepId, duration, unit) => {
        let totalSeconds = duration || 0;

        switch (unit) {
            case 'minutes':
                totalSeconds = duration * 60;
                break;
            case 'hours':
                totalSeconds = duration * 3600;
                break;
            default:
                totalSeconds = duration || 0;
        }

        setActiveTimer(stepId);
        setTimerSeconds(prev => ({ ...prev, [stepId]: totalSeconds }));

        const timer = setInterval(() => {
            setTimerSeconds(prev => {
                if (prev[stepId] <= 1) {
                    clearInterval(timer);
                    setActiveTimer(null);
                    return { ...prev, [stepId]: 0 };
                }
                return { ...prev, [stepId]: prev[stepId] - 1 };
            });
        }, 1000);
    };

    const pauseTimer = () => {
        setActiveTimer(null);
    };

    const resetTimer = (stepId) => {
        setTimerSeconds(prev => ({ ...prev, [stepId]: 0 }));
        setActiveTimer(null);
    };

    const formatTime = (seconds) => {
        if (!seconds) return '00:00';

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCompleteStep = async (stepId) => {
        if (onCompleteStep) {
            onCompleteStep(stepId);
        }

        if (sessionId) {
            try {
                const response = await fetch('/api/cooking-sessions/complete-step.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        step_id: stepId
                    })
                });
                await response.json();
            } catch (err) {
                console.error('Error completing step:', err);
                setError('Failed to save step completion');
            }
        }

        if (activeTimer === stepId) {
            setActiveTimer(null);
        }
    };

    if (isLoading) {
        return (
            <div className="list-layout">
                <div className="loading-state text-center py-8">
                    <FaSpinner className="animate-spin text-4xl text-chef-red mb-3" />
                    <p className="text-warm-gray-medium">Loading cooking steps...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="list-layout">
                <div className="error-state text-center py-8">
                    <div className="error-icon mb-3">
                        <FaClock className="text-4xl text-warm-gray-light" />
                    </div>
                    <p className="text-warm-gray-dark font-medium mb-2">Failed to load steps</p>
                    <p className="text-warm-gray-medium text-sm">{error}</p>
                    <button
                        onClick={loadSteps}
                        className="btn-rpg btn-rpg-primary mt-3"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const displaySteps = steps || recipeSteps;

    return (
        <div className="list-layout">
            <div className="list-header mb-3">
                <h3 className="text-xl font-bold text-warm-gray-dark">
                    <FaFlagCheckered className="inline mr-2" />
                    Cooking Steps
                </h3>
                <p className="text-sm text-warm-gray-medium">
                    Follow each step to complete the recipe
                </p>
            </div>

            <div className="steps-list">
                {displaySteps && displaySteps.length > 0 ? (
                    displaySteps.map((step, index) => {
                        const stepId = step.id || index;
                        const isCompleted = completedSteps.includes(stepId);
                        const hasTimer = step.timer_duration && step.timer_duration > 0;

                        return (
                            <div
                                key={stepId}
                                className={`list-item ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="step-number-container">
                                    <div className={`step-number ${isCompleted ? 'completed' : ''}`}>
                                        {index + 1}
                                    </div>
                                </div>

                                <div className="list-content flex-1">
                                    <div className="step-description mb-2">
                                        <p className="text-warm-gray-dark">{step.description}</p>
                                    </div>

                                    {step.image && (
                                        <div className="step-image mb-2">
                                            <img
                                                src={step.image}
                                                alt={`Step ${index + 1}`}
                                                className="rounded-md max-w-xs"
                                            />
                                        </div>
                                    )}

                                    {hasTimer && (
                                        <div className="step-timer-section mb-2">
                                            <div className="timer-card card">
                                                <div className="card-body p-3">
                                                    <div className="timer-header flex items-center justify-between mb-2">
                                                        <div className="timer-info flex items-center">
                                                            <FaHourglassHalf className="text-sizzling-orange mr-2" />
                                                            <span className="font-medium">Step Timer</span>
                                                        </div>
                                                        <div className="timer-display font-mono text-lg font-bold">
                                                            {formatTime(timerSeconds[stepId] || step.timer_duration)}
                                                        </div>
                                                    </div>

                                                    <div className="timer-controls flex gap-2">
                                                        {activeTimer === stepId ? (
                                                            <button
                                                                className="btn-rpg btn-rpg-warning btn-rpg-sm flex-1"
                                                                onClick={() => pauseTimer()}
                                                            >
                                                                <FaPauseCircle /> Pause
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn-rpg btn-rpg-success btn-rpg-sm flex-1"
                                                                onClick={() => startTimer(stepId, step.timer_duration, step.timer_unit)}
                                                                disabled={isCompleted}
                                                            >
                                                                <FaPlayCircle /> Start Timer
                                                            </button>
                                                        )}

                                                        <button
                                                            className="btn-rpg btn-rpg-secondary btn-rpg-sm"
                                                            onClick={() => resetTimer(stepId)}
                                                        >
                                                            <FaRedo /> Reset
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(step.exp_reward > 0 || step.gold_reward > 0 || step.gem_reward > 0) && (
                                        <div className="step-rewards mb-2">
                                            <div className="rewards-badges flex gap-2">
                                                {step.exp_reward > 0 && (
                                                    <span className="badge badge-xp">
                                                        +{step.exp_reward} EXP
                                                    </span>
                                                )}
                                                {step.gold_reward > 0 && (
                                                    <span className="badge badge-gold">
                                                        +{step.gold_reward} Gold
                                                    </span>
                                                )}
                                                {step.gem_reward > 0 && (
                                                    <span className="badge badge-gem">
                                                        +{step.gem_reward} Gem
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="step-actions ml-3">
                                    <button
                                        className={`btn-rpg ${isCompleted ? 'btn-rpg-success' : 'btn-rpg-secondary'} btn-rpg-sm`}
                                        onClick={() => handleCompleteStep(stepId)}
                                        disabled={isCompleted}
                                    >
                                        {isCompleted ? (
                                            <>
                                                <FaCheckCircle /> Completed
                                            </>
                                        ) : (
                                            <>
                                                <FaCircle /> Mark Complete
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-steps text-center py-4">
                        <FaClock className="text-4xl text-warm-gray-light mb-2" />
                        <p className="text-warm-gray-medium">No steps defined</p>
                    </div>
                )}
            </div>

            {displaySteps && displaySteps.length > 0 && (
                <div className="steps-summary mt-4">
                    <div className="summary-card card">
                        <div className="card-body p-3">
                            <div className="summary-stats grid grid-cols-3 gap-2">
                                <div className="stat-item">
                                    <div className="stat-label text-xs text-warm-gray-medium">Total Steps</div>
                                    <div className="stat-value font-bold">{displaySteps.length}</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label text-xs text-warm-gray-medium">Completed</div>
                                    <div className="stat-value font-bold text-success-green">
                                        {completedSteps.length} / {displaySteps.length}
                                    </div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-label text-xs text-warm-gray-medium">Progress</div>
                                    <div className="stat-value font-bold">
                                        {Math.round((completedSteps.length / displaySteps.length) * 100)}%
                                    </div>
                                </div>
                            </div>

                            <div className="progress-container mt-2">
                                <div
                                    className="progress-bar progress-bar-exp"
                                    style={{
                                        width: `${(completedSteps.length / displaySteps.length) * 100}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepList;