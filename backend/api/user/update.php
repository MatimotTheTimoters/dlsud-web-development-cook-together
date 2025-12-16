<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

$data = json_decode(file_get_contents('php://input'), true);

$userId = intval($data['user_id'] ?? 0);
$username = $conn->real_escape_string($data['username'] ?? '');
$fullName = $conn->real_escape_string($data['full_name'] ?? '');
$bio = $conn->real_escape_string($data['bio'] ?? '');
$location = $conn->real_escape_string($data['location'] ?? '');
$cookingSince = intval($data['cooking_since'] ?? date('Y'));

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'User ID required']);
    exit();
}

try {
    // Check if username is taken by another user
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
    $checkStmt->bind_param("si", $username, $userId);
    $checkStmt->execute();

    if ($checkStmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already taken']);
        exit();
    }

    // Update user
    $stmt = $conn->prepare("
        UPDATE users 
        SET username = ?, full_name = ?, bio = ?, location = ?, cooking_since = ?, updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->bind_param("ssssii", $username, $fullName, $bio, $location, $cookingSince, $userId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$db->closeConnection();
