<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ResponseFormatter::success(null, "Preflight request successful", 200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error("Method not allowed", 405);
    exit;
}

try {
    // Get authorization header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    // Extract token
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        ResponseFormatter::unauthorized("No authentication token provided");
        exit;
    }
    
    $token = $matches[1];
    
    // Validate token
    $tokenData = AuthHelper::validateToken($token);
    
    if (!$tokenData) {
        ResponseFormatter::unauthorized("Invalid or expired token");
        exit;
    }
    
    $user_id = $tokenData['user_id'];
    
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        ResponseFormatter::error("Invalid JSON input", 400);
        exit;
    }
    
    // Validate required fields
    $required = ['title', 'description', 'total_cook_quota', 'start_date', 'end_date'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            ResponseFormatter::error("Missing required field: $field", 400);
            exit;
        }
    }
    
    // Prepare challenge data
    $challenge_data = [
        'id' => $input['challenge_id'] ?? uniqid('challenge_', true),
        'title' => $input['title'],
        'description' => $input['description'],
        'cover_image' => $input['cover_image'] ?? null,
        'tags' => is_array($input['tags']) ? implode(',', $input['tags']) : $input['tags'] ?? '',
        'total_cook_quota' => (int)$input['total_cook_quota'],
        'current_cook_count' => 0,
        'start_date' => $input['start_date'],
        'end_date' => $input['end_date'],
        'exp_reward' => (int)($input['exp_reward'] ?? 0),
        'gold_reward' => (int)($input['gold_reward'] ?? 0),
        'gem_reward' => (int)($input['gem_reward'] ?? 0),
        'author_id' => $user_id,
        'status' => $input['status'] ?? 'active',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    // TODO: Insert into database 
    
    ResponseFormatter::success([
        'challenge' => $challenge_data
    ], "Challenge created successfully");
    
} catch (Exception $e) {
    error_log("Create challenge endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error: " . $e->getMessage(), 500);
}