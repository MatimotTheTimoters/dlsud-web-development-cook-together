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
require_once __DIR__ . '/../../utils/validation.php';

try {
    // Get and decode JSON input
    $json_input = file_get_contents('php://input');
    $input = json_decode($json_input, true);
    
    if (!$input) {
        ResponseFormatter::error('Invalid JSON input', 400);
    }
    
    // Sanitize input
    $input = Validation::sanitizeInput($input);
    
    // Validate required fields
    $required_fields = ['full_name', 'email', 'password'];
    $validation_errors = Validation::validateRequired($input, $required_fields);
    
    if (!empty($validation_errors)) {
        ResponseFormatter::validationError($validation_errors);
    }
    
    // Extract data
    $full_name = $input['full_name'];
    $email = strtolower($input['email']);
    $password = $input['password'];
    $age = isset($input['age']) ? (int)$input['age'] : null;
    $gender = isset($input['gender']) ? $input['gender'] : null;
    
    // Validate email format
    if (!Validation::validateEmail($email)) {
        ResponseFormatter::validationError(['email' => 'Invalid email format']);
    }
    
    // Validate password strength
    $password_strength = AuthHelper::validatePasswordStrength($password);
    if (!$password_strength['success']) {
        ResponseFormatter::validationError(['password' => $password_strength['message']]);
    }
    
    // Check if email already exists
    if (DatabaseHelper::emailExists($email)) {
        ResponseFormatter::validationError(['email' => 'Email already registered']);
    }
    
    // Hash password
    $password_hash = AuthHelper::hashPassword($password);
    
    // Prepare user data
    $user_data = [
        'full_name' => $full_name,
        'email' => $email,
        'password_hash' => $password_hash,
        'age' => $age,
        'gender' => $gender
    ];
    
    // Register user
    $new_user = DatabaseHelper::registerUser($user_data);
    
    if (!$new_user) {
        ResponseFormatter::error('Failed to create user account', 500);
    }
    
    // Generate JWT token
    $token = AuthHelper::generateToken($new_user['id'], $email, [
        'full_name' => $full_name
    ]);
    
    // Generate refresh token
    $refresh_token = AuthHelper::generateRefreshToken($new_user['id']);
    
    // Prepare response data
    $response_data = [
        'user' => $new_user,
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