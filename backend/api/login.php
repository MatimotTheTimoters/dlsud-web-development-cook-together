<?php
// CORS headers at the very top
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../db/connection.php';
require_once __DIR__ . '/../utils/validation.php'; // Added this line

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit();
}

// Sanitize inputs using Validation class
$data = Validation::sanitizeInput($data);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Validate inputs using Validation class
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit();
}

if (!Validation::validateEmail($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Find user by email - include password for comparison
    $stmt = $conn->prepare("SELECT id, username, email, password, full_name FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        $db->closeConnection();

        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
        exit();
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    if ($password !== $user['password']) {
        $db->closeConnection();

        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid password'
        ]);
        exit();
    }

    // Get user stats for gamification
    $statsStmt = $conn->prepare("
        SELECT level, current_exp, gold_count, gem_count, login_streak 
        FROM user_stats 
        WHERE user_id = ?
    ");
    $statsStmt->bind_param("i", $user['id']);
    $statsStmt->execute();
    $statsResult = $statsStmt->get_result();
    $stats = $statsResult->fetch_assoc() ?? ['level' => 1, 'current_exp' => 0, 'gold_count' => 100, 'gem_count' => 10, 'login_streak' => 0];
    $statsStmt->close();

    $db->closeConnection();

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful! Welcome back to CookTogether!',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'full_name' => $user['full_name'] ?? ''
        ],
        'stats' => [
            'level' => $stats['level'] ?? 1,
            'current_exp' => $stats['current_exp'] ?? 0,
            'gold_count' => $stats['gold_count'] ?? 100,
            'gem_count' => $stats['gem_count'] ?? 10,
            'login_streak' => $stats['login_streak'] ?? 0
        ],
        'daily_bonus' => [
            'gold' => 10,
            'gems' => 1,
            'message' => '📅 Daily login bonus received!'
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
