<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error('Method not allowed', 405);
    exit();
}

// Get Authorization header
$token = AuthHelper::getBearerToken();

if (!$token) {
    ResponseFormatter::unauthorized('No authentication token provided');
    exit();
}

// Validate token
$userData = AuthHelper::validateToken($token);

if (!$userData) {
    ResponseFormatter::unauthorized('Invalid or expired token');
    exit();
}

$user_id = $userData['user_id'];

try {
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['item_id']) || !isset($input['currency_type'])) {
        ResponseFormatter::error('Missing required fields: item_id and currency_type', 400);
        exit();
    }
    
    $item_id = trim($input['item_id']);
    $currency_type = trim($input['currency_type']);
    
    // Validate currency type
    if (!in_array($currency_type, ['gold', 'gem'])) {
        ResponseFormatter::error('Invalid currency type. Must be "gold" or "gem"', 400);
        exit();
    }
    
    // Get item details first to check price
    $db = Database::getConnection();
    
    // Get shop item details
    $sql = "SELECT * FROM shop_items WHERE id = :item_id AND is_available = 1";
    $stmt = $db->prepare($sql);
    $stmt->execute(['item_id' => $item_id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$item) {
        ResponseFormatter::error('Item not found or not available', 404);
        exit();
    }
    
    // Get the price based on currency type
    $price_field = $currency_type . '_price';
    $price = $item[$price_field];
    
    if ($price <= 0) {
        ResponseFormatter::error('Item cannot be purchased with this currency', 400);
        exit();
    }
    
    // Check if user already has this item (for non-consumables)
    if ($item['item_type'] !== 'consumable') {
        $checkSql = "SELECT * FROM user_inventory WHERE user_id = :user_id AND item_id = :item_id";
        $checkStmt = $db->prepare($checkSql);
        $checkStmt->execute(['user_id' => $user_id, 'item_id' => $item_id]);
        
        if ($checkStmt->fetch()) {
            ResponseFormatter::error('You already own this item', 400);
            exit();
        }
    }
    
    // Check user's currency balance
    $balanceSql = "SELECT {$currency_type}_count FROM user_stats WHERE user_id = :user_id";
    $balanceStmt = $db->prepare($balanceSql);
    $balanceStmt->execute(['user_id' => $user_id]);
    $balance = $balanceStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$balance) {
        ResponseFormatter::error('User stats not found', 404);
        exit();
    }
    
    $user_balance = $balance[$currency_type . '_count'];
    
    if ($user_balance < $price) {
        ResponseFormatter::error('Insufficient funds', 400, [
            'required' => $price,
            'current' => $user_balance,
            'currency' => $currency_type
        ]);
        exit();
    }
    
    // Process purchase using DatabaseHelper
    $purchaseResult = DatabaseHelper::purchaseShopItem($user_id, $item_id, $currency_type, $price);
    
    if (!$purchaseResult) {
        ResponseFormatter::error('Failed to process purchase', 500);
        exit();
    }
    
    // Get updated balance
    $updatedBalanceStmt = $db->prepare($balanceSql);
    $updatedBalanceStmt->execute(['user_id' => $user_id]);
    $updatedBalance = $updatedBalanceStmt->fetch(PDO::FETCH_ASSOC);
    
    // Get purchase details
    $purchaseSql = "SELECT * FROM user_shop_purchases 
                    WHERE user_id = :user_id AND item_id = :item_id 
                    ORDER BY purchased_at DESC LIMIT 1";
    $purchaseStmt = $db->prepare($purchaseSql);
    $purchaseStmt->execute(['user_id' => $user_id, 'item_id' => $item_id]);
    $purchaseDetails = $purchaseStmt->fetch(PDO::FETCH_ASSOC);
    
    // If it's a consumable, also get inventory details
    $inventoryDetails = null;
    if ($item['item_type'] === 'consumable') {
        $inventorySql = "SELECT * FROM user_inventory 
                        WHERE user_id = :user_id AND item_id = :item_id 
                        ORDER BY purchased_at DESC LIMIT 1";
        $inventoryStmt = $db->prepare($inventorySql);
        $inventoryStmt->execute(['user_id' => $user_id, 'item_id' => $item_id]);
        $inventoryDetails = $inventoryStmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Log activity
    DatabaseHelper::logActivity($user_id, 'shop_purchase', [
        'item_id' => $item_id,
        'item_name' => $item['name'],
        'currency_type' => $currency_type,
        'price' => $price,
        'item_type' => $item['item_type']
    ]);
    
    // Return success response
    ResponseFormatter::success([
        'purchase' => $purchaseDetails,
        'item' => $item,
        'inventory' => $inventoryDetails,
        'balances' => [
            'gold' => $updatedBalance['gold_count'],
            'gems' => $updatedBalance['gem_count']
        ],
        'message' => 'Purchase successful! ' . ($item['item_type'] === 'consumable' ? 'Item added to inventory.' : 'Item unlocked!')
    ], 'Purchase completed successfully', 200);
    
} catch (PDOException $e) {
    error_log("Database error in purchase/item.php: " . $e->getMessage());
    ResponseFormatter::error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Error in purchase/item.php: " . $e->getMessage());
    ResponseFormatter::error('An error occurred: ' . $e->getMessage(), 500);
}