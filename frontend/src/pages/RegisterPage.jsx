import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="register-page">
            <div className="register-header">
                <h1>🍳 CookTogether</h1>
                <p>Join our community of cooking enthusiasts!</p>
            </div>

            <div className="register-content">
                <RegisterForm />

                <div className="features-preview">
                    <h3>What you'll get:</h3>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">👨‍🍳</div>
                            <h4>Cook with Friends</h4>
                            <p>Multiplayer cooking sessions</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h4>Earn Rewards</h4>
                            <p>Level up & collect currencies</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📖</div>
                            <h4>Recipe Collection</h4>
                            <p>Save & organize recipes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;