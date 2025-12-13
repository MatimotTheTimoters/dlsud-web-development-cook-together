import React from 'react';
import { FaHeart, FaTwitter, FaDiscord, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    return (
        <footer className="page-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="footer-logo-icon">🍳</span>
                            <span className="footer-logo-text">CookTogether</span>
                        </div>
                        <p className="footer-tagline">
                            Level up your cooking skills with friends!
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h3 className="footer-heading">Explore</h3>
                            <ul className="footer-list">
                                <li><a href="/recipes" className="footer-link">Recipes</a></li>
                                <li><a href="/cooking-sessions" className="footer-link">Cooking Sessions</a></li>
                                <li><a href="/discover" className="footer-link">Discover Chefs</a></li>
                                <li><a href="/cookbooks" className="footer-link">Cookbooks</a></li>
                                <li><a href="/shop" className="footer-link">Shop</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="footer-heading">Community</h3>
                            <ul className="footer-list">
                                <li><a href="/challenges" className="footer-link">Challenges</a></li>
                                <li><a href="/leaderboard" className="footer-link">Leaderboard</a></li>
                                <li><a href="/blog" className="footer-link">Blog</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="footer-heading">Support</h3>
                            <ul className="footer-list">
                                <li><a href="/faq" className="footer-link">FAQ</a></li>
                                <li><a href="/contact" className="footer-link">Contact Us</a></li>
                                <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
                                <li><a href="/terms" className="footer-link">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {getCurrentYear()} CookTogether. Made with <FaHeart className="text-chef-red" /> for food lovers everywhere.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;