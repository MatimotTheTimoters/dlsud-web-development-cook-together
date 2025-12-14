<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

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

    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }

    // Get interaction data
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $responseFormatter->error("Invalid JSON data", 400);
        exit;
    }

    if (!isset($data['interaction_type'])) {
        $responseFormatter->error("Interaction type is required", 400);
        exit;
    }

    $interactionType = $data['interaction_type'];
    $allowedInteractions = ['like', 'dislike', 'save'];

    if (!in_array($interactionType, $allowedInteractions)) {
        $responseFormatter->error("Invalid interaction type", 400);
        exit;
    }

    // Handle interaction using DatabaseHelper
    $dbHelper = new DatabaseHelper();
    $success = $dbHelper->handleRecipeInteraction(
        $userId,
        $recipeId,
        $interactionType,
        isset($data['metadata']) ? $data['metadata'] : []
    );

    if (!$success) {
        $responseFormatter->error("Failed to process interaction", 500);
        exit;
    }

    // Get updated interaction counts
    $counts = $dbHelper->getRecipeInteractions($recipeId);

    $responseData = [
        'interaction_type' => $interactionType,
        'counts' => $counts,
        'message' => 'Interaction processed successfully'
    ];

    $responseFormatter->success($responseData, "Interaction processed successfully", 200);
} catch (Exception $e) {
    $responseFormatter->error("Failed to process interaction: " . $e->getMessage(), 500);
}
