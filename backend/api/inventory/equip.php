<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/database.php';  // This provides Database class
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

$response = new ResponseFormatter();
$authHelper = new AuthHelper();
$dbHelper = new DatabaseHelper();

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response->error('Method not allowed', 405);
    exit;
}

// Get authorization token
$token = $authHelper->getBearerToken();
if (!$token) {
    $response->unauthorized('No authentication token provided');
    exit;
}

// Validate token
$userData = $authHelper->validateToken($token);
if (!$userData) {
    $response->unauthorized('Invalid or expired token');
    exit;
}

$userId = $userData['user_id'];

// Get request body
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['inventory_id']) || !isset($input['action'])) {
    $response->badRequest('Inventory item ID and action are required');
    exit;
}

$inventoryId = $input['inventory_id'];
$action = $input['action']; // 'equip' or 'unequip'

if (!in_array($action, ['equip', 'unequip'])) {
    $response->badRequest('Action must be "equip" or "unequip"');
    exit;
}

try {
    // Use Database::getConnection() instead of connect()
    $conn = Database::getConnection();

    // Get inventory item details
    $stmt = $conn->prepare("
        SELECT ui.*, si.* 
        FROM user_inventory ui 
        JOIN shop_items si ON ui.item_id = si.id 
        WHERE ui.id = ? AND ui.user_id = ?
    ");
    $stmt->execute([$inventoryId, $userId]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        $response->notFound('Inventory item not found');
        exit;
    }

    // Validate item can be equipped
    if ($item['item_type'] !== 'equipment') {
        $response->badRequest('Only equipment items can be equipped');
        exit;
    }

    // Check category limits (e.g., only one item per category can be equipped)
    $category = $item['category'];

    // Start transaction
    $conn->beginTransaction();

    try {
        if ($action === 'equip') {
            // Unequip any other item in the same category first
            $stmt = $conn->prepare("
                UPDATE user_inventory ui
                JOIN shop_items si ON ui.item_id = si.id
                SET ui.is_equipped = 0
                WHERE ui.user_id = ? 
                AND si.category = ? 
                AND ui.is_equipped = 1
                AND ui.id != ?
            ");
            $stmt->execute([$userId, $category, $inventoryId]);

            // Equip the selected item
            $stmt = $conn->prepare("UPDATE user_inventory SET is_equipped = 1 WHERE id = ?");
            $stmt->execute([$inventoryId]);

            $message = "{$item['name']} equipped successfully";
        } else { // unequip
            // Unequip the item
            $stmt = $conn->prepare("UPDATE user_inventory SET is_equipped = 0 WHERE id = ?");
            $stmt->execute([$inventoryId]);

            $message = "{$item['name']} unequipped successfully";
        }

        // Log activity
        $activityData = [
            'item_name' => $item['name'],
            'action' => $action,
            'category' => $category,
            'inventory_id' => $inventoryId
        ];
        $dbHelper->logActivity($userId, 'equip_item', $activityData);

        // Commit transaction
        $conn->commit();

        // Get updated equipped items
        $equippedItems = $dbHelper->getEquippedItems($userId);

        $result = [
            'success' => true,
            'action' => $action,
            'item_name' => $item['name'],
            'is_equipped' => $action === 'equip',
            'equipped_items' => $equippedItems,
            'message' => $message
        ];

        $response->success($result, $message, 200);
    } catch (Exception $e) {
        $conn->rollBack();
        throw $e;
    }
} catch (Exception $e) {
    error_log('Equip item error: ' . $e->getMessage());
    $response->error('Failed to equip/unequip item: ' . $e->getMessage(), 500);
}
