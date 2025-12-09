<?php

/**
 * POST /api/relationships/follow.php
 * Follow or unfollow a user
 */
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

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
    // Get authorization header (support both functions)
    $headers = function_exists('getallheaders') ? getallheaders() : apache_request_headers();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    // Extract token
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        ResponseFormatter::error("No authentication token provided", 401);
        exit;
    }
    
    $token = $matches[1];
    
    // Validate token
    $tokenData = AuthHelper::validateToken($token);
    
    if (!$tokenData) {
        ResponseFormatter::error("Invalid or expired token", 401);
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
    $message = $input['message'] ?? null;
    
    // Check if user is trying to follow themselves
    if ($current_user_id === $target_user_id) {
        ResponseFormatter::error("Cannot follow yourself", 400);
        exit;
    }
    
    // Check if target user exists
    $target_user = DatabaseHelper::getUserById($target_user_id);
    if (!$target_user) {
        ResponseFormatter::error("Target user not found", 404);
        exit;
    }
    
    // Determine action (follow or unfollow)
    $action = isset($input['action']) ? strtolower($input['action']) : 'toggle';
    
    // Perform the action
    switch ($action) {
        case 'follow':
            $success = DatabaseHelper::followUser($current_user_id, $target_user_id, $message);
            $messageText = "Successfully followed user";
            $is_following_now = true;
            break;
            
        case 'unfollow':
            $success = DatabaseHelper::unfollowUser($current_user_id, $target_user_id);
            $messageText = "Successfully unfollowed user";
            $is_following_now = false;
            break;
            
        case 'toggle':
        default:
            $isFollowing = DatabaseHelper::isFollowing($current_user_id, $target_user_id);
            if ($isFollowing) {
                $success = DatabaseHelper::unfollowUser($current_user_id, $target_user_id);
                $messageText = "Successfully unfollowed user";
                $is_following_now = false;
                $action = 'unfollow';
            } else {
                $success = DatabaseHelper::followUser($current_user_id, $target_user_id, $message);
                $messageText = "Successfully followed user";
                $is_following_now = true;
                $action = 'follow';
            }
            break;
    }
    
    if (!$success) {
        ResponseFormatter::error("Failed to update follow status", 500);
        exit;
    }
    
    // Get updated follow status
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
    ResponseFormatter::success($response_data, $messageText, 200);
    
} catch (Exception $e) {
    error_log("Follow endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error", 500);
}