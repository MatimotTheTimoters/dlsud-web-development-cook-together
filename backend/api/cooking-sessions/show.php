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
    // Get session ID from URL
    $session_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$session_id) {
        ResponseFormatter::error('Session ID is required', 400);
        exit;
    }
    
    $dbHelper = new DatabaseHelper();
    
    // Get cooking session
    $session = $dbHelper->getCookingSession($session_id);
    
    if (!$session) {
        ResponseFormatter::error('Cooking session not found', 404);
        exit;
    }
    
    // Check if user can view the session (based on visibility)
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        require_once __DIR__ . '/../../classes/AuthHelper.php';
        $authHelper = new AuthHelper();
        $token = $authHelper->getBearerToken();
        
        if ($token) {
            $tokenData = $authHelper->validateToken($token);
            if ($tokenData) {
                $user_id = $tokenData['user_id'];
                // Add user-specific data (like participation status)
                $session['user_participant'] = $dbHelper->isUserInSession($session_id, $user_id);
            }
        }
    }
    
    ResponseFormatter::success([
        'session' => $session,
        'message' => 'Cooking session retrieved successfully'
    ], 'Session retrieved', 200);
    
} catch (Exception $e) {
    error_log('Error retrieving cooking session: ' . $e->getMessage());
    ResponseFormatter::error('Server error: ' . $e->getMessage(), 500);
}
?>