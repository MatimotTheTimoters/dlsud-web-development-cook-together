<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';

// Set CORS headers
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/cors.php';

$responseFormatter = new ResponseFormatter();
$dbHelper = new DatabaseHelper();

try {
    // Get recipe ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $recipeId = end($url_parts);

    if (empty($recipeId)) {
        $responseFormatter->error("Recipe ID is required", 400);
        exit;
    }

    // Get user ID if authenticated
    $userId = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        if (str_starts_with($authHeader, 'Bearer ')) {
            $token = str_replace('Bearer ', '', $authHeader);
            $authHelper = new AuthHelper();
            $decoded = $authHelper->validateToken($token);
            if ($decoded) {
                $userId = $decoded['user_id'];
            }
        }
    }

    // Get recipe using DatabaseHelper
    $recipe = $dbHelper->getRecipe($recipeId, $userId);

    if (!$recipe) {
        $responseFormatter->notFound("Recipe not found");
        exit;
    }

    // Check if user has access to paid recipe
    if ($recipe['is_paid'] && $recipe['user_id'] !== $userId) {
        // Check if user has purchased this recipe
        $accessSql = "SELECT id FROM user_recipe_purchases 
                     WHERE user_id = :user_id AND recipe_id = :recipe_id";
        $hasAccess = Database::fetchOne($accessSql, [
            'user_id' => $userId,
            'recipe_id' => $recipeId
        ]);

        if (!$hasAccess) {
            $responseFormatter->forbidden("You need to purchase this recipe to view it");
            exit;
        }
    }

    $responseFormatter->success($recipe, "Recipe retrieved successfully", 200);
} catch (Exception $e) {
    $responseFormatter->error("Failed to retrieve recipe: " . $e->getMessage(), 500);
}
