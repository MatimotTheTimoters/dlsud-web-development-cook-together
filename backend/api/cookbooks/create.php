<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../utils/uuidHelper.php';

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
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        ResponseFormatter::error('Method not allowed', 405);
        exit();
    }

    // Get and validate authorization header
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (empty($authHeader) || !preg_match('/Bearer\s+(.+)$/i', $authHeader, $matches)) {
        ResponseFormatter::unauthorized('No authentication token provided');
        exit();
    }

    $token = $matches[1];
    $userData = AuthHelper::validateToken($token);

    if (!$userData) {
        ResponseFormatter::unauthorized('Invalid or expired token');
        exit();
    }

    // Get request body
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        ResponseFormatter::error('Invalid JSON data', 400);
        exit();
    }

    // Validate required fields
    $requiredFields = ['name'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            ResponseFormatter::validationError(["$field" => "$field is required"]);
            exit();
        }
    }

    // Prepare cookbook data
    $cookbookData = [
        'user_id' => $userData['user_id'],
        'name' => trim($data['name']),
        'description' => isset($data['description']) ? trim($data['description']) : null,
        'is_public' => isset($data['is_public']) ? (bool)$data['is_public'] : false
    ];

    // Create cookbook
    $cookbookId = DatabaseHelper::createCookbook($cookbookData);

    if (!$cookbookId) {
        ResponseFormatter::error('Failed to create cookbook', 500);
        exit();
    }

    // Get the newly created cookbook
    $cookbook = DatabaseHelper::getCookbooks($userData['user_id'], false);
    $newCookbook = null;
    foreach ($cookbook as $cb) {
        if ($cb['id'] === $cookbookId) {
            $newCookbook = $cb;
            break;
        }
    }

    ResponseFormatter::success($newCookbook, 'Cookbook created successfully', 201);
} catch (Exception $e) {
    error_log("Cookbook create error: " . $e->getMessage());
    ResponseFormatter::error('Internal server error', 500, ['message' => $e->getMessage()]);
}