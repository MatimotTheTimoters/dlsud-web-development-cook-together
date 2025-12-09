import React, { Component } from 'react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

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
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Log error to error reporting service
        if (window.errorReportingService) {
            window.errorReportingService.logError(error, errorInfo);
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary notification-error">
                    <div className="error-container">
                        <div className="error-icon-container">
                            <FaExclamationTriangle className="error-icon" />
                            <div className="error-sparkle"></div>
                        </div>

                        <div className="error-content">
                            <h1 className="error-title">Oops! Something went wrong in the kitchen!</h1>

                            <div className="error-message">
                                <p className="error-description">
                                    Our chefs are working to fix this recipe error.
                                    Don't worry, your progress is saved!
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
                            </div>

                            <div className="error-tips">
                                <h4 className="tips-title">Quick Tips:</h4>
                                <ul className="tips-list">
                                    <li>Refresh the page to try again</li>
                                    <li>Check your internet connection</li>
                                    <li>Clear browser cache if problem persists</li>
                                    <li>Contact support if you need help</li>
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

export default ErrorBoundary;