<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

// For demo purposes, using user_id = 1 (you'll replace with actual session user later)
$userId = 1;

try {
    // Get saved recipes for user
    $stmt = $conn->prepare("
        SELECT r.*, u.username, 
               COUNT(DISTINCT rl.id) as likes,
               COUNT(DISTINCT cb2.id) as saves
        FROM cookbooks cb
        JOIN recipes r ON cb.recipe_id = r.id
        JOIN users u ON r.user_id = u.id
        LEFT JOIN recipe_likes rl ON r.id = rl.recipe_id
        LEFT JOIN cookbooks cb2 ON r.id = cb2.recipe_id
        WHERE cb.user_id = ?
        GROUP BY r.id
        ORDER BY cb.saved_at DESC
    ");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $recipes = [];
    while ($row = $result->fetch_assoc()) {
        $recipes[] = $row;
    }

    echo json_encode([
        'success' => true,
        'recipes' => $recipes
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$db->closeConnection();
