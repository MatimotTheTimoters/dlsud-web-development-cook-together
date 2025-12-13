<?php
// backend/api/relationships/list.php
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
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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

    // Get query parameters
    $type = $_GET['type'] ?? 'following';
    $target_user_id = $_GET['user_id'] ?? $current_user_id;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

    // Validate parameters
    if ($limit < 1 || $limit > 100) {
        $limit = 50;
    }

    // Check if target user exists
    $target_user = DatabaseHelper::getUserById($target_user_id);

    if (!$target_user) {
        ResponseFormatter::notFound('User not found');
    }

    // Get relationships using DatabaseHelper
    $relationships = DatabaseHelper::getRelationships($target_user_id, $type, $limit);

    // Prepare response data
    $response_data = [
        'type' => $type,
        'target_user_id' => $target_user_id,
        'relationships' => $relationships,
        'total_count' => count($relationships),
        'limit' => $limit
    ];

    // Return success response
    ResponseFormatter::success($response_data, 'Relationships retrieved successfully');
} catch (Exception $e) {
    error_log('List relationships error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred while retrieving relationships', 500);
}
