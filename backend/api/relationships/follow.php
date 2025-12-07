<?php

/**
 * POST /api/relationships/follow
 * Follow or unfollow a user
 */

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ResponseFormatter::success(null, "Preflight request successful", 200);
    exit;
}

// Only POST method allowed
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
    
    $current_user_id = $tokenData['user_id'];
    
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        ResponseFormatter::error("Invalid JSON input", 400);
        exit;
    }
    
    // Validate required fields
    if (!isset($input['target_user_id'])) {
        ResponseFormatter::error("target_user_id is required", 400);
        exit;
    }
    
    $target_user_id = $input['target_user_id'];
    
    // Check if user is trying to follow themselves
    if ($current_user_id === $target_user_id) {
        ResponseFormatter::error("Cannot follow yourself", 400);
        exit;
    }
    
    // Check if target user exists
    $target_user = DatabaseHelper::getUserById($target_user_id);
    if (!$target_user) {
        ResponseFormatter::notFound("Target user not found");
        exit;
    }
    
    // Determine action (follow or unfollow)
    $action = isset($input['action']) ? strtolower($input['action']) : 'toggle';
    
    // Perform the action
    switch ($action) {
        case 'follow':
            $success = DatabaseHelper::followUser($current_user_id, $target_user_id);
            $message = "Successfully followed user";
            break;
            
        case 'unfollow':
            $success = DatabaseHelper::unfollowUser($current_user_id, $target_user_id);
            $message = "Successfully unfollowed user";
            break;
            
        case 'toggle':
        default:
            $is_following = DatabaseHelper::isFollowing($current_user_id, $target_user_id);
            if ($is_following) {
                $success = DatabaseHelper::unfollowUser($current_user_id, $target_user_id);
                $message = "Successfully unfollowed user";
                $action = 'unfollow';
            } else {
                $success = DatabaseHelper::followUser($current_user_id, $target_user_id);
                $message = "Successfully followed user";
                $action = 'follow';
            }
            break;
    }
    
    if (!$success) {
        ResponseFormatter::error("Failed to update follow status", 500);
        exit;
    }
    
    // Get updated follow status
    $is_following_now = ($action === 'follow');
    
    // Prepare response data
    $response_data = [
        'follow_status' => [
            'is_following' => $is_following_now,
            'action' => $action,
            'current_user_id' => $current_user_id,
            'target_user_id' => $target_user_id
        ],
        'target_user' => [
            'id' => $target_user['id'],
            'full_name' => $target_user['full_name'],
            'profile_picture' => $target_user['profile_picture'] ?? null
        ]
    ];
    
    // Return success response
    ResponseFormatter::success($response_data, $message);
    
} catch (Exception $e) {
    error_log("Follow endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error: " . $e->getMessage(), 500);
}