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

// Set session status and max players based on session type
$sessionStatus = ($sessionType === 'solo') ? 'active' : 'waiting';
$maxPlayers = ($sessionType === 'solo') ? 1 : 6;

// Generate session code for multiplayer (10 characters as per schema)
$sessionCode = null;
if ($sessionType === 'multiplayer') {
    // Keep trying until we get a unique code
    $maxAttempts = 10;
    $attempt = 0;
    $unique = false;
    
    while (!$unique && $attempt < $maxAttempts) {
        // Generate 10-character alphanumeric code
        $code = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 10);
        
        // Check if code exists
        $checkStmt = $conn->prepare("SELECT id FROM cooking_sessions WHERE session_code = ?");
        $checkStmt->bind_param("s", $code);
        $checkStmt->execute();
        $checkStmt->store_result();
        
        if ($checkStmt->num_rows === 0) {
            $sessionCode = $code;
            $unique = true;
        }
        
        $checkStmt->close();
        $attempt++;
    }
    
    if (!$unique) {
        echo json_encode(['success' => false, 'message' => 'Failed to generate unique session code']);
        exit();
    }
}

// Insert into cooking_sessions with all required fields
$stmt = $conn->prepare("
    INSERT INTO cooking_sessions 
    (recipe_id, user_id, session_type, session_status, max_players, session_code) 
    VALUES (?, ?, ?, ?, ?, ?)
");
$stmt->bind_param("iissis", $recipeId, $userId, $sessionType, $sessionStatus, $maxPlayers, $sessionCode);
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
        'session_type' => $sessionType,
        'session_status' => $sessionStatus,
        'max_players' => $maxPlayers,
        'session_code' => $sessionCode,
        'message' => 'Cooking session created successfully'
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create session']);
}

$db->closeConnection();