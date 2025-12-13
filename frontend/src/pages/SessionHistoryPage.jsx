import React, { useState, useEffect } from 'react';
import { FaHistory, FaChartBar, FaClock, FaCalendar } from 'react-icons/fa';

const SessionHistoryPage = () => {
    const [sessionHistory, setSessionHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [stats, setStats] = useState(null);

    // Load session history
    const loadSessionHistory = async () => {
        try {
            setLoading(true);
            // Mock API call - replace with actual API
            setTimeout(() => {
                setSessionHistory([
                    {
                        id: 1,
                        recipe_title: 'Pizza Margherita',
                        completed_at: '2024-01-15T14:30:00',
                        duration_minutes: 45,
                        exp_earned: 150,
                        gold_earned: 75,
                        gems_earned: 5,
                        status: 'completed'
                    },
                    {
                        id: 2,
                        recipe_title: 'Chocolate Cake',
                        completed_at: '2024-01-14T16:45:00',
                        duration_minutes: 60,
                        exp_earned: 200,
                        gold_earned: 100,
                        gems_earned: 8,
                        status: 'completed'
                    },
                    {
                        id: 3,
                        recipe_title: 'Spaghetti Carbonara',
                        completed_at: '2024-01-13T12:15:00',
                        duration_minutes: 35,
                        exp_earned: 120,
                        gold_earned: 60,
                        gems_earned: 3,
                        status: 'completed'
                    }
                ]);

                setStats({
                    total_sessions: 24,
                    total_time_minutes: 1250,
                    total_exp: 3200,
                    total_gold: 1800,
                    total_gems: 85
                });

                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error loading session history:', error);
            setLoading(false);
        }
    };

    // Filter sessions by criteria
    const filterSessions = (filterType) => {
        if (filterType === 'all') return sessionHistory;
        if (filterType === 'recent') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return sessionHistory.filter(session =>
                new Date(session.completed_at) > oneWeekAgo
            );
        }
        return sessionHistory.filter(session => session.status === filterType);
    };

    // Calculate cooking statistics
    const calculateStatistics = () => {
        if (!sessionHistory.length) return {};

        return {
            total_sessions: sessionHistory.length,
            total_time_minutes: sessionHistory.reduce((sum, session) => sum + session.duration_minutes, 0),
            total_exp: sessionHistory.reduce((sum, session) => sum + session.exp_earned, 0),
            total_gold: sessionHistory.reduce((sum, session) => sum + session.gold_earned, 0),
            total_gems: sessionHistory.reduce((sum, session) => sum + session.gems_earned, 0),
            avg_session_time: Math.round(sessionHistory.reduce((sum, session) => sum + session.duration_minutes, 0) / sessionHistory.length)
        };
    };

    useEffect(() => {
        loadSessionHistory();
    }, []);

    const filteredSessions = filterSessions(filterType);
    const calculatedStats = calculateStatistics();

    if (loading) {
        return (
            <div className="session-history-page loading">
                <div className="loading-container">
                    <FaHistory className="loading-icon" />
                    <p>Loading your cooking history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="session-history-page">
            {/* Page Header */}
            <div className="page-header">
                <h1><FaHistory /> Session History</h1>
                <p>Track your cooking progress and achievements</p>
            </div>

            {/* Stats Display */}
            <div className="stats-display">
                <h2>
                    <FaChartBar /> Cooking Statistics
                </h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🍳</div>
                        <div className="stat-content">
                            <h4>Total Sessions</h4>
                            <p className="stat-value">{calculatedStats.total_sessions || 0}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-content">
                            <h4>Total Time</h4>
                            <p className="stat-value">
                                {Math.floor((calculatedStats.total_time_minutes || 0) / 60)}h {(calculatedStats.total_time_minutes || 0) % 60}m
                            </p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-content">
                            <h4>Total EXP</h4>
                            <p className="stat-value">{calculatedStats.total_exp || 0}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <h4>Total Gold</h4>
                            <p className="stat-value">{calculatedStats.total_gold || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="filter-controls">
                <h3>
                    <FaFilter /> Filter Sessions
                </h3>
                <div className="filter-buttons">
                    <button
                        className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-button ${filterType === 'recent' ? 'active' : ''}`}
                        onClick={() => setFilterType('recent')}
                    >
                        <FaCalendar /> Recent
                    </button>
                    <button
                        className={`filter-button ${filterType === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilterType('completed')}
                    >
                        <FaClock /> Completed
                    </button>
                </div>
            </div>

            {/* Session History List */}
            <div className="session-history-list">
                <h3>Your Cooking Sessions</h3>

                {filteredSessions.length === 0 ? (
                    <div className="empty-state">
                        <FaHistory />
                        <p>No cooking sessions found for this filter.</p>
                    </div>
                ) : (
                    <div className="sessions-grid">
                        {filteredSessions.map(session => (
                            <div key={session.id} className="session-card">
                                <div className="session-header">
                                    <h4>{session.recipe_title}</h4>
                                    <span className="session-date">
                                        {new Date(session.completed_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="session-details">
                                    <div className="detail-item">
                                        <FaClock /> {session.duration_minutes} min
                                    </div>
                                    <div className="detail-item status">
                                        {session.status === 'completed' ? '✅ Completed' : '⏸️ Paused'}
                                    </div>
                                </div>

                                <div className="session-rewards">
                                    <div className="reward-item">
                                        <span className="reward-icon">⭐</span>
                                        <span className="reward-value">{session.exp_earned} EXP</span>
                                    </div>
                                    <div className="reward-item">
                                        <span className="reward-icon">💰</span>
                                        <span className="reward-value">{session.gold_earned} Gold</span>
                                    </div>
                                    <div className="reward-item">
                                        <span className="reward-icon">💎</span>
                                        <span className="reward-value">{session.gems_earned} Gems</span>
                                    </div>
                                </div>

                                <button className="view-details-btn">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionHistoryPage;