import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 className="login-title">
                        <FaSignInAlt /> Login to CookTogether
                    </h1>
                    <p className="login-subtitle">
                        Enter your credentials to access your cooking journey
                    </p>
                </div>

                <LoginForm />

                <div className="login-footer">
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                    <p>
                        <Link to="/forgot-password">Forgot your password?</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;