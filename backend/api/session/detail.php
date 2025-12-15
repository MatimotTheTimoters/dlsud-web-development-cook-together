<?php
require_once '../../db/connection.php';

header('Content-Type: application/json');

$sessionId = $_GET['session_id'] ?? 0;

if ($sessionId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid session ID']);
    exit;
}

$db = new Database();
$conn = $db->getConnection();

// Get session details
$sessionSql = "SELECT 
    cs.*,
    r.title as recipe_title,
    u.username as host_name,
    u.id as host_id
FROM cooking_sessions cs
JOIN recipes r ON cs.recipe_id = r.id
JOIN users u ON cs.user_id = u.id
WHERE cs.id = ?";

$stmt = $conn->prepare($sessionSql);
$stmt->bind_param("i", $sessionId);
$stmt->execute();
$sessionResult = $stmt->get_result();

if ($sessionResult->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Session not found']);
    exit;
}

$session = $sessionResult->fetch_assoc();

// Get participants with ready status
$participantsSql = "SELECT 
    sp.id,
    sp.user_id,
    sp.ready_status,
    u.username,
    sp.user_id = cs.user_id as is_host
FROM session_participants sp
JOIN users u ON sp.user_id = u.id
JOIN cooking_sessions cs ON sp.session_id = cs.id
WHERE sp.session_id = ?
ORDER BY sp.joined_at ASC";

$stmt2 = $conn->prepare($participantsSql);
$stmt2->bind_param("i", $sessionId);
$stmt2->execute();
$participantsResult = $stmt2->get_result();

$participants = [];
while ($row = $participantsResult->fetch_assoc()) {
    $participants[] = $row;
}

echo json_encode([
    'success' => true,
    'session' => $session,
    'participants' => $participants
]);

$db->closeConnection();
