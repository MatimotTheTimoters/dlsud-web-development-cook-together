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

require_once '../../db/connection.php';
require_once '../../utils/code-generator.php'; // NEW: Include the utility

try {
    $db = new Database();
    $conn = $db->getConnection();

    // NEW: Use the reusable code generator
    $code = generateUniqueSessionCode($conn);
    
    // Log the generation
    error_log("API: Generated session code: $code");
    
    echo json_encode([
        'success' => true,
        'code' => $code,
        'message' => 'Unique session code generated'
    ]);

    $db->closeConnection();
} catch (Exception $e) {
    error_log("API: Code generation failed: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>