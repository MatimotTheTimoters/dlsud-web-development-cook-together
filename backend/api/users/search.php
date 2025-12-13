<?php

/**
 * GET /api/users/search
 * Search for users by name or email
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
    $query = $_GET['q'] ?? '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    
    // Validate parameters
    if (empty($query)) {
        ResponseFormatter::error("Search query (q) is required", 400);
        exit;
    }
    
    if ($page < 1) $page = 1;
    if ($limit < 1 || $limit > 100) $limit = 20;
    
    $offset = ($page - 1) * $limit;
    
    // Search users using DatabaseHelper's searchUsers method
    $search_result = DatabaseHelper::searchUsers($query, $limit, $offset);
    
    // Process users
    $users = [];
    foreach ($search_result['users'] as $user) {
        $user_data = [
            'id' => $user['id'],
            'full_name' => $user['full_name'],
            'profile_picture' => $user['profile_picture'] ?? null,
            'email' => $user['email'],
            'level' => $user['level'] ?? 1,
            'recipes_created' => $user['recipes_created'] ?? 0,
            'recipes_cooked' => $user['recipes_cooked'] ?? 0
        ];
        
        // Check following status using DatabaseHelper's getRelationships method
        $relationships = DatabaseHelper::getRelationships($current_user_id, 'following');
        $is_following = false;
        foreach ($relationships as $relationship) {
            if ($relationship['target_user_id'] === $user['id']) {
                $is_following = true;
                break;
            }
        }
        
        $user_data['is_following'] = $is_following;
        
        $users[] = $user_data;
    }
    
    // Calculate pagination
    $total_pages = $search_result['total'] > 0 ? ceil($search_result['total'] / $limit) : 0;
    
    // Prepare response data per api_contract.md
    $response_data = [
        'users' => $users,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $total_pages,
            'total_results' => $search_result['total'],
            'has_more' => ($page < $total_pages),
            'limit' => $limit
        ]
    ];
    
    // Return success response
    ResponseFormatter::success($response_data, "Search completed successfully");
    
} catch (Exception $e) {
    error_log("User search endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error", 500);
}
?>