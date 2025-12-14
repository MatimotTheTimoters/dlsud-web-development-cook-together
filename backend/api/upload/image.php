<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error('Method not allowed', 405);
}

// Include required classes
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../utils/fileUpload.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

try {
    // Get token from Authorization header
    $token = AuthHelper::getBearerToken();

    if (!$token) {
        ResponseFormatter::unauthorized('No authentication token provided');
    }

    // Validate token
    $payload = AuthHelper::validateToken($token);

    if (!$payload) {
        ResponseFormatter::unauthorized('Invalid or expired token');
    }

    $user_id = $payload['user_id'];

    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        ResponseFormatter::error('No image file uploaded or upload error occurred', 400);
    }

    $file = $_FILES['image'];

    // Get upload type from request
    $upload_type = $_POST['type'] ?? 'profile_picture';
    $valid_types = ['profile_picture', 'recipe_cover', 'step_image'];

    if (!in_array($upload_type, $valid_types)) {
        ResponseFormatter::error('Invalid upload type. Valid types: ' . implode(', ', $valid_types), 400);
    }

    // Validate image
    if (!validateImage($file)) {
        ResponseFormatter::error('Invalid image file. Please upload a valid image (JPEG, PNG, GIF, WebP) under 5MB', 400);
    }

    // Upload image using fileUpload utility
    $upload_result = uploadImage($file, $upload_type, $user_id);

    if (!$upload_result) {
        ResponseFormatter::error('Failed to upload image', 500);
    }

    // Prepare response data
    $response_data = [
        'image' => [
            'url' => $upload_result['url'],
            'optimized_url' => $upload_result['optimized_url'] ?? null,
            'thumbnail_url' => $upload_result['thumbnail_url'] ?? null,
            'file_name' => $upload_result['file_name'],
            'file_size' => $upload_result['file_size'],
            'dimensions' => $upload_result['dimensions']
        ],
        'upload_type' => $upload_type,
        'user_id' => $user_id
    ];

    // Return success response
    ResponseFormatter::success($response_data, 'Image uploaded successfully');
} catch (Exception $e) {
    error_log('Image upload error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred while uploading image', 500);
}
