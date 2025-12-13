<?php
// backend/api/shop/items.php
header('Content-Type: application/json');
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';

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
    // Get optional filters
    $filters = [];
    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $filters['category'] = $_GET['category'];
    }
    if (isset($_GET['item_type']) && !empty($_GET['item_type'])) {
        $filters['item_type'] = $_GET['item_type'];
    }
    
    // Get shop items
    $items = $dbHelper->getShopItems($filters);
    
    // Get user stats to check affordability
    $userStats = $dbHelper->getUserStats($userId);
    
    // Format response with affordability info
    $formattedItems = [];
    foreach ($items as $item) {
        $formattedItem = [
            'id' => $item['id'],
            'name' => $item['name'],
            'description' => $item['description'],
            'item_type' => $item['item_type'],
            'category' => $item['category'],
            'gold_price' => (int)$item['gold_price'],
            'gem_price' => (int)$item['gem_price'],
            'effect_value' => $item['effect_value'] ? (int)$item['effect_value'] : null,
            'duration_days' => $item['duration_days'] ? (int)$item['duration_days'] : null,
            'image_url' => $item['image_url'],
            'is_available' => (bool)$item['is_available'],
            'purchase_count' => (int)$item['purchase_count']
        ];
        
        // Check affordability
        if ($userStats) {
            $formattedItem['can_afford_gold'] = $userStats['gold_count'] >= $item['gold_price'];
            $formattedItem['can_afford_gem'] = $userStats['gem_count'] >= $item['gem_price'];
            $formattedItem['user_gold'] = (int)$userStats['gold_count'];
            $formattedItem['user_gems'] = (int)$userStats['gem_count'];
        }
        
        $formattedItems[] = $formattedItem;
    }
    
    // Get categories for filtering
    $categories = array_unique(array_column($items, 'category'));
    $itemTypes = array_unique(array_column($items, 'item_type'));
    
    $result = [
        'items' => $formattedItems,
        'total_items' => count($formattedItems),
        'categories' => array_values($categories),
        'item_types' => array_values($itemTypes),
        'currency_rates' => [
            'gold_to_gem' => 10, // 10 gold = 1 gem (example rate)
            'gem_to_gold' => 0.1 // 1 gem = 10 gold
        ]
    ];
    
    $response->success($result, 'Shop items retrieved successfully', 200);
    
} catch (Exception $e) {
    error_log('Shop items error: ' . $e->getMessage());
    $response->error('Failed to retrieve shop items: ' . $e->getMessage(), 500);
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