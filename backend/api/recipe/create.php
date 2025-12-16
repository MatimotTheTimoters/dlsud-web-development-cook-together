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
require_once '../../utils/code-generator.php'; // NEW: Include the utility

$input = json_decode(file_get_contents('php://input'), true);

$recipe_id = $input['recipe_id'] ?? null;
$user_id = $input['user_id'] ?? null;
$session_type = $input['session_type'] ?? 'solo';

if (!$recipe_id || !$user_id) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    // Get database connection
    $db = new Database();
    $conn = $db->getConnection();

    // Get POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    // Validate required fields
    if (empty($data['title'])) {
        throw new Exception('Recipe title is required');
    }

    if (empty($data['ingredients'])) {
        throw new Exception('Ingredients are required');
    }

    // Sanitize inputs using your validation class
    $title = Validation::sanitizeInput($data['title']);
    $ingredients = Validation::sanitizeInput($data['ingredients']);
    $description = Validation::sanitizeInput($data['description'] ?? '');
    $steps = Validation::sanitizeInput($data['steps'] ?? 'No steps provided');
    $userId = isset($data['user_id']) ? intval($data['user_id']) : 1;

    // Set number values (use 0 for empty)
    $prepTime = isset($data['prep_time']) && $data['prep_time'] !== '' ? intval($data['prep_time']) : 0;
    $cookTime = isset($data['cook_time']) && $data['cook_time'] !== '' ? intval($data['cook_time']) : 0;
    $servings = isset($data['servings']) && $data['servings'] !== '' ? intval($data['servings']) : 1;
    $difficulty = Validation::sanitizeInput($data['difficulty'] ?? 'Medium');
    $category = Validation::sanitizeInput($data['category'] ?? '');

    // Handle image - SIMPLE: Save base64 if provided, otherwise empty
    $imageUrl = '';
    if (!empty($data['image_url']) && strlen($data['image_url']) > 100) {
        // Check if it's base64
        if (strpos($data['image_url'], 'data:image') === 0) {
            // Save base64 to database (simple solution for now)
            $imageUrl = $data['image_url'];

            // OPTIONAL: Save to file system (comment out if you want database storage only)
            /*
            $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['image_url']));
            $filename = 'recipe_' . time() . '.jpg';
            $filepath = '../../uploads/' . $filename;
            file_put_contents($filepath, $imageData);
            $imageUrl = 'uploads/' . $filename;
            */
        }
    }

    // Escape strings for SQL (additional safety)
    $title = $conn->real_escape_string($title);
    $description = $conn->real_escape_string($description);
    $ingredients = $conn->real_escape_string($ingredients);
    $steps = $conn->real_escape_string($steps);
    $difficulty = $conn->real_escape_string($difficulty);
    $category = $conn->real_escape_string($category);
    $imageUrl = $conn->real_escape_string($imageUrl);

    $sql = "INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty, category, image_url) 
        VALUES ($userId, '$title', '$description', $prepTime, $cookTime, $servings, '$difficulty', '$category', '$imageUrl')";

    if ($conn->query($sql)) {
        $recipeId = $conn->insert_id;

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
            
            // Log successful creation
            error_log("Session created: ID $session_id, Type: $session_type, Code: " . ($join_code ?: 'N/A'));
            
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
    error_log("Session creation error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}