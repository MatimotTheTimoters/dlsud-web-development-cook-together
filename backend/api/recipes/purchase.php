<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../classes/UserCalculations.php';

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

    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }

    // Get purchase data
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $responseFormatter->error("Invalid JSON data", 400);
        exit;
    }

    if (!isset($data['currency_type'])) {
        $responseFormatter->error("Currency type is required", 400);
        exit;
    }

    $currencyType = $data['currency_type'];
    if (!in_array($currencyType, ['gold', 'gem'])) {
        $responseFormatter->error("Invalid currency type", 400);
        exit;
    }

    // Get user stats for affordability check
    $dbHelper = new DatabaseHelper();
    $userCalculations = new UserCalculations();

    $userStats = $dbHelper->getUserStats($userId);
    if (!$userStats) {
        $responseFormatter->error("Failed to get user stats", 500);
        exit;
    }

    // Get recipe price
    $recipe = $dbHelper->getRecipe($recipeId, $userId);
    if (!$recipe) {
        $responseFormatter->notFound("Recipe not found");
        exit;
    }

    if ($recipe['user_id'] === $userId) {
        $responseFormatter->error("You cannot purchase your own recipe", 400);
        exit;
    }

    if (!$recipe['is_paid']) {
        $responseFormatter->error("This recipe is not available for purchase", 400);
        exit;
    }

    // Check if already purchased
    $checkSql = "SELECT id FROM user_recipe_purchases 
                 WHERE user_id = :user_id AND recipe_id = :recipe_id";
    $existingPurchase = Database::fetchOne($checkSql, [
        'user_id' => $userId,
        'recipe_id' => $recipeId
    ]);

    if ($existingPurchase) {
        $responseFormatter->error("You have already purchased this recipe", 400);
        exit;
    }

    // Check affordability
    $priceField = $currencyType . '_price';
    $price = $recipe[$priceField];
    $balanceField = $currencyType . '_count';
    $userBalance = $userStats[$balanceField];

    if ($userBalance < $price) {
        $responseFormatter->error("Insufficient " . $currencyType . " balance", 400);
        exit;
    }

    // Purchase recipe using DatabaseHelper
    $success = $dbHelper->purchaseRecipe($userId, $recipeId, $currencyType, $price);

    if (!$success) {
        $responseFormatter->error("Failed to purchase recipe", 500);
        exit;
    }

    // Get updated user stats
    $updatedStats = $dbHelper->getUserStats($userId);

    $responseData = [
        'recipe_id' => $recipeId,
        'currency_type' => $currencyType,
        'price_paid' => $price,
        'new_balance' => $updatedStats[$balanceField],
        'message' => 'Recipe purchased successfully'
    ];

    $responseFormatter->success($responseData, "Recipe purchased successfully", 200);
} catch (Exception $e) {
    $responseFormatter->error("Failed to purchase recipe: " . $e->getMessage(), 500);
}
