<?php

/**
 * GET /api/relationships/list
 * List relationships (followers, following, friends, friend requests)
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
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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

// Get query parameters
$type = $_GET['type'] ?? 'all'; // 'followers', 'following', 'friends', 'requests_received', 'requests_sent', 'all'
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

// Validate limit and offset
if ($limit < 1 || $limit > 100) {
    $limit = 50;
}
if ($offset < 0) {
    $offset = 0;
}

try {
    $data = [];

    switch ($type) {
        case 'followers':
            $followers = DatabaseHelper::getFollowers($user_id);
            // Apply pagination
            $data['followers'] = array_slice($followers, $offset, $limit);
            $data['total_followers'] = count($followers);
            break;

        case 'following':
            $following = DatabaseHelper::getFollowing($user_id);
            // Apply pagination
            $data['following'] = array_slice($following, $offset, $limit);
            $data['total_following'] = count($following);
            break;

        case 'friends':
            $friends = DatabaseHelper::getFriends($user_id);
            // Apply pagination
            $data['friends'] = array_slice($friends, $offset, $limit);
            $data['total_friends'] = count($friends);
            break;

        case 'requests_received':
            $requests_received = DatabaseHelper::getFriendRequests($user_id, 'received');
            // Apply pagination
            $data['requests_received'] = array_slice($requests_received, $offset, $limit);
            $data['total_requests_received'] = count($requests_received);
            break;

        case 'requests_sent':
            $requests_sent = DatabaseHelper::getFriendRequests($user_id, 'sent');
            // Apply pagination
            $data['requests_sent'] = array_slice($requests_sent, $offset, $limit);
            $data['total_requests_sent'] = count($requests_sent);
            break;

        case 'all':
        default:
            // Get all relationship types
            $data['followers'] = array_slice(DatabaseHelper::getFollowers($user_id), 0, $limit);
            $data['following'] = array_slice(DatabaseHelper::getFollowing($user_id), 0, $limit);
            $data['friends'] = array_slice(DatabaseHelper::getFriends($user_id), 0, $limit);
            $data['requests_received'] = array_slice(DatabaseHelper::getFriendRequests($user_id, 'received'), 0, $limit);
            $data['requests_sent'] = array_slice(DatabaseHelper::getFriendRequests($user_id, 'sent'), 0, $limit);

            // Add counts
            $data['total_followers'] = count(DatabaseHelper::getFollowers($user_id));
            $data['total_following'] = count(DatabaseHelper::getFollowing($user_id));
            $data['total_friends'] = count(DatabaseHelper::getFriends($user_id));
            $data['total_requests_received'] = count(DatabaseHelper::getFriendRequests($user_id, 'received'));
            $data['total_requests_sent'] = count(DatabaseHelper::getFriendRequests($user_id, 'sent'));
            break;
    }

    // Add pagination info
    $data['pagination'] = [
        'limit' => $limit,
        'offset' => $offset,
        'type' => $type
    ];

    ResponseFormatter::success($data, 'Relationships retrieved successfully', 200);
} catch (Exception $e) {
    error_log('List relationships error: ' . $e->getMessage());
    ResponseFormatter::error('Internal server error', 500);
}