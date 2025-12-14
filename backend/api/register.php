<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../db/connection.php';
require_once __DIR__ . '/../utils/validation.php';

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

// Sanitize inputs
$data = Validation::sanitizeInput($data);

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$full_name = $data['full_name'] ?? '';

// Validate inputs
$errors = [];

if (!Validation::validateUsername($username)) {
    $errors[] = 'Username must be 3-20 characters (letters, numbers, underscores only)';
}

if (!Validation::validateEmail($email)) {
    $errors[] = 'Invalid email address';
}

// SIMPLIFIED: Remove password validation for now
// if (!Validation::validatePassword($password)) {
//     $errors[] = 'Password must be at least 8 characters with uppercase, lowercase, and number';
// }

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Validation failed', 'errors' => $errors]);
    exit();
}

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Check if user already exists
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    $checkStmt->bind_param("ss", $email, $username);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        $checkStmt->close();
        $db->closeConnection();

        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'User already exists with this email or username'
        ]);
        exit();
    }
    $checkStmt->close();

    // SIMPLIFIED: Store plain password for now (TEMPORARY - INSECURE)
    // In production, always use password_hash()
    $password_hash = $password; // Storing plain password temporarily

    // Insert user
    $stmt = $conn->prepare("
        INSERT INTO users (username, email, password_hash, full_name) 
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("ssss", $username, $email, $password_hash, $full_name);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;

        // Create user stats entry with starting rewards
        $statsStmt = $conn->prepare("
            INSERT INTO user_stats (user_id, gold_count, gem_count) 
            VALUES (?, 100, 10)
        ");
        $statsStmt->bind_param("i", $user_id);
        $statsStmt->execute();
        $statsStmt->close();

        $stmt->close();
        $db->closeConnection();

        echo json_encode([
            'success' => true,
            'message' => 'Registration successful! Welcome to CookTogether!',
            'user' => [
                'id' => $user_id,
                'username' => $username,
                'email' => $email,
                'full_name' => $full_name
            ],
            'rewards' => [
                'gold' => 100,
                'gems' => 10,
                'message' => '🎉 Welcome bonus: 100 Gold & 10 Gems!'
            ]
        ]);
    } else {
        throw new Exception("Failed to create user: " . $stmt->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
