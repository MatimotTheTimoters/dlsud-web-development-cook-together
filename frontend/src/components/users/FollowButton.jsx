import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import * as relationshipsApi from '../../api/relationships';
import { useAuth } from '../../hooks/useAuth'; // Fixed import path

const FollowButton = ({ targetUserId, initialFollowing = false, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const checkFollowingStatus = async () => {
        if (!currentUser || targetUserId === currentUser.id) return false;

        try {
            // This function needs to be implemented in relationships API
            const response = await relationshipsApi.getFriendRequests();
            const isFollowing = response.some(req =>
                req.target_user_id === targetUserId &&
                req.relationship_type === 'following' &&
                req.status === 'accepted'
            );
            return isFollowing;
        } catch (error) {
            console.error('Error checking following status:', error);
            return initialFollowing;
        }
    };

    useEffect(() => {
        const init = async () => {
            const followingStatus = await checkFollowingStatus();
            setIsFollowing(followingStatus);
        };
        init();
    }, [targetUserId, currentUser]);

    const toggleFollow = async () => {
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
            setIsFollowing(!isFollowing); // Revert on error
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
                        <span className="spinner"></span>
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