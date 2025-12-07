// frontend/src/components/cooking/SessionTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaHourglassHalf, FaClock } from 'react-icons/fa';

const SessionTimer = ({ duration = 300, active = false, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(active);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(true);
    setIsCompleted(false);
  };

  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(duration);
    setIsActive(false);
    setIsCompleted(false);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            setIsCompleted(true);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, onComplete]);

  useEffect(() => {
    setTimeLeft(duration);
    setIsActive(active);
  }, [duration, active]);

  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="session-timer">
      <div className="timer-header">
        <h3 className="timer-title">
          <FaClock /> Cooking Timer
        </h3>
        <div className="timer-status">
          <span className={`status-badge ${isActive ? 'status-active' : 'status-paused'}`}>
            {isActive ? 'ACTIVE' : isCompleted ? 'COMPLETED' : 'PAUSED'}
          </span>
        </div>
      </div>

      <div className="timer-display">
        <div className="time-left">
          <span className="time-value">{formatTime(timeLeft)}</span>
          <span className="time-label">Time Remaining</span>
        </div>
        
        <div className="progress-ring">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="#e0e0e0"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="url(#timer-gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="339.292"
              strokeDashoffset={339.292 * (1 - progressPercentage / 100)}
              transform="rotate(-90 60 60)"
            />
            <defs>
              <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="progress-text">{Math.round(progressPercentage)}%</div>
        </div>
      </div>

      <div className="timer-controls">
        {!isActive && timeLeft > 0 && !isCompleted && (
          <button className="control-btn start-btn" onClick={startTimer}>
            <FaPlay /> Start
          </button>
        )}
        
        {isActive && timeLeft > 0 && (
          <button className="control-btn pause-btn" onClick={pauseTimer}>
            <FaPause /> Pause
          </button>
        )}
        
        {(!isActive && timeLeft < duration && !isCompleted) || isCompleted ? (
          <button className="control-btn reset-btn" onClick={resetTimer}>
            <FaRedo /> Reset
          </button>
        ) : null}
      </div>

      {isCompleted && (
        <div className="timer-complete">
          <div className="complete-message">
            <FaHourglassHalf className="complete-icon" />
            <h4>Timer Complete!</h4>
            <p>Step timer has finished. You may proceed.</p>
          </div>
        </div>
      )}

      <div className="timer-info">
        <div className="info-item">
          <span className="info-label">Total Duration:</span>
          <span className="info-value">{formatTime(duration)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Time Elapsed:</span>
          <span className="info-value">{formatTime(duration - timeLeft)}</span>
        </div>
        {isActive && (
          <div className="info-item">
            <span className="info-label">Time Bonus:</span>
            <span className="info-value bonus-text">+25% Gold</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTimer;