<?php

/**
 * GET /api/relationships/list
 * List relationships (followers, following, friends, or pending requests)
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
    
    // Get query parameters
    $type = $_GET['type'] ?? 'friends'; // friends, followers, following, friend_requests
    $target_user_id = $_GET['user_id'] ?? $current_user_id; // Default to current user
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    
    // Validate parameters
    $valid_types = ['friends', 'followers', 'following', 'friend_requests'];
    if (!in_array($type, $valid_types)) {
        ResponseFormatter::error("Invalid type. Valid types are: " . implode(', ', $valid_types), 400);
        exit;
    }
    
    if ($page < 1) $page = 1;
    if ($limit < 1 || $limit > 100) $limit = 20;
    
    $offset = ($page - 1) * $limit;
    
    // Check if target user exists
    $target_user = DatabaseHelper::getUserById($target_user_id);
    if (!$target_user) {
        ResponseFormatter::notFound("User not found");
        exit;
    }
    
    $list_data = [];
    $total_items = 0;
    
    switch ($type) {
        case 'friends':
            $friends = DatabaseHelper::getFriendsList($target_user_id, $limit, $offset);
            $list_data = $friends;
            // Note: For simplicity, we're not counting total friends here
            // In production, you'd want a separate count query
            $total_items = count($friends);
            break;
            
        case 'followers':
            $followers = DatabaseHelper::getFollowersList($target_user_id, $limit, $offset);
            $list_data = $followers;
            $total_items = count($followers);
            break;
            
        case 'following':
            $following = DatabaseHelper::getFollowingList($target_user_id, $limit, $offset);
            $list_data = $following;
            $total_items = count($following);
            break;
            
        case 'friend_requests':
            $request_type = $_GET['request_type'] ?? 'received'; // received or sent
            if (!in_array($request_type, ['received', 'sent'])) {
                $request_type = 'received';
            }
            
            $requests = DatabaseHelper::getFriendRequests($target_user_id, $request_type);
            $list_data = $requests;
            $total_items = count($requests);
            break;
    }
    
    // Process list items
    $items = [];
    foreach ($list_data as $item) {
        $item_data = [
            'id' => $item['friend_id'] ?? $item['follower_id'] ?? $item['following_id'] ?? $item['source_user_id'] ?? null,
            'full_name' => $item['full_name'],
            'profile_picture' => $item['profile_picture'] ?? null,
        ];
        
        // Add relationship-specific fields
        if ($type === 'friends' && isset($item['friends_since'])) {
            $item_data['friends_since'] = $item['friends_since'];
        }
        
        if (($type === 'followers' || $type === 'following') && isset($item['followed_at'])) {
            $item_data['followed_at'] = $item['followed_at'];
        }
        
        if ($type === 'friend_requests') {
            $item_data['message'] = $item['message'] ?? null;
            $item_data['created_at'] = $item['created_at'];
            $item_data['request_type'] = $request_type;
        }
        
        // Add current user's relationship with each item
        if ($current_user_id !== $target_user_id) {
            $item_user_id = $item_data['id'];
            $item_data['is_following'] = DatabaseHelper::isFollowing($current_user_id, $item_user_id);
            $item_data['are_friends'] = DatabaseHelper::areFriends($current_user_id, $item_user_id);
        }
        
        $items[] = $item_data;
    }
    
    // Calculate pagination
    $total_pages = $total_items > 0 ? ceil($total_items / $limit) : 0;
    
    // Prepare response data
    $response_data = [
        'type' => $type,
        'target_user_id' => $target_user_id,
        'items' => $items,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $total_pages,
            'total_items' => $total_items,
            'items_per_page' => $limit,
            'has_more' => ($page < $total_pages)
        ]
    ];
    
    // Add request_type for friend_requests
    if ($type === 'friend_requests') {
        $response_data['request_type'] = $request_type;
    }
    
    // Return success response
    ResponseFormatter::success($response_data, "Relationships list retrieved successfully");
    
} catch (Exception $e) {
    error_log("Relationships list endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error: " . $e->getMessage(), 500);
}