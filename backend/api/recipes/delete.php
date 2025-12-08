<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

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
        $responseFormatter->unauthorized("You don't have permission to delete this recipe");
        exit;
    }
    
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }
    
    // Start transaction
    Database::query("START TRANSACTION");
    
    try {
        // Delete recipe and related data (cascade should handle most)
        // Delete from cookbooks first (foreign key constraint)
        Database::delete('cookbook_recipes', "recipe_id = :recipe_id", ['recipe_id' => $recipeId]);
        
        // Delete interactions
        Database::delete('recipe_interactions', "recipe_id = :recipe_id", ['recipe_id' => $recipeId]);
        
        // Delete the recipe (cascade will delete ingredients, steps, metadata)
        $deleted = Database::delete('recipes', "id = :id", ['id' => $recipeId]);
        
        if ($deleted === false) {
            throw new Exception("Failed to delete recipe");
        }
        
        // Update user stats (decrement recipes created)
        $dbHelper = new DatabaseHelper();
        $dbHelper->incrementUserStat($userId, 'recipes_created', -1);
        
        // Commit transaction
        Database::query("COMMIT");
        
        $responseFormatter->success([
            'recipe_id' => $recipeId,
            'message' => 'Recipe deleted successfully'
        ], "Recipe deleted successfully", 200);
        
    } catch (Exception $e) {
        // Rollback on error
        Database::query("ROLLBACK");
        throw $e;
    }
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to delete recipe: " . $e->getMessage(), 500);
}