<?php
// backend/api/session/generate-code.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Use the same connection method as your recipe API
require_once '../../db/connection.php';

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Generate 6-character alphanumeric code
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $maxAttempts = 20;
    $code = '';

    for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        // Check if code already exists using MySQLi
        $checkStmt = $conn->prepare("SELECT COUNT(*) FROM cooking_sessions WHERE join_code = ?");
        $checkStmt->bind_param("s", $code);
        $checkStmt->execute();
        $checkStmt->bind_result($count);
        $checkStmt->fetch();
        $checkStmt->close();
        
        if ($count == 0) {
            // Found unique code
            break;
        }
        
        $code = ''; // Reset for next attempt
    }

    if ($code === '') {
        throw new Exception('Failed to generate unique code after ' . $maxAttempts . ' attempts');
    }

    echo json_encode([
        'success' => true,
        'code' => $code,
        'message' => 'Code generated successfully'
    ]);

    $db->closeConnection();
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>