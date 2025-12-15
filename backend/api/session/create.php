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

// Use the same connection method as your recipe API
require_once '../../db/connection.php';

$input = json_decode(file_get_contents('php://input'), true);

$recipe_id = $input['recipe_id'] ?? null;
$user_id = $input['user_id'] ?? null;
$session_type = $input['session_type'] ?? 'solo';

if (!$recipe_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    // Get database connection using the same method as recipe API
    $db = new Database();
    $conn = $db->getConnection();

    // Start transaction
    $conn->begin_transaction();

    // Create session - check if join_code needs to be generated for multiplayer
    $join_code = null;
    if ($session_type === 'multiplayer') {
        // Generate a simple 6-character code
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $maxAttempts = 10;
        $codeGenerated = false;
        
        for ($i = 0; $i < $maxAttempts; $i++) {
            $join_code = '';
            for ($j = 0; $j < 6; $j++) {
                $join_code .= $characters[rand(0, strlen($characters) - 1)];
            }
            
            // Check if code exists
            $checkStmt = $conn->prepare("SELECT COUNT(*) FROM cooking_sessions WHERE join_code = ?");
            $checkStmt->bind_param("s", $join_code);
            $checkStmt->execute();
            $checkStmt->bind_result($count);
            $checkStmt->fetch();
            $checkStmt->close();
            
            if ($count == 0) {
                $codeGenerated = true;
                break;
            }
        }
        
        if (!$codeGenerated) {
            throw new Exception('Failed to generate unique session code');
        }
        
        // Insert with join_code
        $stmt = $conn->prepare("
            INSERT INTO cooking_sessions 
            (recipe_id, user_id, join_code, created_at) 
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->bind_param("iis", $recipe_id, $user_id, $join_code);
    } else {
        // Solo session - no join_code
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
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>