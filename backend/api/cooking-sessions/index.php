<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

header('Content-Type: application/json');

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ResponseFormatter::error('Method not allowed', 405);
    exit;
}

try {
    $dbHelper = new DatabaseHelper();
    
    // Get query parameters
    $filters = [];
    
    if (isset($_GET['status'])) {
        $filters['status'] = $_GET['status'];
    }
    
    if (isset($_GET['visibility'])) {
        $filters['visibility'] = $_GET['visibility'];
    }
    
    if (isset($_GET['mode'])) {
        $filters['mode'] = $_GET['mode'];
    }
    
    if (isset($_GET['recipe_id'])) {
        $filters['recipe_id'] = $_GET['recipe_id'];
    }
    
    if (isset($_GET['host_id'])) {
        $filters['host_id'] = $_GET['host_id'];
    }
    
    // Pagination
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    // Check for user authentication to show private sessions
    $user_id = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        require_once __DIR__ . '/../../classes/AuthHelper.php';
        $authHelper = new AuthHelper();
        $token = $authHelper->getBearerToken();
        
        if ($token) {
            $tokenData = $authHelper->validateToken($token);
            if ($tokenData) {
                $user_id = $tokenData['user_id'];
                $filters['user_id'] = $user_id; // For showing user's sessions
            }
        }
    }
    
    // Get cooking sessions
    $sessions = $dbHelper->getCookingSessions($filters, $limit, $offset);
    
    // Get total count for pagination
    $total = $dbHelper->getCookingSessionsCount($filters);
    
    ResponseFormatter::paginated([
        'sessions' => $sessions,
        'filters' => $filters
    ], $total, ceil($offset / $limit) + 1, $limit, 'Cooking sessions retrieved successfully');
    
} catch (Exception $e) {
    error_log('Error listing cooking sessions: ' . $e->getMessage());
    ResponseFormatter::error('Server error: ' . $e->getMessage(), 500);
}
?>