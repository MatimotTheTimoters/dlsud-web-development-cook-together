<?php

/**
 * GET /api/users/stats
 * Get detailed user statistics
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

    // Get user stats
    $stats = DatabaseHelper::getUserStats($target_user_id);

    if (!$stats) {
        ResponseFormatter::notFound("User statistics not found");
        exit;
    }

    // Get user data for calculations
    $user_data = DatabaseHelper::getUserById($target_user_id);

    if (!$user_data) {
        ResponseFormatter::notFound("User not found");
        exit;
    }

    // Calculate user limits
    $user_for_calc = array_merge($user_data, $stats);
    $user_limits = UserCalculations::calculateAllUserLimits($user_for_calc);

    // Calculate level progress
    $level_progress = UserCalculations::calculateLevelUpRequirements(
        $stats['level'],
        $stats['current_exp']
    );

    // Get level title from level_progress array
    $level_title = $level_progress['level_title'] ?? 'Novice Cook';

    // Calculate daily login bonus
    $daily_bonus = UserCalculations::calculateDailyLoginBonus($stats['login_streak']);

    // Prepare response data per api_contract.md
    $response_data = [
        'user_id' => $target_user_id,
        'level' => $stats['level'],
        'level_title' => $level_title,
        'current_exp' => $stats['current_exp'],
        'current_level_ceiling' => $stats['current_level_ceiling'],
        'gold_count' => $stats['gold_count'],
        'gem_count' => $stats['gem_count'],
        'login_streak' => $stats['login_streak'],
        'recipes_created' => $stats['recipes_created'],
        'recipes_cooked' => $stats['recipes_cooked'],
        'challenges_completed' => $stats['challenges_completed'],
        'recipes_sold' => $stats['recipes_sold'],
        'total_cooking_time' => $stats['total_cooking_time'] ?? 0,
        'max_exp_reward' => $user_limits['max_exp_reward'],
        'max_gold_reward' => $user_limits['max_gold_reward'],
        'max_gem_reward' => $user_limits['max_gem_reward'],
        'max_gold_price' => $user_limits['max_gold_price'],
        'max_gem_price' => $user_limits['max_gem_price'],
        'last_limit_update' => $stats['last_limit_update'] ?? date('Y-m-d H:i:s'),
        'level_progress' => $level_progress,
        'daily_bonus' => $daily_bonus
    ];

    // Return success response
    ResponseFormatter::success($response_data, "User statistics retrieved successfully");
} catch (Exception $e) {
    error_log("User stats endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error", 500);
}
