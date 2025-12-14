import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // For testing, get user ID 1
            const response = await api.get('/profile.php?id=1');
            if (response.data.success) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="profile-loading">Loading profile...</div>;
    if (!profile) return <div className="profile-error">Profile not found</div>;

    return (
        <div className="profile-container">
            <h1>👨‍🍳 User Profile</h1>

            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profile.user.profile_picture ? (
                            <img src={profile.user.profile_picture} alt={profile.user.username} />
                        ) : (
                            <div className="avatar-placeholder">👤</div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h2>{profile.user.full_name || profile.user.username}</h2>
                        <p className="username">@{profile.user.username}</p>
                        <p className="bio">{profile.user.bio || "No bio yet"}</p>
                        <p className="location">📍 {profile.user.location || "Unknown location"}</p>
                    </div>
                </div>

                <div className="profile-stats">
                    <h3>📊 Cooking Stats</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Level</span>
                            <span className="stat-value">🏆 {profile.stats.level}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">XP</span>
                            <span className="stat-value">⚡ {profile.stats.current_exp}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Gold</span>
                            <span className="stat-value">💰 {profile.stats.gold_count}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Gems</span>
                            <span className="stat-value">💎 {profile.stats.gem_count}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Recipes Created</span>
                            <span className="stat-value">📝 {profile.stats.recipes_created}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Recipes Cooked</span>
                            <span className="stat-value">🍳 {profile.stats.recipes_cooked}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;