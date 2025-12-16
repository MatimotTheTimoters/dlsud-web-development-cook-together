-- Insert sample users (same as before)
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
-- Insert user stats (same as before)
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
-- Insert user achievements (same as before)
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
-- Insert sample recipes WITH PRICE AND CURRENCY FIELDS
INSERT INTO recipes (
        user_id,
        title,
        description,
        prep_time,
        cook_time,
        servings,
        difficulty,
        category,
        price,
        currency
    )
VALUES (
        1,
        'Classic Spaghetti Carbonara',
        'Creamy Italian pasta with eggs, cheese, and pancetta',
        15,
        20,
        4,
        'Easy',
        'Pasta',
        50.00,
        'USD'
    ),
    (
        2,
        'Chocolate Chip Cookies',
        'Soft and chewy cookies with chocolate chips',
        15,
        10,
        24,
        'Easy',
        'Dessert',
        25.00,
        'USD'
    ),
    (
        3,
        'Chicken Tikka Masala',
        'Creamy Indian curry with grilled chicken',
        30,
        40,
        6,
        'Medium',
        'Curry',
        75.00,
        'USD'
    ),
    (
        4,
        'Avocado Toast',
        'Healthy breakfast toast with avocado and spices',
        5,
        0,
        1,
        'Easy',
        'Breakfast',
        10.00,
        'USD'
    ),
    (
        1,
        'Beef Wellington',
        'Fancy beef dish wrapped in puff pastry',
        60,
        45,
        4,
        'Hard',
        'Meat',
        150.00,
        'USD'
    ),
    (
        2,
        'Croissants',
        'French buttery pastries',
        120,
        25,
        12,
        'Hard',
        'Pastry',
        100.00,
        'EUR'
    ),
    (
        3,
        'Sushi Rolls',
        'Japanese rice and seafood rolls',
        40,
        0,
        4,
        'Medium',
        'Seafood',
        80.00,
        'USD'
    ),
    (
        4,
        'Quinoa Salad',
        'Healthy salad with quinoa and vegetables',
        20,
        15,
        4,
        'Easy',
        'Salad',
        30.00,
        'USD'
    );
-- Insert recipe ingredients (same as before)
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
-- Insert recipe steps (same as before)
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
-- Insert cooking sessions with new schema fields
INSERT INTO cooking_sessions (
        recipe_id,
        user_id,
        session_type,
        session_status,
        max_players,
        session_code,
        created_at
    )
VALUES -- Multiplayer sessions (waiting for players)
    (
        1,
        -- Spaghetti Carbonara
        1,
        -- chefjohn
        'multiplayer',
        'waiting',
        6,
        'ABC123',
        '2024-01-15 18:00:00'
    ),
    (
        2,
        -- Chocolate Chip Cookies
        2,
        -- bakermary
        'multiplayer',
        'waiting',
        4,
        'XYZ789',
        '2024-01-15 15:30:00'
    ),
    -- Active multiplayer session
    (
        3,
        -- Chicken Tikka Masala
        3,
        -- cookmax
        'multiplayer',
        'active',
        6,
        'DEF456',
        '2024-01-15 14:00:00'
    ),
    -- Completed session
    (
        4,
        -- Avocado Toast
        4,
        -- recipeamy
        'solo',
        'completed',
        1,
        NULL,
        '2024-01-15 08:30:00'
    ),
    -- Another waiting session
    (
        2,
        -- Chocolate Chip Cookies
        5,
        -- testuser
        'multiplayer',
        'waiting',
        6,
        'GHI789',
        '2024-01-15 10:00:00'
    );
-- Insert session participants for the first multiplayer session
INSERT INTO session_participants (session_id, user_id, ready_status)
VALUES (1, 1, 'ready'),
    -- chefjohn (host) is ready
    (1, 2, 'ready'),
    -- bakermary is ready
    (1, 3, 'not_ready');
-- cookmax is not ready
-- Insert participants for the second multiplayer session
INSERT INTO session_participants (session_id, user_id, ready_status)
VALUES (2, 2, 'ready'),
    -- bakermary (host) is ready
    (2, 4, 'ready');
-- recipeamy is ready
-- Insert sample likes for recipes
INSERT INTO recipe_likes (recipe_id, user_id)
VALUES (1, 2),
    -- bakermary likes Spaghetti Carbonara
    (1, 3),
    -- cookmax likes Spaghetti Carbonara
    (1, 4),
    -- recipeamy likes Spaghetti Carbonara
    (2, 1),
    -- chefjohn likes Chocolate Chip Cookies
    (2, 3),
    -- cookmax likes Chocolate Chip Cookies
    (3, 1),
    -- chefjohn likes Chicken Tikka Masala
    (3, 2),
    -- bakermary likes Chicken Tikka Masala
    (4, 5),
    -- testuser likes Avocado Toast
    (5, 3),
    -- cookmax likes Beef Wellington
    (6, 4),
    -- recipeamy likes Croissants
    (7, 1),
    -- chefjohn likes Sushi Rolls
    (8, 2);
-- bakermary likes Quinoa Salad
-- Insert saved recipes to cookbooks
INSERT INTO cookbooks (user_id, recipe_id, notes)
VALUES (1, 2, 'Great cookie recipe!'),
    (1, 3, 'Want to try this curry'),
    (2, 1, 'Love this pasta recipe'),
    (3, 2, 'Perfect for parties'),
    (4, 5, 'Special occasion dish'),
    (5, 4, 'My go-to breakfast');
-- Insert recipe purchases
INSERT INTO recipe_purchases (user_id, recipe_id, price_gold)
VALUES (2, 1, 50),
    -- bakermary purchased Spaghetti Carbonara
    (3, 2, 25),
    -- cookmax purchased Chocolate Chip Cookies
    (5, 4, 10);
-- testuser purchased Avocado Toast
-- Insert shop items
INSERT INTO shop_items (
        name,
        description,
        category,
        price_gold,
        icon,
        effect_description
    )
VALUES (
        'Golden Whisk',
        'A shiny golden whisk for professional cooking',
        'tool',
        200,
        'kitchen',
        '+10% cooking speed'
    ),
    (
        'Chef Hat',
        'A stylish chef hat to show off your skills',
        'icon',
        50,
        'account_circle',
        'Special chef avatar'
    ),
    (
        'Kitchen Theme',
        'Beautiful kitchen background theme',
        'theme',
        100,
        'palette',
        'Custom kitchen background'
    ),
    (
        'Recipe Book',
        'Extra recipe slots for your cookbook',
        'tool',
        150,
        'menu_book',
        '+5 recipe storage'
    ),
    (
        'Magic Spoon',
        'Magical spoon that helps with mixing',
        'tool',
        300,
        'restaurant',
        'Auto-stir feature'
    ),
    (
        'Golden Apron',
        'Premium cooking apron with gold accents',
        'icon',
        75,
        'checkroom',
        'Exclusive apron skin'
    ),
    (
        'Festive Theme',
        'Holiday kitchen decorations',
        'theme',
        120,
        'celebration',
        'Festive kitchen atmosphere'
    );
-- Insert user inventory items
INSERT INTO user_inventory (user_id, item_id, is_equipped)
VALUES (1, 1, TRUE),
    -- chefjohn has Golden Whisk equipped
    (1, 2, TRUE),
    -- chefjohn has Chef Hat equipped
    (2, 3, FALSE),
    -- bakermary has Kitchen Theme
    (3, 4, TRUE),
    -- cookmax has Recipe Book equipped
    (4, 5, FALSE);
-- recipeamy has Magic Spoon
-- Display inserted data for verification
SELECT '=== USERS (5 total) ===' as info;
SELECT id,
    username,
    email,
    full_name
FROM users;
SELECT '=== USER STATS ===' as info;
SELECT user_id,
    level,
    gold_count,
    gem_count,
    recipes_cooked
FROM user_stats;
SELECT '=== RECIPES WITH PRICES (8 total) ===' as info;
SELECT id,
    title,
    difficulty,
    prep_time,
    cook_time,
    CONCAT(price, ' ', currency) as price,
    category
FROM recipes;
SELECT '=== RECIPE LIKES ===' as info;
SELECT r.title as recipe,
    COUNT(rl.id) as like_count,
    GROUP_CONCAT(u.username) as liked_by
FROM recipes r
    LEFT JOIN recipe_likes rl ON r.id = rl.recipe_id
    LEFT JOIN users u ON rl.user_id = u.id
GROUP BY r.id
ORDER BY like_count DESC;
SELECT '=== RECIPE PURCHASES ===' as info;
SELECT u.username,
    r.title,
    rp.price_gold,
    rp.purchased_at
FROM recipe_purchases rp
    JOIN users u ON rp.user_id = u.id
    JOIN recipes r ON rp.recipe_id = r.id
ORDER BY rp.purchased_at DESC;
SELECT '=== COOKING SESSIONS (5 total) ===' as info;
SELECT id,
    recipe_id,
    user_id,
    session_type,
    session_status,
    session_code,
    created_at
FROM cooking_sessions
ORDER BY created_at DESC;
SELECT '=== SESSION PARTICIPANTS ===' as info;
SELECT sp.session_id,
    u.username,
    sp.ready_status,
    sp.joined_at
FROM session_participants sp
    JOIN users u ON sp.user_id = u.id
ORDER BY sp.session_id,
    sp.joined_at;
SELECT '=== COOKBOOK SAVED RECIPES ===' as info;
SELECT u.username,
    r.title,
    cb.notes,
    cb.saved_at
FROM cookbooks cb
    JOIN users u ON cb.user_id = u.id
    JOIN recipes r ON cb.recipe_id = r.id
ORDER BY cb.saved_at DESC;
SELECT '=== SHOP ITEMS ===' as info;
SELECT name,
    category,
    price_gold,
    effect_description
FROM shop_items
ORDER BY category,
    price_gold;
SELECT '=== USER INVENTORY ===' as info;
SELECT u.username,
    si.name,
    si.category,
    ui.is_equipped
FROM user_inventory ui
    JOIN users u ON ui.user_id = u.id
    JOIN shop_items si ON ui.item_id = si.id
ORDER BY u.username,
    si.category;
SELECT '=== TEST CREDENTIALS ===' as info;
SELECT 'Username: chefjohn' as account,
    'Password: password123' as password
UNION ALL
SELECT 'Username: bakermary' as account,
    'Password: marypass456' as password
UNION ALL
SELECT 'Username: testuser' as account,
    'Password: testpass' as password;
SELECT '=== PURCHASE TESTING ===' as info;
SELECT 'testuser (id:5) has NOT purchased recipe id:1 (can buy)' as note,
    'Price: 50 gold' as price
UNION ALL
SELECT 'bakermary (id:2) HAS purchased recipe id:1 (cannot buy again)' as note,
    'Already purchased' as price;
SELECT '=== ACTIVE MULTIPLAYER SESSIONS (for testing Feature 8) ===' as info;
SELECT cs.id as session_id,
    cs.session_code,
    r.title as recipe_name,
    u.username as host_name,
    cs.session_status,
    cs.max_players,
    COUNT(sp.id) as current_players
FROM cooking_sessions cs
    JOIN recipes r ON cs.recipe_id = r.id
    JOIN users u ON cs.user_id = u.id
    LEFT JOIN session_participants sp ON cs.id = sp.session_id
WHERE cs.session_type = 'multiplayer'
    AND cs.session_status = 'waiting'
GROUP BY cs.id
ORDER BY cs.created_at DESC;