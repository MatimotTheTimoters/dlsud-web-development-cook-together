<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Set CORS headers
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/cors.php';

$responseFormatter = new ResponseFormatter();

try {
    // Get recipe ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $recipe_id = end($url_parts);
    
    if (empty($recipe_id)) {
        $responseFormatter->error("Recipe ID is required", 400);
        exit;
    }
    
    // Get recipe basic info
    $sql = "SELECT 
                r.id, r.created_at, r.updated_at, r.cover_image, 
                r.title, r.description, r.origin, 
                r.preparation_time, r.cooking_time, r.serving_size, 
                r.difficulty, r.is_paid, r.is_public, r.user_id,
                u.full_name as author_name, u.profile_picture as author_picture,
                rm.tags, rm.like_count, rm.dislike_count, rm.cook_count,
                rm.exp_reward, rm.gold_reward, rm.gem_reward,
                rm.gold_price, rm.gem_price, rm.purchase_count,
                rm.total_calories, rm.total_protein, rm.total_carbs, rm.total_fat
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id
            WHERE r.id = :id";
    
    $recipe = Database::fetchOne($sql, ['id' => $recipe_id]);
    
    if (!$recipe) {
        $responseFormatter->notFound("Recipe not found");
        exit;
    }
    
    // Get ingredients
    $ingredientsSql = "SELECT 
                        id, name, amount, unit, notes, order_index,
                        calories_per_unit, protein_per_unit, 
                        carbs_per_unit, fat_per_unit
                    FROM recipe_ingredients 
                    WHERE recipe_id = :recipe_id 
                    ORDER BY order_index ASC";
    
    $ingredients = Database::fetchAll($ingredientsSql, ['recipe_id' => $recipe_id]);
    
    // Get steps
    $stepsSql = "SELECT 
                    id, description, image, 
                    read_timer_duration, timer_duration, timer_unit,
                    exp_reward, gold_reward, gem_reward, order_index
                FROM recipe_steps 
                WHERE recipe_id = :recipe_id 
                ORDER BY order_index ASC";
    
    $steps = Database::fetchAll($stepsSql, ['recipe_id' => $recipe_id]);
    
    // Get user interaction status (if authenticated)
    $userInteraction = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
        require_once __DIR__ . '/../../classes/AuthHelper.php';
        
        $authHelper = new AuthHelper();
        $decoded = $authHelper->validateToken($token);
        
        if ($decoded) {
            $userId = $decoded['user_id'];
            
            $interactionSql = "SELECT interaction_type 
                              FROM recipe_interactions 
                              WHERE user_id = :user_id AND recipe_id = :recipe_id";
            $userInteractions = Database::fetchAll($interactionSql, [
                'user_id' => $userId,
                'recipe_id' => $recipe_id
            ]);
            
            $userInteraction = [];
            foreach ($userInteractions as $interaction) {
                $userInteraction[$interaction['interaction_type']] = true;
            }
        }
    }
    
    // Format response
    $responseData = [
        'recipe' => $recipe,
        'ingredients' => $ingredients,
        'steps' => $steps,
        'user_interaction' => $userInteraction
    ];
    
    $responseFormatter->success($responseData, "Recipe retrieved successfully", 200);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to retrieve recipe: " . $e->getMessage(), 500);
}