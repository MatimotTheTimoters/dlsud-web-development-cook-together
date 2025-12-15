<?php
require_once '../../db/connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$sessionId = $data['session_id'] ?? 0;

if ($sessionId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid session']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Update session status to active
$stmt = $conn->prepare("UPDATE cooking_sessions SET session_status = 'active' WHERE id = ?");
$stmt->bind_param("i", $sessionId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Session started']);
} else {
    echo json_encode(['success' => false, 'message' => 'Start failed']);
}

$db->closeConnection();
