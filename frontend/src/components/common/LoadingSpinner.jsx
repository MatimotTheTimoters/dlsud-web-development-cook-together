import React from 'react';
import { FaUtensilSpoon, FaBlender, FaFire } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'medium', color = 'chef-red' }) => {
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
            default: return 'text-chef-red';
        }
    };

    return (
        <div className="loading-spinner">
            <div className="spinner-container animate__animated animate__pulse">
                <div className="spinner-icon-container">
                    <FaUtensilSpoon className={`spinner-icon spoon-icon ${getColorClass()}`} />
                    <FaBlender className={`spinner-icon blender-icon ${getColorClass()}`} />
                    <FaFire className={`spinner-icon fire-icon ${getColorClass()}`} />
                </div>

                <div className="spinner-text-container">
                    <h3 className="spinner-title">Cooking up something delicious...</h3>
                    <p className="spinner-subtitle">
                        <span className="spinner-dots">
                            <span className="dot">⚙️</span>
                            <span className="dot">⚙️</span>
                            <span className="dot">⚙️</span>
                        </span>
                    </p>

                    <div className="spinner-reward-note">
                        <span className="reward-icon">🎁</span>
                        <span className="reward-text">+10 EXP for your patience!</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;