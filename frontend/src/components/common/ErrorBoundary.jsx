import React, { Component } from 'react';
import { FaExclamationTriangle, FaRedo, FaHome, FaUser, FaCooking } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            errorInfo: errorInfo
        });

        // Log error to error reporting service
        if (window.errorReportingService) {
            window.errorReportingService.logError(error, errorInfo);
        }

        // You can also log to your backend API here
        this.logErrorToBackend(error, errorInfo);
    }

    logErrorToBackend = async (error, errorInfo) => {
        try {
            // This would be implemented when error logging API is available
            // await fetch('http://localhost/backend/api/errors/log.php', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         error: error.toString(),
            //         stack: errorInfo.componentStack,
            //         url: window.location.href,
            //         user: localStorage.getItem('user')
            //     })
            // });
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleGoProfile = () => {
        window.location.href = '/profile';
    };

    getUserSpecificTips = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const tips = [
            'Refresh the page to try again',
            'Check your internet connection',
            'Clear browser cache if problem persists',
            'Contact support if you need help'
        ];

        if (user.level > 10) {
            tips.push('As an experienced chef, try creating the recipe from scratch');
        }

        if (user.recipes_created > 5) {
            tips.push('Your created recipes are safe in the database');
        }

        return tips;
    };

    render() {
        if (this.state.hasError) {
            const userTips = this.getUserSpecificTips();
            const isUserAuthenticated = localStorage.getItem('token');

            return (
                <div className="error-boundary notification-error">
                    <div className="error-container">
                        <div className="error-icon-container">
                            <FaExclamationTriangle className="error-icon" />
                            <div className="error-sparkle"></div>
                        </div>

                        <div className="error-content">
                            <h1 className="error-title">
                                <FaCooking className="inline mr-2" />
                                Kitchen Malfunction!
                            </h1>

                            <div className="error-message">
                                <p className="error-description">
                                    Something burned in the oven! Our culinary wizards are investigating.
                                    {isUserAuthenticated && " Your progress has been auto-saved!"}
                                </p>

                                {this.state.error && (
                                    <div className="error-details">
                                        <h3 className="error-details-title">Error Details:</h3>
                                        <code className="error-code">
                                            {this.state.error.toString()}
                                        </code>
                                    </div>
                                )}
                            </div>

                            <div className="error-actions">
                                <button
                                    onClick={this.handleReload}
                                    className="btn-rpg btn-rpg-primary error-action-button"
                                >
                                    <FaRedo className="button-icon" />
                                    Try Again
                                </button>

                                <button
                                    onClick={this.handleGoHome}
                                    className="btn-rpg btn-rpg-secondary error-action-button"
                                >
                                    <FaHome className="button-icon" />
                                    Go Home
                                </button>

                                {isUserAuthenticated && (
                                    <button
                                        onClick={this.handleGoProfile}
                                        className="btn-rpg btn-rpg-success error-action-button"
                                    >
                                        <FaUser className="button-icon" />
                                        My Profile
                                    </button>
                                )}
                            </div>

                            <div className="error-tips">
                                <h4 className="tips-title">
                                    <FaCooking className="inline mr-2" />
                                    Chef's Tips:
                                </h4>
                                <ul className="tips-list">
                                    {userTips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component to add navigation capability
const ErrorBoundaryWithNavigation = (props) => {
    const navigate = useNavigate();
    return <ErrorBoundary {...props} navigate={navigate} />;
};

export default ErrorBoundaryWithNavigation;