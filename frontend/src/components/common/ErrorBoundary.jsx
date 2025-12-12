import React, { Component } from 'react';
import { FaExclamationTriangle, FaRedo, FaHome, FaUser, FaCooking, FaUtensils, FaFire } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

        // Detect recipe-related errors
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

        // Log error to error reporting service
        if (window.errorReportingService) {
            window.errorReportingService.logError(error, errorInfo);
        }

        // Log to backend API
        this.logErrorToBackend(error, errorInfo);
    }

    logErrorToBackend = async (error, errorInfo) => {
        try {
            // This would be implemented when error logging API is available
            const token = localStorage.getItem('token');
            // await fetch('http://localhost/backend/api/errors/log.php', {
            //     method: 'POST',
            //     headers: { 
            //         'Content-Type': 'application/json',
            //         'Authorization': token ? `Bearer ${token}` : ''
            //     },
            //     body: JSON.stringify({
            //         error: error.toString(),
            //         stack: errorInfo.componentStack,
            //         url: window.location.href,
            //         component: this.props.componentName || 'Unknown',
            //         user: JSON.parse(localStorage.getItem('user') || '{}'),
            //         timestamp: new Date().toISOString(),
            //         error_type: this.state.errorType
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

    handleGoRecipes = () => {
        window.location.href = '/recipes';
    };

    getRecipeSpecificTips = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const tips = [
            'Refresh the page to try loading the recipe again',
            'Check your internet connection',
            'The recipe might have been removed or made private',
            'Try browsing other recipes in the meantime'
        ];

        if (user.level > 10) {
            tips.push('As an experienced chef, you can create your own version of this recipe');
        }

        if (user.recipes_created > 5) {
            tips.push('Your created recipes are safe and accessible from your profile');
        }

        return tips;
    };

    getGeneralTips = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const tips = [
            'Refresh the page to try again',
            'Check your internet connection',
            'Clear browser cache if problem persists',
            'Contact support if you need help'
        ];

        if (user.level > 10) {
            tips.push('As an experienced chef, try the action again with different parameters');
        }

        return tips;
    };

    getErrorTitle = () => {
        switch (this.state.errorType) {
            case 'recipe':
                return (
                    <>
                        <FaUtensils className="inline mr-2" />
                        Recipe Kitchen Error!
                    </>
                );
            default:
                return (
                    <>
                        <FaCooking className="inline mr-2" />
                        Kitchen Malfunction!
                    </>
                );
        }
    };

    getErrorDescription = () => {
        const isUserAuthenticated = localStorage.getItem('token');

        switch (this.state.errorType) {
            case 'recipe':
                return `Something went wrong with this recipe! Our culinary wizards are investigating.${isUserAuthenticated ? " Your cooking progress has been saved!" : ""}`;
            default:
                return `Something burned in the oven! Our culinary wizards are investigating.${isUserAuthenticated ? " Your progress has been auto-saved!" : ""}`;
        }
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
            const userTips = this.state.errorType === 'recipe' ? this.getRecipeSpecificTips() : this.getGeneralTips();
            const isUserAuthenticated = localStorage.getItem('token');

            return (
                <div className="error-boundary notification-error">
                    <div className="error-container">
                        <div className="error-icon-container">
                            {this.getErrorIcon()}
                            <div className="error-sparkle"></div>
                        </div>

                        <div className="error-content">
                            <h1 className="error-title">
                                {this.getErrorTitle()}
                            </h1>

                            <div className="error-message">
                                <p className="error-description">
                                    {this.getErrorDescription()}
                                </p>

                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <div className="error-details">
                                        <h3 className="error-details-title">Error Details:</h3>
                                        <code className="error-code">
                                            {this.state.error.toString()}
                                        </code>
                                        {this.state.errorInfo && (
                                            <details className="error-stack">
                                                <summary>Component Stack Trace</summary>
                                                <pre>{this.state.errorInfo.componentStack}</pre>
                                            </details>
                                        )}
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

                                {this.state.errorType === 'recipe' && (
                                    <button
                                        onClick={this.handleGoRecipes}
                                        className="btn-rpg btn-rpg-info error-action-button"
                                    >
                                        <FaUtensils className="button-icon" />
                                        Browse Recipes
                                    </button>
                                )}

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
                                    <FaFire className="inline mr-2" />
                                    {this.state.errorType === 'recipe' ? 'Recipe Recovery Tips:' : 'Chef\'s Tips:'}
                                </h4>
                                <ul className="tips-list">
                                    {userTips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recipe-specific error context */}
                            {this.state.errorType === 'recipe' && (
                                <div className="recipe-error-context mt-4">
                                    <div className="context-card card">
                                        <div className="card-body">
                                            <h5 className="context-title">Recipe Error Context:</h5>
                                            <p className="context-text">
                                                This error occurred while loading or processing recipe data.
                                                It could be due to:
                                            </p>
                                            <ul className="context-list">
                                                <li>Missing recipe data in the database</li>
                                                <li>Invalid recipe format or structure</li>
                                                <li>Network issues while fetching recipe details</li>
                                                <li>Permission issues accessing the recipe</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
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