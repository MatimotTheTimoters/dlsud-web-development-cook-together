<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Use your existing connection class
require_once '../../db/connection.php';
require_once '../../utils/validation.php';

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

    // Escape strings for SQL (additional safety)
    $title = $conn->real_escape_string($title);
    $description = $conn->real_escape_string($description);
    $ingredients = $conn->real_escape_string($ingredients);
    $steps = $conn->real_escape_string($steps);
    $difficulty = $conn->real_escape_string($difficulty);
    $category = $conn->real_escape_string($category);

    // Insert recipe using simple query (avoid bind_param issues)
    $sql = "INSERT INTO recipes (user_id, title, description, prep_time, cook_time, servings, difficulty, category) 
            VALUES ($userId, '$title', '$description', $prepTime, $cookTime, $servings, '$difficulty', '$category')";

    if ($conn->query($sql)) {
        $recipeId = $conn->insert_id;

        // Insert ingredients
        $ingSql = "INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES ($recipeId, '$ingredients')";
        $conn->query($ingSql);

        // Insert steps
        $stepSql = "INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES ($recipeId, 1, '$steps')";
        $conn->query($stepSql);

        // Update user stats
        $statsSql = "UPDATE user_stats SET recipes_created = recipes_created + 1 WHERE user_id = $userId";
        $conn->query($statsSql);

        echo json_encode([
            'success' => true,
            'recipe_id' => $recipeId,
            'message' => 'Recipe created successfully! 🎉'
        ]);
    } else {
        throw new Exception('Database error: ' . $conn->error);
    }

    $db->closeConnection();
} catch (Exception $e) {
    // Return error response
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
