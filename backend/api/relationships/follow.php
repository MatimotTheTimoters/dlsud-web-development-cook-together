<?php

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

    $current_user_id = $payload['user_id'];

    // Get and decode JSON input
    $json_input = file_get_contents('php://input');
    $input = json_decode($json_input, true);

    if (!$input) {
        ResponseFormatter::error('Invalid JSON input', 400);
    }

    // Validate required fields
    if (empty($input['target_user_id'])) {
        ResponseFormatter::validationError([
            'target_user_id' => 'Target user ID is required'
        ]);
    }

    $target_user_id = $input['target_user_id'];

    // Check if user is trying to follow themselves
    if ($current_user_id === $target_user_id) {
        ResponseFormatter::error('Cannot follow yourself', 400);
    }

    // Check if target user exists
    $target_user = DatabaseHelper::getUserById($target_user_id);

    if (!$target_user) {
        ResponseFormatter::notFound('Target user not found');
    }

    // Manage relationship using DatabaseHelper
    $success = DatabaseHelper::manageRelationship($current_user_id, $target_user_id, 'follow');

    if (!$success) {
        ResponseFormatter::error('Failed to process follow action', 500);
    }

    // Prepare response data
    $response_data = [
        'relationship_status' => [
            'is_following' => true,
            'current_user_id' => $current_user_id,
            'target_user_id' => $target_user_id
        ],
        'target_user' => [
            'id' => $target_user['id'],
            'full_name' => $target_user['full_name'],
            'profile_picture' => $target_user['profile_picture']
        ]
    ];

    // Return success response
    ResponseFormatter::success($response_data, 'Successfully followed user');
} catch (Exception $e) {
    error_log('Follow error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred while processing follow request', 500);
}
