import React, { Component } from 'react';
import { FaExclamationTriangle, FaRedo, FaHome, FaUser, FaUtensils, FaFire } from 'react-icons/fa';

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

    handleGoProfile = () => {
        window.location.href = '/profile';
    };

    handleGoRecipes = () => {
        window.location.href = '/recipes';
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
                                Kitchen Malfunction!
                            </h1>

                            <div className="error-message">
                                <p className="error-description">
                                    Something went wrong! Please try again.
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