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

    // Get cookbook ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $cookbook_id = end($url_parts);

    // Validate cookbook ID
    if (empty($cookbook_id) || !preg_match('/^[a-f0-9\-]+$/i', $cookbook_id)) {
        ResponseFormatter::error('Invalid cookbook ID format', 400);
        exit();
    }

    // Get query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    // Get cookbook recipes
    $result = DatabaseHelper::getCookbookRecipes($cookbook_id, $limit, $offset);

    if (!$result) {
        ResponseFormatter::error('Cookbook not found or failed to fetch data', 404);
        exit();
    }

    ResponseFormatter::success($result, 'Cookbook retrieved successfully', 200);
} catch (Exception $e) {
    error_log("Cookbook show error: " . $e->getMessage());
    ResponseFormatter::error('Internal server error', 500, ['message' => $e->getMessage()]);
}