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

$input = json_decode(file_get_contents('php://input'), true);

$recipe_id = $input['recipe_id'] ?? null;
$user_id = $input['user_id'] ?? null;
$session_type = $input['session_type'] ?? 'solo';

// DEBUG: Log the request
error_log("Session creation request: recipe_id=$recipe_id, user_id=$user_id, session_type=$session_type");

if (!$recipe_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if user exists
    $checkUser = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $checkUser->bind_param("i", $user_id);
    $checkUser->execute();
    $checkUser->store_result();
    
    if ($checkUser->num_rows === 0) {
        $checkUser->close();
        echo json_encode([
            'success' => false, 
            'message' => 'User not found. Please log in first.',
            'debug' => "User ID $user_id not found in database"
        ]);
        exit;
    }
    $checkUser->close();
    
    // Check if recipe exists
    $checkRecipe = $conn->prepare("SELECT id FROM recipes WHERE id = ?");
    $checkRecipe->bind_param("i", $recipe_id);
    $checkRecipe->execute();
    $checkRecipe->store_result();
    
    if ($checkRecipe->num_rows === 0) {
        $checkRecipe->close();
        echo json_encode(['success' => false, 'message' => 'Recipe not found']);
        exit;
    }
    $checkRecipe->close();

    // Start transaction
    $conn->begin_transaction();

    // Create session with session_type
    $join_code = null;
    if ($session_type === 'multiplayer') {
        // Generate a 6-character code
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
        
        // Insert with join_code and session_type
        $stmt = $conn->prepare("
            INSERT INTO cooking_sessions 
            (recipe_id, user_id, session_type, join_code, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param("iiss", $recipe_id, $user_id, $session_type, $join_code);
    } else {
        // Solo session - no join_code, but include session_type
        $stmt = $conn->prepare("
            INSERT INTO cooking_sessions 
            (recipe_id, user_id, session_type, created_at) 
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->bind_param("iis", $recipe_id, $user_id, $session_type);
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
            
            error_log("Session created successfully: id=$session_id, type=$session_type, join_code=$join_code");
            
            echo json_encode([
                'success' => true,
                'session_id' => $session_id,
                'session_type' => $session_type,
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
        'message' => $e->getMessage(),
        'debug' => "recipe_id: $recipe_id, user_id: $user_id, session_type: $session_type"
    ]);
}
?>