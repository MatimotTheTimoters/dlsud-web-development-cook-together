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

    const getColorClass = () => {
        switch (color) {
            case 'gold': return 'text-gold-coin';
            case 'gem': return 'text-rare-gem';
            case 'xp': return 'text-xp-purple';
            case 'success': return 'text-success-green';
            case 'user': return 'text-chef-red';
            case 'recipe': return 'text-sizzling-orange';
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
                        <FaCarrot className={`spinner-icon carrot-icon ${getColorClass()}`} />
                        <FaBreadSlice className={`spinner-icon bread-icon ${getColorClass()}`} />
                    </>
                );
            case 'recipe-list':
                return (
                    <>
                        <FaSeedling className={`spinner-icon seedling-icon ${getColorClass()}`} />
                        <FaUtensilSpoon className={`spinner-icon spoon-icon ${getColorClass()}`} />
                        <FaBlender className={`spinner-icon blender-icon ${getColorClass()}`} />
                    </>
                );
            case 'recipe-detail':
                return (
                    <>
                        <FaCarrot className={`spinner-icon carrot-icon ${getColorClass()}`} />
                        <FaUtensilSpoon className={`spinner-icon spoon-icon ${getColorClass()}`} />
                        <FaFire className={`spinner-icon fire-icon ${getColorClass()}`} />
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

    const getRewardMessage = () => {
        switch (type) {
            case 'user':
                return '+5 EXP for checking stats';
            case 'recipe':
                return '+20 EXP for recipe creation';
            case 'recipe-list':
                return '+10 EXP for recipe discovery';
            case 'recipe-detail':
                return '+15 EXP for recipe preparation';
            case 'cooking':
                return '+25 EXP for cooking patience';
            default:
                return '+10 EXP for your patience!';
        }
    };

    const getProgressLabel = () => {
        switch (type) {
            case 'recipe':
                return 'Recipe Creation Progress';
            case 'recipe-list':
                return 'Loading Recipes';
            case 'recipe-detail':
                return 'Fetching Recipe Data';
            default:
                return 'Loading Progress';
        }
    };

    return (
        <div className={`loading-spinner ${getSizeClass()}`}>
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

                    {/* Progress indicator for recipe data loading */}
                    {(progress !== null || ['recipe', 'recipe-list', 'recipe-detail'].includes(type)) && (
                        <div className="recipe-loading-progress mt-4">
                            <div className="progress-label">
                                <span>{getProgressLabel()}</span>
                                <span className="progress-value">
                                    {progress !== null ? `${progress}%` : 'Loading...'}
                                </span>
                            </div>
                            <div className="progress-container">
                                <div
                                    className="progress-bar progress-bar-exp"
                                    style={{
                                        width: progress !== null ? `${progress}%` : '70%'
                                    }}
                                ></div>
                            </div>
                            {type === 'recipe' && (
                                <div className="progress-steps mt-2 text-xs text-warm-gray-medium">
                                    <span>Preparing ingredients...</span>
                                </div>
                            )}
                            {type === 'recipe-detail' && (
                                <div className="progress-steps mt-2 text-xs text-warm-gray-medium">
                                    <span>Loading ingredients and steps...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recipe-specific loading tips */}
                    {['recipe', 'recipe-list', 'recipe-detail'].includes(type) && (
                        <div className="loading-tips mt-3">
                            <div className="tips-card card">
                                <div className="card-body p-2">
                                    <p className="text-xs text-warm-gray-medium">
                                        <FaUtensilSpoon className="inline mr-1" />
                                        Tip: Great recipes take time to prepare!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;