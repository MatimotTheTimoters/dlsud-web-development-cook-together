-- CookTogether Database Schema
-- Created for XAMPP/MySQL
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS cooktogether;
USE cooktogether;
-- Drop existing tables if migrating (in correct order for foreign key constraints)
DROP TABLE IF EXISTS cookbook_recipes;
DROP TABLE IF EXISTS cookbooks;
DROP TABLE IF EXISTS cooking_session_votes;
DROP TABLE IF EXISTS cooking_step_completions;
DROP TABLE IF EXISTS cooking_session_participants;
DROP TABLE IF EXISTS cooking_session_details;
DROP TABLE IF EXISTS cooking_sessions;
DROP TABLE IF EXISTS recipe_interactions;
DROP TABLE IF EXISTS recipe_steps;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipe_metadata;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS user_relationships;
DROP TABLE IF EXISTS user_stats;
DROP TABLE IF EXISTS users;
-- Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    profile_picture VARCHAR(500) NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    age INT NULL,
    gender ENUM('male', 'female', 'non-binary', 'other') NULL,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- User_Stats Table
CREATE TABLE user_stats (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    login_streak INT DEFAULT 0,
    level INT DEFAULT 1,
    current_exp INT DEFAULT 0,
    current_level_ceiling INT DEFAULT 100,
    gold_count INT DEFAULT 0,
    gem_count INT DEFAULT 0,
    recipes_created INT DEFAULT 0,
    recipes_cooked INT DEFAULT 0,
    challenges_completed INT DEFAULT 0,
    recipes_sold INT DEFAULT 0,
    max_exp_reward INT DEFAULT 100,
    max_gold_reward INT DEFAULT 50,
    max_gem_reward INT DEFAULT 5,
    max_gold_price INT DEFAULT 100,
    max_gem_price INT DEFAULT 10,
    last_limit_update DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_level (level)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- User_Relationships Table
CREATE TABLE user_relationships (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_user_id VARCHAR(255) NOT NULL,
    target_user_id VARCHAR(255) NOT NULL,
    relationship_type ENUM('following', 'friend', 'blocked') NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
    message TEXT NULL,
    responded_at DATETIME NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_relationship (
        source_user_id,
        target_user_id,
        relationship_type
    ),
    FOREIGN KEY (source_user_id) REFERENCES users(id),
    FOREIGN KEY (target_user_id) REFERENCES users(id),
    INDEX idx_source_user (source_user_id),
    INDEX idx_target_user (target_user_id),
    INDEX idx_relationship_type (relationship_type),
    INDEX idx_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Recipes Table
CREATE TABLE recipes (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    cover_image VARCHAR(500) NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    origin VARCHAR(100) NULL,
    preparation_time INT NULL,
    cooking_time INT NULL,
    serving_size INT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    is_paid BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_difficulty (difficulty),
    INDEX idx_created_at (created_at),
    INDEX idx_is_public (is_public),
    FULLTEXT INDEX idx_search (title, description, origin)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Recipe_Metadata Table
CREATE TABLE recipe_metadata (
    id VARCHAR(255) PRIMARY KEY,
    recipe_id VARCHAR(255) NOT NULL,
    tags TEXT NULL,
    exp_reward INT DEFAULT 0,
    gold_reward INT DEFAULT 0,
    gem_reward INT DEFAULT 0,
    gold_price INT DEFAULT 0,
    gem_price INT DEFAULT 0,
    purchase_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    cook_count INT DEFAULT 0,
    total_calories DECIMAL(10, 2) DEFAULT 0,
    total_protein DECIMAL(10, 2) DEFAULT 0,
    total_carbs DECIMAL(10, 2) DEFAULT 0,
    total_fat DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_recipe_id (recipe_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_like_count (like_count),
    INDEX idx_cook_count (cook_count)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Recipe_Ingredients Table
CREATE TABLE recipe_ingredients (
    id VARCHAR(255) PRIMARY KEY,
    recipe_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(8, 2) NULL,
    unit VARCHAR(50) NULL,
    notes VARCHAR(255) NULL,
    order_index INT NOT NULL,
    calories_per_unit DECIMAL(10, 2) DEFAULT 0,
    protein_per_unit DECIMAL(10, 2) DEFAULT 0,
    carbs_per_unit DECIMAL(10, 2) DEFAULT 0,
    fat_per_unit DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_order_index (order_index),
    INDEX idx_name (name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Recipe_Steps Table
CREATE TABLE recipe_steps (
    id VARCHAR(255) PRIMARY KEY,
    recipe_id VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) NULL,
    read_timer_duration INT DEFAULT 10,
    timer_duration INT NULL,
    timer_unit ENUM('seconds', 'minutes', 'hours') DEFAULT 'seconds',
    exp_reward INT DEFAULT 0,
    gold_reward INT DEFAULT 0,
    gem_reward INT DEFAULT 0,
    order_index INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_order_index (order_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Recipe_Interactions Table
CREATE TABLE recipe_interactions (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL,
    recipe_id VARCHAR(255) NOT NULL,
    interaction_type ENUM('like', 'dislike', 'save', 'purchase') NOT NULL,
    metadata JSON NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_interaction (user_id, recipe_id, interaction_type),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    INDEX idx_user_id (user_id),
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_interaction_type (interaction_type),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Cooking_Sessions Table
CREATE TABLE cooking_sessions (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    recipe_id VARCHAR(255) NOT NULL,
    host_id VARCHAR(255) NOT NULL,
    mode ENUM('solo', 'multiplayer') DEFAULT 'solo',
    visibility ENUM('private', 'friends_only', 'public') DEFAULT 'private',
    status ENUM(
        'planned',
        'preparing',
        'cooking',
        'paused',
        'completed',
        'cancelled',
        'abandoned'
    ) DEFAULT 'planned',
    started_at DATETIME NULL,
    paused_at DATETIME NULL,
    completed_at DATETIME NULL,
    notes TEXT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (host_id) REFERENCES users(id),
    INDEX idx_host_id (host_id),
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_status (status),
    INDEX idx_visibility (visibility),
    INDEX idx_mode (mode),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Cooking_Session_Details Table
CREATE TABLE cooking_session_details (
    id VARCHAR(255) PRIMARY KEY,
    cooking_session_id VARCHAR(255) NOT NULL,
    current_step_index INT DEFAULT 0,
    total_steps INT NOT NULL,
    completed_steps INT DEFAULT 0,
    total_duration INT NULL,
    active_timer_step_id VARCHAR(255) NULL,
    timer_ends_at DATETIME NULL,
    exp_earned INT DEFAULT 0,
    gold_earned INT DEFAULT 0,
    gems_earned INT DEFAULT 0,
    cook_duration INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cooking_session_id (cooking_session_id),
    FOREIGN KEY (cooking_session_id) REFERENCES cooking_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (active_timer_step_id) REFERENCES recipe_steps(id),
    INDEX idx_cooking_session_id (cooking_session_id),
    INDEX idx_timer_ends_at (timer_ends_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Cooking_Session_Participants Table
CREATE TABLE cooking_session_participants (
    id VARCHAR(255) PRIMARY KEY,
    cooking_session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    role ENUM('host', 'participant', 'spectator') DEFAULT 'participant',
    status ENUM('joined', 'ready', 'active', 'left') DEFAULT 'joined',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_participation (cooking_session_id, user_id),
    FOREIGN KEY (cooking_session_id) REFERENCES cooking_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_cooking_session_id (cooking_session_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_role (role)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Cooking_Step_Completions Table
CREATE TABLE cooking_step_completions (
    id VARCHAR(255) PRIMARY KEY,
    cooking_session_id VARCHAR(255) NOT NULL,
    recipe_step_id VARCHAR(255) NOT NULL,
    step_index INT NOT NULL,
    completed_at DATETIME NULL,
    duration_seconds INT NULL,
    was_skipped BOOLEAN DEFAULT FALSE,
    notes TEXT NULL,
    exp_earned INT DEFAULT 0,
    gold_earned INT DEFAULT 0,
    gems_earned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cooking_session_id) REFERENCES cooking_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_step_id) REFERENCES recipe_steps(id),
    INDEX idx_cooking_session_id (cooking_session_id),
    INDEX idx_recipe_step_id (recipe_step_id),
    INDEX idx_step_index (step_index),
    INDEX idx_completed_at (completed_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Cooking_Session_Votes Table
CREATE TABLE cooking_session_votes (
    id VARCHAR(255) PRIMARY KEY,
    cooking_session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    vote_type ENUM('skip_read_timer', 'skip_step', 'other') NOT NULL,
    vote_value BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_vote (cooking_session_id, user_id, vote_type),
    FOREIGN KEY (cooking_session_id) REFERENCES cooking_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_cooking_session_id (cooking_session_id),
    INDEX idx_user_id (user_id),
    INDEX idx_vote_type (vote_type),
    INDEX idx_created_at (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Cookbooks Table
CREATE TABLE cookbooks (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX idx_cookbook_search (name, description)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Cookbook_Recipes Table
CREATE TABLE cookbook_recipes (
    id VARCHAR(255) PRIMARY KEY,
    cookbook_id VARCHAR(255) NOT NULL,
    recipe_id VARCHAR(255) NOT NULL,
    added_by VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cookbook_recipe (cookbook_id, recipe_id),
    FOREIGN KEY (cookbook_id) REFERENCES cookbooks(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id),
    FOREIGN KEY (added_by) REFERENCES users(id),
    INDEX idx_cookbook_id (cookbook_id),
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_added_by (added_by),
    INDEX idx_added_at (added_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Shop_Items Table (for gamification shop)
CREATE TABLE shop_items (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    item_type ENUM('cosmetic', 'tool', 'recipe', 'boost', 'other') NOT NULL,
    category VARCHAR(100) NOT NULL,
    gold_price INT DEFAULT 0,
    gem_price INT DEFAULT 0,
    effect_value INT DEFAULT 0,
    duration_days INT DEFAULT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    purchase_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_item_type (item_type),
    INDEX idx_is_available (is_available),
    INDEX idx_gold_price (gold_price),
    INDEX idx_gem_price (gem_price),
    INDEX idx_created_at (created_at),
    FULLTEXT INDEX idx_shop_search (name, description, category)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- User_Purchases Table (tracks shop item purchases)
CREATE TABLE user_purchases (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    currency_type ENUM('gold', 'gem') NOT NULL,
    price INT NOT NULL,
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_user_item_active (user_id, item_id, is_active),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES shop_items(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_item_id (item_id),
    INDEX idx_currency_type (currency_type),
    INDEX idx_purchased_at (purchased_at),
    INDEX idx_expires_at (expires_at),
    INDEX idx_is_active (is_active)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Insert some initial test data (optional for development)
-- INSERT INTO users (id, full_name, email, password_hash) VALUES 
-- ('test_user_1', 'Test User', 'test@example.com', '$2y$10$hashedpasswordhere');
-- Success message
SELECT 'Database schema created successfully!' as message;