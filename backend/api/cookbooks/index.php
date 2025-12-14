<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';

header('Content-Type: application/json');

$response = new ResponseFormatter();

try {
    // Check for token (optional for public cookbooks)
    $token = AuthHelper::getBearerToken();
    $user_id = null;
    
    if ($token) {
        $userData = AuthHelper::validateToken($token);
        if ($userData) {
            $user_id = $userData['user_id'];
        }
    }

    // Get query parameters
    $filters = [];
    $user_id_filter = isset($_GET['user_id']) ? $_GET['user_id'] : $user_id;
    $include_public = isset($_GET['include_public']) ? (bool)$_GET['include_public'] : false;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    $dbHelper = new DatabaseHelper();
    
    // If user is authenticated, get their cookbooks
    if ($user_id) {
        $cookbooks = $dbHelper->getUserCookbooks($user_id, $include_public, $limit, $offset);
        
        // If specific user_id is requested and it's not the current user
        if (isset($_GET['user_id']) && $_GET['user_id'] !== $user_id) {
            // Only show public cookbooks of other users
            $cookbooks = array_filter($cookbooks, function($cookbook) {
                return $cookbook['is_public'] == true;
            });
        }
    } else {
        // For non-authenticated users, only show public cookbooks
        $filters['is_public'] = true;
        $cookbooks = $dbHelper->getCookbooks($filters, $limit, $offset);
    }

    // Format response
    $responseData = [
        'cookbooks' => $cookbooks,
        'count' => count($cookbooks),
        'limit' => $limit,
        'offset' => $offset
    ];

    $response->success($responseData, 'Cookbooks retrieved successfully');
    
} catch (Exception $e) {
    error_log("Cookbooks index error: " . $e->getMessage());
    $response->error('Server error', 500);
}
?>