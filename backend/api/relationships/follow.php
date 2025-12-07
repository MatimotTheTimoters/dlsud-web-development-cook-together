<?php

/**
 * POST /api/relationships/follow
 * Follow or unfollow a user
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error('Method not allowed', 405);
    exit();
}

// Get and validate JWT token
$headers = apache_request_headers();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

if (!$token) {
    ResponseFormatter::error('No authentication token provided', 401);
    exit();
}

$user_data = AuthHelper::validateToken($token);
if (!$user_data) {
    ResponseFormatter::error('Invalid or expired token', 401);
    exit();
}

$source_user_id = $user_data['user_id'];

// Get and validate request data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['target_user_id']) || !isset($input['action'])) {
    ResponseFormatter::error('Missing required fields: target_user_id and action are required', 400);
    exit();
}

$target_user_id = $input['target_user_id'];
$action = $input['action']; // 'follow' or 'unfollow'
$message = $input['message'] ?? null;

// Validate action
if (!in_array($action, ['follow', 'unfollow'])) {
    ResponseFormatter::error('Invalid action. Must be "follow" or "unfollow"', 400);
    exit();
}

// Check if target user exists
$target_user = DatabaseHelper::getUserById($target_user_id);
if (!$target_user) {
    ResponseFormatter::error('Target user not found', 404);
    exit();
}

// Prevent following oneself
if ($source_user_id === $target_user_id) {
    ResponseFormatter::error('Cannot follow/unfollow yourself', 400);
    exit();
}

try {
    if ($action === 'follow') {
        // Follow user
        $success = DatabaseHelper::followUser($source_user_id, $target_user_id, $message);

        if ($success) {
            // Check if already following to determine message
            $is_following = DatabaseHelper::isFollowing($source_user_id, $target_user_id);

            ResponseFormatter::success([
                'following' => true,
                'message' => 'Successfully followed user'
            ], 'User followed successfully', 200);
        } else {
            ResponseFormatter::error('Failed to follow user', 500);
        }
    } else {
        // Unfollow user
        $success = DatabaseHelper::unfollowUser($source_user_id, $target_user_id);

        if ($success) {
            ResponseFormatter::success([
                'following' => false,
                'message' => 'Successfully unfollowed user'
            ], 'User unfollowed successfully', 200);
        } else {
            ResponseFormatter::error('Failed to unfollow user', 500);
        }
    }
} catch (Exception $e) {
    error_log('Follow/unfollow error: ' . $e->getMessage());
    ResponseFormatter::error('Internal server error', 500);
}