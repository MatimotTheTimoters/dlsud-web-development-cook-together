import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import * as relationshipsApi from '../../api/relationships';
import { useAuth } from '../../hooks/AuthContext';

/**
 * FollowButton Component
 * Allows users to follow/unfollow other users
 * 
 * @param {Object} props
 * @param {string} props.targetUserId - ID of user to follow/unfollow
 * @param {string} props.initialFollowing - Initial following state
 * @param {function} props.onFollowChange - Callback when follow state changes
 */
const FollowButton = ({ targetUserId, initialFollowing = false, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // Check initial following state on mount
    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                // Use the API to check if following
                const following = await relationshipsApi.isFollowing(targetUserId);
                setIsFollowing(following);
            } catch (err) {
                console.error('Error checking following status:', err);
                // Keep the initialFollowing prop as fallback
            }
        };

        if (currentUser && targetUserId !== currentUser.id) {
            checkFollowingStatus();
        }
    }, [targetUserId, currentUser]);

    // Don't show follow button for own profile
    if (!currentUser || targetUserId === currentUser.id) {
        return null;
    }

    const toggleFollow = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (isFollowing) {
                // Unfollow user
                await relationshipsApi.unfollowUser(targetUserId);
                setIsFollowing(false);
                if (onFollowChange) onFollowChange(false);
            } else {
                // Follow user
                await relationshipsApi.followUser(targetUserId);
                setIsFollowing(true);
                if (onFollowChange) onFollowChange(true);
            }
        } catch (err) {
            console.error('Error toggling follow:', err);
            setError(err.response?.data?.message || 'Failed to update follow status');

            // Revert UI state on error
            setIsFollowing(!isFollowing);
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonText = () => {
        if (isLoading) {
            return isFollowing ? 'Unfollowing...' : 'Following...';
        }
        return isFollowing ? 'Following' : 'Follow';
    };

    const getButtonIcon = () => {
        if (isLoading) {
            return null; // Or a loading spinner
        }
        return isFollowing ? <FaUserCheck /> : <FaUserPlus />;
    };

    const getButtonClass = () => {
        const baseClass = 'flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200';

        if (isFollowing) {
            return `${baseClass} bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300`;
        } else {
            return `${baseClass} bg-blue-500 text-white hover:bg-blue-600`;
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <button
                onClick={toggleFollow}
                disabled={isLoading}
                className={getButtonClass()}
            >
                {getButtonIcon()}
                {getButtonText()}
            </button>

            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}

            {/* Friend request option could be added here */}
            <div className="text-xs text-gray-500 mt-1">
                {isFollowing ? (
                    <span className="flex items-center gap-1">
                        <FaUserCheck className="text-green-500" /> Following
                    </span>
                ) : (
                    <span className="flex items-center gap-1">
                        <FaUserPlus className="text-blue-500" /> Not following
                    </span>
                )}
            </div>
        </div>
    );
};

export default FollowButton;