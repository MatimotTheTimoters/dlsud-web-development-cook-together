import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { FaBell, FaEnvelope, FaUserFriends, FaChevronDown } from 'react-icons/fa';
import * as relationshipsApi from '../../api/relationships';

/**
 * Navigation Component
 * Main navigation with friend request notifications
 */
const Navigation = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // State for friend requests
    const [friendRequests, setFriendRequests] = useState([]);
    const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Load friend requests when authenticated
    useEffect(() => {
        if (isAuthenticated() && currentUser) {
            loadFriendRequests();

            // Refresh requests every 30 seconds
            const interval = setInterval(loadFriendRequests, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, currentUser]);

    const loadFriendRequests = async () => {
        if (!isAuthenticated()) return;

        setIsLoadingRequests(true);
        try {
            const response = await relationshipsApi.getFriendRequests('received', 5, 0);
            const requests = response.requests_received || [];
            setFriendRequests(requests);

            // Count unread requests (you could add a 'read' field to the database)
            setUnreadCount(requests.length);
        } catch (error) {
            console.error('Error loading friend requests:', error);
        } finally {
            setIsLoadingRequests(false);
        }
    };

    const handleAcceptRequest = async (requestId, e) => {
        e.stopPropagation();

        try {
            await relationshipsApi.acceptFriendRequest(requestId);

            // Update local state
            setFriendRequests(prev => prev.filter(req => req.id !== requestId));
            setUnreadCount(prev => prev - 1);

            // Show success message
            // You could add a notification here
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (requestId, e) => {
        e.stopPropagation();

        try {
            await relationshipsApi.rejectFriendRequest(requestId);

            // Update local state
            setFriendRequests(prev => prev.filter(req => req.id !== requestId));
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const handleViewAllRequests = () => {
        navigate('/friends/requests');
        setShowRequestsDropdown(false);
    };

    const isActiveLink = (isActive) => {
        return isActive
            ? 'flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium'
            : 'flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors';
    };

    const hasPermission = (requiredRole) => {
        // Simple permission check - you can expand this based on your user roles
        if (!currentUser) return false;

        // Example: Check if user has required role
        // return currentUser.roles.includes(requiredRole);
        return true; // For now, all authenticated users have permission
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left side - Main navigation */}
                <div className="flex items-center gap-6">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => isActiveLink(isActive)}
                    >
                        <FaBell /> Home
                    </NavLink>

                    <NavLink
                        to="/recipes"
                        className={({ isActive }) => isActiveLink(isActive)}
                    >
                        Recipes
                    </NavLink>

                    <NavLink
                        to="/cooking-sessions"
                        className={({ isActive }) => isActiveLink(isActive)}
                    >
                        Sessions
                    </NavLink>

                    <NavLink
                        to="/discover"
                        className={({ isActive }) => isActiveLink(isActive)}
                    >
                        Discover
                    </NavLink>

                    {hasPermission('manage_recipes') && (
                        <NavLink
                            to="/create-recipe"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            Create Recipe
                        </NavLink>
                    )}
                </div>

                {/* Right side - User actions */}
                <div className="flex items-center gap-4">
                    {/* Friend Requests Dropdown */}
                    {isAuthenticated() && (
                        <div className="relative">
                            <button
                                onClick={() => setShowRequestsDropdown(!showRequestsDropdown)}
                                className="relative flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaUserFriends className="text-lg" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                                <FaChevronDown className={`text-xs transition-transform ${showRequestsDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showRequestsDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-4 border-b border-gray-100">
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <FaUserFriends /> Friend Requests
                                            {unreadCount > 0 && (
                                                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                                    {unreadCount} new
                                                </span>
                                            )}
                                        </h3>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {isLoadingRequests ? (
                                            <div className="p-4 text-center text-gray-500">
                                                Loading requests...
                                            </div>
                                        ) : friendRequests.length > 0 ? (
                                            <div className="divide-y divide-gray-100">
                                                {friendRequests.map((request) => (
                                                    <div key={request.id} className="p-4 hover:bg-gray-50">
                                                        <div className="flex items-start gap-3">
                                                            <img
                                                                src={request.profile_picture || '/default-avatar.png'}
                                                                alt={request.full_name}
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-800">
                                                                    {request.full_name}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {request.message || 'Wants to be friends'}
                                                                </p>
                                                                <div className="flex gap-2 mt-3">
                                                                    <button
                                                                        onClick={(e) => handleAcceptRequest(request.id, e)}
                                                                        className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleRejectRequest(request.id, e)}
                                                                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                                                                    >
                                                                        Decline
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <FaUserFriends className="text-3xl text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">No friend requests</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-gray-100">
                                        <button
                                            onClick={handleViewAllRequests}
                                            className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2"
                                        >
                                            View all friend requests →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Messages */}
                    {isAuthenticated() && (
                        <button className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <FaEnvelope className="text-lg" />
                            {/* You could add message count badge here */}
                        </button>
                    )}

                    {/* Profile link */}
                    {isAuthenticated() && currentUser && (
                        <NavLink
                            to={`/profile/${currentUser.id}`}
                            className={({ isActive }) => isActive
                                ? 'flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium'
                                : 'flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors'
                            }
                        >
                            <img
                                src={currentUser.profile_picture || '/default-avatar.png'}
                                alt={currentUser.full_name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="hidden md:inline">{currentUser.full_name?.split(' ')[0]}</span>
                        </NavLink>
                    )}
                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {showRequestsDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRequestsDropdown(false)}
                />
            )}
        </nav>
    );
};

export default Navigation;