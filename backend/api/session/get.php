<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

// Get session ID from URL
$sessionId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($sessionId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Session ID required']);
    exit();
}

try {
    // Get session details
    $stmt = $conn->prepare("
        SELECT cs.*, r.title as recipe_title, r.image_url, u.username 
        FROM cooking_sessions cs
        LEFT JOIN recipes r ON cs.recipe_id = r.id
        LEFT JOIN users u ON cs.user_id = u.id
        WHERE cs.id = ?
    ");
    $stmt->bind_param("i", $sessionId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $session = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'session' => $session,
            'recipe_id' => $session['recipe_id']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Session not found'
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

$db->closeConnection();
