<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once '../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

// Get recipe ID from URL parameter
$recipeId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($recipeId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Recipe ID required']);
    exit();
}

// Get recipe with user info
$sql = "SELECT r.*, u.username 
        FROM recipes r 
        LEFT JOIN users u ON r.user_id = u.id 
        WHERE r.id = $recipeId 
        LIMIT 1";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $recipe = $result->fetch_assoc();

    // Get ingredients
    $ingResult = $conn->query("SELECT ingredient FROM recipe_ingredients WHERE recipe_id = $recipeId");
    $ingredients = $ingResult->fetch_assoc()['ingredient'] ?? '';

    // Get steps  
    $stepResult = $conn->query("SELECT instruction FROM recipe_steps WHERE recipe_id = $recipeId LIMIT 1");
    $steps = $stepResult->fetch_assoc()['instruction'] ?? '';

    echo json_encode([
        'success' => true,
        'recipe' => array_merge($recipe, [
            'ingredients' => $ingredients,
            'steps' => $steps
        ])
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Recipe not found'
    ]);
}

$db->closeConnection();
