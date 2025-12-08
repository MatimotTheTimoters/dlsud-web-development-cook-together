<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../utils/uuidHelper.php';

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
    if (empty($data['recipe_id'])) {
        $responseFormatter->error("Recipe ID is required", 400);
        exit;
    }
    
    // Get recipe details to determine total steps
    $recipeSql = "SELECT 
                    r.*,
                    COUNT(rs.id) as total_steps,
                    (r.preparation_time + r.cooking_time) * 60 as total_duration_seconds
                FROM recipes r
                LEFT JOIN recipe_steps rs ON r.id = rs.recipe_id
                WHERE r.id = :recipe_id
                GROUP BY r.id";
    
    $recipe = Database::fetchOne($recipeSql, ['recipe_id' => $data['recipe_id']]);
    
    if (!$recipe) {
        $responseFormatter->notFound("Recipe not found");
        exit;
    }
    
    // Check if recipe is paid and user has purchased it
    if ($recipe['is_paid']) {
        $purchaseSql = "SELECT id FROM recipe_interactions 
                       WHERE user_id = :user_id 
                       AND recipe_id = :recipe_id 
                       AND interaction_type = 'purchase'";
        
        $purchase = Database::fetchOne($purchaseSql, [
            'user_id' => $userId,
            'recipe_id' => $data['recipe_id']
        ]);
        
        if (!$purchase) {
            $responseFormatter->error("You need to purchase this recipe before cooking", 403);
            exit;
        }
    }
    
    // Prepare session data
    $sessionData = [
        'recipe_id' => $data['recipe_id'],
        'host_id' => $userId,
        'mode' => $data['mode'] ?? 'solo',
        'visibility' => $data['visibility'] ?? 'private',
        'status' => 'planned',
        'notes' => $data['notes'] ?? null,
        'total_steps' => $recipe['total_steps'] ?? 0,
        'total_duration' => $recipe['total_duration_seconds'] ?? 0
    ];
    
    $dbHelper = new DatabaseHelper();
    
    // Create cooking session
    $sessionId = $dbHelper->createCookingSession($sessionData);
    
    if (!$sessionId) {
        throw new Exception("Failed to create cooking session");
    }
    
    // Get the created session
    $createdSession = $dbHelper->getCookingSession($sessionId);
    
    if (!$createdSession) {
        throw new Exception("Failed to retrieve created session");
    }
    
    // Update user stats
    $dbHelper->incrementUserStat($userId, 'recipes_cooked', 1);
    
    $responseData = [
        'session' => $createdSession['session'],
        'session_id' => $sessionId,
        'message' => 'Cooking session created successfully'
    ];
    
    $responseFormatter->success($responseData, "Cooking session created successfully", 201);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to create cooking session: " . $e->getMessage(), 500);
}