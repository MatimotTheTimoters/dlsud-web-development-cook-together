<?php

/**
 * POST /api/relationships/friends
 * Manage friend relationships (send request, accept, reject, remove)
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

$user_id = $user_data['user_id'];

// Get and validate request data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    ResponseFormatter::error('Missing required field: action', 400);
    exit();
}

$action = $input['action'];

try {
    switch ($action) {
        case 'send_request':
            // Send friend request
            if (!isset($input['target_user_id'])) {
                ResponseFormatter::error('Missing required field: target_user_id', 400);
                exit();
            }

            $target_user_id = $input['target_user_id'];
            $message = $input['message'] ?? null;

            // Check if target user exists
            $target_user = DatabaseHelper::getUserById($target_user_id);
            if (!$target_user) {
                ResponseFormatter::error('Target user not found', 404);
                exit();
            }

            // Prevent sending request to oneself
            if ($user_id === $target_user_id) {
                ResponseFormatter::error('Cannot send friend request to yourself', 400);
                exit();
            }

            $success = DatabaseHelper::sendFriendRequest($user_id, $target_user_id, $message);

            if ($success) {
                ResponseFormatter::success([
                    'request_sent' => true,
                    'message' => 'Friend request sent successfully'
                ], 'Friend request sent', 200);
            } else {
                ResponseFormatter::error('Failed to send friend request. Request may already exist.', 400);
            }
            break;

        case 'respond_request':
            // Respond to friend request
            if (!isset($input['request_id']) || !isset($input['response'])) {
                ResponseFormatter::error('Missing required fields: request_id and response', 400);
                exit();
            }

            $request_id = $input['request_id'];
            $response = $input['response']; // 'accept' or 'reject'

            if (!in_array($response, ['accept', 'reject'])) {
                ResponseFormatter::error('Invalid response. Must be "accept" or "reject"', 400);
                exit();
            }

            $status = $response === 'accept' ? 'accepted' : 'rejected';
            $success = DatabaseHelper::respondToFriendRequest($request_id, $status);

            if ($success) {
                ResponseFormatter::success([
                    'request_processed' => true,
                    'status' => $status,
                    'message' => 'Friend request ' . $response . 'ed successfully'
                ], 'Friend request ' . $response . 'ed', 200);
            } else {
                ResponseFormatter::error('Failed to process friend request. Request may not exist or already processed.', 400);
            }
            break;

        case 'remove_friend':
            // Remove friend
            if (!isset($input['friend_id'])) {
                ResponseFormatter::error('Missing required field: friend_id', 400);
                exit();
            }

            $friend_id = $input['friend_id'];

            // Check if friend exists
            $friend = DatabaseHelper::getUserById($friend_id);
            if (!$friend) {
                ResponseFormatter::error('Friend not found', 404);
                exit();
            }

            $success = DatabaseHelper::removeFriend($user_id, $friend_id);

            if ($success) {
                ResponseFormatter::success([
                    'friend_removed' => true,
                    'message' => 'Friend removed successfully'
                ], 'Friend removed', 200);
            } else {
                ResponseFormatter::error('Failed to remove friend. Friendship may not exist.', 400);
            }
            break;

        default:
            ResponseFormatter::error('Invalid action. Must be "send_request", "respond_request", or "remove_friend"', 400);
            break;
    }
} catch (Exception $e) {
    error_log('Friend management error: ' . $e->getMessage());
    ResponseFormatter::error('Internal server error', 500);
}