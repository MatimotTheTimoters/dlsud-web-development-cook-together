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
require_once __DIR__ . '/../../utils/uuidHelper.php';

try {
    // Get and decode JSON input
    $json_input = file_get_contents('php://input');
    $input = json_decode($json_input, true);
    
    if (!$input) {
        ResponseFormatter::error('Invalid JSON input', 400);
    }
    
    // Validate required fields
    if (empty($input['full_name']) || empty($input['email']) || empty($input['password'])) {
        ResponseFormatter::validationError([
            'full_name' => empty($input['full_name']) ? 'Full name is required' : null,
            'email' => empty($input['email']) ? 'Email is required' : null,
            'password' => empty($input['password']) ? 'Password is required' : null
        ]);
    }
    
    // Extract data
    $full_name = trim($input['full_name']);
    $email = strtolower(trim($input['email']));
    $password = $input['password'];
    $age = isset($input['age']) ? (int)$input['age'] : null;
    $gender = isset($input['gender']) ? $input['gender'] : null;
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        ResponseFormatter::validationError(['email' => 'Invalid email format']);
    }
    
    // Validate password strength
    $password_strength = AuthHelper::validatePasswordStrength($password);
    if (!$password_strength['success']) {
        ResponseFormatter::validationError(['password' => $password_strength['message']]);
    }
    
    // Hash password
    $password_hash = AuthHelper::hashPassword($password);
    
    // Prepare user data for DatabaseHelper
    $user_data = [
        'full_name' => $full_name,
        'email' => $email,
        'password_hash' => $password_hash,
        'age' => $age,
        'gender' => $gender
    ];
    
    // Register user using DatabaseHelper
    $user_id = DatabaseHelper::registerUser($user_data);
    
    if (!$user_id) {
        ResponseFormatter::error('Failed to create user account', 500);
    }
    
    // Get the newly created user
    $user = DatabaseHelper::getUserById($user_id);
    
    if (!$user) {
        ResponseFormatter::error('Failed to retrieve created user', 500);
    }
    
    // Generate JWT token
    $token = AuthHelper::generateToken($user['id'], $user['email']);
    
    // Generate refresh token
    $refresh_token = AuthHelper::generateRefreshToken($user['id']);
    
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
    
    // Prepare response data
    $response_data = [
        'user' => $user_data,
        'token' => $token,
        'refresh_token' => $refresh_token,
        'expires_in' => AuthHelper::getConfig()['token_expiry']
    ];
    
    // Return success response
    ResponseFormatter::created($response_data, 'Registration successful');
    
} catch (Exception $e) {
    error_log('Registration error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred during registration', 500);
}
?>