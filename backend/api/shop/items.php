<?php
header('Content-Type: application/json');
require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';

// Enable CORS
require_once '../../config/cors.php';
setCorsHeaders();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    handlePreflight();
    exit;
}

$responseFormatter = new ResponseFormatter();

try {
    // Verify authentication
    $authHelper = new AuthHelper();
    $token = getAuthorizationToken();

    if (!$token || !$authHelper->validateToken($token)) {
        $responseFormatter->unauthorized('Authentication required');
        exit;
    }

    $decodedToken = $authHelper->validateToken($token);
    if (!$decodedToken) {
        $responseFormatter->unauthorized('Invalid token');
        exit;
    }

    // Get shop items with optional filters
    $databaseHelper = new DatabaseHelper();

    // Get query parameters
    $category = $_GET['category'] ?? null;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

    // Build filters array
    $filters = [];
    if ($category) {
        $filters['category'] = $category;
    }

    // Get shop items from database
    $shopItems = $databaseHelper->getShopItems($filters, $limit, $offset);

    if ($shopItems === false) {
        $responseFormatter->error('Failed to fetch shop items', 500);
        exit;
    }

    // Get item categories for filtering
    $categories = $databaseHelper->getItemCategories();

    $responseData = [
        'success' => true,
        'data' => [
            'items' => $shopItems,
            'categories' => $categories,
            'pagination' => [
                'limit' => $limit,
                'offset' => $offset,
                'total' => count($shopItems)
            ]
        ],
        'message' => 'Shop items retrieved successfully'
    ];

    echo json_encode($responseData);
} catch (Exception $e) {
    error_log('Shop items error: ' . $e->getMessage());
    $responseFormatter->error('Internal server error', 500, $e->getMessage());
}

// Helper function to get authorization token from headers
function getAuthorizationToken()
{
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
    }
    return null;
}