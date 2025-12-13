import React from 'react';
import { FaHeart, FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa';

const Footer = () => {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    return (
        <footer className="page-footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/about" className="footer-link">About</a>
                        <a href="/blog" className="footer-link">Blog</a>
                        <a href="/privacy" className="footer-link">Privacy</a>
                        <a href="/terms" className="footer-link">Terms</a>
                    </div>

                    <div className="footer-social">
                        <a href="https://twitter.com" className="social-link">
                            <FaTwitter />
                        </a>
                        <a href="https://discord.com" className="social-link">
                            <FaDiscord />
                        </a>
                        <a href="https://github.com" className="social-link">
                            <FaGithub />
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {getCurrentYear()} CookTogether • Level up your cooking!
                    </p>
                    <p className="footer-tagline">
                        Made with <FaHeart className="text-chef-red" /> and 🍳 by food lovers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;