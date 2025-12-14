import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';

function CookingSessionPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [time, setTime] = useState(0); // in seconds
    const [isActive, setIsActive] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [steps, setSteps] = useState([
        "1. Gather all ingredients",
        "2. Preheat your equipment",
        "3. Follow the recipe instructions",
        "4. Monitor cooking progress",
        "5. Serve and enjoy!"
    ]);

    // Timer functionality
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    // Format time as MM:SS
    const formatTime = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const endSession = () => {
        alert(`🎉 Session completed in ${formatTime()}!`);
        navigate('/recipes');
    };

    return (
        <div className="cooking-session">
            <h1>👨‍🍳 Cooking Session #{sessionId}</h1>

            <div className="session-info">
                <h2>⏱️ Timer: {formatTime()}</h2>
                <button onClick={toggleTimer} className="btn-primary">
                    {isActive ? '⏸️ Pause' : '▶️ Resume'}
                </button>
            </div>

            <div className="current-step">
                <h2>📋 Current Step: {currentStep}/{steps.length}</h2>
                <div className="step-card">
                    <p>{steps[currentStep - 1]}</p>
                </div>

                <div className="step-controls">
                    <button
                        onClick={previousStep}
                        disabled={currentStep === 1}
                        className="btn-secondary"
                    >
                        ⏮️ Previous
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={currentStep === steps.length}
                        className="btn-primary"
                    >
                        {currentStep === steps.length ? 'Finish' : '⏭️ Next'}
                    </button>
                </div>
            </div>

            <div className="all-steps">
                <h3>All Steps:</h3>
                <ol>
                    {steps.map((step, index) => (
                        <li key={index} className={index + 1 === currentStep ? 'active-step' : ''}>
                            {step}
                        </li>
                    ))}
                </ol>
            </div>

            <div className="session-controls">
                <button className="btn-primary" onClick={endSession}>
                    ✅ Complete Session
                </button>
                <button className="btn-secondary" onClick={() => navigate('/recipes')}>
                    🏠 Back to Recipes
                </button>
            </div>
        </div>
    );
}

export default CookingSessionPage;