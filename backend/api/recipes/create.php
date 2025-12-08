<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../utils/uuidHelper.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/fileUpload.php';

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

    // Handle multipart form data
    if (!empty($_FILES['cover_image'])) {
        // Handle cover image upload
        $uploadResult = FileUpload::uploadImage($_FILES['cover_image'], 'recipe', $userId);

        if ($uploadResult) {
            $coverImagePath = $uploadResult['relative_path'];
        } else {
            $coverImagePath = null;
        }
    } else {
        $coverImagePath = null;
    }

    // Get form data
    $data = [];

    // Get text fields from POST
    $textFields = [
        'title',
        'description',
        'origin',
        'difficulty',
        'is_paid',
        'is_public',
        'preparation_time',
        'cooking_time',
        'serving_size',
        'exp_reward',
        'gold_reward',
        'gem_reward',
        'gold_price',
        'gem_price',
        'total_calories',
        'total_protein',
        'total_carbs',
        'total_fat',
        'tags'
    ];

    foreach ($textFields as $field) {
        if (isset($_POST[$field])) {
            $data[$field] = $_POST[$field];
        }
    }

    // Parse JSON arrays if they were sent as form fields
    if (isset($_POST['ingredients'])) {
        $data['ingredients'] = json_decode($_POST['ingredients'], true);
    }

    if (isset($_POST['steps'])) {
        $data['steps'] = json_decode($_POST['steps'], true);
    }

    // If no POST data, try JSON input (for backward compatibility)
    if (empty($data) && empty($_FILES)) {
        $data = json_decode(file_get_contents('php://input'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $responseFormatter->error("Invalid JSON data", 400);
            exit;
        }
    }

    // Validate required fields
    $requiredFields = ['title', 'description', 'difficulty'];
    $validationErrors = [];

    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            $validationErrors[$field] = "This field is required";
        }
    }

    if (!empty($validationErrors)) {
        $responseFormatter->validationError($validationErrors);
        exit;
    }

    // Sanitize input
    $data = Validation::sanitizeInput($data);

    // Generate recipe ID
    $recipeId = UUIDHelper::generateUniqueId('recipes', 'id');

    // Prepare recipe data
    $recipeData = [
        'id' => $recipeId,
        'title' => $data['title'],
        'description' => $data['description'] ?? '',
        'origin' => $data['origin'] ?? '',
        'preparation_time' => isset($data['preparation_time']) ? (int)$data['preparation_time'] : null,
        'cooking_time' => isset($data['cooking_time']) ? (int)$data['cooking_time'] : null,
        'serving_size' => isset($data['serving_size']) ? (int)$data['serving_size'] : null,
        'difficulty' => $data['difficulty'],
        'is_paid' => isset($data['is_paid']) ? (bool)$data['is_paid'] : false,
        'is_public' => isset($data['is_public']) ? (bool)$data['is_public'] : true,
        'user_id' => $userId,
        'cover_image' => $coverImagePath
    ];

    // Start transaction
    Database::query("START TRANSACTION");

    try {
        // Insert recipe
        $recipeInserted = Database::insert('recipes', $recipeData);

        if (!$recipeInserted) {
            throw new Exception("Failed to create recipe");
        }

        // Create recipe metadata
        $metadataId = UUIDHelper::generateUniqueId('recipe_metadata', 'id');
        $metadataData = [
            'id' => $metadataId,
            'recipe_id' => $recipeId,
            'tags' => isset($data['tags']) ? $data['tags'] : null,
            'exp_reward' => isset($data['exp_reward']) ? (int)$data['exp_reward'] : 0,
            'gold_reward' => isset($data['gold_reward']) ? (int)$data['gold_reward'] : 0,
            'gem_reward' => isset($data['gem_reward']) ? (int)$data['gem_reward'] : 0,
            'gold_price' => isset($data['gold_price']) ? (int)$data['gold_price'] : 0,
            'gem_price' => isset($data['gem_price']) ? (int)$data['gem_price'] : 0,
            'total_calories' => isset($data['total_calories']) ? (float)$data['total_calories'] : 0,
            'total_protein' => isset($data['total_protein']) ? (float)$data['total_protein'] : 0,
            'total_carbs' => isset($data['total_carbs']) ? (float)$data['total_carbs'] : 0,
            'total_fat' => isset($data['total_fat']) ? (float)$data['total_fat'] : 0
        ];

        Database::insert('recipe_metadata', $metadataData);

        // Insert ingredients
        if (!empty($data['ingredients']) && is_array($data['ingredients'])) {
            foreach ($data['ingredients'] as $index => $ingredient) {
                $ingredientId = UUIDHelper::generateUniqueId('recipe_ingredients', 'id');
                $ingredientData = [
                    'id' => $ingredientId,
                    'recipe_id' => $recipeId,
                    'name' => $ingredient['name'] ?? '',
                    'amount' => isset($ingredient['amount']) ? (float)$ingredient['amount'] : null,
                    'unit' => $ingredient['unit'] ?? '',
                    'notes' => $ingredient['notes'] ?? '',
                    'order_index' => isset($ingredient['order_index']) ? (int)$ingredient['order_index'] : $index,
                    'calories_per_unit' => isset($ingredient['calories_per_unit']) ? (float)$ingredient['calories_per_unit'] : 0,
                    'protein_per_unit' => isset($ingredient['protein_per_unit']) ? (float)$ingredient['protein_per_unit'] : 0,
                    'carbs_per_unit' => isset($ingredient['carbs_per_unit']) ? (float)$ingredient['carbs_per_unit'] : 0,
                    'fat_per_unit' => isset($ingredient['fat_per_unit']) ? (float)$ingredient['fat_per_unit'] : 0
                ];

                Database::insert('recipe_ingredients', $ingredientData);
            }
        }

        // Insert steps
        if (!empty($data['steps']) && is_array($data['steps'])) {
            foreach ($data['steps'] as $index => $step) {
                $stepId = UUIDHelper::generateUniqueId('recipe_steps', 'id');
                $stepData = [
                    'id' => $stepId,
                    'recipe_id' => $recipeId,
                    'description' => $step['description'] ?? '',
                    'image' => $step['image'] ?? null,
                    'read_timer_duration' => isset($step['read_timer_duration']) ? (int)$step['read_timer_duration'] : 10,
                    'timer_duration' => isset($step['timer_duration']) ? (int)$step['timer_duration'] : null,
                    'timer_unit' => $step['timer_unit'] ?? 'seconds',
                    'exp_reward' => isset($step['exp_reward']) ? (int)$step['exp_reward'] : 0,
                    'gold_reward' => isset($step['gold_reward']) ? (int)$step['gold_reward'] : 0,
                    'gem_reward' => isset($step['gem_reward']) ? (int)$step['gem_reward'] : 0,
                    'order_index' => isset($step['order_index']) ? (int)$step['order_index'] : $index
                ];

                // Handle step image upload if provided
                if (!empty($_FILES['step_images'][$index])) {
                    $stepUploadResult = FileUpload::uploadImage($_FILES['step_images'][$index], 'step', $userId);
                    if ($stepUploadResult) {
                        $stepData['image'] = $stepUploadResult['relative_path'];
                    }
                }

                Database::insert('recipe_steps', $stepData);
            }
        }

        // Commit transaction
        Database::query("COMMIT");

        // Update user stats (recipes created)
        $dbHelper = new DatabaseHelper();
        $dbHelper->incrementUserStat($userId, 'recipes_created', 1);

        // Get full recipe data to return
        $recipeSql = "SELECT r.*, rm.*, u.full_name as author_name 
                     FROM recipes r 
                     LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id 
                     LEFT JOIN users u ON r.user_id = u.id 
                     WHERE r.id = :id";
        $createdRecipe = Database::fetchOne($recipeSql, ['id' => $recipeId]);

        // Add full URL for cover image
        if (!empty($createdRecipe['cover_image'])) {
            $createdRecipe['cover_image_url'] = FileUpload::getFileUrl($createdRecipe['cover_image']);
        }

        $responseFormatter->success([
            'recipe' => $createdRecipe,
            'recipe_id' => $recipeId,
            'message' => 'Recipe created successfully'
        ], "Recipe created successfully", 201);
    } catch (Exception $e) {
        // Rollback on error
        Database::query("ROLLBACK");
        throw $e;
    }
} catch (Exception $e) {
    $responseFormatter->error("Failed to create recipe: " . $e->getMessage(), 500);
}