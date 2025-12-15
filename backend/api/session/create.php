<?php
// backend/api/session/create.php
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

$input = json_decode(file_get_contents('php://input'), true);

$recipe_id = $input['recipe_id'] ?? null;
$user_id = $input['user_id'] ?? null;
$session_type = $input['session_type'] ?? 'solo';

if (!$recipe_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    // Get database connection
    $db = new Database();
    $conn = $db->getConnection();

    // Start transaction
    $conn->begin_transaction();

    $join_code = null;
    if ($session_type === 'multiplayer') {
        // NEW: Use the reusable code generator
        $join_code = generateUniqueSessionCode($conn);
        error_log("Multiplayer session created with code: $join_code by user $user_id");
    }

    // Create session
    if ($session_type === 'multiplayer') {
        $stmt = $conn->prepare("
            INSERT INTO cooking_sessions 
            (recipe_id, user_id, join_code, created_at) 
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->bind_param("iis", $recipe_id, $user_id, $join_code);
    } else {
        $stmt = $conn->prepare("
            INSERT INTO cooking_sessions 
            (recipe_id, user_id, created_at) 
            VALUES (?, ?, NOW())
        ");
        $stmt->bind_param("ii", $recipe_id, $user_id);
    }

    if ($stmt->execute()) {
        $session_id = $conn->insert_id;
        $stmt->close();

        // Add host as participant
        $stmt = $conn->prepare("
            INSERT INTO session_participants 
            (session_id, user_id, joined_at) 
            VALUES (?, ?, NOW())
        ");
        $stmt->bind_param("ii", $session_id, $user_id);
        
        if ($stmt->execute()) {
            $stmt->close();
            $conn->commit();
            
            // Log successful creation
            error_log("Session created: ID $session_id, Type: $session_type, Code: " . ($join_code ?: 'N/A'));
            
            echo json_encode([
                'success' => true,
                'session_id' => $session_id,
                'join_code' => $join_code,
                'message' => 'Session created successfully'
            ]);
        } else {
            throw new Exception('Failed to add participant: ' . $conn->error);
        }
    } else {
        throw new Exception('Failed to create session: ' . $conn->error);
    }

    $db->closeConnection();
} catch (Exception $e) {
    if (isset($conn) && method_exists($conn, 'rollback')) {
        $conn->rollback();
    }
    error_log("Session creation error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>