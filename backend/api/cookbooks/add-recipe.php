<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
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

    // Get cookbook ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $cookbook_id_index = array_search('add-recipe', $url_parts);
    $cookbook_id = $url_parts[$cookbook_id_index - 1] ?? null;

    // Validate cookbook ID
    if (empty($cookbook_id) || !preg_match('/^[a-f0-9\-]+$/i', $cookbook_id)) {
        ResponseFormatter::error('Invalid cookbook ID format', 400);
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
    if (!isset($data['recipe_id']) || empty(trim($data['recipe_id']))) {
        ResponseFormatter::validationError(['recipe_id' => 'recipe_id is required']);
        exit();
    }

    // Add recipe to cookbook
    $recipe_id = trim($data['recipe_id']);
    $entry_id = DatabaseHelper::addRecipeToCookbook($cookbook_id, $recipe_id, $userData['user_id']);

    if (!$entry_id) {
        ResponseFormatter::error('Failed to add recipe to cookbook', 500);
        exit();
    }

    ResponseFormatter::success(
        ['entry_id' => $entry_id, 'cookbook_id' => $cookbook_id, 'recipe_id' => $recipe_id],
        'Recipe added to cookbook successfully',
        201
    );
} catch (Exception $e) {
    error_log("Add recipe to cookbook error: " . $e->getMessage());
    ResponseFormatter::error('Internal server error', 500, ['message' => $e->getMessage()]);
}