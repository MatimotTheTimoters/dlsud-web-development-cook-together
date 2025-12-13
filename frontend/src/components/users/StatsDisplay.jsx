import React, { useState, useEffect } from 'react';
import {
    FaChartBar, FaFire, FaCoins, FaGem, FaStar, FaUtensils, FaClock,
    FaTrophy, FaUserFriends, FaCrown, FaMedal
} from 'react-icons/fa';
import * as usersApi from '../../api/users';

const StatsDisplay = ({ userId, compact = false }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUserStats();
    }, [userId]);

    const loadUserStats = async () => {
        setLoading(true);
        try {
            const statsData = await usersApi.getUserStats(userId);
            setStats(statsData);
            setError(null);
        } catch (err) {
            console.error('Error loading user stats:', err);
            setError('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    const formatStatValue = (value, type) => {
        switch (type) {
            case 'currency':
                return new Intl.NumberFormat().format(value);
            case 'time':
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            case 'percentage':
                return `${value}%`;
            case 'level':
                return `Level ${value}`;
            default:
                return value;
        }
    };

    const getStatIcon = (statName) => {
        const iconMap = {
            level: <FaCrown className="text-xp-purple" />,
            current_exp: <FaStar className="text-xp-purple" />,
            current_level_ceiling: <FaTrophy className="text-gold-coin" />,
            gold_count: <FaCoins className="text-gold-coin" />,
            gem_count: <FaGem className="text-rare-gem" />,
            login_streak: <FaFire className="text-sizzling-orange" />,
            recipes_created: <FaUtensils className="text-success-green" />,
            recipes_cooked: <FaUtensils className="text-chefs-red" />,
            challenges_completed: <FaMedal className="text-gold-coin" />,
            recipes_sold: <FaChartBar className="text-success-green" />,
            total_cooking_time: <FaClock className="text-xp-purple" />,
        };
        return iconMap[statName] || <FaChartBar className="text-muted" />;
    };

    const calculateLevelProgress = () => {
        if (!stats) return { progress: 0, remaining: 0 };
        const currentExp = stats.current_exp || 0;
        const nextLevelExp = stats.current_level_ceiling || 100;
        const progress = (currentExp / nextLevelExp) * 100;
        return {
            progress: Math.min(progress, 100),
            remaining: Math.max(0, nextLevelExp - currentExp)
        };
    };

    if (loading) {
        return (
            <div className="stats-display loading">
                <div className="spinner"></div>
                <p>Loading statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stats-display error">
                <p className="text-error">{error}</p>
                <button onClick={loadUserStats} className="game-button small">
                    Try Again
                </button>
            </div>
        );
    }

    if (!stats) return null;

    const levelProgress = calculateLevelProgress();
    const statItems = [
        { key: 'level', label: 'Level', value: stats.level, type: 'level' },
        { key: 'current_exp', label: 'Current EXP', value: stats.current_exp, type: 'number' },
        { key: 'current_level_ceiling', label: 'Next Level EXP', value: stats.current_level_ceiling, type: 'number' },
        { key: 'gold_count', label: 'Gold', value: stats.gold_count, type: 'currency' },
        { key: 'gem_count', label: 'Gems', value: stats.gem_count, type: 'currency' },
        { key: 'login_streak', label: 'Login Streak', value: stats.login_streak, type: 'days' },
        { key: 'recipes_created', label: 'Recipes Created', value: stats.recipes_created, type: 'number' },
        { key: 'recipes_cooked', label: 'Recipes Cooked', value: stats.recipes_cooked, type: 'number' },
        { key: 'challenges_completed', label: 'Challenges Completed', value: stats.challenges_completed, type: 'number' },
        { key: 'recipes_sold', label: 'Recipes Sold', value: stats.recipes_sold || 0, type: 'number' },
        { key: 'total_cooking_time', label: 'Total Cooking Time', value: stats.total_cooking_time, type: 'time' },
    ];

    if (compact) {
        return (
            <div className="stats-display-compact">
                <div className="stats-header-compact">
                    <FaChartBar />
                    <span>Stats</span>
                </div>
                <div className="stats-grid-compact">
                    <div className="stat-item-compact">
                        <div className="stat-icon-compact">
                            <FaCrown />
                        </div>
                        <div className="stat-content-compact">
                            <div className="stat-value-compact">{stats.level}</div>
                            <div className="stat-label-compact">Level</div>
                        </div>
                    </div>
                    <div className="stat-item-compact">
                        <div className="stat-icon-compact">
                            <FaCoins />
                        </div>
                        <div className="stat-content-compact">
                            <div className="stat-value-compact">{formatStatValue(stats.gold_count, 'currency')}</div>
                            <div className="stat-label-compact">Gold</div>
                        </div>
                    </div>
                    <div className="stat-item-compact">
                        <div className="stat-icon-compact">
                            <FaFire />
                        </div>
                        <div className="stat-content-compact">
                            <div className="stat-value-compact">{stats.login_streak}</div>
                            <div className="stat-label-compact">Streak</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="stats-display">
            <div className="stats-header">
                <h3 className="stats-title">
                    <FaChartBar className="stats-title-icon" />
                    Statistics
                </h3>
                <button onClick={loadUserStats} className="btn-refresh">
                    Refresh
                </button>
            </div>

            {/* Level Progress Section */}
            <div className="level-progress-container">
                <div className="level-progress-header">
                    <span className="level-title">Level {stats.level}</span>
                    <span className="level-progress-percentage">{Math.floor(levelProgress.progress)}%</span>
                </div>
                <div className="level-progress-bar">
                    <div
                        className="level-progress-fill"
                        style={{ width: `${levelProgress.progress}%` }}
                    />
                </div>
                <div className="level-progress-footer">
                    <span className="current-exp">{stats.current_exp} EXP</span>
                    <span className="next-level-exp">{levelProgress.remaining} to Level {stats.level + 1}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statItems.map((item) => (
                    <div key={item.key} className="stat-item">
                        <div className="stat-icon">
                            {getStatIcon(item.key)}
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">{item.label}</div>
                            <div className="stat-value">
                                {formatStatValue(item.value, item.type)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-footer">
                <p className="text-muted">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default StatsDisplay;