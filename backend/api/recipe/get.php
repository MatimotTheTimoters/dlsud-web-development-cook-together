<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight ONCE
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

$recipeId = intval($_GET['id'] ?? 0);
$userId = intval($_GET['user_id'] ?? 1); // Get from query param, default to 1 for demo

if (!$recipeId) {
    echo json_encode(['success' => false, 'message' => 'Recipe ID required']);
    exit();
}

// Get recipe
$stmt = $conn->prepare("SELECT r.*, u.username FROM recipes r LEFT JOIN users u ON r.user_id = u.id WHERE r.id = ?");
$stmt->bind_param("i", $recipeId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $recipe = $result->fetch_assoc();

    // Get ingredients
    $ingStmt = $conn->prepare("SELECT GROUP_CONCAT(ingredient SEPARATOR ',') as ingredients FROM recipe_ingredients WHERE recipe_id = ?");
    $ingStmt->bind_param("i", $recipeId);
    $ingStmt->execute();
    $recipe['ingredients'] = $ingStmt->get_result()->fetch_assoc()['ingredients'] ?? '';

    // Get steps  
    $stepStmt = $conn->prepare("SELECT GROUP_CONCAT(instruction SEPARATOR '.') as steps FROM recipe_steps WHERE recipe_id = ?");
    $stepStmt->bind_param("i", $recipeId);
    $stepStmt->execute();
    $recipe['steps'] = $stepStmt->get_result()->fetch_assoc()['steps'] ?? '';

    // Check purchase status
    $purchaseStmt = $conn->prepare("SELECT id FROM recipe_purchases WHERE user_id = ? AND recipe_id = ?");
    $purchaseStmt->bind_param("ii", $userId, $recipeId);
    $purchaseStmt->execute();
    $recipe['purchased'] = $purchaseStmt->get_result()->num_rows > 0;

    // Get like count
    $likeStmt = $conn->prepare("SELECT COUNT(*) as likes FROM recipe_likes WHERE recipe_id = ?");
    $likeStmt->bind_param("i", $recipeId);
    $likeStmt->execute();
    $recipe['likes'] = $likeStmt->get_result()->fetch_assoc()['likes'] ?? 0;

    echo json_encode([
        'success' => true,
        'recipe' => $recipe
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Recipe not found']);
}

$db->closeConnection();
    