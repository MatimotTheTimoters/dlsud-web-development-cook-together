import React, { Component } from 'react';
import { FaExclamationTriangle, FaRedo, FaHome, FaUtensils } from 'react-icons/fa';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorType: 'general'
        };
    }

    static getDerivedStateFromError(error) {
        let errorType = 'general';

        if (error.message && (
            error.message.includes('recipe') ||
            error.message.includes('Recipe') ||
            error.message.includes('ingredient') ||
            error.message.includes('cooking') ||
            error.message.includes('step')
        )) {
            errorType = 'recipe';
        } else if (error.message && (
            error.message.includes('auth') ||
            error.message.includes('Auth') ||
            error.message.includes('token') ||
            error.message.includes('login')
        )) {
            errorType = 'auth';
        } else if (error.message && (
            error.message.includes('network') ||
            error.message.includes('Network') ||
            error.message.includes('fetch') ||
            error.message.includes('API')
        )) {
            errorType = 'network';
        }

        return {
            hasError: true,
            error,
            errorType
        };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            errorInfo: errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    getErrorIcon = () => {
        switch (this.state.errorType) {
            case 'recipe':
                return <FaUtensils className="error-icon" />;
            default:
                return <FaExclamationTriangle className="error-icon" />;
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-container">
                        <div className="error-icon-container">
                            {this.getErrorIcon()}
                        </div>

                        <div className="error-content">
                            <h1 className="error-title">
                                ⚠️ Something went wrong!
                            </h1>

                            <div className="error-message">
                                <p className="error-description">
                                    {this.state.errorType === 'recipe'
                                        ? 'There was an error with the recipe system.'
                                        : this.state.errorType === 'auth'
                                            ? 'Authentication error. Please log in again.'
                                            : this.state.errorType === 'network'
                                                ? 'Network error. Please check your connection.'
                                                : 'An unexpected error occurred.'}
                                </p>
                            </div>

                            <div className="error-actions">
                                <button
                                    onClick={this.handleReload}
                                    className="btn-rpg btn-rpg-primary"
                                >
                                    <FaRedo className="button-icon" />
                                    Try Again
                                </button>

                                <button
                                    onClick={this.handleGoHome}
                                    className="btn-rpg btn-rpg-secondary"
                                >
                                    <FaHome className="button-icon" />
                                    Go Home
                                </button>
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