<?php
// backend/api/session/create.php
header('Content-Type: application/json');
require_once '../db/connection.php';

$input = json_decode(file_get_contents('php://input'), true);

$recipe_id = $input['recipe_id'] ?? null;
$user_id = $input['user_id'] ?? null;
$session_type = $input['session_type'] ?? 'solo';

if (!$recipe_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $conn = getConnection();
    
    // Start transaction
    $conn->beginTransaction();
    
    // Create session - only store basic info for solo sessions
    $stmt = $conn->prepare("
        INSERT INTO cooking_sessions 
        (recipe_id, user_id, created_at) 
        VALUES (?, ?, NOW())
    ");
    $stmt->execute([$recipe_id, $user_id]);
    $session_id = $conn->lastInsertId();
    
    // Add host as participant
    $stmt = $conn->prepare("
        INSERT INTO session_participants 
        (session_id, user_id, joined_at) 
        VALUES (?, ?, NOW())
    ");
    $stmt->execute([$session_id, $user_id]);
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'session_id' => $session_id,
        'message' => 'Session created successfully'
    ]);
    
} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>