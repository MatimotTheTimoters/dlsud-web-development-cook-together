import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';
import * as relationshipsApi from '../../api/relationships';
import { useAuth } from '../../hooks/useAuth';

const FollowButton = ({ targetUserId, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const checkFollowingStatus = async () => {
            if (!currentUser || targetUserId === currentUser.id) return;

            try {
                const response = await relationshipsApi.getFollowing();
                const following = response.some(following => following.id === targetUserId);
                setIsFollowing(following);
            } catch (error) {
                console.error('Error checking following status:', error);
            }
        };

        if (currentUser) {
            checkFollowingStatus();
        }
    }, [targetUserId, currentUser]);

    const toggleFollow = async () => {
        if (!currentUser || targetUserId === currentUser.id) return;

        setIsLoading(true);
        setError(null);

        try {
            if (isFollowing) {
                await relationshipsApi.unfollowUser(targetUserId);
                setIsFollowing(false);
                if (onFollowChange) onFollowChange(false);
            } else {
                await relationshipsApi.followUser(targetUserId);
                setIsFollowing(true);
                if (onFollowChange) onFollowChange(true);
            }
        } catch (err) {
            console.error('Error toggling follow:', err);
            setError(err.response?.data?.message || 'Failed to update follow status');
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser || targetUserId === currentUser.id) {
        return null;
    }

    return (
        <div className="follow-button-container">
            <button
                onClick={toggleFollow}
                disabled={isLoading}
                className={`btn-rpg ${isFollowing ? 'btn-rpg-secondary' : 'btn-rpg-primary'}`}
            >
                {isLoading ? (
                    <>
                        <span className="spinner-small"></span>
                        {isFollowing ? 'Unfollowing...' : 'Following...'}
                    </>
                ) : (
                    <>
                        {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                        {isFollowing ? 'Following' : 'Follow'}
                    </>
                )}
            </button>

            {error && (
                <p className="text-error text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default FollowButton;