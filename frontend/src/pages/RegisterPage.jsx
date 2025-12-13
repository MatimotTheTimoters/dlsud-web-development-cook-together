import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1 className="register-title">
                        <FaUserPlus /> Join CookTogether
                    </h1>
                    <p className="register-subtitle">
                        Create your account and start your cooking adventure today!
                    </p>
                    <div className="welcome-bonus">
                        <span className="bonus-icon">🎁</span>
                        <span className="bonus-text">Welcome Bonus: 100 Gold!</span>
                    </div>
                </div>

                <RegisterForm />

                <div className="register-footer">
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                    <p className="terms-notice">
                        By registering, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;