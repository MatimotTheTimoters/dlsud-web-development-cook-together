<?php
require_once '../../db/connection.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$participantId = $data['participant_id'] ?? 0;
$readyStatus = $data['ready_status'] ?? 'not_ready';

if ($participantId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid participant']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

$stmt = $conn->prepare("UPDATE session_participants SET ready_status = ? WHERE id = ?");
$stmt->bind_param("si", $readyStatus, $participantId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Status updated']);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}

$db->closeConnection();
