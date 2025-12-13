<?php
require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';

header('Content-Type: application/json');

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
    if (empty($input['cookbook_id'])) {
        $response->validationError(['cookbook_id' => 'Cookbook ID is required']);
        exit;
    }

    if (empty($input['recipe_id'])) {
        $response->validationError(['recipe_id' => 'Recipe ID is required']);
        exit;
    }

    $cookbook_id = $input['cookbook_id'];
    $recipe_id = $input['recipe_id'];
    
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

    // Check if recipe exists
    $recipe = $dbHelper->getRecipe($recipe_id, $user_id);
    if (!$recipe) {
        $response->notFound('Recipe not found');
        exit;
    }

    // Check if user has access to recipe
    if ($recipe['is_paid'] && !$recipe['has_access'] && $recipe['user_id'] !== $user_id) {
        $response->forbidden('You do not have access to this recipe');
        exit;
    }

    // Check if recipe already in cookbook
    $existing = $dbHelper->checkRecipeInCookbook($cookbook_id, $recipe_id);
    if ($existing) {
        $response->error('Recipe already exists in this cookbook', 409);
        exit;
    }

    // Add recipe to cookbook
    $success = $dbHelper->manageCookbookRecipe($cookbook_id, $recipe_id, 'add', $user_id);
    
    if (!$success) {
        $response->error('Failed to add recipe to cookbook', 500);
        exit;
    }

    // Log activity
    $dbHelper->logActivity($user_id, 'recipe_added_to_cookbook', [
        'cookbook_id' => $cookbook_id,
        'cookbook_name' => $cookbook['name'],
        'recipe_id' => $recipe_id,
        'recipe_title' => $recipe['title']
    ]);

    $response->success([
        'cookbook_id' => $cookbook_id,
        'recipe_id' => $recipe_id,
        'added_at' => date('Y-m-d H:i:s')
    ], 'Recipe added to cookbook successfully');
    
} catch (Exception $e) {
    error_log("Add recipe to cookbook error: " . $e->getMessage());
    $response->error('Server error', 500);
}
?>