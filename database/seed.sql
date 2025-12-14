-- Insert sample users
INSERT INTO users (
        username,
        email,
        password,
        full_name,
        bio,
        location,
        profile_picture,
        cooking_since,
        last_login
    )
VALUES (
        'chefjohn',
        'john@email.com',
        'password123',
        'John Chef',
        'Professional chef with 10 years experience',
        'New York, USA',
        'john.jpg',
        2010,
        '2024-01-15 10:30:00'
    ),
    (
        'bakermary',
        'mary@email.com',
        'marypass456',
        'Mary Baker',
        'Home baker specializing in pastries',
        'Paris, France',
        'mary.jpg',
        2015,
        '2024-01-15 09:15:00'
    ),
    (
        'cookmax',
        'max@email.com',
        'max789pass',
        'Max Cook',
        'Food enthusiast exploring world cuisines',
        'Tokyo, Japan',
        'max.jpg',
        2018,
        '2024-01-14 14:20:00'
    ),
    (
        'recipeamy',
        'amy@email.com',
        'amyrecipe321',
        'Amy Recipe',
        'Healthy cooking advocate',
        'Sydney, Australia',
        'amy.jpg',
        2019,
        '2024-01-14 16:45:00'
    ),
    (
        'testuser',
        'test@email.com',
        'testpass',
        'Test User',
        'Just testing the system',
        'Test City',
        'default.jpg',
        2020,
        '2024-01-15 08:00:00'
    );
-- Insert user stats
INSERT INTO user_stats (
        user_id,
        login_streak,
        level,
        current_exp,
        current_level_ceiling,
        gold_count,
        gem_count,
        recipes_created,
        recipes_cooked,
        challenges_completed,
        recipes_sold,
        total_cooking_time
    )
VALUES (
        1,
        7,
        15,
        850,
        1000,
        2500,
        45,
        12,
        50,
        8,
        3,
        1250
    ),
    (2, 14, 12, 450, 600, 1800, 32, 8, 35, 5, 2, 980),
    (3, 3, 8, 220, 300, 950, 18, 5, 20, 3, 1, 540),
    (
        4,
        21,
        18,
        1200,
        1500,
        3200,
        55,
        15,
        65,
        12,
        5,
        1850
    ),
    (5, 1, 1, 0, 100, 100, 10, 0, 0, 0, 0, 0);
-- Insert user achievements
INSERT INTO user_achievements (
        user_id,
        achievement_type,
        achievement_name,
        description,
        icon
    )
VALUES (
        1,
        'cooking',
        'Master Chef',
        'Cooked 50+ recipes',
        '👨‍🍳'
    ),
    (
        1,
        'streak',
        'Weekly Warrior',
        '7-day login streak',
        '🔥'
    ),
    (
        2,
        'baking',
        'Pastry Pro',
        'Baked 20+ pastries',
        '🥐'
    ),
    (
        3,
        'exploration',
        'World Explorer',
        'Cooked 10+ cuisines',
        '🌎'
    ),
    (
        4,
        'health',
        'Health Guru',
        'Created 10+ healthy recipes',
        '🥗'
    ),
    (
        4,
        'streak',
        'Month Master',
        '21-day login streak',
        '📅'
    ),
    (
        4,
        'social',
        'Recipe Star',
        'Got 100+ likes on recipes',
        '⭐'
    );
-- Insert sample recipes
INSERT INTO recipes (
        user_id,
        title,
        description,
        prep_time,
        cook_time,
        servings,
        difficulty,
        category
    )
VALUES (
        1,
        'Classic Spaghetti Carbonara',
        'Creamy Italian pasta with eggs, cheese, and pancetta',
        15,
        20,
        4,
        'Easy',
        'Pasta'
    ),
    (
        2,
        'Chocolate Chip Cookies',
        'Soft and chewy cookies with chocolate chips',
        15,
        10,
        24,
        'Easy',
        'Dessert'
    ),
    (
        3,
        'Chicken Tikka Masala',
        'Creamy Indian curry with grilled chicken',
        30,
        40,
        6,
        'Medium',
        'Curry'
    ),
    (
        4,
        'Avocado Toast',
        'Healthy breakfast toast with avocado and spices',
        5,
        0,
        1,
        'Easy',
        'Breakfast'
    ),
    (
        1,
        'Beef Wellington',
        'Fancy beef dish wrapped in puff pastry',
        60,
        45,
        4,
        'Hard',
        'Meat'
    ),
    (
        2,
        'Croissants',
        'French buttery pastries',
        120,
        25,
        12,
        'Hard',
        'Pastry'
    ),
    (
        3,
        'Sushi Rolls',
        'Japanese rice and seafood rolls',
        40,
        0,
        4,
        'Medium',
        'Seafood'
    ),
    (
        4,
        'Quinoa Salad',
        'Healthy salad with quinoa and vegetables',
        20,
        15,
        4,
        'Easy',
        'Salad'
    );
-- Insert recipe ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient)
VALUES -- Spaghetti Carbonara ingredients
    (1, '400g spaghetti'),
    (1, '200g pancetta'),
    (1, '4 eggs'),
    (1, '100g Pecorino cheese'),
    (1, 'Black pepper'),
    (1, 'Salt'),
    -- Chocolate Chip Cookies ingredients
    (2, '2 1/4 cups flour'),
    (2, '1 tsp baking soda'),
    (2, '1 tsp salt'),
    (2, '1 cup butter'),
    (2, '3/4 cup sugar'),
    (2, '3/4 cup brown sugar'),
    (2, '2 eggs'),
    (2, '2 cups chocolate chips'),
    -- Chicken Tikka Masala ingredients
    (3, '500g chicken breast'),
    (3, '1 cup yogurt'),
    (3, '2 tbsp tikka masala paste'),
    (3, '1 onion'),
    (3, '2 cloves garlic'),
    (3, '1 cup cream'),
    (3, '1 can tomatoes'),
    -- Avocado Toast ingredients
    (4, '2 slices bread'),
    (4, '1 avocado'),
    (4, '1 tbsp lemon juice'),
    (4, 'Salt and pepper'),
    (4, 'Red pepper flakes (optional)'),
    -- Beef Wellington ingredients
    (5, '500g beef fillet'),
    (5, '200g mushrooms'),
    (5, '8 slices prosciutto'),
    (5, '500g puff pastry'),
    (5, '2 tbsp mustard'),
    (5, '1 egg (for egg wash)');
-- Insert recipe steps
INSERT INTO recipe_steps (recipe_id, step_number, instruction)
VALUES -- Spaghetti Carbonara steps
    (
        1,
        1,
        'Cook spaghetti in salted boiling water until al dente'
    ),
    (1, 2, 'Fry pancetta until crispy'),
    (1, 3, 'Beat eggs with grated Pecorino cheese'),
    (
        1,
        4,
        'Mix hot pasta with pancetta, then add egg mixture'
    ),
    (
        1,
        5,
        'Season with black pepper and serve immediately'
    ),
    -- Chocolate Chip Cookies steps
    (2, 1, 'Preheat oven to 375°F (190°C)'),
    (
        2,
        2,
        'Mix flour, baking soda, and salt in a bowl'
    ),
    (2, 3, 'Cream butter and sugars until fluffy'),
    (2, 4, 'Add eggs one at a time, then vanilla'),
    (2, 5, 'Gradually add flour mixture'),
    (2, 6, 'Stir in chocolate chips'),
    (
        2,
        7,
        'Drop spoonfuls onto baking sheet and bake for 9-11 minutes'
    ),
    -- Chicken Tikka Masala steps
    (
        3,
        1,
        'Marinate chicken in yogurt and spices for 1 hour'
    ),
    (3, 2, 'Grill or bake chicken until cooked'),
    (3, 3, 'Sauté onions and garlic until soft'),
    (
        3,
        4,
        'Add tikka masala paste and cook for 2 minutes'
    ),
    (3, 5, 'Add tomatoes and simmer for 15 minutes'),
    (
        3,
        6,
        'Add cream and cooked chicken, simmer for 10 minutes'
    ),
    (3, 7, 'Serve with rice or naan'),
    -- Avocado Toast steps
    (4, 1, 'Toast bread until golden brown'),
    (
        4,
        2,
        'Mash avocado with lemon juice, salt, and pepper'
    ),
    (4, 3, 'Spread avocado mixture on toast'),
    (
        4,
        4,
        'Sprinkle with red pepper flakes if desired'
    ),
    -- Beef Wellington steps (simplified)
    (5, 1, 'Sear beef fillet on all sides, then cool'),
    (
        5,
        2,
        'Finely chop mushrooms and sauté until dry'
    ),
    (
        5,
        3,
        'Spread mustard on beef, wrap in prosciutto'
    ),
    (5, 4, 'Spread mushroom mixture on prosciutto'),
    (5, 5, 'Wrap everything in puff pastry'),
    (
        5,
        6,
        'Brush with egg wash and bake at 400°F for 25-30 minutes'
    );
-- Insert cooking sessions (some completed, some active)
INSERT INTO cooking_sessions (
        recipe_id,
        user_id,
        status,
        started_at,
        completed_at,
        total_time
    )
VALUES (
        1,
        1,
        'completed',
        '2024-01-14 18:00:00',
        '2024-01-14 18:40:00',
        40
    ),
    (
        2,
        2,
        'completed',
        '2024-01-14 15:30:00',
        '2024-01-14 16:00:00',
        30
    ),
    (
        3,
        3,
        'completed',
        '2024-01-13 19:00:00',
        '2024-01-13 20:10:00',
        70
    ),
    (4, 4, 'active', '2024-01-15 08:30:00', NULL, 0),
    (2, 5, 'active', '2024-01-15 10:00:00', NULL, 0);
-- Display inserted data for verification
SELECT '=== USERS ===' as '';
SELECT id,
    username,
    email,
    password
FROM users;
SELECT '=== USER STATS ===' as '';
SELECT user_id,
    level,
    gold_count,
    gem_count
FROM user_stats;
SELECT '=== RECIPES ===' as '';
SELECT id,
    title,
    difficulty,
    prep_time,
    cook_time
FROM recipes;
SELECT '=== COOKING SESSIONS ===' as '';
SELECT id,
    recipe_id,
    user_id,
    status,
    total_time
FROM cooking_sessions;
SELECT '=== SAMPLE LOGIN INFO ===' as '';
SELECT 'Test with these credentials:' as note,
    'Username: chefjohn' as username1,
    'Password: password123' as password1,
    'Username: testuser' as username2,
    'Password: testpass' as password2;