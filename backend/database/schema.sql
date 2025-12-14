-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cooktogether;
USE cooktogether;
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- User stats table (for future gamification)
CREATE TABLE user_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    login_streak INT DEFAULT 0,
    level INT DEFAULT 1,
    current_exp INT DEFAULT 0,
    gold_count INT DEFAULT 100,
    -- Start with 100 gold
    gem_count INT DEFAULT 10,
    -- Start with 10 gems
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Add user_tokens table for authentication
CREATE TABLE IF NOT EXISTS user_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
);
-- Add last_login field to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;
-- Update validation utility to include verifyPassword function
-- (Already exists in your validation.php)
USE cooktogether;
-- Add user_tokens table
CREATE TABLE IF NOT EXISTS user_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
);
-- Add last_login to users table if not exists
ALTER TABLE users
ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;