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

    $user_id = $decodedToken['user_id'];

    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $responseFormatter->error('Method not allowed', 405);
        exit;
    }

    // Get and validate request data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['item_id'])) {
        $responseFormatter->error('Invalid request data. item_id is required.', 400);
        exit;
    }

    $item_id = $input['item_id'];

    // Validate item_id
    if (empty($item_id)) {
        $responseFormatter->error('Item ID cannot be empty', 400);
        exit;
    }

    // Process purchase
    $databaseHelper = new DatabaseHelper();
    $purchaseResult = $databaseHelper->purchaseItem($user_id, $item_id);

    if ($purchaseResult === false) {
        $responseFormatter->error('Purchase failed. Check your balance or item availability.', 400);
        exit;
    }

    $responseData = [
        'success' => true,
        'data' => $purchaseResult,
        'message' => 'Item purchased successfully!'
    ];

    echo json_encode($responseData);
} catch (Exception $e) {
    error_log('Purchase error: ' . $e->getMessage());
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