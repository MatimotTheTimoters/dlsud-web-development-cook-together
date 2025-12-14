<?php
require_once __DIR__ . '/../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);
$recipe_id = $input['recipe_id'] ?? null;
$user_id = $input['user_id'] ?? null;

// Validate input
if (!$recipe_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Recipe ID and User ID are required']);
    exit();
}

// Create session
$stmt = $conn->prepare("INSERT INTO cooking_sessions (recipe_id, user_id) VALUES (?, ?)");
$stmt->bind_param("ii", $recipe_id, $user_id);

if ($stmt->execute()) {
    $session_id = $stmt->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Cooking session started',
        'session_id' => $session_id
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create session']);
}

$stmt->close();
$db->closeConnection();
