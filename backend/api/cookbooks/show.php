<?php
require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';

header('Content-Type: application/json');

$response = new ResponseFormatter();

try {
    // Get cookbook ID from URL
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        $response->badRequest('Cookbook ID is required');
        exit;
    }

    $cookbook_id = $_GET['id'];
    
    // Check authentication
    $token = AuthHelper::getBearerToken();
    $user_id = null;
    $is_owner = false;
    
    if ($token) {
        $userData = AuthHelper::validateToken($token);
        if ($userData) {
            $user_id = $userData['user_id'];
        }
    }

    $dbHelper = new DatabaseHelper();
    
    // Get cookbook
    $include_recipes = isset($_GET['include_recipes']) ? (bool)$_GET['include_recipes'] : true;
    $cookbook = $dbHelper->getCookbook($cookbook_id, $include_recipes);
    
    if (!$cookbook) {
        $response->notFound('Cookbook not found');
        exit;
    }

    // Check permissions
    if ($user_id) {
        $is_owner = ($cookbook['user_id'] === $user_id);
    }
    
    // If cookbook is not public and user is not owner
    if (!$cookbook['is_public'] && !$is_owner) {
        $response->forbidden('You do not have permission to view this cookbook');
        exit;
    }

    // Add permission info to response
    $cookbook['permissions'] = [
        'can_edit' => $is_owner,
        'can_add_recipe' => $is_owner,
        'can_remove_recipe' => $is_owner
    ];

    $response->success($cookbook, 'Cookbook retrieved successfully');
    
} catch (Exception $e) {
    error_log("Cookbook show error: " . $e->getMessage());
    $response->error('Server error', 500);
}
?>