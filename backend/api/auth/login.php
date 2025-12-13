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
    
    // Validate required fields
    if (empty($input['email']) || empty($input['password'])) {
        ResponseFormatter::validationError([
            'email' => empty($input['email']) ? 'Email is required' : null,
            'password' => empty($input['password']) ? 'Password is required' : null
        ]);
    }
    
    // Extract data
    $email = strtolower(trim($input['email']));
    $password = $input['password'];
    
    // Validate user credentials using DatabaseHelper
    $user = DatabaseHelper::validateUserLogin($email, $password);
    
    if (!$user) {
        ResponseFormatter::error('Invalid email or password', 401);
    }
    
    // Generate JWT token
    $token = AuthHelper::generateToken($user['id'], $user['email']);
    
    // Generate refresh token
    $refresh_token = AuthHelper::generateRefreshToken($user['id']);
    
    // Get user stats
    $stats = DatabaseHelper::getUserStats($user['id']);
    
    // Prepare user data for response
    $user_data = [
        'id' => $user['id'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'profile_picture' => $user['profile_picture'],
        'age' => $user['age'],
        'gender' => $user['gender'],
        'created_at' => $user['created_at']
    ];
    
    // Prepare stats data
    $stats_data = $stats ?: [
        'level' => 1,
        'current_exp' => 0,
        'current_level_ceiling' => 100,
        'gold_count' => 0,
        'gem_count' => 0,
        'login_streak' => 0
    ];
    
    // Prepare response data
    $response_data = [
        'user' => $user_data,
        'stats' => $stats_data,
        'token' => $token,
        'refresh_token' => $refresh_token,
        'expires_in' => AuthHelper::getConfig()['token_expiry']
    ];
    
    // Return success response
    ResponseFormatter::success($response_data, 'Login successful');
    
} catch (Exception $e) {
    error_log('Login error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred during login', 500);
}
?>