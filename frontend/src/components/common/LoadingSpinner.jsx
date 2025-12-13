import React from 'react';
import {
    FaUtensilSpoon, FaBlender, FaFire, FaUser, FaChartLine,
    FaCookieBite, FaSeedling, FaCarrot, FaBreadSlice
} from 'react-icons/fa';

const LoadingSpinner = ({
    size = 'medium',
    color = 'chef-red',
    type = 'default',
    message = null,
    progress = null
}) => {
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
            case 'recipe-list':
                return (
                    <>
                        <FaSeedling className="spinner-icon seedling-icon" />
                        <FaUtensilSpoon className="spinner-icon spoon-icon" />
                        <FaBlender className="spinner-icon blender-icon" />
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
            case 'cooking':
                return (
                    <>
                        <FaFire className="spinner-icon fire-icon" />
                        <FaCookieBite className="spinner-icon cookie-icon" />
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
                return 'Loading user profile...';
            case 'recipe':
                return 'Creating your recipe masterpiece...';
            case 'recipe-list':
                return 'Gathering delicious recipes...';
            case 'recipe-detail':
                return 'Preparing recipe details...';
            case 'cooking':
                return 'Preparing cooking session...';
            default:
                return 'Cooking up something delicious...';
        }
    };

    return (
        <div className={`loading-spinner ${getSizeClass()}`}>
            <div className="spinner-container">
                <div className="spinner-icon-container">
                    {getSpinnerIcons()}
                </div>

                <div className="spinner-text-container">
                    <h3 className="spinner-title">{getLoadingMessage()}</h3>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;