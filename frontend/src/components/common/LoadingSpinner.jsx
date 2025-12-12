import React from 'react';
import { FaUtensilSpoon, FaBlender, FaFire, FaUser, FaChartLine, FaCookieBite } from 'react-icons/fa';

const LoadingSpinner = ({
    size = 'medium',
    color = 'chef-red',
    type = 'default',
    message = null
}) => {
    const getSizeClass = () => {
        switch (size) {
            case 'small': return 'spinner-small';
            case 'large': return 'spinner-large';
            default: return 'spinner-medium';
        }
    };

    const getColorClass = () => {
        switch (color) {
            case 'gold': return 'text-gold-coin';
            case 'gem': return 'text-rare-gem';
            case 'xp': return 'text-xp-purple';
            case 'success': return 'text-success-green';
            case 'user': return 'text-chef-red';
            default: return 'text-chef-red';
        }
    };

    const getSpinnerIcons = () => {
        switch (type) {
            case 'user':
                return (
                    <>
                        <FaUser className={`spinner-icon user-icon ${getColorClass()}`} />
                        <FaChartLine className={`spinner-icon chart-icon ${getColorClass()}`} />
                    </>
                );
            case 'recipe':
                return (
                    <>
                        <FaUtensilSpoon className={`spinner-icon spoon-icon ${getColorClass()}`} />
                        <FaBlender className={`spinner-icon blender-icon ${getColorClass()}`} />
                    </>
                );
            case 'cooking':
                return (
                    <>
                        <FaFire className={`spinner-icon fire-icon ${getColorClass()}`} />
                        <FaCookieBite className={`spinner-icon cookie-icon ${getColorClass()}`} />
                    </>
                );
            default:
                return (
                    <>
                        <FaUtensilSpoon className={`spinner-icon spoon-icon ${getColorClass()}`} />
                        <FaBlender className={`spinner-icon blender-icon ${getColorClass()}`} />
                        <FaFire className={`spinner-icon fire-icon ${getColorClass()}`} />
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
                return 'Fetching recipe details...';
            case 'cooking':
                return 'Preparing cooking session...';
            default:
                return 'Cooking up something delicious...';
        }
    };

    const getRewardMessage = () => {
        switch (type) {
            case 'user':
                return '+5 EXP for checking stats';
            case 'recipe':
                return '+10 EXP for recipe discovery';
            case 'cooking':
                return '+15 EXP for cooking patience';
            default:
                return '+10 EXP for your patience!';
        }
    };

    return (
        <div className="loading-spinner">
            <div className="spinner-container animate__animated animate__pulse">
                <div className="spinner-icon-container">
                    {getSpinnerIcons()}
                </div>

                <div className="spinner-text-container">
                    <h3 className="spinner-title">{getLoadingMessage()}</h3>
                    <p className="spinner-subtitle">
                        <span className="spinner-dots">
                            <span className="dot">⚙️</span>
                            <span className="dot">⚙️</span>
                            <span className="dot">⚙️</span>
                        </span>
                    </p>

                    <div className="spinner-reward-note">
                        <span className="reward-icon">🎁</span>
                        <span className="reward-text">{getRewardMessage()}</span>
                    </div>

                    {/* Progress indicator for user data loading */}
                    {type === 'user' && (
                        <div className="user-loading-progress">
                            <div className="progress-label">
                                <span>Loading User Data</span>
                                <span className="progress-value">70%</span>
                            </div>
                            <div className="progress-container">
                                <div className="progress-bar progress-bar-exp" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;