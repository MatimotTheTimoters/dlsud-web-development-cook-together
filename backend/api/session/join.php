<?php
require_once __DIR__ . '/../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);
$session_id = $input['session_id'] ?? null;
$user_id = $input['user_id'] ?? null;

// Validate input
if (!$session_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Session ID and User ID are required']);
    exit();
}

// Check if user is already in session
$check = $conn->prepare("SELECT id FROM session_participants WHERE session_id = ? AND user_id = ?");
$check->bind_param("ii", $session_id, $user_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Already joined this session']);
    $check->close();
    exit();
}
$check->close();

// Add participant
$stmt = $conn->prepare("INSERT INTO session_participants (session_id, user_id) VALUES (?, ?)");
$stmt->bind_param("ii", $session_id, $user_id);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Joined cooking session',
        'participant_id' => $stmt->insert_id
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to join session']);
}

$stmt->close();
$db->closeConnection();
