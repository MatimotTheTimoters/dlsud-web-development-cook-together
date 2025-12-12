import React from 'react';
import { FaChartBar, FaFire, FaCoins, FaGem, FaStar, FaMedal } from 'react-icons/fa';
import * as usersApi from '../../api/users';

const StatsDisplay = ({ userId, compact = false }) => {
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
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
            case 'percentage':
                return `${value}%`;
            case 'level':
                return `Level ${value}`;
            case 'experience':
                return `${value.toLocaleString()} XP`;
            default:
                return value;
        }
    };

    const getStatIcon = (statName) => {
        const iconMap = {
            level: <FaStar className="text-gold-coin" />,
            current_exp: <FaStar className="text-xp-purple" />,
            gold_count: <FaCoins className="text-gold-coin" />,
            gem_count: <FaGem className="text-rare-gem" />,
            login_streak: <FaFire className="text-sizzling-orange" />,
            recipes_created: <FaChartBar className="text-success-green" />,
            recipes_cooked: <FaMedal className="text-xp-purple" />,
            challenges_completed: <FaMedal className="text-gold-coin" />,
        };
        return iconMap[statName] || <FaChartBar />;
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
            </div>
        );
    }

    if (!stats) return null;

    const statItems = [
        { key: 'level', label: 'Level', value: stats.level, type: 'level' },
        { key: 'current_exp', label: 'Experience', value: stats.current_exp, type: 'experience' },
        { key: 'gold_count', label: 'Gold', value: stats.gold_count, type: 'currency' },
        { key: 'gem_count', label: 'Gems', value: stats.gem_count, type: 'currency' },
        { key: 'login_streak', label: 'Login Streak', value: stats.login_streak, type: 'days' },
        { key: 'recipes_created', label: 'Recipes Created', value: stats.recipes_created },
        { key: 'recipes_cooked', label: 'Recipes Cooked', value: stats.recipes_cooked },
        { key: 'challenges_completed', label: 'Challenges', value: stats.challenges_completed },
    ];

    return (
        <div className={`stats-display ${compact ? 'compact' : ''}`}>
            <div className="stats-header">
                <h3 className="stats-title">
                    <FaChartBar className="stats-title-icon" />
                    Statistics
                </h3>
                {!compact && (
                    <button onClick={loadUserStats} className="btn-refresh">
                        Refresh
                    </button>
                )}
            </div>

            <div className="stats-grid">
                {statItems.map((item) => (
                    <div key={item.key} className="stat-item card">
                        <div className="stat-icon-container">
                            {getStatIcon(item.key)}
                        </div>
                        <div className="stat-content">
                            <h4 className="stat-label">{item.label}</h4>
                            <p className="stat-value">
                                {formatStatValue(item.value, item.type)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {!compact && stats.last_updated && (
                <div className="stats-footer">
                    <p className="text-sm text-muted">
                        Last updated: {new Date(stats.last_updated).toLocaleString()}
                    </p>
                </div>
            )}
        </div>
    );
};

export default StatsDisplay;