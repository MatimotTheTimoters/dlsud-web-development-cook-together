<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../utils/uuidHelper.php';

header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error('Method not allowed', 405);
    exit;
}

try {
    // Get authorization token
    $authHelper = new AuthHelper();
    $token = $authHelper->getBearerToken();
    
    if (!$token) {
        ResponseFormatter::unauthorized('No authentication token provided');
        exit;
    }
    
    // Validate token
    $tokenData = $authHelper->validateToken($token);
    if (!$tokenData) {
        ResponseFormatter::unauthorized('Invalid or expired token');
        exit;
    }
    
    $user_id = $tokenData['user_id'];
    
    // Get and validate input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['recipe_id'])) {
        ResponseFormatter::error('Recipe ID is required', 400);
        exit;
    }
    
    // Check if user has access to recipe
    $dbHelper = new DatabaseHelper();
    
    // Check recipe access
    $recipe = $dbHelper->getRecipe($input['recipe_id'], $user_id);
    if (!$recipe) {
        ResponseFormatter::error('Recipe not found or access denied', 404);
        exit;
    }
    
    // Prepare session data
    $sessionData = [
        'recipe_id' => $input['recipe_id'],
        'host_id' => $user_id,
        'mode' => $input['mode'] ?? 'solo',
        'visibility' => $input['visibility'] ?? 'private',
        'status' => 'planned',
        'notes' => $input['notes'] ?? null
    ];
    
    // Create cooking session
    $session_id = $dbHelper->createCookingSession($sessionData);
    
    if (!$session_id) {
        ResponseFormatter::error('Failed to create cooking session', 500);
        exit;
    }
    
    // Get the created session
    $session = $dbHelper->getCookingSession($session_id);
    
    ResponseFormatter::success([
        'session' => $session,
        'message' => 'Cooking session created successfully'
    ], 'Session created', 201);
    
} catch (Exception $e) {
    error_log('Error creating cooking session: ' . $e->getMessage());
    ResponseFormatter::error('Server error: ' . $e->getMessage(), 500);
}
?>