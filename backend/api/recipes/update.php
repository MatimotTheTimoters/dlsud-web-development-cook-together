<?php
// backend/api/recipes/update.php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
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
    
    // Get recipe ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $recipeId = end($url_parts);
    
    if (empty($recipeId)) {
        $responseFormatter->error("Recipe ID is required", 400);
        exit;
    }
    
    // Check recipe ownership
    $checkSql = "SELECT user_id FROM recipes WHERE id = :id";
    $recipe = Database::fetchOne($checkSql, ['id' => $recipeId]);
    
    if (!$recipe) {
        $responseFormatter->notFound("Recipe not found");
        exit;
    }
    
    if ($recipe['user_id'] !== $userId) {
        $responseFormatter->unauthorized("You don't have permission to update this recipe");
        exit;
    }
    
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }
    
    // Get and validate input data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $responseFormatter->error("Invalid JSON data", 400);
        exit;
    }
    
    // Sanitize input
    $data = Validation::sanitizeInput($data);
    
    // Prepare update data
    $updateData = [];
    $allowedFields = [
        'title', 'description', 'origin', 'preparation_time', 
        'cooking_time', 'serving_size', 'difficulty', 
        'is_paid', 'is_public', 'cover_image'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateData[$field] = $data[$field];
        }
    }
    
    // Start transaction
    Database::query("START TRANSACTION");
    
    try {
        // Update recipe
        if (!empty($updateData)) {
            $updateData['updated_at'] = date('Y-m-d H:i:s');
            $where = "id = :id";
            $updateData['id'] = $recipeId;
            
            Database::update('recipes', $updateData, $where);
        }
        
        // Update metadata if provided
        if (!empty($data['metadata'])) {
            $metadataUpdate = [];
            $metadataFields = [
                'tags', 'exp_reward', 'gold_reward', 'gem_reward',
                'gold_price', 'gem_price', 'total_calories',
                'total_protein', 'total_carbs', 'total_fat'
            ];
            
            foreach ($metadataFields as $field) {
                if (isset($data['metadata'][$field])) {
                    $metadataUpdate[$field] = $data['metadata'][$field];
                }
            }
            
            if (!empty($metadataUpdate)) {
                $metadataWhere = "recipe_id = :recipe_id";
                $metadataUpdate['recipe_id'] = $recipeId;
                
                Database::update('recipe_metadata', $metadataUpdate, $metadataWhere);
            }
        }
        
        // Handle ingredients update (replace all)
        if (isset($data['ingredients']) && is_array($data['ingredients'])) {
            // Delete existing ingredients
            Database::delete('recipe_ingredients', "recipe_id = :recipe_id", ['recipe_id' => $recipeId]);
            
            // Insert new ingredients
            require_once __DIR__ . '/../../utils/uuidHelper.php';
            
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
        
        // Handle steps update (replace all)
        if (isset($data['steps']) && is_array($data['steps'])) {
            // Delete existing steps
            Database::delete('recipe_steps', "recipe_id = :recipe_id", ['recipe_id' => $recipeId]);
            
            // Insert new steps
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
        
        // Get updated recipe
        $recipeSql = "SELECT * FROM recipes WHERE id = :id";
        $updatedRecipe = Database::fetchOne($recipeSql, ['id' => $recipeId]);
        
        $responseFormatter->success([
            'recipe' => $updatedRecipe,
            'message' => 'Recipe updated successfully'
        ], "Recipe updated successfully", 200);
        
    } catch (Exception $e) {
        // Rollback on error
        Database::query("ROLLBACK");
        throw $e;
    }
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to update recipe: " . $e->getMessage(), 500);
}