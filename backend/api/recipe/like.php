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
    // Check if user already liked this recipe
    $checkStmt = $conn->prepare("SELECT id FROM recipe_likes WHERE recipe_id = ? AND user_id = ?");
    $checkStmt->bind_param("ii", $recipeId, $userId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // Unlike: Remove the like
        $deleteStmt = $conn->prepare("DELETE FROM recipe_likes WHERE recipe_id = ? AND user_id = ?");
        $deleteStmt->bind_param("ii", $recipeId, $userId);
        $deleteStmt->execute();
        $liked = false;
    } else {
        // Like: Add the like
        $insertStmt = $conn->prepare("INSERT INTO recipe_likes (recipe_id, user_id) VALUES (?, ?)");
        $insertStmt->bind_param("ii", $recipeId, $userId);
        $insertStmt->execute();
        $liked = true;
    }

    // Get updated like count
    $countStmt = $conn->prepare("SELECT COUNT(*) as like_count FROM recipe_likes WHERE recipe_id = ?");
    $countStmt->bind_param("i", $recipeId);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $row = $countResult->fetch_assoc();
    $likeCount = $row['like_count'];

    echo json_encode([
        'success' => true,
        'liked' => $liked,
        'like_count' => $likeCount
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$db->closeConnection();
