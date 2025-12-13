import React from 'react';
import {
    FaUtensilSpoon, FaBlender, FaFire, FaUser, FaChartLine,
    FaCookieBite, FaSeedling, FaCarrot, FaBreadSlice
} from 'react-icons/fa';

const LoadingSpinner = ({ size = 'medium', type = 'default', message = null }) => {
    const getSizeClass = () => {
        switch (size) {
            case 'small': return 'spinner-small';
            case 'large': return 'spinner-large';
            default: return 'spinner-medium';
        }
    };

    const getSpinnerIcons = () => {
        switch (type) {
            case 'user':
                return (
                    <>
                        <FaUser className="spinner-icon user-icon" />
                        <FaChartLine className="spinner-icon chart-icon" />
                    </>
                );
            case 'recipe':
                return (
                    <>
                        <FaUtensilSpoon className="spinner-icon spoon-icon" />
                        <FaCarrot className="spinner-icon carrot-icon" />
                        <FaBreadSlice className="spinner-icon bread-icon" />
                    </>
                );
            case 'cooking':
                return (
                    <>
                        <FaFire className="spinner-icon fire-icon" />
                        <FaCookieBite className="spinner-icon cookie-icon" />
                    </>
                );
            case 'recipe-list':
                return (
                    <>
                        <FaSeedling className="spinner-icon seedling-icon" />
                        <FaUtensilSpoon className="spinner-icon spoon-icon" />
                    </>
                );
            case 'recipe-detail':
                return (
                    <>
                        <FaCarrot className="spinner-icon carrot-icon" />
                        <FaUtensilSpoon className="spinner-icon spoon-icon" />
                        <FaFire className="spinner-icon fire-icon" />
                    </>
                );
            default:
                return (
                    <>
                        <FaUtensilSpoon className="spinner-icon spoon-icon" />
                        <FaBlender className="spinner-icon blender-icon" />
                        <FaFire className="spinner-icon fire-icon" />
                    </>
                );
        }
    };

    const getLoadingMessage = () => {
        if (message) return message;

        switch (type) {
            case 'user':
                return 'Loading user data...';
            case 'recipe':
                return 'Creating recipe...';
            case 'cooking':
                return 'Preparing cooking session...';
            case 'recipe-list':
                return 'Loading recipes...';
            case 'recipe-detail':
                return 'Loading recipe details...';
            default:
                return 'Loading...';
        }
    };

    return (
        <div className={`loading-spinner ${getSizeClass()}`}>
            <div className="spinner-container">
                <div className="spinner-icon-container">
                    {getSpinnerIcons()}
                </div>
                <div className="spinner-text">
                    {getLoadingMessage()}
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;