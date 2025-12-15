import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../styles/pages.css';

function SoloCookingPage() {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [recipe, setRecipe] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [ingredientsChecked, setIngredientsChecked] = useState({});
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSession();
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

    const fetchSession = async () => {
        try {
            const response = await api.get(`/session/get.php?id=${sessionId}`);
            if (response.data.success) {
                setSession(response.data.session);
                setRecipe(response.data.recipe);
                // Load saved notes if any
                if (response.data.session.notes) {
                    setNotes(response.data.session.notes);
                }
            }
        } catch (error) {
            console.error('Error fetching session:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteStep = async () => {
        try {
            await api.post('/session/complete-step.php', {
                session_id: sessionId,
                step_number: currentStep + 1,
                user_id: localStorage.getItem('userId')
            });

            if (currentStep < (recipe?.steps?.split('.').filter(s => s.trim()).length || 1) - 1) {
                setCurrentStep(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error completing step:', error);
        }
    };

    const handleSaveNotes = async () => {
        try {
            await api.post('/session/notes.php', {
                session_id: sessionId,
                notes: notes,
                user_id: localStorage.getItem('userId')
            });
            alert('Notes saved!');
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    const handleCompleteSession = async () => {
        try {
            const response = await api.post('/session/complete.php', {
                session_id: sessionId,
                user_id: localStorage.getItem('userId')
            });

            if (response.data.success) {
                alert(`Session completed! You earned ${response.data.rewards?.gold || 0} gold!`);
                navigate('/');
            }
        } catch (error) {
            console.error('Error completing session:', error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return <div className="loading">Loading session...</div>;
    if (!session) return <div className="error">Session not found</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    const steps = recipe.steps ? recipe.steps.split('.').filter(step => step.trim()) : [];
    const ingredients = recipe.ingredients ? recipe.ingredients.split(',').filter(item => item.trim()) : [];

    return (
        <div className="solo-cooking-page">
            {/* Header */}
            <div className="session-header">
                <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
                <h1>👨‍🍳 Solo Cooking Session #{sessionId.slice(0, 6)}</h1>
            </div>

            {/* Timer */}
            <div className="session-timer">
                <div className="timer-display">⏱️ {formatTime(timer)}</div>
                <div className="timer-controls">
                    <button 
                        className={isTimerRunning ? 'btn-secondary' : 'btn-primary'}
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                    >
                        {isTimerRunning ? '⏸️ Pause' : '▶️ Start'}
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={() => setTimer(0)}
                    >
                        🔄 Reset
                    </button>
                </div>
            </div>

            {/* Current Step */}
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
                        onClick={handleCompleteStep}
                    >
                        ✓ Mark Complete
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                        disabled={currentStep === steps.length - 1}
                    >
                        Next →
                    </button>
                </div>
            </div>

            {/* Ingredients Checklist */}
            <div className="ingredient-checklist">
                <h2>📝 Ingredients</h2>
                <div className="checklist-items">
                    {ingredients.map((item, index) => (
                        <div key={index} className="checklist-item">
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
                        </div>
                    ))}
                </div>
                <div className="checklist-progress">
                    Completed: {Object.values(ingredientsChecked).filter(Boolean).length} / {ingredients.length}
                </div>
            </div>

            {/* Session Notes */}
            <div className="session-notes">
                <h2>📝 Notes</h2>
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your cooking notes here..."
                    rows="4"
                />
                <button 
                    className="btn-primary"
                    onClick={handleSaveNotes}
                >
                    💾 Save Notes
                </button>
            </div>

            {/* Complete Session Button */}
            <div className="session-complete">
                <button 
                    className="btn-primary complete-btn"
                    onClick={handleCompleteSession}
                >
                    🎉 Complete Session
                </button>
            </div>
        </div>
    );
}

export default SoloCookingPage;