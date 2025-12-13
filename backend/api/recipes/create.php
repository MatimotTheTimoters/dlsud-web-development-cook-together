<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../classes/UserCalculations.php';
require_once __DIR__ . '/../../utils/uuidHelper.php';
require_once __DIR__ . '/../../utils/validation.php';

// Set CORS headers
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/cors.php';

$responseFormatter = new ResponseFormatter();
$authHelper = new AuthHelper();

try {
    // Check authentication
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        $responseFormatter->unauthorized("Authentication required");
        exit;
    }

    $token = str_replace('Bearer ', '', $authHeader);
    $decoded = $authHelper->validateToken($token);

    if (!$decoded) {
        $responseFormatter->unauthorized("Invalid or expired token");
        exit;
    }

    $userId = $decoded['user_id'];

    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }

    // Get and validate recipe data
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $responseFormatter->error("Invalid JSON data", 400);
        exit;
    }

    // Validate required fields
    $requiredFields = ['title', 'ingredients', 'steps'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $responseFormatter->error("$field is required", 400);
            exit;
        }
    }

    // Sanitize input
    $data = sanitizeInput($data);

    // Get user stats for reward calculations
    $userCalculations = new UserCalculations();
    $dbHelper = new DatabaseHelper();

    $userStats = $dbHelper->getUserStats($userId);
    if (!$userStats) {
        $responseFormatter->error("Failed to get user stats", 500);
        exit;
    }

    $userLimits = $userCalculations->calculateAllUserLimits($userStats);

    // Calculate recipe rewards
    $difficulty = $data['difficulty'] ?? 'medium';
    $recipeRewards = $userCalculations->calculateRecipeRewards($difficulty, $userLimits);

    // Start transaction
    Database::query("START TRANSACTION");

    try {
        // Generate recipe ID
        $recipeId = generateUniqueId('recipes', 'id');

        // Prepare recipe data
        $recipeData = [
            'id' => $recipeId,
            'user_id' => $userId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'origin' => $data['origin'] ?? null,
            'preparation_time' => isset($data['preparation_time']) ? (int)$data['preparation_time'] : null,
            'cooking_time' => isset($data['cooking_time']) ? (int)$data['cooking_time'] : null,
            'serving_size' => isset($data['serving_size']) ? (int)$data['serving_size'] : null,
            'difficulty' => $difficulty,
            'is_paid' => isset($data['is_paid']) ? (bool)$data['is_paid'] : false,
            'is_public' => isset($data['is_public']) ? (bool)$data['is_public'] : true,
            'cover_image' => $data['cover_image'] ?? null
        ];

        // Insert recipe
        Database::insert('recipes', $recipeData);

        // Insert recipe metadata with rewards
        $metadataId = generateUniqueId('recipe_metadata', 'id');
        $metadataData = [
            'id' => $metadataId,
            'recipe_id' => $recipeId,
            'tags' => isset($data['tags']) ? (is_array($data['tags']) ? implode(',', $data['tags']) : $data['tags']) : null,
            'exp_reward' => $recipeRewards['exp_reward'],
            'gold_reward' => $recipeRewards['gold_reward'],
            'gem_reward' => $recipeRewards['gem_reward'],
            'gold_price' => isset($data['gold_price']) ? (int)$data['gold_price'] : 0,
            'gem_price' => isset($data['gem_price']) ? (int)$data['gem_price'] : 0,
            'total_calories' => 0,
            'total_protein' => 0,
            'total_carbs' => 0,
            'total_fat' => 0
        ];

        Database::insert('recipe_metadata', $metadataData);

        // Insert ingredients
        $totalNutrition = ['calories' => 0, 'protein' => 0, 'carbs' => 0, 'fat' => 0];

        foreach ($data['ingredients'] as $index => $ingredient) {
            $ingredientId = generateUniqueId('recipe_ingredients', 'id');
            $ingredientData = [
                'id' => $ingredientId,
                'recipe_id' => $recipeId,
                'name' => $ingredient['name'],
                'amount' => isset($ingredient['amount']) ? (float)$ingredient['amount'] : null,
                'unit' => $ingredient['unit'] ?? null,
                'notes' => $ingredient['notes'] ?? null,
                'order_index' => isset($ingredient['order_index']) ? (int)$ingredient['order_index'] : $index,
                'calories_per_unit' => isset($ingredient['calories_per_unit']) ? (float)$ingredient['calories_per_unit'] : 0,
                'protein_per_unit' => isset($ingredient['protein_per_unit']) ? (float)$ingredient['protein_per_unit'] : 0,
                'carbs_per_unit' => isset($ingredient['carbs_per_unit']) ? (float)$ingredient['carbs_per_unit'] : 0,
                'fat_per_unit' => isset($ingredient['fat_per_unit']) ? (float)$ingredient['fat_per_unit'] : 0
            ];

            Database::insert('recipe_ingredients', $ingredientData);

            // Calculate nutrition totals
            if ($ingredientData['amount'] && $ingredientData['calories_per_unit']) {
                $totalNutrition['calories'] += $ingredientData['amount'] * $ingredientData['calories_per_unit'];
                $totalNutrition['protein'] += $ingredientData['amount'] * $ingredientData['protein_per_unit'];
                $totalNutrition['carbs'] += $ingredientData['amount'] * $ingredientData['carbs_per_unit'];
                $totalNutrition['fat'] += $ingredientData['amount'] * $ingredientData['fat_per_unit'];
            }
        }

        // Update metadata with nutrition totals
        Database::update('recipe_metadata', [
            'total_calories' => $totalNutrition['calories'],
            'total_protein' => $totalNutrition['protein'],
            'total_carbs' => $totalNutrition['carbs'],
            'total_fat' => $totalNutrition['fat']
        ], "recipe_id = :recipe_id", ['recipe_id' => $recipeId]);

        // Insert steps with rewards
        foreach ($data['steps'] as $index => $step) {
            $stepId = generateUniqueId('recipe_steps', 'id');

            // Calculate step rewards
            $stepRewards = $userCalculations->calculateStepRewards(
                $index,
                count($data['steps']),
                $recipeRewards
            );

            $stepData = [
                'id' => $stepId,
                'recipe_id' => $recipeId,
                'description' => $step['description'],
                'image' => $step['image'] ?? null,
                'read_timer_duration' => isset($step['read_timer_duration']) ? (int)$step['read_timer_duration'] : 10,
                'timer_duration' => isset($step['timer_duration']) ? (int)$step['timer_duration'] : null,
                'timer_unit' => $step['timer_unit'] ?? 'seconds',
                'exp_reward' => $stepRewards['exp_reward'],
                'gold_reward' => $stepRewards['gold_reward'],
                'gem_reward' => $stepRewards['gem_reward'],
                'order_index' => isset($step['order_index']) ? (int)$step['order_index'] : $index
            ];

            Database::insert('recipe_steps', $stepData);
        }

        // Update user stats (increment recipes created)
        $dbHelper->incrementUserStat($userId, 'recipes_created', 1);

        // Commit transaction
        Database::query("COMMIT");

        // Return success response with recipe data
        $responseData = [
            'recipe_id' => $recipeId,
            'rewards' => $recipeRewards,
            'message' => 'Recipe created successfully'
        ];

        $responseFormatter->created($responseData, "Recipe created successfully");
    } catch (Exception $e) {
        // Rollback on error
        Database::query("ROLLBACK");
        throw $e;
    }
} catch (Exception $e) {
    $responseFormatter->error("Failed to create recipe: " . $e->getMessage(), 500);
}
