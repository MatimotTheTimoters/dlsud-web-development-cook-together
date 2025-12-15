<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../db/connection.php';

$sessionId = isset($_GET['session_id']) ? intval($_GET['session_id']) : 0;

if ($sessionId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Session ID required']);
    exit();
}

$db = new Database();
$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("SELECT step_id FROM step_completions WHERE session_id = ?");
    $stmt->bind_param("i", $sessionId);
    $stmt->execute();
    $result = $stmt->get_result();

    $completedSteps = [];
    while ($row = $result->fetch_assoc()) {
        $completedSteps[] = $row['step_id'];
    }

    echo json_encode([
        'success' => true,
        'completed_steps' => $completedSteps
    ]);

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$db->closeConnection();
