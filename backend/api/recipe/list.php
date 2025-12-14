<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

// Simple GET all recipes
$sql = "SELECT r.*, u.username 
        FROM recipes r 
        LEFT JOIN users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC 
        LIMIT 20";

$result = $conn->query($sql);

if ($result) {
    $recipes = [];
    while ($row = $result->fetch_assoc()) {
        $recipes[] = $row;
    }

    echo json_encode([
        'success' => true,
        'recipes' => $recipes
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No recipes found'
    ]);
}

$db->closeConnection();
