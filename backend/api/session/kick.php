<?php
require_once '../../db/connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$participantId = $data['participant_id'] ?? 0;

if ($participantId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid participant']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

$stmt = $conn->prepare("DELETE FROM session_participants WHERE id = ?");
$stmt->bind_param("i", $participantId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Player kicked']);
} else {
    echo json_encode(['success' => false, 'message' => 'Kick failed']);
}

$db->closeConnection();
