<?php
// backend/api/session/generate-code.php
header('Content-Type: application/json');
require_once '../db/connection.php';

try {
    $conn = getConnection();
    
    // Simple 6-character alphanumeric code
    $code = '';
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    do {
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        // Check if code already exists
        $stmt = $conn->prepare("SELECT COUNT(*) FROM cooking_sessions WHERE join_code = ?");
        $stmt->execute([$code]);
        $exists = $stmt->fetchColumn();
    } while ($exists > 0);
    
    echo json_encode([
        'success' => true,
        'code' => $code
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>