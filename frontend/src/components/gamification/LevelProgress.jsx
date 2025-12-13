import React, { useState, useEffect } from 'react';
import { FaTrophy, FaChessQueen, FaStar, FaCrown } from 'react-icons/fa';
import { getUserStats } from '../../api/users';
import { useAuth } from '../../hooks/useAuth';
import './LevelProgress.css';

/**
 * LevelProgress component for visual progress bar for user level progression
 * Backend Endpoint: api/users/stats.php
 */
const LevelProgress = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStats = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const statsData = await getUserStats(user.id);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching user stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserStats();
    }, [user?.id]);

    const calculateProgress = () => {
        if (!stats) return 0;

        const currentExp = stats.current_exp || 0;
        const levelCeiling = stats.current_level_ceiling || 100;

        return Math.min(100, (currentExp / levelCeiling) * 100);
    };

    const getLevelTitle = (level) => {
        if (level >= 50) return 'Legendary Chef';
        if (level >= 30) return 'Master Chef';
        if (level >= 20) return 'Expert Cook';
        if (level >= 10) return 'Skilled Cook';
        if (level >= 5) return 'Aspiring Cook';
        return 'Kitchen Newbie';
    };

    const getLevelIcon = (level) => {
        if (level >= 50) return <FaCrown />;
        if (level >= 30) return <FaChessQueen />;
        if (level >= 20) return <FaTrophy />;
        return <FaStar />;
    };

    if (loading || !stats) {
        return (
            <div className="level-progress loading">
                <div className="level-skeleton"></div>
            </div>
        );
    }

    const progress = calculateProgress();
    const currentLevel = stats.level || 1;
    const currentExp = stats.current_exp || 0;
    const levelCeiling = stats.current_level_ceiling || 100;
    const expNeeded = Math.max(0, levelCeiling - currentExp);

    return (
        <div className="level-progress">
            <div className="level-header">
                <div className="level-icon">
                    {getLevelIcon(currentLevel)}
                </div>
                <div className="level-info">
                    <div className="level-title">
                        Level {currentLevel} • {getLevelTitle(currentLevel)}
                    </div>
                    <div className="level-exp">
                        {currentExp.toLocaleString()}/{levelCeiling.toLocaleString()} EXP
                    </div>
                </div>
            </div>

            <div className="progress-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                >
                    <div className="progress-fill"></div>
                </div>
                <div className="progress-text">
                    {progress.toFixed(1)}%
                </div>
            </div>

            <div className="level-details">
                <div className="exp-needed">
                    {expNeeded.toLocaleString()} EXP to next level
                </div>
                <div className="level-rewards">
                    Next: Unlock new recipes & rewards
                </div>
            </div>
        </div>
    );
};

export default LevelProgress;