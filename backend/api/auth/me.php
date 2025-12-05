<?php

// Set CORS headers and handle preflight
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ResponseFormatter::handlePreflight();
    exit;
}

// Set CORS headers for actual request
ResponseFormatter::setCorsHeaders();

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ResponseFormatter::error('Method not allowed', 405);
}

// Include required classes
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

try {
    // Get token from Authorization header
    $token = AuthHelper::getBearerToken();
    
    if (!$token) {
        ResponseFormatter::unauthorized('No authentication token provided');
    }
    
    // Validate token
    $payload = AuthHelper::validateToken($token);
    
    if (!$payload) {
        ResponseFormatter::unauthorized('Invalid or expired token');
    }
    
    $user_id = $payload['user_id'];
    
    // Get user data
    $user = DatabaseHelper::getUserById($user_id);
    
    if (!$user) {
        ResponseFormatter::notFound('User not found');
    }
    
    // Get user stats
    $stats = DatabaseHelper::getUserStats($user_id);
    
    // Prepare response data
    $response_data = [
        'user' => [
            'id' => $user['id'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'profile_picture' => $user['profile_picture'],
            'age' => $user['age'],
            'gender' => $user['gender'],
            'created_at' => $user['created_at'],
            'updated_at' => $user['updated_at']
        ],
        'stats' => $stats ?: [
            'level' => 1,
            'current_exp' => 0,
            'current_level_ceiling' => 100,
            'gold_count' => 0,
            'gem_count' => 0,
            'login_streak' => 0
        ]
    ];
    
    // Return success response
    ResponseFormatter::success($response_data, 'User profile retrieved');
    
} catch (Exception $e) {
    error_log('Get profile error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred while fetching profile', 500);
}