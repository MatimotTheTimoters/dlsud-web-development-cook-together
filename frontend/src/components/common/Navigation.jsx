import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FaBell, FaEnvelope, FaUserFriends } from 'react-icons/fa';

const Navigation = () => {
    const { isAuthenticated } = useAuth();

    const isActiveLink = (isActive) => {
        return isActive
            ? 'nav-link active'
            : 'nav-link';
    };

    const hasPermission = (requiredRole) => {
        return true;
    };

    if (!isAuthenticated()) {
        return null;
    }

    return (
        <nav className="nav-main bg-card-bg shadow-sm border-b border-light">
            <div className="container">
                <div className="nav-content">
                    <div className="nav-links">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/recipes"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            Recipes
                        </NavLink>

                        <NavLink
                            to="/discover"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            Discover
                        </NavLink>

                        <NavLink
                            to="/create-recipe"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            Create Recipe
                        </NavLink>
                    </div>

                    <div className="nav-actions">
                        <button className="nav-action-button">
                            <FaBell className="nav-icon" />
                        </button>
                        <button className="nav-action-button">
                            <FaEnvelope className="nav-icon" />
                        </button>
                        <button className="nav-action-button">
                            <FaUserFriends className="nav-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;