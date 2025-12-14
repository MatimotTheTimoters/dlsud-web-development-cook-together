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

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Validate inputs
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

    // Find user by email
    $stmt = $conn->prepare("SELECT id, username, email, password_hash, full_name FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        $db->closeConnection();

        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
        exit();
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password
    if (!Validation::verifyPassword($password, $user['password_hash'])) {
        $db->closeConnection();

        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
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
    $stats = $statsResult->fetch_assoc();
    $statsStmt->close();

    // Calculate daily login bonus (simplified - update streak)
    $currentDate = date('Y-m-d');
    $lastLoginBonus = $currentDate; // In real app, you'd store this in DB

    // Simple bonus calculation
    $bonusGold = 0;
    $bonusGems = 0;

    // Update login streak (simplified - in real app, check last login date)
    $newStreak = ($stats['login_streak'] ?? 0) + 1;

    // Give bonus for streaks
    if ($newStreak % 7 === 0) {
        $bonusGold = 50; // Weekly bonus
        $bonusGems = 5;
    } elseif ($newStreak % 30 === 0) {
        $bonusGold = 200; // Monthly bonus
        $bonusGems = 20;
    } else {
        $bonusGold = 10; // Daily bonus
        $bonusGems = 1;
    }

    // Update user stats with new streak and bonuses
    $updateStmt = $conn->prepare("
        UPDATE user_stats 
        SET login_streak = ?, 
            gold_count = gold_count + ?,
            gem_count = gem_count + ?
        WHERE user_id = ?
    ");
    $updateStmt->bind_param("iiii", $newStreak, $bonusGold, $bonusGems, $user['id']);
    $updateStmt->execute();
    $updateStmt->close();

    // Calculate new totals
    $newGold = ($stats['gold_count'] ?? 0) + $bonusGold;
    $newGems = ($stats['gem_count'] ?? 0) + $bonusGems;

    // Generate simple token (for demo - in production use JWT)
    $token = bin2hex(random_bytes(32));

    // Store token in database (simplified - in real app use sessions or JWT)
    $tokenStmt = $conn->prepare("
        INSERT INTO user_tokens (user_id, token, expires_at) 
        VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
    ");
    $tokenStmt->bind_param("is", $user['id'], $token);
    $tokenStmt->execute();
    $tokenStmt->close();

    $db->closeConnection();

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful! Welcome back to CookTogether!',
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'full_name' => $user['full_name']
        ],
        'stats' => [
            'level' => $stats['level'] ?? 1,
            'current_exp' => $stats['current_exp'] ?? 0,
            'gold_count' => $newGold,
            'gem_count' => $newGems,
            'login_streak' => $newStreak
        ],
        'daily_bonus' => [
            'gold' => $bonusGold,
            'gems' => $bonusGems,
            'message' => $bonusGold > 10 ? '🎉 Great streak! Bonus received!' : '📅 Daily login bonus received!'
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
