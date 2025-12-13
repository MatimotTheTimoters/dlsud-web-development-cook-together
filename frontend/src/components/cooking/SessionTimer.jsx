import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaHourglassHalf, FaClock, FaStepForward } from 'react-icons/fa';

const SessionTimer = ({ duration = 300, active = false, onComplete, onSkip }) => {
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

  const skipTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(0);
    setIsActive(false);
    setIsCompleted(true);
    if (onComplete) onComplete();
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
      <div className="timer-display">
        <span className="time-value">{formatTime(timeLeft)}</span>
        <span className="time-label">Time Remaining</span>
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

        {!isCompleted && (
          <button className="control-btn skip-btn" onClick={skipTimer}>
            <FaStepForward /> Skip
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
          <FaHourglassHalf className="complete-icon" />
          <span>Timer Complete!</span>
        </div>
      )}
    </div>
  );
};

export default SessionTimer;