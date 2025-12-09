import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaBell, FaEnvelope, FaUserFriends, FaChevronDown, FaSearch } from 'react-icons/fa';
import * as relationshipsApi from '../../api/relationships';

const Navigation = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [friendRequests, setFriendRequests] = useState([]);
    const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isAuthenticated() && currentUser) {
            loadFriendRequests();
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
            setFriendRequests(prev => prev.filter(req => req.id !== requestId));
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (requestId, e) => {
        e.stopPropagation();
        try {
            await relationshipsApi.rejectFriendRequest(requestId);
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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const isActiveLink = (isActive) => {
        return isActive
            ? 'nav-link active'
            : 'nav-link';
    };

    const hasPermission = (requiredRole) => {
        if (!currentUser) return false;
        return true;
    };

    return (
        <nav className="nav-main bg-card-bg shadow-sm border-b border-light">
            <div className="container">
                <div className="nav-content">
                    {/* Left side - Main navigation */}
                    <div className="nav-links">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            <FaBell className="nav-icon" /> Home
                        </NavLink>

                        <NavLink
                            to="/recipes"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            <FaSearch className="nav-icon" /> Recipes
                        </NavLink>

                        <NavLink
                            to="/cooking-sessions"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            <FaUserFriends className="nav-icon" /> Sessions
                        </NavLink>

                        <NavLink
                            to="/discover"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            <FaSearch className="nav-icon" /> Discover
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

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="search-container">
                        <div className="form-with-icon">
                            <FaSearch className="form-icon" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="form-control"
                            />
                        </div>
                    </form>

                    {/* Right side - User actions */}
                    <div className="nav-actions">
                        {/* Friend Requests Dropdown */}
                        {isAuthenticated() && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowRequestsDropdown(!showRequestsDropdown)}
                                    className="nav-action-button"
                                >
                                    <FaUserFriends className="nav-icon" />
                                    {unreadCount > 0 && (
                                        <span className="badge badge-primary">
                                            {unreadCount}
                                        </span>
                                    )}
                                    <FaChevronDown className={`nav-icon ${showRequestsDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showRequestsDropdown && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <h3 className="dropdown-title">
                                                <FaUserFriends /> Friend Requests
                                                {unreadCount > 0 && (
                                                    <span className="badge badge-info">
                                                        {unreadCount} new
                                                    </span>
                                                )}
                                            </h3>
                                        </div>

                                        <div className="dropdown-content">
                                            {isLoadingRequests ? (
                                                <div className="loading-state">
                                                    Loading requests...
                                                </div>
                                            ) : friendRequests.length > 0 ? (
                                                <div className="requests-list">
                                                    {friendRequests.map((request) => (
                                                        <div key={request.id} className="request-item card">
                                                            <div className="request-content">
                                                                <img
                                                                    src={request.profile_picture || '/default-avatar.png'}
                                                                    alt={request.full_name}
                                                                    className="request-avatar"
                                                                />
                                                                <div className="request-details">
                                                                    <h4 className="request-name">
                                                                        {request.full_name}
                                                                    </h4>
                                                                    <p className="request-message">
                                                                        {request.message || 'Wants to be friends'}
                                                                    </p>
                                                                    <div className="request-actions">
                                                                        <button
                                                                            onClick={(e) => handleAcceptRequest(request.id, e)}
                                                                            className="btn-rpg btn-rpg-success btn-rpg-sm"
                                                                        >
                                                                            Accept
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => handleRejectRequest(request.id, e)}
                                                                            className="btn-rpg btn-rpg-secondary btn-rpg-sm"
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
                                                <div className="empty-state">
                                                    <FaUserFriends className="empty-icon" />
                                                    <p className="empty-text">No friend requests</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="dropdown-footer">
                                            <button
                                                onClick={handleViewAllRequests}
                                                className="view-all-button"
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
                            <button className="nav-action-button">
                                <FaEnvelope className="nav-icon" />
                            </button>
                        )}

                        {/* Profile link */}
                        {isAuthenticated() && currentUser && (
                            <NavLink
                                to={`/profile/${currentUser.id}`}
                                className={({ isActive }) => isActiveLink(isActive)}
                            >
                                <img
                                    src={currentUser.profile_picture || '/default-avatar.png'}
                                    alt={currentUser.full_name}
                                    className="profile-avatar"
                                />
                                <span className="profile-name">{currentUser.full_name?.split(' ')[0]}</span>
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {showRequestsDropdown && (
                <div
                    className="dropdown-backdrop"
                    onClick={() => setShowRequestsDropdown(false)}
                />
            )}
        </nav>
    );
};

export default Navigation;