import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-header">
                <h1>🍳 CookTogether</h1>
                <p>Sign in to cook with friends and earn rewards!</p>
            </div>

            <div className="login-content">
                <LoginForm />

                <div className="features-reminder">
                    <h3>Continue where you left off:</h3>
                    <div className="features-list">
                        <div className="feature-item">
                            <span className="feature-icon">🏆</span>
                            <span>Track your cooking level</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">👥</span>
                            <span>Join cooking sessions</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📖</span>
                            <span>Access your cookbooks</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🏪</span>
                            <span>Spend your earned currency</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;