import React from 'react';
import { FaFlagCheckered, FaRoute, FaCheckCircle, FaCircle } from 'react-icons/fa';

const StepProgress = ({ current = 1, total = 8 }) => {
    const calculateProgress = (currentStep, totalSteps) => {
        return totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
    };

    const progress = calculateProgress(current, total);

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
        </div>
    );
};

export default StepProgress;