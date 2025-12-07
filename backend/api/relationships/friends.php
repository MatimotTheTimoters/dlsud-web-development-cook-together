<?php

/**
 * POST /api/relationships/friends
 * Manage friend relationships (send, accept, reject, cancel, remove)
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
    
    if (!isset($input['action'])) {
        ResponseFormatter::error("action is required", 400);
        exit;
    }
    
    $target_user_id = $input['target_user_id'];
    $action = strtolower($input['action']);
    $message = $input['message'] ?? null;
    
    // Validate action
    $valid_actions = ['send_request', 'accept_request', 'reject_request', 'cancel_request', 'remove_friend'];
    if (!in_array($action, $valid_actions)) {
        ResponseFormatter::error("Invalid action. Valid actions are: " . implode(', ', $valid_actions), 400);
        exit;
    }
    
    // Check if user is trying to friend themselves
    if ($current_user_id === $target_user_id) {
        ResponseFormatter::error("Cannot send friend request to yourself", 400);
        exit;
    }
    
    // Check if target user exists
    $target_user = DatabaseHelper::getUserById($target_user_id);
    if (!$target_user) {
        ResponseFormatter::notFound("Target user not found");
        exit;
    }
    
    // Perform the action
    $success = false;
    $status_message = "";
    
    switch ($action) {
        case 'send_request':
            // Check if already friends or request exists
            if (DatabaseHelper::areFriends($current_user_id, $target_user_id)) {
                ResponseFormatter::error("Already friends with this user", 409);
                exit;
            }
            
            $success = DatabaseHelper::manageFriendRelationships('send_request', $current_user_id, $target_user_id, $message);
            $status_message = "Friend request sent successfully";
            break;
            
        case 'accept_request':
            // Check if request exists
            $requests = DatabaseHelper::getFriendRequests($current_user_id, 'received');
            $has_request = false;
            foreach ($requests as $request) {
                if ($request['source_user_id'] === $target_user_id) {
                    $has_request = true;
                    break;
                }
            }
            
            if (!$has_request) {
                ResponseFormatter::error("No pending friend request from this user", 404);
                exit;
            }
            
            $success = DatabaseHelper::manageFriendRelationships('accept_request', $current_user_id, $target_user_id);
            $status_message = "Friend request accepted successfully";
            break;
            
        case 'reject_request':
            // Check if request exists
            $requests = DatabaseHelper::getFriendRequests($current_user_id, 'received');
            $has_request = false;
            foreach ($requests as $request) {
                if ($request['source_user_id'] === $target_user_id) {
                    $has_request = true;
                    break;
                }
            }
            
            if (!$has_request) {
                ResponseFormatter::error("No pending friend request from this user", 404);
                exit;
            }
            
            $success = DatabaseHelper::manageFriendRelationships('reject_request', $current_user_id, $target_user_id);
            $status_message = "Friend request rejected successfully";
            break;
            
        case 'cancel_request':
            // Check if request exists
            $requests = DatabaseHelper::getFriendRequests($current_user_id, 'sent');
            $has_request = false;
            foreach ($requests as $request) {
                if ($request['source_user_id'] === $current_user_id) {
                    $has_request = true;
                    break;
                }
            }
            
            if (!$has_request) {
                ResponseFormatter::error("No pending friend request sent to this user", 404);
                exit;
            }
            
            $success = DatabaseHelper::manageFriendRelationships('cancel_request', $current_user_id, $target_user_id);
            $status_message = "Friend request cancelled successfully";
            break;
            
        case 'remove_friend':
            // Check if they are friends
            if (!DatabaseHelper::areFriends($current_user_id, $target_user_id)) {
                ResponseFormatter::error("Not friends with this user", 404);
                exit;
            }
            
            $success = DatabaseHelper::manageFriendRelationships('remove_friend', $current_user_id, $target_user_id);
            $status_message = "Friend removed successfully";
            break;
    }
    
    if (!$success) {
        ResponseFormatter::error("Failed to process friend action", 500);
        exit;
    }
    
    // Get updated friendship status
    $are_friends = DatabaseHelper::areFriends($current_user_id, $target_user_id);
    
    // Prepare response data
    $response_data = [
        'friendship_status' => [
            'are_friends' => $are_friends,
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
    ResponseFormatter::success($response_data, $status_message);
    
} catch (Exception $e) {
    error_log("Friends endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error: " . $e->getMessage(), 500);
}