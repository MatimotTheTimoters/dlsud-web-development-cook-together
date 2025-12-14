<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

// Simple GET endpoint to fetch user profile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = isset($_GET['id']) ? intval($_GET['id']) : 1; // Default to user ID 1 for testing

    // Get user basic info
    $userQuery = $conn->prepare("SELECT id, username, email, full_name, bio, location, profile_picture, cooking_since FROM users WHERE id = ?");
    $userQuery->bind_param("i", $userId);
    $userQuery->execute();
    $userResult = $userQuery->get_result();

    if ($userResult->num_rows > 0) {
        $user = $userResult->fetch_assoc();

        // Get user stats
        $statsQuery = $conn->prepare("SELECT level, current_exp, gold_count, gem_count, recipes_created, recipes_cooked FROM user_stats WHERE user_id = ?");
        $statsQuery->bind_param("i", $userId);
        $statsQuery->execute();
        $statsResult = $statsQuery->get_result();
        $stats = $statsResult->fetch_assoc();

        echo json_encode([
            'success' => true,
            'user' => $user,
            'stats' => $stats
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
    }

    $userQuery->close();
    if (isset($statsQuery)) $statsQuery->close();
}

$db->closeConnection();
