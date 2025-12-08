<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        ResponseFormatter::error('Method not allowed', 405);
        exit();
    }

    // Get query parameters
    $user_id = $_GET['user_id'] ?? null;
    $include_public = isset($_GET['include_public']) ? filter_var($_GET['include_public'], FILTER_VALIDATE_BOOLEAN) : false;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    // Validate user_id if provided
    if ($user_id && !preg_match('/^[a-f0-9\-]+$/i', $user_id)) {
        ResponseFormatter::error('Invalid user ID format', 400);
        exit();
    }

    // Get cookbooks
    if ($user_id) {
        $cookbooks = DatabaseHelper::getCookbooks($user_id, $include_public);
    } else {
        // If no user_id provided, return error
        ResponseFormatter::error('User ID is required', 400);
        exit();
    }

    if ($cookbooks === false) {
        ResponseFormatter::error('Failed to fetch cookbooks', 500);
        exit();
    }

    ResponseFormatter::success($cookbooks, 'Cookbooks retrieved successfully', 200);
} catch (Exception $e) {
    error_log("Cookbooks index error: " . $e->getMessage());
    ResponseFormatter::error('Internal server error', 500, ['message' => $e->getMessage()]);
}