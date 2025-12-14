<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

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

// Check if it's a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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

try {
    // Get optional category filter
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    
    // Get inventory items
    $inventory = $dbHelper->getUserInventory($userId, $category);
    
    // Separate equipped and unequipped items
    $equipped = [];
    $unequipped = [];
    
    foreach ($inventory as $item) {
        if ($item['is_equipped']) {
            $equipped[] = $item;
        } else {
            $unequipped[] = $item;
        }
    }
    
    // Format response
    $formattedItems = [];
    foreach ($inventory as $item) {
        $formattedItem = [
            'id' => $item['inventory_id'],
            'item_id' => $item['item_id'],
            'name' => $item['name'],
            'description' => $item['description'],
            'item_type' => $item['item_type'],
            'category' => $item['category'],
            'quantity' => $item['quantity'],
            'image_url' => $item['image_url'],
            'is_equipped' => (bool)$item['is_equipped'],
            'purchased_at' => $item['purchased_at'],
            'expires_at' => $item['expires_at']
        ];
        
        // Add effect details for consumables and boosts
        if (in_array($item['item_type'], ['consumable', 'boost'])) {
            $formattedItem['effect_value'] = (int)$item['effect_value'];
            $formattedItem['duration_days'] = $item['duration_days'] ? (int)$item['duration_days'] : null;
        }
        
        $formattedItems[] = $formattedItem;
    }
    
    // Get equipped items separately
    $equippedItems = $dbHelper->getEquippedItems($userId);
    
    $result = [
        'inventory' => $formattedItems,
        'equipped' => $equippedItems,
        'total_items' => count($inventory),
        'equipped_count' => count($equipped),
        'categories' => array_unique(array_column($inventory, 'category'))
    ];
    
    $response->success($result, 'Inventory retrieved successfully', 200);
    
} catch (Exception $e) {
    error_log('Inventory list error: ' . $e->getMessage());
    $response->error('Failed to retrieve inventory: ' . $e->getMessage(), 500);
}
?>