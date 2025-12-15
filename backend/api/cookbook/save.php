<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once '../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$recipeId = isset($data['recipe_id']) ? intval($data['recipe_id']) : 0;

// For demo purposes, using user_id = 1 (you'll replace with actual session user later)
$userId = 1;

if ($recipeId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid recipe ID']);
    exit();
}

try {
    // Check if recipe already in cookbook
    $checkStmt = $conn->prepare("SELECT id FROM cookbooks WHERE user_id = ? AND recipe_id = ?");
    $checkStmt->bind_param("ii", $userId, $recipeId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // Remove from cookbook
        $deleteStmt = $conn->prepare("DELETE FROM cookbooks WHERE user_id = ? AND recipe_id = ?");
        $deleteStmt->bind_param("ii", $userId, $recipeId);
        $deleteStmt->execute();
        $saved = false;
    } else {
        // Add to cookbook
        $insertStmt = $conn->prepare("INSERT INTO cookbooks (user_id, recipe_id) VALUES (?, ?)");
        $insertStmt->bind_param("ii", $userId, $recipeId);
        $insertStmt->execute();
        $saved = true;
    }

    echo json_encode([
        'success' => true,
        'saved' => $saved,
        'message' => $saved ? 'Recipe saved to cookbook' : 'Recipe removed from cookbook'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$db->closeConnection();
