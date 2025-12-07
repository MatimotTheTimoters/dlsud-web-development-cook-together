<?php
// backend/api/recipes/create.php

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
    
    // Get and validate input data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $responseFormatter->error("Invalid JSON data", 400);
        exit;
    }
    
    // Validate required fields
    $requiredFields = ['title', 'description', 'difficulty'];
    $validationErrors = Validation::validateRequired($data, $requiredFields);
    
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
        'preparation_time' => $data['preparation_time'] ?? null,
        'cooking_time' => $data['cooking_time'] ?? null,
        'serving_size' => $data['serving_size'] ?? null,
        'difficulty' => $data['difficulty'],
        'is_paid' => $data['is_paid'] ?? false,
        'is_public' => $data['is_public'] ?? true,
        'user_id' => $userId,
        'cover_image' => $data['cover_image'] ?? null
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
            'tags' => isset($data['tags']) ? implode(',', $data['tags']) : null,
            'exp_reward' => $data['exp_reward'] ?? 0,
            'gold_reward' => $data['gold_reward'] ?? 0,
            'gem_reward' => $data['gem_reward'] ?? 0,
            'gold_price' => $data['gold_price'] ?? 0,
            'gem_price' => $data['gem_price'] ?? 0,
            'total_calories' => $data['total_calories'] ?? 0,
            'total_protein' => $data['total_protein'] ?? 0,
            'total_carbs' => $data['total_carbs'] ?? 0,
            'total_fat' => $data['total_fat'] ?? 0
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
                    'amount' => $ingredient['amount'] ?? null,
                    'unit' => $ingredient['unit'] ?? '',
                    'notes' => $ingredient['notes'] ?? '',
                    'order_index' => $ingredient['order_index'] ?? $index,
                    'calories_per_unit' => $ingredient['calories_per_unit'] ?? 0,
                    'protein_per_unit' => $ingredient['protein_per_unit'] ?? 0,
                    'carbs_per_unit' => $ingredient['carbs_per_unit'] ?? 0,
                    'fat_per_unit' => $ingredient['fat_per_unit'] ?? 0
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
                    'read_timer_duration' => $step['read_timer_duration'] ?? 10,
                    'timer_duration' => $step['timer_duration'] ?? null,
                    'timer_unit' => $step['timer_unit'] ?? 'seconds',
                    'exp_reward' => $step['exp_reward'] ?? 0,
                    'gold_reward' => $step['gold_reward'] ?? 0,
                    'gem_reward' => $step['gem_reward'] ?? 0,
                    'order_index' => $step['order_index'] ?? $index
                ];
                
                Database::insert('recipe_steps', $stepData);
            }
        }
        
        // Commit transaction
        Database::query("COMMIT");
        
        // Update user stats (recipes created)
        $dbHelper = new DatabaseHelper();
        $dbHelper->incrementUserStat($userId, 'recipes_created', 1);
        
        // Get full recipe data to return
        $recipeSql = "SELECT * FROM recipes WHERE id = :id";
        $createdRecipe = Database::fetchOne($recipeSql, ['id' => $recipeId]);
        
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