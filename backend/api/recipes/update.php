<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../utils/validation.php';

// Set CORS headers
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/cors.php';

$responseFormatter = new ResponseFormatter();
$authHelper = new AuthHelper();

try {
    // Check authentication
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        $responseFormatter->unauthorized("Authentication required");
        exit;
    }

    $token = str_replace('Bearer ', '', $authHeader);
    $decoded = $authHelper->validateToken($token);

    if (!$decoded) {
        $responseFormatter->unauthorized("Invalid or expired token");
        exit;
    }

    $userId = $decoded['user_id'];

    // Get recipe ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $recipeId = end($url_parts);

    if (empty($recipeId)) {
        $responseFormatter->error("Recipe ID is required", 400);
        exit;
    }

    // Check recipe ownership
    $dbHelper = new DatabaseHelper();
    $recipe = $dbHelper->getRecipe($recipeId, $userId);

    if (!$recipe) {
        $responseFormatter->notFound("Recipe not found");
        exit;
    }

    if ($recipe['user_id'] !== $userId) {
        $responseFormatter->unauthorized("You don't have permission to update this recipe");
        exit;
    }

    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }

    // Get update data
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $responseFormatter->error("Invalid JSON data", 400);
        exit;
    }

    // Sanitize input
    $data = sanitizeInput($data);

    // Prepare update data
    $updateData = [];
    $allowedFields = [
        'title',
        'description',
        'origin',
        'difficulty',
        'is_paid',
        'is_public',
        'preparation_time',
        'cooking_time',
        'serving_size',
        'cover_image'
    ];

    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateData[$field] = $data[$field];
        }
    }

    // Validate difficulty if provided
    if (isset($updateData['difficulty']) && !in_array($updateData['difficulty'], ['easy', 'medium', 'hard'])) {
        $responseFormatter->error("Invalid difficulty value", 400);
        exit;
    }

    // Update recipe using DatabaseHelper
    $success = $dbHelper->updateRecipe(
        $recipeId,
        $updateData,
        isset($data['ingredients']) ? $data['ingredients'] : [],
        isset($data['steps']) ? $data['steps'] : []
    );

    if (!$success) {
        $responseFormatter->error("Failed to update recipe", 500);
        exit;
    }

    // Get updated recipe
    $updatedRecipe = $dbHelper->getRecipe($recipeId, $userId);

    $responseFormatter->success($updatedRecipe, "Recipe updated successfully", 200);
} catch (Exception $e) {
    $responseFormatter->error("Failed to update recipe: " . $e->getMessage(), 500);
}
