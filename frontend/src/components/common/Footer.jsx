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
                                <li><a href="/community" className="footer-link">Forums</a></li>
                                <li><a href="/challenges" className="footer-link">Challenges</a></li>
                                <li><a href="/leaderboard" className="footer-link">Leaderboard</a></li>
                                <li><a href="/events" className="footer-link">Events</a></li>
                                <li><a href="/blog" className="footer-link">Blog</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3 className="footer-heading">Support</h3>
                            <ul className="footer-list">
                                <li><a href="/help" className="footer-link">Help Center</a></li>
                                <li><a href="/faq" className="footer-link">FAQ</a></li>
                                <li><a href="/contact" className="footer-link">Contact Us</a></li>
                                <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
                                <li><a href="/terms" className="footer-link">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-social">
                        <h3 className="footer-heading">Connect With Us</h3>
                        <div className="social-icons">
                            <a href="https://twitter.com/cooktogether" className="social-link">
                                <FaTwitter className="social-icon" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="https://discord.gg/cooktogether" className="social-link">
                                <FaDiscord className="social-icon" />
                                <span className="sr-only">Discord</span>
                            </a>
                            <a href="https://github.com/cooktogether" className="social-link">
                                <FaGithub className="social-icon" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="mailto:hello@cooktogether.com" className="social-link">
                                <FaEnvelope className="social-icon" />
                                <span className="sr-only">Email</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {getCurrentYear()} CookTogether. Made with <FaHeart className="text-chef-red" /> for food lovers everywhere.
                    </p>
                    <p className="footer-note">
                        Earn XP, collect coins, and level up your culinary skills!
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;