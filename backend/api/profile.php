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

try {
    $userId = isset($_GET['id']) ? intval($_GET['id']) : 1;

    // Get user basic info
    $userQuery = $conn->prepare("SELECT id, username, email, full_name, bio, location, profile_picture, cooking_since, created_at FROM users WHERE id = ?");
    $userQuery->bind_param("i", $userId);
    $userQuery->execute();
    $userResult = $userQuery->get_result();

    if ($userResult->num_rows === 0) {
        // Create default user data if not exists
        $user = [
            'id' => 1,
            'username' => 'chefjohn',
            'full_name' => 'Chef John',
            'bio' => 'Professional chef with 10 years experience',
            'location' => 'New York',
            'profile_picture' => null,
            'cooking_since' => '2018',
            'created_at' => date('Y-m-d H:i:s')
        ];
        $stats = [
            'level' => 1,
            'current_exp' => 0,
            'gold_count' => 100,
            'gem_count' => 10,
            'recipes_created' => 0,
            'recipes_cooked' => 0
        ];
    } else {
        $user = $userResult->fetch_assoc();

        // Get user stats
        $statsQuery = $conn->prepare("SELECT level, current_exp, gold_count, gem_count, recipes_created, recipes_cooked FROM user_stats WHERE user_id = ?");
        $statsQuery->bind_param("i", $userId);
        $statsQuery->execute();
        $statsResult = $statsQuery->get_result();

        if ($statsResult->num_rows > 0) {
            $stats = $statsResult->fetch_assoc();
        } else {
            // Default stats
            $stats = [
                'level' => 1,
                'current_exp' => 0,
                'gold_count' => 100,
                'gem_count' => 10,
                'recipes_created' => 0,
                'recipes_cooked' => 0
            ];
        }
        $statsQuery->close();
    }

    $userQuery->close();
    $db->closeConnection();

    echo json_encode([
        'success' => true,
        'user' => $user,
        'stats' => $stats,
        'message' => 'Profile loaded successfully'
    ]);
} catch (Exception $e) {
    // Fallback data if database fails
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => 1,
            'username' => 'chefjohn',
            'full_name' => 'Chef John',
            'bio' => 'Professional chef with 10 years experience. Love Italian cuisine!',
            'location' => 'New York',
            'profile_picture' => null,
            'cooking_since' => '2018',
            'created_at' => '2024-01-01 00:00:00'
        ],
        'stats' => [
            'level' => 15,
            'current_exp' => 1250,
            'gold_count' => 500,
            'gem_count' => 25,
            'recipes_created' => 50,
            'recipes_cooked' => 12
        ],
        'message' => 'Using fallback data'
    ]);
}
