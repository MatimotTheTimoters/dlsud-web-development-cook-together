<?php
// Set CORS headers and handle preflight
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ResponseFormatter::handlePreflight();
    exit;
}

// Set CORS headers for actual request
ResponseFormatter::setCorsHeaders();

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error('Method not allowed', 405);
}

// Include required classes
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

try {
    // Get and decode JSON input
    $json_input = file_get_contents('php://input');
    $input = json_decode($json_input, true);
    
    if (!$input) {
        ResponseFormatter::error('Invalid JSON input', 400);
    }
    
    // Check for required fields
    if (empty($input['refresh_token'])) {
        ResponseFormatter::validationError(['refresh_token' => 'Refresh token is required']);
    }
    
    $refresh_token = $input['refresh_token'];
    
    // Also check for old token to get user info
    $old_token = AuthHelper::getBearerToken();
    
    if (!$old_token) {
        ResponseFormatter::unauthorized('No authentication token provided');
    }
    
    // Validate the old token (might be expired but still valid for refresh)
    $payload = AuthHelper::validateToken($old_token, true); // true = allow expired
    
    if (!$payload) {
        ResponseFormatter::unauthorized('Invalid token');
    }
    
    $user_id = $payload['user_id'];
    
    // Get user data to verify
    $user = DatabaseHelper::getUserById($user_id);
    
    if (!$user) {
        ResponseFormatter::unauthorized('User not found');
    }
    
    // Generate new JWT token
    $new_token = AuthHelper::generateToken($user['id'], $user['email']);
    
    // Generate new refresh token
    $new_refresh_token = AuthHelper::generateRefreshToken($user['id']);
    
    // Prepare response data
    $response_data = [
        'token' => $new_token,
        'refresh_token' => $new_refresh_token,
        'expires_in' => AuthHelper::getConfig()['token_expiry']
    ];
    
    // Return success response
    ResponseFormatter::success($response_data, 'Token refreshed successfully');
    
} catch (Exception $e) {
    error_log('Token refresh error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred while refreshing token', 500);
}
?>