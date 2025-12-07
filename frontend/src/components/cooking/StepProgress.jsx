// frontend/src/components/cooking/StepProgress.jsx
import React from 'react';
import { FaFlagCheckered, FaRoute, FaCheckCircle, FaCircle } from 'react-icons/fa';

const StepProgress = ({ current = 1, total = 8 }) => {
    const calculateProgress = (currentStep, totalSteps) => {
        return totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
    };

    const progress = calculateProgress(current, total);
    const steps = Array.from({ length: total }, (_, i) => i + 1);

    return (
        <div className="step-progress">
            <div className="progress-header">
                <h3 className="progress-title">
                    <FaRoute /> Cooking Progress
                </h3>
                <div className="progress-stats">
                    <span className="stat">
                        <FaCheckCircle /> {current} of {total} Steps
                    </span>
                    <span className="stat">
                        <FaFlagCheckered /> {Math.round(progress)}% Complete
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="progress-labels">
                    <span className="label-start">Start</span>
                    <span className="label-current">Step {current}</span>
                    <span className="label-end">Finish</span>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="step-indicators">
                {steps.map((step) => (
                    <div
                        key={step}
                        className={`step-indicator ${step <= current ? 'completed' : ''} ${step === current ? 'current' : ''}`}
                    >
                        <div className="indicator-dot">
                            {step < current ? (
                                <FaCheckCircle className="check-icon" />
                            ) : step === current ? (
                                <FaCircle className="current-icon" />
                            ) : (
                                <FaCircle className="pending-icon" />
                            )}
                        </div>
                        <div className="indicator-label">
                            <span className="step-number">Step {step}</span>
                            {step === current && (
                                <span className="current-label">Current</span>
                            )}
                        </div>
                        {step === current && (
                            <div className="current-step-info">
                                <div className="info-bubble">
                                    <span className="info-text">You are here</span>
                                    <div className="info-arrow"></div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Progress Details */}
            <div className="progress-details">
                <div className="detail-card">
                    <div className="detail-icon">⏱️</div>
                    <div className="detail-content">
                        <h4 className="detail-title">Time Remaining</h4>
                        <p className="detail-value">
                            {Math.round((total - current) * 5)} minutes estimated
                        </p>
                    </div>
                </div>
                <div className="detail-card">
                    <div className="detail-icon">💰</div>
                    <div className="detail-content">
                        <h4 className="detail-title">Rewards Earned</h4>
                        <p className="detail-value">
                            {Math.round((current / total) * 100)}% of total rewards
                        </p>
                    </div>
                </div>
                <div className="detail-card">
                    <div className="detail-icon">🔥</div>
                    <div className="detail-content">
                        <h4 className="detail-title">Progress Speed</h4>
                        <p className="detail-value">
                            {current > 1 ? Math.round((current / 5) * 100) : 0}% efficiency
                        </p>
                    </div>
                </div>
                <div className="detail-card">
                    <div className="detail-icon">🏆</div>
                    <div className="detail-content">
                        <h4 className="detail-title">Bonus Available</h4>
                        <p className="detail-value">
                            {progress >= 90 ? "Perfection Bonus!" : "Keep going!"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Completion Prediction */}
            {progress < 100 && (
                <div className="completion-prediction">
                    <h4 className="prediction-title">
                        <FaFlagCheckered /> Completion Prediction
                    </h4>
                    <div className="prediction-content">
                        <div className="prediction-bar">
                            <div
                                className="prediction-fill"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="prediction-marker"></div>
                            </div>
                        </div>
                        <div className="prediction-labels">
                            <div className="prediction-label">
                                <span className="label-time">Now</span>
                                <span className="label-percent">{Math.round(progress)}%</span>
                            </div>
                            <div className="prediction-label">
                                <span className="label-time">Soon</span>
                                <span className="label-percent">100%</span>
                            </div>
                        </div>
                    </div>
                    <p className="prediction-message">
                        {progress > 75
                            ? "🎉 Almost there! Finish strong for bonus rewards!"
                            : progress > 50
                                ? "🔥 Halfway through! Maintain your pace."
                                : "🚀 Good start! Keep following the steps."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default StepProgress;