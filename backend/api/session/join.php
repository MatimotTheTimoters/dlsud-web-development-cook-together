<?php
require_once '../../db/connection.php';

header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$sessionCode = $data['session_code'] ?? '';
$userId = $data['user_id'] ?? 0;

if (empty($sessionCode) || $userId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Find session by code
$stmt = $conn->prepare("SELECT id FROM cooking_sessions WHERE session_code = ? AND session_status = 'waiting'");
$stmt->bind_param("s", $sessionCode);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Session not found or already started']);
    exit;
}

$session = $result->fetch_assoc();
$sessionId = $session['id'];

// Check if user is already in session
$checkStmt = $conn->prepare("SELECT id FROM session_participants WHERE session_id = ? AND user_id = ?");
$checkStmt->bind_param("ii", $sessionId, $userId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Already in session']);
    exit;
}

// Add participant
$insertStmt = $conn->prepare("INSERT INTO session_participants (session_id, user_id) VALUES (?, ?)");
$insertStmt->bind_param("ii", $sessionId, $userId);

if ($insertStmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Joined successfully',
        'session_id' => $sessionId
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to join']);
}

$db->closeConnection();
