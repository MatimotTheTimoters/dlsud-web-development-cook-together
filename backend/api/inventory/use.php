<?php
// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/database.php';  // This provides Database class
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../classes/UserCalculations.php';

$response = new ResponseFormatter();
$authHelper = new AuthHelper();
$dbHelper = new DatabaseHelper();
$userCalculations = new UserCalculations();

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

if (!isset($input['inventory_id'])) {
    $response->badRequest('Inventory item ID is required');
    exit;
}

$inventoryId = $input['inventory_id'];

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

    // Validate item can be used
    if ($item['item_type'] !== 'consumable') {
        $response->badRequest('Only consumable items can be used');
        exit;
    }

    if ($item['quantity'] <= 0) {
        $response->badRequest('Item quantity is zero');
        exit;
    }

    if ($item['expires_at'] && strtotime($item['expires_at']) < time()) {
        $response->badRequest('Item has expired');
        exit;
    }

    // Get current user stats using DatabaseHelper method instead
    $userStats = $dbHelper->getUserStats($userId);

    if (!$userStats) {
        $response->error('User stats not found', 404);
        exit;
    }

    // Apply consumable effect
    $effectData = $userCalculations->applyConsumableEffect($userStats, $item['item_type'], $item['effect_value']);

    // Start transaction
    $conn->beginTransaction();

    try {
        // Update user stats using DatabaseHelper instead of direct PDO
        $updateSuccess = $dbHelper->updateUserStats($userId, $effectData['updated_stats']);

        if (!$updateSuccess) {
            throw new Exception('Failed to update user stats');
        }

        // Reduce item quantity using DatabaseHelper method
        $remaining = $item['quantity'] - 1;
        if ($remaining > 0) {
            // Update quantity
            $sql = "UPDATE user_inventory SET quantity = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$remaining, $inventoryId]);
        } else {
            // Remove item
            $sql = "DELETE FROM user_inventory WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$inventoryId]);
        }

        // Log activity
        $activityData = [
            'item_name' => $item['name'],
            'effect' => $effectData['effect_description'],
            'inventory_id' => $inventoryId
        ];
        $dbHelper->logActivity($userId, 'use_item', $activityData);

        // Commit transaction
        $conn->commit();

        // Format response
        $result = [
            'success' => true,
            'item_used' => $item['name'],
            'remaining_quantity' => $remaining,
            'effect_applied' => $effectData['effect_description'],
            'updated_stats' => $effectData['updated_stats'],
            'message' => 'Item used successfully'
        ];

        $response->success($result, 'Item used successfully', 200);
    } catch (Exception $e) {
        $conn->rollBack();
        throw $e;
    }
} catch (Exception $e) {
    error_log('Use item error: ' . $e->getMessage());
    $response->error('Failed to use item: ' . $e->getMessage(), 500);
}
