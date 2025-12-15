import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function SoloCookingPage() {
    const { sessionId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [ingredientsChecked, setIngredientsChecked] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipe();
    }, [sessionId]);

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const fetchRecipe = async () => {
        try {
            const response = await api.get(`/session/get.php?id=${sessionId}`);
            if (response.data.success) {
                setRecipe(response.data.recipe);
            }
        } catch (error) {
            console.error('Error fetching session:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const toggleTimer = () => {
        setIsTimerRunning(!isTimerRunning);
    };

    const resetTimer = () => {
        setTimer(0);
        setIsTimerRunning(false);
    };

    if (loading) return <div className="loading">Loading session...</div>;
    if (!recipe) return <div className="error">Session not found</div>;

    const steps = recipe.steps ? recipe.steps.split('.').filter(step => step.trim()) : [];
    const ingredients = recipe.ingredients ? recipe.ingredients.split(',').filter(item => item.trim()) : [];

    return (
        <div className="recipe-detail">
            <div className="session-header">
                <button 
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    ← Back
                </button>
                <h1>👨‍🍳 Solo Cooking Session</h1>
            </div>

            <div className="session-timer">
                <div className="timer-display">⏱️ {formatTime(timer)}</div>
                <div className="timer-controls">
                    <button 
                        className={isTimerRunning ? 'btn-secondary' : 'btn-primary'}
                        onClick={toggleTimer}
                    >
                        {isTimerRunning ? '⏸️ Pause' : '▶️ Start Timer'}
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={resetTimer}
                    >
                        🔄 Reset
                    </button>
                </div>
            </div>

            <div className="current-step">
                <h2>Step {currentStep + 1} of {steps.length}</h2>
                <div className="step-content">
                    <p>{steps[currentStep] || 'No step available'}</p>
                </div>
                <div className="step-navigation">
                    <button 
                        className="btn-secondary"
                        onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                    >
                        ← Previous
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                        disabled={currentStep === steps.length - 1}
                    >
                        Next →
                    </button>
                </div>
            </div>

            <div className="ingredients">
                <h2>📝 Ingredients</h2>
                <ul>
                    {ingredients.map((item, index) => (
                        <li key={index} className="checklist-item">
                            <input 
                                type="checkbox" 
                                id={`ingredient-${index}`}
                                checked={!!ingredientsChecked[index]}
                                onChange={(e) => setIngredientsChecked(prev => ({
                                    ...prev,
                                    [index]: e.target.checked
                                }))}
                            />
                            <label htmlFor={`ingredient-${index}`}>
                                {item.trim()}
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="checklist-progress">
                    Completed: {Object.values(ingredientsChecked).filter(Boolean).length} / {ingredients.length}
                </div>
            </div>

            <div className="recipe-actions">
                <button 
                    className="btn-primary"
                    onClick={() => {
                        alert(`Session completed in ${formatTime(timer)}!`);
                        navigate('/');
                    }}
                >
                    🎉 Complete Session
                </button>
            </div>
        </div>
    );
}

export default SoloCookingPage;