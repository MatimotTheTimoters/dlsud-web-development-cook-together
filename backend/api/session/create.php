<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

require_once '../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);
$recipeId = intval($data['recipe_id'] ?? 0);
$userId = intval($data['user_id'] ?? 0);
$sessionType = $data['session_type'] ?? 'solo';

if (!$recipeId || !$userId) {
    echo json_encode(['success' => false, 'message' => 'Recipe ID and User ID required']);
    exit();
}

// Generate session code for multiplayer
$sessionCode = $sessionType === 'multiplayer' ? substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 6) : null;

$stmt = $conn->prepare("INSERT INTO cooking_sessions (recipe_id, user_id, session_type, session_code) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $recipeId, $userId, $sessionType, $sessionCode);
$stmt->execute();

$sessionId = $stmt->insert_id;

// Add creator as participant
if ($sessionId) {
    $partStmt = $conn->prepare("INSERT INTO session_participants (session_id, user_id) VALUES (?, ?)");
    $partStmt->bind_param("ii", $sessionId, $userId);
    $partStmt->execute();

    echo json_encode([
        'success' => true,
        'session_id' => $sessionId,
        'session_code' => $sessionCode,
        'message' => 'Cooking session created'
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create session']);
}

$db->closeConnection();
