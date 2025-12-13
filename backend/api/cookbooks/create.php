<?php
require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';
require_once '../../utils/uuidHelper.php';

header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = new ResponseFormatter();

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response->error('Method not allowed', 405);
    exit;
}

try {
    // Get authorization header
    $token = AuthHelper::getBearerToken();
    if (!$token) {
        $response->unauthorized('Authentication required');
        exit;
    }

    // Validate token
    $userData = AuthHelper::validateToken($token);
    if (!$userData) {
        $response->unauthorized('Invalid or expired token');
        exit;
    }

    $user_id = $userData['user_id'];
    
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        $response->badRequest('Invalid JSON input');
        exit;
    }

    // Validate required fields
    if (empty($input['name'])) {
        $response->validationError(['name' => 'Cookbook name is required']);
        exit;
    }

    // Prepare cookbook data
    $cookbookData = [
        'id' => makeId(),
        'user_id' => $user_id,
        'name' => trim($input['name']),
        'description' => isset($input['description']) ? trim($input['description']) : null,
        'is_public' => isset($input['is_public']) ? (bool)$input['is_public'] : false
    ];

    // Create cookbook
    $dbHelper = new DatabaseHelper();
    $cookbookId = $dbHelper->createCookbook($cookbookData);
    
    if (!$cookbookId) {
        $response->error('Failed to create cookbook', 500);
        exit;
    }

    // Get the created cookbook
    $cookbook = $dbHelper->getCookbook($cookbookId, false);
    
    // Log activity
    $dbHelper->logActivity($user_id, 'cookbook_created', [
        'cookbook_id' => $cookbookId,
        'cookbook_name' => $cookbookData['name']
    ]);

    $response->created($cookbook, 'Cookbook created successfully');
    
} catch (Exception $e) {
    error_log("Cookbook create error: " . $e->getMessage());
    $response->error('Server error: ' . $e->getMessage(), 500);
}
?>