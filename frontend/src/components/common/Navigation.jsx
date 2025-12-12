import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Fixed import path
import { FaBell, FaEnvelope, FaUserFriends, FaChevronDown, FaSearch } from 'react-icons/fa';
import * as relationshipsApi from '../../api/relationships'; // Keep this if needed

const Navigation = () => {
    const { isAuthenticated, getCurrentUser } = useAuth(); // Updated to match AuthContext API
    const navigate = useNavigate();

    const [friendRequests, setFriendRequests] = useState([]);
    const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (isAuthenticated()) {
            const user = getCurrentUser();
            setCurrentUser(user);
            loadFriendRequests();
        }
    }, [isAuthenticated]);

    const loadFriendRequests = async () => {
        if (!isAuthenticated()) return;
        setIsLoadingRequests(true);
        try {
            // Update this to use the new PHP API when relationships endpoint is ready
            // const response = await relationshipsApi.getFriendRequests();
            // For now, using mock data
            const requests = []; // Empty for now
            setFriendRequests(requests);
            setUnreadCount(requests.length);
        } catch (error) {
            console.error('Error loading friend requests:', error);
        } finally {
            setIsLoadingRequests(false);
        }
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
        // Basic permission check - can be expanded later
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
                            to="/discover"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            <FaSearch className="nav-icon" /> Discover
                        </NavLink>

                        {hasPermission('manage_recipes') && isAuthenticated() && (
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
                                placeholder="Search recipes, users..."
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
                                            {/* Friend requests content would go here */}
                                            <p className="text-muted">Feature coming soon</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile link */}
                        {isAuthenticated() && currentUser && (
                            <NavLink
                                to={`/profile`}
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
        </nav>
    );
};

export default Navigation;