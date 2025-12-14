<?php
// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/database.php';  // This provides Database class
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../purchase/item.php';  // Fixed path

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

    // Use DatabaseHelper method for purchase
    $success = $dbHelper->purchaseShopItem($userId, $itemId, $currencyType, $price);

    if ($success) {
        // Get updated inventory and stats
        $inventoryItem = $dbHelper->getItemDetails($itemId);
        $userStats = $dbHelper->getUserStats($userId);

        // Log activity
        $activityData = [
            'item_name' => $item['name'],
            'currency_type' => $currencyType,
            'price' => $price,
            'item_id' => $itemId
        ];
        $dbHelper->logActivity($userId, 'shop_purchase', $activityData);

        $result = [
            'success' => true,
            'item_name' => $item['name'],
            'currency_type' => $currencyType,
            'price_paid' => $price,
            'item_added_to_inventory' => true,
            'remaining_balance' => [
                'gold' => $userStats['gold_count'] ?? 0,
                'gem' => $userStats['gem_count'] ?? 0
            ],
            'message' => 'Item purchased successfully'
        ];

        $response->success($result, 'Item purchased successfully', 200);
    } else {
        $response->error('Failed to complete purchase', 400);
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
function validateShopPurchase(string $userId, string $itemId): array
{
    try {
        // Use Database class instead of connect()
        $conn = Database::getConnection();

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

        // Check user's currency balance using DatabaseHelper
        $dbHelper = new DatabaseHelper();
        $userStats = $dbHelper->getUserStats($userId);

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
 * Generates a unique ID using DatabaseHelper's method
 * 
 * @param string $table Table name
 * @param string $field Field name
 * @return string Unique ID
 */
function generateUniqueId(string $table, string $field): string
{
    // Use the existing function from utils if available
    if (function_exists('\generateUniqueId')) {
        return \generateUniqueId($table, $field);
    }
    // Fallback to simple ID generation
    return uniqid($table . '_', true);
}
