<?php
// backend/api/inventory/use.php
header('Content-Type: application/json');
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';
require_once '../../classes/UserCalculations.php';

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
    // Get inventory item details
    $conn = connect();
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
    
    // Get current user stats
    $stmt = $conn->prepare("SELECT * FROM user_stats WHERE user_id = ?");
    $stmt->execute([$userId]);
    $userStats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$userStats) {
        $response->error('User stats not found', 404);
        exit;
    }
    
    // Apply consumable effect
    $effectData = $userCalculations->applyConsumableEffect($userStats, $item['item_type'], $item['effect_value']);
    
    // Start transaction
    $conn->beginTransaction();
    
    try {
        // Update user stats
        foreach ($effectData['updated_stats'] as $field => $value) {
            $stmt = $conn->prepare("UPDATE user_stats SET $field = ? WHERE user_id = ?");
            $stmt->execute([$value, $userId]);
        }
        
        // Reduce item quantity or remove if quantity becomes 0
        if ($item['quantity'] > 1) {
            $stmt = $conn->prepare("UPDATE user_inventory SET quantity = quantity - 1 WHERE id = ?");
            $stmt->execute([$inventoryId]);
            $remaining = $item['quantity'] - 1;
        } else {
            $stmt = $conn->prepare("DELETE FROM user_inventory WHERE id = ?");
            $stmt->execute([$inventoryId]);
            $remaining = 0;
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
?>