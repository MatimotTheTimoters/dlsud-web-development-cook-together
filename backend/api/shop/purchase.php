<?php
// backend/api/shop/purchase.php
header('Content-Type: application/json');
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';
require_once '../purchase/item.php';

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

if (!isset($input['item_id']) || !isset($input['currency_type'])) {
    $response->badRequest('Item ID and currency type are required');
    exit;
}

$itemId = $input['item_id'];
$currencyType = $input['currency_type'];

// Validate currency type
if (!in_array($currencyType, ['gold', 'gem'])) {
    $response->badRequest('Currency type must be "gold" or "gem"');
    exit;
}

try {
    // Validate shop purchase
    $validated = validateShopPurchase($userId, $itemId);
    if (!$validated['valid']) {
        $response->badRequest($validated['message']);
        exit;
    }
    
    // Get item price based on currency type
    $priceField = $currencyType . '_price';
    $item = $validated['item'];
    $price = $item[$priceField];
    
    if ($price <= 0) {
        $response->badRequest('Item cannot be purchased with this currency');
        exit;
    }
    
    // Redirect to purchase/item.php for actual purchase processing
    // In a real implementation, we'd call the function directly
    $purchaseResult = processItemPurchase($userId, $itemId, $currencyType, $price);
    
    if ($purchaseResult['success']) {
        // Log activity
        $activityData = [
            'item_name' => $item['name'],
            'currency_type' => $currencyType,
            'price' => $price,
            'item_id' => $itemId
        ];
        $dbHelper->logActivity($userId, 'shop_purchase', $activityData);
        
        $response->success($purchaseResult, 'Item purchased successfully', 200);
    } else {
        $response->error($purchaseResult['message'], 400);
    }
    
} catch (Exception $e) {
    error_log('Shop purchase error: ' . $e->getMessage());
    $response->error('Failed to purchase item: ' . $e->getMessage(), 500);
}

/**
 * Validates shop purchase request
 * 
 * @param string $userId User ID
 * @param string $itemId Item ID
 * @return array Validation result
 */
function validateShopPurchase(string $userId, string $itemId): array {
    try {
        $conn = connect();
        
        // Check if item exists and is available
        $stmt = $conn->prepare("SELECT * FROM shop_items WHERE id = ? AND is_available = 1");
        $stmt->execute([$itemId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$item) {
            return [
                'valid' => false,
                'message' => 'Item not found or not available'
            ];
        }
        
        // Check if user already owns this item (for non-consumable items)
        if ($item['item_type'] !== 'consumable') {
            $stmt = $conn->prepare("SELECT COUNT(*) as count FROM user_inventory WHERE user_id = ? AND item_id = ?");
            $stmt->execute([$userId, $itemId]);
            $owned = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($owned['count'] > 0) {
                return [
                    'valid' => false,
                    'message' => 'You already own this item'
                ];
            }
        }
        
        // Check user's currency balance
        $stmt = $conn->prepare("SELECT gold_count, gem_count FROM user_stats WHERE user_id = ?");
        $stmt->execute([$userId]);
        $userStats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$userStats) {
            return [
                'valid' => false,
                'message' => 'User stats not found'
            ];
        }
        
        // Check if user can afford with either currency
        $canAffordGold = $userStats['gold_count'] >= $item['gold_price'];
        $canAffordGem = $userStats['gem_count'] >= $item['gem_price'];
        
        if (!$canAffordGold && !$canAffordGem) {
            return [
                'valid' => false,
                'message' => 'Insufficient currency to purchase this item'
            ];
        }
        
        return [
            'valid' => true,
            'item' => $item,
            'can_afford_gold' => $canAffordGold,
            'can_afford_gem' => $canAffordGem
        ];
        
    } catch (Exception $e) {
        return [
            'valid' => false,
            'message' => 'Validation error: ' . $e->getMessage()
        ];
    }
}

/**
 * Processes item purchase (redirects to purchase/item.php logic)
 * 
 * @param string $userId User ID
 * @param string $itemId Item ID
 * @param string $currencyType Gold or Gem
 * @param int $price Price to pay
 * @return array Purchase result
 */
function processItemPurchase(string $userId, string $itemId, string $currencyType, int $price): array {
    // This function would normally call purchase/item.php
    // For now, we'll implement the logic here
    
    try {
        $conn = connect();
        $conn->beginTransaction();
        
        // Get item details
        $stmt = $conn->prepare("SELECT * FROM shop_items WHERE id = ?");
        $stmt->execute([$itemId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$item) {
            throw new Exception('Item not found');
        }
        
        // Deduct currency
        $currencyField = $currencyType . '_count';
        $stmt = $conn->prepare("UPDATE user_stats SET $currencyField = $currencyField - ? WHERE user_id = ? AND $currencyField >= ?");
        $stmt->execute([$price, $userId, $price]);
        
        if ($stmt->rowCount() === 0) {
            throw new Exception('Insufficient funds');
        }
        
        // Record purchase
        $purchaseId = generateUniqueId('user_shop_purchases', 'id');
        $expiresAt = null;
        if ($item['duration_days']) {
            $expiresAt = date('Y-m-d H:i:s', strtotime('+' . $item['duration_days'] . ' days'));
        }
        
        $purchaseData = [
            'id' => $purchaseId,
            'user_id' => $userId,
            'item_id' => $itemId,
            'currency_type' => $currencyType,
            'price' => $price,
            'expires_at' => $expiresAt
        ];
        
        $stmt = $conn->prepare("
            INSERT INTO user_shop_purchases (id, user_id, item_id, currency_type, price, expires_at) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute(array_values($purchaseData));
        
        // Add to inventory
        $inventoryId = generateUniqueId('user_inventory', 'id');
        $inventoryData = [
            'id' => $inventoryId,
            'user_id' => $userId,
            'item_id' => $itemId,
            'quantity' => 1,
            'expires_at' => $expiresAt
        ];
        
        $stmt = $conn->prepare("
            INSERT INTO user_inventory (id, user_id, item_id, quantity, expires_at) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute(array_values($inventoryData));
        
        // Update purchase count
        $stmt = $conn->prepare("UPDATE shop_items SET purchase_count = purchase_count + 1 WHERE id = ?");
        $stmt->execute([$itemId]);
        
        $conn->commit();
        
        return [
            'success' => true,
            'purchase_id' => $purchaseId,
            'inventory_id' => $inventoryId,
            'item_name' => $item['name'],
            'currency_type' => $currencyType,
            'price_paid' => $price,
            'expires_at' => $expiresAt,
            'remaining_balance' => [
                'gold' => $currencyType === 'gold' ? -$price : 0,
                'gem' => $currencyType === 'gem' ? -$price : 0
            ]
        ];
        
    } catch (Exception $e) {
        if (isset($conn) && $conn->inTransaction()) {
            $conn->rollBack();
        }
        return [
            'success' => false,
            'message' => 'Purchase failed: ' . $e->getMessage()
        ];
    }
}

/**
 * Generates a unique ID
 * 
 * @param string $table Table name
 * @param string $field Field name
 * @return string Unique ID
 */
function generateUniqueId(string $table, string $field): string {
    return uniqid($table . '_', true);
}

/**
 * Extracts Bearer token from Authorization header
 * 
 * @return string|null Token or null if not found
 */
function getAuthorizationToken(): ?string {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }
    }
    return null;
}
?>