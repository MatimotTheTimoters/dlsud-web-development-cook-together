<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);
$recipeId = intval($data['recipe_id'] ?? 0);
$userId = 1; // Demo user

if ($recipeId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid recipe']);
    exit();
}

try {
    // Check if already purchased
    $checkStmt = $conn->prepare("SELECT id FROM recipe_purchases WHERE user_id = ? AND recipe_id = ?");
    $checkStmt->bind_param("ii", $userId, $recipeId);
    $checkStmt->execute();

    if ($checkStmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Already purchased']);
        exit();
    }

    // Get user gold
    $goldStmt = $conn->prepare("SELECT gold_count FROM user_stats WHERE user_id = ?");
    $goldStmt->bind_param("i", $userId);
    $goldStmt->execute();
    $goldResult = $goldStmt->get_result()->fetch_assoc();
    $userGold = $goldResult['gold_count'] ?? 100;

    $recipePrice = 50; // Default price

    if ($userGold < $recipePrice) {
        echo json_encode(['success' => false, 'message' => 'Not enough gold']);
        exit();
    }

    // Start transaction
    $conn->begin_transaction();

    // Deduct gold
    $updateStmt = $conn->prepare("UPDATE user_stats SET gold_count = gold_count - ? WHERE user_id = ?");
    $updateStmt->bind_param("ii", $recipePrice, $userId);
    $updateStmt->execute();

    // Record purchase
    $purchaseStmt = $conn->prepare("INSERT INTO recipe_purchases (user_id, recipe_id, price_gold) VALUES (?, ?, ?)");
    $purchaseStmt->bind_param("iii", $userId, $recipeId, $recipePrice);
    $purchaseStmt->execute();

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Recipe purchased!',
        'new_balance' => $userGold - $recipePrice
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Purchase failed: ' . $e->getMessage()]);
}

$db->closeConnection();
