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
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

    // Get cookbook ID and recipe ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $remove_recipe_index = array_search('remove-recipe', $url_parts);
    $cookbook_id = $url_parts[$remove_recipe_index - 1] ?? null;

    // Get recipe ID from query parameters
    $recipe_id = $_GET['recipe_id'] ?? null;

    // Validate IDs
    if (empty($cookbook_id) || !preg_match('/^[a-f0-9\-]+$/i', $cookbook_id)) {
        ResponseFormatter::error('Invalid cookbook ID format', 400);
        exit();
    }

    if (empty($recipe_id) || !preg_match('/^[a-f0-9\-]+$/i', $recipe_id)) {
        ResponseFormatter::error('Invalid recipe ID format', 400);
        exit();
    }

    // Check if user owns the cookbook
    $pdo = Database::getConnection();
    $checkStmt = $pdo->prepare("SELECT user_id FROM cookbooks WHERE id = ?");
    $checkStmt->execute([$cookbook_id]);
    $cookbook = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$cookbook) {
        ResponseFormatter::error('Cookbook not found', 404);
        exit();
    }

    if ($cookbook['user_id'] != $userData['user_id']) {
        ResponseFormatter::unauthorized('You don\'t have permission to remove recipes from this cookbook');
        exit();
    }

    // Remove recipe from cookbook
    $deleteStmt = $pdo->prepare("DELETE FROM cookbook_recipes WHERE cookbook_id = ? AND recipe_id = ?");
    $result = $deleteStmt->execute([$cookbook_id, $recipe_id]);

    if (!$result || $deleteStmt->rowCount() === 0) {
        ResponseFormatter::error('Recipe not found in cookbook or failed to remove', 404);
        exit();
    }

    // Update cookbook's updated_at timestamp
    $updateStmt = $pdo->prepare("UPDATE cookbooks SET updated_at = NOW() WHERE id = ?");
    $updateStmt->execute([$cookbook_id]);

    ResponseFormatter::success(
        ['cookbook_id' => $cookbook_id, 'recipe_id' => $recipe_id],
        'Recipe removed from cookbook successfully',
        200
    );
} catch (Exception $e) {
    error_log("Remove recipe from cookbook error: " . $e->getMessage());
    ResponseFormatter::error('Internal server error', 500, ['message' => $e->getMessage()]);
}