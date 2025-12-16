<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../../db/connection.php';

$db = new Database();
$conn = $db->getConnection();

// Get query parameters for filtering
$difficulty = $_GET['difficulty'] ?? '';
$category = $_GET['category'] ?? '';
$time_filter = $_GET['time'] ?? '';

// SIMPLE QUERY: Get recipes with user info
$sql = "SELECT r.*, u.username, u.profile_picture 
        FROM recipes r 
        LEFT JOIN users u ON r.user_id = u.id 
        WHERE 1=1";

// SIMPLE FIX: Actually apply filters if provided
if (!empty($difficulty) && $difficulty !== 'all') {
    $sql .= " AND r.difficulty = '" . $conn->real_escape_string($difficulty) . "'";
}

if (!empty($category) && $category !== 'all') {
    $sql .= " AND r.category = '" . $conn->real_escape_string($category) . "'";
}

if (!empty($time_filter) && is_numeric($time_filter)) {
    $max_time = (int)$time_filter;
    $sql .= " AND (IFNULL(r.prep_time, 0) + IFNULL(r.cook_time, 0)) <= $max_time";
}

$sql .= " ORDER BY r.created_at DESC LIMIT 20";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $recipes = [];
    while ($row = $result->fetch_assoc()) {
        $recipes[] = $row;
    }

    echo json_encode([
        'success' => true,
        'recipes' => $recipes,
        'count' => count($recipes)
    ]);
} else {
    echo json_encode([
        'success' => true,
        'recipes' => [],
        'count' => 0,
        'message' => 'No recipes found'
    ]);
}

$db->closeConnection();