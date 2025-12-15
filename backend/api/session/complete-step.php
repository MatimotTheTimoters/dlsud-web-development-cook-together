<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../db/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$sessionId = $input['session_id'] ?? 0;
$stepId = $input['step_id'] ?? 0;

if (!$sessionId || !$stepId) {
    echo json_encode(['success' => false, 'message' => 'Session ID and Step ID required']);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

try {
    // Check if step completion already exists
    $checkStmt = $conn->prepare("SELECT id FROM step_completions WHERE session_id = ? AND step_id = ?");
    $checkStmt->bind_param("ii", $sessionId, $stepId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Step already completed']);
        exit();
    }

    // Record step completion
    $stmt = $conn->prepare("INSERT INTO step_completions (session_id, step_id, completed_at) VALUES (?, ?, NOW())");
    $stmt->bind_param("ii", $sessionId, $stepId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Step marked as complete']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to complete step']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$db->closeConnection();
