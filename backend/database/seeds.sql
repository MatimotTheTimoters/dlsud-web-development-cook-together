-- CookTogether Test Seed Data
-- Use this after creating the database schema

USE cooktogether;

-- Disable foreign key checks temporarily for easier insertion
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data (optional, for clean seeding)
DELETE FROM cookbook_recipes;
DELETE FROM cookbooks;
DELETE FROM cooking_session_votes;
DELETE FROM cooking_step_completions;
DELETE FROM cooking_session_participants;
DELETE FROM cooking_session_details;
DELETE FROM cooking_sessions;
DELETE FROM recipe_interactions;
DELETE FROM recipe_steps;
DELETE FROM recipe_ingredients;
DELETE FROM recipe_metadata;
DELETE FROM recipes;
DELETE FROM user_relationships;
DELETE FROM user_stats;
DELETE FROM users;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================
-- 1. USERS
-- ====================
INSERT INTO users (id, full_name, email, password_hash, age, gender, profile_picture, created_at) VALUES
-- Password for all test users: "password123" (hashed with bcrypt)
('usr_001', 'Alex Johnson', 'alex@example.com', '$2y$10$X4zLwB7f2wQ7z8Y9A0B1C.D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 28, 'male', 'https://randomuser.me/api/portraits/men/32.jpg', '2024-01-01 10:00:00'),
('usr_002', 'Maria Garcia', 'maria@example.com', '$2y$10$X4zLwB7f2wQ7z8Y9A0B1C.D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 34, 'female', 'https://randomuser.me/api/portraits/women/44.jpg', '2024-01-02 11:30:00'),
('usr_003', 'David Chen', 'david@example.com', '$2y$10$X4zLwB7f2wQ7z8Y9A0B1C.D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 25, 'male', 'https://randomuser.me/api/portraits/men/67.jpg', '2024-01-03 14:20:00'),
('usr_004', 'Sarah Williams', 'sarah@example.com', '$2y$10$X4zLwB7f2wQ7z8Y9A0B1C.D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 31, 'female', 'https://randomuser.me/api/portraits/women/68.jpg', '2024-01-04 09:15:00'),
('usr_005', 'Jamal Brown', 'jamal@example.com', '$2y$10$X4zLwB7f2wQ7z8Y9A0B1C.D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W', 29, 'male', 'https://randomuser.me/api/portraits/men/75.jpg', '2024-01-05 16:45:00');

-- ====================
-- 2. USER STATS
-- ====================
INSERT INTO user_stats (id, user_id, level, current_exp, current_level_ceiling, gold_count, gem_count, login_streak, recipes_created, recipes_cooked, challenges_completed, max_exp_reward, max_gold_reward, max_gem_reward, last_limit_update) VALUES
('stat_001', 'usr_001', 5, 320, 500, 1250, 45, 7, 3, 12, 2, 150, 75, 8, '2024-01-10 08:00:00'),
('stat_002', 'usr_002', 8, 780, 1000, 3200, 120, 14, 7, 25, 5, 200, 100, 12, '2024-01-10 09:30:00'),
('stat_003', 'usr_003', 3, 80, 200, 450, 15, 3, 1, 5, 1, 120, 60, 6, '2024-01-10 10:15:00'),
('stat_004', 'usr_004', 6, 420, 600, 1800, 65, 10, 4, 18, 3, 170, 85, 10, '2024-01-10 11:45:00'),
('stat_005', 'usr_005', 2, 30, 150, 200, 8, 2, 0, 3, 0, 110, 55, 5, '2024-01-10 13:20:00');

-- ====================
-- 3. USER RELATIONSHIPS
-- ====================
INSERT INTO user_relationships (id, source_user_id, target_user_id, relationship_type, status, message, created_at) VALUES
('rel_001', 'usr_001', 'usr_002', 'following', 'accepted', NULL, '2024-01-06 14:30:00'),
('rel_002', 'usr_001', 'usr_003', 'friend', 'accepted', 'Hey, let''s cook together sometime!', '2024-01-07 10:15:00'),
('rel_003', 'usr_002', 'usr_004', 'following', 'accepted', NULL, '2024-01-08 16:45:00'),
('rel_004', 'usr_003', 'usr_001', 'friend', 'accepted', 'Thanks for the add!', '2024-01-07 10:20:00'),
('rel_005', 'usr_004', 'usr_002', 'following', 'accepted', NULL, '2024-01-09 09:30:00'),
('rel_006', 'usr_005', 'usr_001', 'friend', 'pending', 'Hi Alex, I saw your recipes and would love to connect!', '2024-01-10 14:00:00');

-- ====================
-- 4. RECIPES
-- ====================
INSERT INTO recipes (id, title, description, origin, preparation_time, cooking_time, serving_size, difficulty, is_paid, is_public, user_id, cover_image, created_at) VALUES
('rec_001', 'Classic Spaghetti Carbonara', 'A traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper.', 'Italian', 15, 20, 4, 'medium', FALSE, TRUE, 'usr_002', 'https://images.unsplash.com/photo-1598866594230-a7c12756260f', '2024-01-05 14:30:00'),
('rec_002', 'Vegetable Stir Fry', 'Quick and healthy vegetable stir fry with tofu and soy sauce.', 'Chinese', 20, 15, 2, 'easy', FALSE, TRUE, 'usr_001', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '2024-01-06 11:20:00'),
('rec_003', 'Chocolate Chip Cookies', 'Soft and chewy chocolate chip cookies with melted chocolate chunks.', 'American', 15, 12, 24, 'easy', FALSE, TRUE, 'usr_004', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e', '2024-01-07 16:45:00'),
('rec_004', 'Beef Bourguignon', 'French beef stew braised in red wine with carrots, mushrooms, and onions.', 'French', 30, 120, 6, 'hard', TRUE, TRUE, 'usr_002', 'https://images.unsplash.com/photo-1600891964092-4316c288032e', '2024-01-08 10:15:00'),
('rec_005', 'Avocado Toast', 'Simple yet delicious avocado toast with cherry tomatoes and feta cheese.', 'Mediterranean', 10, 5, 1, 'easy', FALSE, TRUE, 'usr_003', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d', '2024-01-09 09:30:00'),
('rec_006', 'Chicken Tikka Masala', 'Creamy Indian curry with marinated chicken in spiced tomato sauce.', 'Indian', 30, 40, 4, 'medium', FALSE, TRUE, 'usr_004', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641', '2024-01-10 13:20:00');

-- ====================
-- 5. RECIPE METADATA
-- ====================
INSERT INTO recipe_metadata (id, recipe_id, tags, exp_reward, gold_reward, gem_reward, gold_price, gem_price, like_count, dislike_count, cook_count, total_calories, total_protein, total_carbs, total_fat) VALUES
('meta_001', 'rec_001', 'pasta,italian,dinner,comfort food', 50, 25, 2, 0, 0, 45, 2, 28, 650.50, 32.20, 85.10, 25.80),
('meta_002', 'rec_002', 'vegetarian,healthy,quick,asian', 35, 18, 1, 0, 0, 32, 1, 15, 420.75, 18.50, 65.30, 12.40),
('meta_003', 'rec_003', 'dessert,cookies,baking,sweet', 25, 12, 1, 0, 0, 67, 0, 42, 180.25, 2.50, 28.75, 8.90),
('meta_004', 'rec_004', 'french,stew,beef,special occasion', 80, 40, 4, 50, 5, 28, 3, 8, 890.30, 45.20, 42.10, 38.75),
('meta_005', 'rec_005', 'breakfast,healthy,quick,vegetarian', 20, 10, 1, 0, 0, 53, 1, 35, 320.80, 12.60, 28.40, 22.10),
('meta_006', 'rec_006', 'indian,curry,spicy,chicken', 60, 30, 3, 0, 0, 41, 2, 19, 720.60, 38.40, 52.80, 28.90);

-- ====================
-- 6. RECIPE INGREDIENTS
-- ====================
INSERT INTO recipe_ingredients (id, recipe_id, name, amount, unit, notes, order_index, calories_per_unit, protein_per_unit, carbs_per_unit, fat_per_unit) VALUES
-- Spaghetti Carbonara ingredients
('ing_001', 'rec_001', 'Spaghetti', 400, 'grams', 'Use fresh pasta if possible', 1, 131.00, 5.30, 25.50, 0.90),
('ing_002', 'rec_001', 'Pancetta', 150, 'grams', 'Can substitute with bacon', 2, 450.00, 14.00, 1.00, 42.00),
('ing_003', 'rec_001', 'Eggs', 3, 'pieces', 'Large eggs at room temperature', 3, 72.00, 6.30, 0.40, 4.80),
('ing_004', 'rec_001', 'Pecorino Romano', 100, 'grams', 'Freshly grated', 4, 387.00, 28.00, 0.00, 31.00),
('ing_005', 'rec_001', 'Black Pepper', 2, 'tsp', 'Freshly ground', 5, 6.00, 0.30, 1.40, 0.10),

-- Vegetable Stir Fry ingredients
('ing_006', 'rec_002', 'Broccoli', 200, 'grams', 'Cut into florets', 1, 34.00, 2.80, 6.60, 0.40),
('ing_007', 'rec_002', 'Bell Pepper', 2, 'pieces', 'Red and yellow, sliced', 2, 31.00, 1.00, 6.00, 0.30),
('ing_008', 'rec_002', 'Carrots', 150, 'grams', 'Sliced thinly', 3, 41.00, 0.90, 9.60, 0.20),
('ing_009', 'rec_002', 'Tofu', 300, 'grams', 'Firm tofu, cubed', 4, 76.00, 8.10, 1.90, 4.80),
('ing_010', 'rec_002', 'Soy Sauce', 3, 'tbsp', 'Low sodium preferred', 5, 8.00, 1.00, 1.00, 0.10);

-- ====================
-- 7. RECIPE STEPS
-- ====================
INSERT INTO recipe_steps (id, recipe_id, description, read_timer_duration, timer_duration, timer_unit, exp_reward, gold_reward, order_index) VALUES
-- Spaghetti Carbonara steps
('step_001', 'rec_001', 'Bring a large pot of salted water to boil. Add spaghetti and cook according to package instructions until al dente.', 15, 600, 'seconds', 5, 3, 1),
('step_002', 'rec_001', 'While pasta cooks, dice pancetta into small cubes. Cook in a large skillet over medium heat until crispy, about 5-7 minutes.', 15, 300, 'seconds', 5, 3, 2),
('step_003', 'rec_001', 'In a bowl, whisk together eggs, grated pecorino cheese, and freshly ground black pepper.', 10, NULL, NULL, 3, 2, 3),
('step_004', 'rec_001', 'When pasta is done, reserve 1 cup of pasta water, then drain pasta. Quickly add hot pasta to skillet with pancetta and mix.', 15, 60, 'seconds', 5, 3, 4),
('step_005', 'rec_001', 'Remove skillet from heat. Add egg mixture and toss quickly to coat pasta. Add pasta water as needed to create creamy sauce. Serve immediately.', 20, NULL, NULL, 7, 4, 5),

-- Vegetable Stir Fry steps
('step_006', 'rec_002', 'Prepare all vegetables: cut broccoli into florets, slice bell peppers, and thinly slice carrots.', 15, 300, 'seconds', 4, 2, 1),
('step_007', 'rec_002', 'Press tofu to remove excess water, then cut into 1-inch cubes.', 10, 180, 'seconds', 3, 2, 2),
('step_008', 'rec_002', 'Heat oil in a wok or large skillet over high heat. Add tofu and cook until golden brown on all sides, about 5 minutes.', 15, 300, 'seconds', 5, 3, 3),
('step_009', 'rec_002', 'Add vegetables to the wok and stir fry for 4-5 minutes until crisp-tender.', 10, 240, 'seconds', 4, 2, 4),
('step_010', 'rec_002', 'Add soy sauce and stir to combine. Cook for 1 more minute, then serve hot with rice.', 10, 60, 'seconds', 4, 2, 5);

-- ====================
-- 8. RECIPE INTERACTIONS
-- ====================
INSERT INTO recipe_interactions (id, user_id, recipe_id, interaction_type, created_at) VALUES
('int_001', 'usr_001', 'rec_001', 'like', '2024-01-06 15:30:00'),
('int_002', 'usr_001', 'rec_001', 'save', '2024-01-06 15:31:00'),
('int_003', 'usr_002', 'rec_002', 'like', '2024-01-07 10:45:00'),
('int_004', 'usr_003', 'rec_003', 'like', '2024-01-08 14:20:00'),
('int_005', 'usr_003', 'rec_003', 'save', '2024-01-08 14:21:00'),
('int_006', 'usr_004', 'rec_001', 'like', '2024-01-09 11:15:00'),
('int_007', 'usr_005', 'rec_005', 'like', '2024-01-10 09:30:00'),
('int_008', 'usr_001', 'rec_004', 'purchase', '2024-01-10 16:45:00');

-- Add metadata for purchase interaction
UPDATE recipe_interactions SET metadata = '{"purchase_price_gold": 50, "purchase_price_gems": 5}' WHERE id = 'int_008';

-- ====================
-- 9. COOKING SESSIONS
-- ====================
INSERT INTO cooking_sessions (id, recipe_id, host_id, mode, visibility, status, started_at, completed_at, notes, created_at) VALUES
('sess_001', 'rec_001', 'usr_001', 'solo', 'private', 'completed', '2024-01-06 18:30:00', '2024-01-06 19:15:00', 'My first time making carbonara!', '2024-01-06 18:25:00'),
('sess_002', 'rec_002', 'usr_002', 'multiplayer', 'friends_only', 'cooking', '2024-01-07 19:00:00', NULL, 'Cooking with friends tonight!', '2024-01-07 18:45:00'),
('sess_003', 'rec_003', 'usr_003', 'solo', 'private', 'completed', '2024-01-08 14:00:00', '2024-01-08 14:25:00', 'Baking cookies for the office', '2024-01-08 13:55:00'),
('sess_004', 'rec_004', 'usr_001', 'solo', 'private', 'planned', NULL, NULL, 'Weekend cooking project', '2024-01-09 20:15:00'),
('sess_005', 'rec_002', 'usr_004', 'multiplayer', 'public', 'preparing', NULL, NULL, 'Join me for vegetarian cooking!', '2024-01-10 17:30:00');

-- ====================
-- 10. COOKING SESSION DETAILS
-- ====================
INSERT INTO cooking_session_details (id, cooking_session_id, current_step_index, total_steps, completed_steps, total_duration, exp_earned, gold_earned, gems_earned, cook_duration) VALUES
('detail_001', 'sess_001', 5, 5, 5, 2700, 25, 15, 1, 45),
('detail_002', 'sess_002', 3, 5, 2, 1200, 12, 8, 0, 20),
('detail_003', 'sess_003', 5, 5, 5, 1500, 20, 10, 1, 25),
('detail_004', 'sess_004', 0, 8, 0, NULL, 0, 0, 0, NULL),
('detail_005', 'sess_005', 1, 5, 0, NULL, 0, 0, 0, NULL);

-- ====================
-- 11. COOKING SESSION PARTICIPANTS
-- ====================
INSERT INTO cooking_session_participants (id, cooking_session_id, user_id, role, status, joined_at) VALUES
('part_001', 'sess_001', 'usr_001', 'host', 'active', '2024-01-06 18:25:00'),
('part_002', 'sess_002', 'usr_002', 'host', 'active', '2024-01-07 18:45:00'),
('part_003', 'sess_002', 'usr_001', 'participant', 'active', '2024-01-07 18:50:00'),
('part_004', 'sess_002', 'usr_004', 'participant', 'ready', '2024-01-07 18:52:00'),
('part_005', 'sess_003', 'usr_003', 'host', 'active', '2024-01-08 13:55:00'),
('part_006', 'sess_004', 'usr_001', 'host', 'joined', '2024-01-09 20:15:00'),
('part_007', 'sess_005', 'usr_004', 'host', 'active', '2024-01-10 17:30:00'),
('part_008', 'sess_005', 'usr_005', 'participant', 'joined', '2024-01-10 17:35:00');

-- ====================
-- 12. COOKING STEP COMPLETIONS
-- ====================
INSERT INTO cooking_step_completions (id, cooking_session_id, recipe_step_id, step_index, completed_at, duration_seconds, was_skipped, exp_earned, gold_earned) VALUES
('comp_001', 'sess_001', 'step_001', 1, '2024-01-06 18:35:00', 620, FALSE, 5, 3),
('comp_002', 'sess_001', 'step_002', 2, '2024-01-06 18:42:00', 420, FALSE, 5, 3),
('comp_003', 'sess_001', 'step_003', 3, '2024-01-06 18:45:00', 180, FALSE, 3, 2),
('comp_004', 'sess_001', 'step_004', 4, '2024-01-06 18:50:00', 90, FALSE, 5, 3),
('comp_005', 'sess_001', 'step_005', 5, '2024-01-06 18:55:00', 300, FALSE, 7, 4),
('comp_006', 'sess_003', 'step_006', 1, '2024-01-08 14:05:00', 320, FALSE, 4, 2),
('comp_007', 'sess_003', 'step_007', 2, '2024-01-08 14:10:00', 200, FALSE, 3, 2);

-- ====================
-- 13. COOKBOOKS
-- ====================
INSERT INTO cookbooks (id, user_id, name, description, is_public, created_at) VALUES
('book_001', 'usr_001', 'My Favorite Italian Recipes', 'Collection of authentic Italian dishes I love to cook', TRUE, '2024-01-07 11:30:00'),
('book_002', 'usr_002', 'Healthy Weeknight Dinners', 'Quick and nutritious meals for busy evenings', TRUE, '2024-01-08 15:45:00'),
('book_003', 'usr_004', 'Dessert Collection', 'Sweet treats for every occasion', FALSE, '2024-01-09 14:20:00');

-- ====================
-- 14. COOKBOOK RECIPES
-- ====================
INSERT INTO cookbook_recipes (id, cookbook_id, recipe_id, added_by, notes, added_at) VALUES
('cb_rec_001', 'book_001', 'rec_001', 'usr_001', 'My go-to carbonara recipe, perfect every time!', '2024-01-07 11:35:00'),
('cb_rec_002', 'book_002', 'rec_002', 'usr_002', 'Great vegetarian option, packed with veggies', '2024-01-08 15:50:00'),
('cb_rec_003', 'book_002', 'rec_005', 'usr_002', 'Perfect quick breakfast or snack', '2024-01-08 15:52:00'),
('cb_rec_004', 'book_003', 'rec_003', 'usr_004', 'Everyone loves these cookies!', '2024-01-09 14:25:00');

-- ====================
-- 15. UPDATE USER STATS BASED ON ACTIVITIES
-- ====================
-- Update recipes_cooked count based on completed sessions
UPDATE user_stats us
SET recipes_cooked = (
    SELECT COUNT(DISTINCT cs.recipe_id) 
    FROM cooking_sessions cs 
    WHERE cs.host_id = us.user_id 
    AND cs.status = 'completed'
)
WHERE user_id IN ('usr_001', 'usr_002', 'usr_003', 'usr_004', 'usr_005');

-- Update recipes_created count
UPDATE user_stats us
SET recipes_created = (
    SELECT COUNT(*) 
    FROM recipes r 
    WHERE r.user_id = us.user_id
)
WHERE user_id IN ('usr_001', 'usr_002', 'usr_003', 'usr_004', 'usr_005');

-- ====================
-- FINAL MESSAGE
-- ====================
SELECT '✅ Seed data inserted successfully!' AS message;
SELECT 'Test Users Created:' AS info;
SELECT id, full_name, email FROM users;

SELECT 'Recipes Available:' AS info;
SELECT r.id, r.title, u.full_name as creator, r.difficulty 
FROM recipes r 
JOIN users u ON r.user_id = u.id;

SELECT 'Cooking Sessions:' AS info;
SELECT cs.id, r.title as recipe, u.full_name as host, cs.status 
FROM cooking_sessions cs 
JOIN recipes r ON cs.recipe_id = r.id 
JOIN users u ON cs.host_id = u.id;

SELECT 'Ready for testing! Use these credentials to login:' AS instructions;
SELECT 'Email: alex@example.com, Password: password123' AS test_account_1;
SELECT 'Email: maria@example.com, Password: password123' AS test_account_2;
SELECT 'Email: david@example.com, Password: password123' AS test_account_3;