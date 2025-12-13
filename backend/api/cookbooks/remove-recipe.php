<?php
require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';

header('Content-Type: application/json');

$response = new ResponseFormatter();

// Check if it's a DELETE request
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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
    
    // Get DELETE data from URL parameters
    $cookbook_id = isset($_GET['cookbook_id']) ? $_GET['cookbook_id'] : null;
    $recipe_id = isset($_GET['recipe_id']) ? $_GET['recipe_id'] : null;
    
    if (!$cookbook_id || !$recipe_id) {
        $response->badRequest('Both cookbook_id and recipe_id are required');
        exit;
    }

    $dbHelper = new DatabaseHelper();
    
    // Check if cookbook exists and user owns it
    $cookbook = $dbHelper->getCookbook($cookbook_id, false);
    if (!$cookbook) {
        $response->notFound('Cookbook not found');
        exit;
    }
    
    if ($cookbook['user_id'] !== $user_id) {
        $response->forbidden('You do not own this cookbook');
        exit;
    }

    // Check if recipe exists in cookbook
    $existing = $dbHelper->checkRecipeInCookbook($cookbook_id, $recipe_id);
    if (!$existing) {
        $response->notFound('Recipe not found in this cookbook');
        exit;
    }

    // Remove recipe from cookbook
    $success = $dbHelper->manageCookbookRecipe($cookbook_id, $recipe_id, 'remove', $user_id);
    
    if (!$success) {
        $response->error('Failed to remove recipe from cookbook', 500);
        exit;
    }

    // Log activity
    $dbHelper->logActivity($user_id, 'recipe_removed_from_cookbook', [
        'cookbook_id' => $cookbook_id,
        'cookbook_name' => $cookbook['name'],
        'recipe_id' => $recipe_id
    ]);

    $response->success([
        'cookbook_id' => $cookbook_id,
        'recipe_id' => $recipe_id,
        'removed_at' => date('Y-m-d H:i:s')
    ], 'Recipe removed from cookbook successfully');
    
} catch (Exception $e) {
    error_log("Remove recipe from cookbook error: " . $e->getMessage());
    $response->error('Server error', 500);
}
?>