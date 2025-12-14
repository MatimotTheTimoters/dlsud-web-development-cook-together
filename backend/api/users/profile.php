<?php


/**
 * GET /api/users/profile
 * Get user profile information
*/

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../classes/UserCalculations.php';

// Only GET method allowed
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
    
    $current_user_id = $tokenData['user_id'];
    
    // Get target user ID from query parameter
    $target_user_id = $_GET['user_id'] ?? $current_user_id;
    
    // Get user profile
    $user = DatabaseHelper::getUserById($target_user_id);
    
    if (!$user) {
        ResponseFormatter::notFound("User not found");
        exit;
    }
    
    // Get user stats
    $stats = DatabaseHelper::getUserStats($target_user_id);
    
    if (!$stats) {
        // Create default stats if not found
        $stats = [
            'level' => 1,
            'current_exp' => 0,
            'current_level_ceiling' => 100,
            'gold_count' => 0,
            'gem_count' => 0,
            'login_streak' => 0,
            'recipes_created' => 0,
            'recipes_cooked' => 0,
            'challenges_completed' => 0,
            'recipes_sold' => 0,
            'total_cooking_time' => 0
        ];
    }
    
    // Calculate level progress
    $level_progress = UserCalculations::calculateLevelUpRequirements(
        $stats['level'],
        $stats['current_exp']
    );
    
    // Get level title
    $level_title = UserCalculations::getLevelTitle($stats['level']);
    
    // Check if current user follows target user
    $is_following = false;
    $is_friend = false;
    
    if ($current_user_id !== $target_user_id) {
        $is_following = DatabaseHelper::isFollowing($current_user_id, $target_user_id);
    }
    
    // Prepare response data per api_contract.md
    $response_data = [
        'id' => $user['id'],
        'full_name' => $user['full_name'],
        'profile_picture' => $user['profile_picture'] ?? null,
        'age' => $user['age'] ?? null,
        'gender' => $user['gender'] ?? null,
        'email' => $user['email'],
        'created_at' => $user['created_at'] ?? date('Y-m-d H:i:s'),
        'updated_at' => $user['updated_at'] ?? date('Y-m-d H:i:s'),
        'stats' => [
            'level' => $stats['level'],
            'level_title' => $level_title,
            'current_exp' => $stats['current_exp'],
            'current_level_ceiling' => $stats['current_level_ceiling'] ?? 100,
            'gold_count' => $stats['gold_count'],
            'gem_count' => $stats['gem_count'],
            'login_streak' => $stats['login_streak'],
            'recipes_created' => $stats['recipes_created'],
            'recipes_cooked' => $stats['recipes_cooked'],
            'challenges_completed' => $stats['challenges_completed'],
            'recipes_sold' => $stats['recipes_sold'],
            'total_cooking_time' => $stats['total_cooking_time'] ?? 0
        ],
        'level_progress' => $level_progress,
        'is_following' => $is_following,
        'is_friend' => $is_friend
    ];
    
    // Return success response
    ResponseFormatter::success($response_data, "Profile retrieved successfully");
    
} catch (Exception $e) {
    error_log("Profile endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error", 500);
}
?>