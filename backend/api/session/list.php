<?php
require_once '../../db/connection.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

// Get active multiplayer sessions (waiting status)
$sql = "SELECT 
    cs.id,
    cs.session_code,
    cs.created_at,
    cs.max_players,
    r.title as recipe_title,
    u.username as host_name,
    COUNT(sp.id) as participant_count
FROM cooking_sessions cs
JOIN recipes r ON cs.recipe_id = r.id
JOIN users u ON cs.user_id = u.id
LEFT JOIN session_participants sp ON cs.id = sp.session_id
WHERE cs.session_type = 'multiplayer' 
    AND cs.session_status = 'waiting'
GROUP BY cs.id
ORDER BY cs.created_at DESC";

$result = $conn->query($sql);

if ($result) {
    $sessions = [];
    while ($row = $result->fetch_assoc()) {
        $sessions[] = $row;
    }

    echo json_encode([
        'success' => true,
        'sessions' => $sessions
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch sessions',
        'sessions' => []
    ]);
}

$db->closeConnection();
