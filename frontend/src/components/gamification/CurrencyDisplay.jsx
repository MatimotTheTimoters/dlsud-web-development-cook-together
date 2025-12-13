import React, { useState, useEffect } from 'react';
import { FaCoins, FaGem } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { getUserStats } from '../../api/users';
import './CurrencyDisplay.css';

/**
 * CurrencyDisplay component for showing user's currency balances
 * Backend Endpoint: api/users/stats.php
 */
const CurrencyDisplay = ({ showLabels = true, compact = false }) => {
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

        // Refresh stats every 30 seconds if component is mounted
        const interval = setInterval(fetchUserStats, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

    const formatCurrency = (amount, type) => {
        if (amount === null || amount === undefined) return '0';

        if (type === 'gold') {
            return amount.toLocaleString() + 'G';
        } else if (type === 'gems') {
            return amount.toLocaleString();
        }
        return amount.toLocaleString();
    };

    if (loading && !stats) {
        return (
            <div className="currency-display loading">
                <div className="currency-skeleton gold"></div>
                <div className="currency-skeleton gems"></div>
            </div>
        );
    }

    const goldAmount = stats?.gold_count || 0;
    const gemAmount = stats?.gem_count || 0;

    if (compact) {
        return (
            <div className="currency-display compact">
                <div className="currency-item gold" title={`${formatCurrency(goldAmount, 'gold')} Gold`}>
                    <FaCoins className="currency-icon" />
                    <span className="currency-amount">{formatCurrency(goldAmount, 'gold')}</span>
                </div>
                <div className="currency-item gems" title={`${formatCurrency(gemAmount, 'gems')} Gems`}>
                    <FaGem className="currency-icon" />
                    <span className="currency-amount">{formatCurrency(gemAmount, 'gems')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="currency-display">
            <div className="currency-item gold">
                <div className="currency-icon-container">
                    <FaCoins className="currency-icon" />
                    {showLabels && <span className="currency-label">Gold</span>}
                </div>
                <span className="currency-amount">{formatCurrency(goldAmount, 'gold')}</span>
            </div>

            <div className="currency-item gems">
                <div className="currency-icon-container">
                    <FaGem className="currency-icon" />
                    {showLabels && <span className="currency-label">Gems</span>}
                </div>
                <span className="currency-amount">{formatCurrency(gemAmount, 'gems')}</span>
            </div>
        </div>
    );
};

export default CurrencyDisplay;