<?php

/**
 * PUT /api/users/update
 * Update user profile information
 */

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/fileUpload.php';

// Only PUT method allowed
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
    
    $userId = $tokenData['user_id'];
    
    // Check if multipart form data for file upload
    if (!empty($_FILES['profile_picture'])) {
        // Handle file upload using uploadImage function from fileUpload.php
        $uploadResult = uploadImage($_FILES['profile_picture'], 'profile', $userId);
        
        if (!$uploadResult || !$uploadResult['success']) {
            ResponseFormatter::error("Failed to upload profile picture", 400);
            exit;
        }
        
        // Update user with new profile picture path
        $updateData = [
            'profile_picture' => $uploadResult['file_path'],
            'updated_at' => date('Y-m-d H:i:s')
        ];
        
        // Update user profile
        $success = DatabaseHelper::updateUserProfile($userId, $updateData);
        
        if (!$success) {
            ResponseFormatter::error("Failed to update profile", 500);
            exit;
        }
        
        // Get updated user data
        $updated_user = DatabaseHelper::getUserById($userId);
        
        // Prepare response data
        $response_data = [
            'id' => $updated_user['id'],
            'full_name' => $updated_user['full_name'],
            'email' => $updated_user['email'],
            'profile_picture' => $updated_user['profile_picture'] ?? null,
            'age' => $updated_user['age'] ?? null,
            'gender' => $updated_user['gender'] ?? null,
            'updated_at' => $updated_user['updated_at']
        ];
        
        ResponseFormatter::success($response_data, "Profile picture updated successfully");
        exit;
    }
    
    // Handle JSON input for other updates
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        ResponseFormatter::error("Invalid JSON input", 400);
        exit;
    }
    
    // Validate and sanitize input
    $updateData = [];
    $errors = [];
    
    // Validate full_name
    if (isset($input['full_name'])) {
        $full_name = trim($input['full_name']);
        if (strlen($full_name) < 2 || strlen($full_name) > 100) {
            $errors['full_name'] = "Full name must be between 2 and 100 characters";
        } else {
            $updateData['full_name'] = sanitizeInput($full_name);
        }
    }
    
    // Validate age
    if (isset($input['age'])) {
        $age = (int)$input['age'];
        if ($age < 13 || $age > 120) {
            $errors['age'] = "Age must be between 13 and 120";
        } else {
            $updateData['age'] = $age;
        }
    }
    
    // Validate gender
    if (isset($input['gender'])) {
        $valid_genders = ['male', 'female', 'non-binary', 'other'];
        $gender = strtolower(trim($input['gender']));
        if (!in_array($gender, $valid_genders)) {
            $errors['gender'] = "Invalid gender value";
        } else {
            $updateData['gender'] = $gender;
        }
    }
    
    // Validate profile picture URL
    if (isset($input['profile_picture']) && !empty($input['profile_picture'])) {
        $profile_pic = sanitizeInput($input['profile_picture']);
        // Basic URL validation
        if (filter_var($profile_pic, FILTER_VALIDATE_URL) || strpos($profile_pic, 'uploads/') === 0) {
            $updateData['profile_picture'] = $profile_pic;
        } else {
            $errors['profile_picture'] = "Invalid profile picture URL";
        }
    }
    
    // Check for errors
    if (!empty($errors)) {
        ResponseFormatter::validationError($errors);
        exit;
    }
    
    // If no data to update
    if (empty($updateData)) {
        ResponseFormatter::error("No valid fields to update", 400);
        exit;
    }
    
    // Add update timestamp
    $updateData['updated_at'] = date('Y-m-d H:i:s');
    
    // Update user profile
    $success = DatabaseHelper::updateUserProfile($userId, $updateData);
    
    if (!$success) {
        ResponseFormatter::error("Failed to update profile", 500);
        exit;
    }
    
    // Get updated user data
    $updated_user = DatabaseHelper::getUserById($userId);
    
    // Prepare response data
    $response_data = [
        'id' => $updated_user['id'],
        'full_name' => $updated_user['full_name'],
        'email' => $updated_user['email'],
        'profile_picture' => $updated_user['profile_picture'] ?? null,
        'age' => $updated_user['age'] ?? null,
        'gender' => $updated_user['gender'] ?? null,
        'updated_at' => $updated_user['updated_at']
    ];
    
    ResponseFormatter::success($response_data, "Profile updated successfully");
    
} catch (Exception $e) {
    error_log("Update profile endpoint error: " . $e->getMessage());
    ResponseFormatter::error("Internal server error", 500);
}
?>