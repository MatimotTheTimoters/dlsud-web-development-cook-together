-- Replace your schema.sql with this cleaner version:
CREATE DATABASE IF NOT EXISTS cooktogether;
USE cooktogether;
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    location VARCHAR(100),
    profile_picture VARCHAR(255),
    cooking_since YEAR,
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    login_streak INT DEFAULT 0,
    level INT DEFAULT 1,
    current_exp INT DEFAULT 0,
    current_level_ceiling INT DEFAULT 100,
    gold_count INT DEFAULT 100,
    gem_count INT DEFAULT 10,
    recipes_created INT DEFAULT 0,
    recipes_cooked INT DEFAULT 0,
    challenges_completed INT DEFAULT 0,
    recipes_sold INT DEFAULT 0,
    total_cooking_time INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_achievements (user_id, achievement_type)
);