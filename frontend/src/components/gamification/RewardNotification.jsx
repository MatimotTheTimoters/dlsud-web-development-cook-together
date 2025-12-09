import React, { useState, useEffect } from 'react';
import { FaGift, FaCoins, FaGem, FaStar, FaTrophy, FaTimes } from 'react-icons/fa';
import { getUserStats } from '../../api/users';
import { useAuth } from '../../hooks/useAuth';
import './RewardNotification.css';
import {
    calculateDailyLoginBonus,
    checkLevelUp,
    calculateRecipeRewards
} from '../../utils/userCalculations';

/**
 * RewardNotification component for displaying reward notifications
 * Backend Endpoint: api/users/stats.php (for reward updates)
 */
const RewardNotification = ({ initialRewards = [], autoShow = true }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [previousStats, setPreviousStats] = useState(null);
    const [currentStats, setCurrentStats] = useState(null);

    // Check for new rewards by comparing stats
    useEffect(() => {
        const checkForRewards = async () => {
            if (!user?.id) return;

            try {
                const newStats = await getUserStats(user.id);
                setCurrentStats(newStats);

                if (previousStats) {
                    const newRewards = detectRewardChanges(previousStats, newStats);

                    if (newRewards.length > 0) {
                        showNotifications(newRewards);
                    }
                }

                setPreviousStats(newStats);
            } catch (error) {
                console.error('Error checking for rewards:', error);
            }
        };

        // Initial stats fetch
        if (!previousStats) {
            getUserStats(user.id).then(stats => {
                setPreviousStats(stats);
                setCurrentStats(stats);
            });
        }

        // Check for rewards every 10 seconds
        const interval = setInterval(checkForRewards, 10000);
        return () => clearInterval(interval);
    }, [user?.id, previousStats]);

    // Show initial rewards if provided
    useEffect(() => {
        if (autoShow && initialRewards.length > 0) {
            showNotifications(initialRewards);
        }
    }, [initialRewards, autoShow]);

    const detectRewardChanges = (oldStats, newStats) => {
        const rewards = [];

        // Original EXP/gold/gem detection (KEEP THIS!)
        if (newStats.current_exp > (oldStats.current_exp || 0)) {
            const expGain = newStats.current_exp - (oldStats.current_exp || 0);
            if (expGain > 0) {
                rewards.push({
                    id: `exp-${Date.now()}`,
                    type: 'exp',
                    amount: expGain,
                    message: `+${expGain} EXP Earned!`,
                    icon: <FaStar />,
                    color: '#4CAF50'
                });
            }
        }

        if (newStats.gold_count > (oldStats.gold_count || 0)) {
            const goldGain = newStats.gold_count - (oldStats.gold_count || 0);
            if (goldGain > 0) {
                rewards.push({
                    id: `gold-${Date.now()}`,
                    type: 'gold',
                    amount: goldGain,
                    message: `+${goldGain} Gold Earned!`,
                    icon: <FaCoins />,
                    color: '#FFD700'
                });
            }
        }

        if (newStats.gem_count > (oldStats.gem_count || 0)) {
            const gemGain = newStats.gem_count - (oldStats.gem_count || 0);
            if (gemGain > 0) {
                rewards.push({
                    id: `gem-${Date.now()}`,
                    type: 'gem',
                    amount: gemGain,
                    message: `+${gemGain} Gems Earned!`,
                    icon: <FaGem />,
                    color: '#9370DB'
                });
            }
        }

        // Enhanced daily login bonus
        if (newStats.login_streak > (oldStats.login_streak || 0)) {
            const bonus = calculateDailyLoginBonus(newStats.login_streak);
            rewards.push({
                id: `daily-${Date.now()}`,
                type: 'daily_bonus',
                message: `Daily Login Bonus! +${bonus.exp_bonus} EXP, +${bonus.gold_bonus} Gold`,
                amount: bonus.gold_bonus + bonus.gem_bonus,
                streak: bonus.streak,
                icon: <FaGift />,
                color: '#FF6B6B'
            });
        }

        // Enhanced level up detection
        const levelUpCheck = checkLevelUp(oldStats.level || 1, newStats.current_exp);
        if (levelUpCheck.should_level_up) {
            rewards.push({
                id: `level-${Date.now()}`,
                type: 'level_up',
                message: `Level ${levelUpCheck.new_level} Unlocked! (+${levelUpCheck.levels_gained} levels)`,
                amount: levelUpCheck.levels_gained,
                icon: <FaTrophy />,
                color: '#FF6B6B'
            });
        }

        return rewards;
    };

    const showNotification = (reward) => {
        const notification = {
            ...reward,
            id: reward.id || `notification-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            visible: true
        };

        setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 latest

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification.id);
        }, 5000);
    };

    const showNotifications = (rewards) => {
        rewards.forEach(reward => {
            showNotification(reward);
        });
    };

    const hideNotification = (id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, visible: false }
                    : notification
            )
        );

        // Remove from array after fade out animation
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 300);
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'exp':
                return <FaStar />;
            case 'gold':
                return <FaCoins />;
            case 'gem':
                return <FaGem />;
            case 'level':
                return <FaTrophy />;
            default:
                return <FaGift />;
        }
    };

    const formatAmount = (amount, type) => {
        if (type === 'level') return '';
        return amount.toLocaleString();
    };

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="reward-notifications-container">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`reward-notification ${notification.type} ${notification.visible ? 'visible' : 'hidden'}`}
                    style={{ borderLeftColor: notification.color }}
                >
                    <div className="notification-icon" style={{ color: notification.color }}>
                        {notification.icon || getNotificationIcon(notification.type)}
                    </div>

                    <div className="notification-content">
                        <div className="notification-message">
                            {notification.message}
                        </div>
                        {notification.amount > 0 && (
                            <div className="notification-amount">
                                {formatAmount(notification.amount, notification.type)}
                            </div>
                        )}
                    </div>

                    <button
                        className="notification-close"
                        onClick={() => hideNotification(notification.id)}
                        aria-label="Close notification"
                    >
                        <FaTimes />
                    </button>

                    <div
                        className="notification-progress"
                        style={{
                            backgroundColor: notification.color,
                            animation: `shrink 5s linear forwards`
                        }}
                    />
                </div>
            ))}

            {notifications.length > 1 && (
                <button
                    className="clear-all-notifications"
                    onClick={clearNotifications}
                    aria-label="Clear all notifications"
                >
                    Clear All
                </button>
            )}
        </div>
    );
};

export default RewardNotification;