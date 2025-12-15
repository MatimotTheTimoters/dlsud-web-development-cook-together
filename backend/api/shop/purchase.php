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
$itemId = intval($data['item_id'] ?? 0);
$userId = 1; // Demo user

if ($itemId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid item']);
    exit();
}

try {
    // Get item price
    $itemStmt = $conn->prepare("SELECT price_gold FROM shop_items WHERE id = ?");
    $itemStmt->bind_param("i", $itemId);
    $itemStmt->execute();
    $itemResult = $itemStmt->get_result()->fetch_assoc();

    if (!$itemResult) {
        echo json_encode(['success' => false, 'message' => 'Item not found']);
        exit();
    }

    $price = $itemResult['price_gold'];

    // Check if already purchased
    $checkStmt = $conn->prepare("SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ?");
    $checkStmt->bind_param("ii", $userId, $itemId);
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

    if ($userGold < $price) {
        echo json_encode(['success' => false, 'message' => 'Not enough gold']);
        exit();
    }

    // Start transaction
    $conn->begin_transaction();

    // Deduct gold
    $updateStmt = $conn->prepare("UPDATE user_stats SET gold_count = gold_count - ? WHERE user_id = ?");
    $updateStmt->bind_param("ii", $price, $userId);
    $updateStmt->execute();

    // Add to inventory
    $invStmt = $conn->prepare("INSERT INTO user_inventory (user_id, item_id) VALUES (?, ?)");
    $invStmt->bind_param("ii", $userId, $itemId);
    $invStmt->execute();

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Item purchased!',
        'new_balance' => $userGold - $price
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Purchase failed: ' . $e->getMessage()]);
}

$db->closeConnection();
