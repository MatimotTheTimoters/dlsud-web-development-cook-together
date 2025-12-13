import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBell, FaSearch } from 'react-icons/fa';

const Navigation = () => {
    const isActiveLink = (isActive) => {
        return isActive
            ? 'nav-link active'
            : 'nav-link';
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
                            Home
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

                        <NavLink
                            to="/create-recipe"
                            className={({ isActive }) => isActiveLink(isActive)}
                        >
                            Create Recipe
                        </NavLink>
                    </div>

                    {/* Right side - User actions */}
                    <div className="nav-actions">
                        <button className="nav-action-button">
                            <FaBell className="nav-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;