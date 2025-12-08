<?php
// backend/api/recipes/update.php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';
require_once __DIR__ . '/../../utils/validation.php';
require_once __DIR__ . '/../../utils/fileUpload.php';
require_once __DIR__ . '/../../utils/uuidHelper.php'; // Added for ID generation

// Set CORS headers
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/cors.php';

$responseFormatter = new ResponseFormatter();
$authHelper = new AuthHelper();

try {
    // Check authentication
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        $responseFormatter->unauthorized("Authentication required");
        exit;
    }

    $token = str_replace('Bearer ', '', $authHeader);
    $decoded = $authHelper->validateToken($token);

    if (!$decoded) {
        $responseFormatter->unauthorized("Invalid or expired token");
        exit;
    }

    $userId = $decoded['user_id'];

    // Get recipe ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $recipeId = end($url_parts);

    if (empty($recipeId)) {
        $responseFormatter->error("Recipe ID is required", 400);
        exit;
    }

    // Check recipe ownership
    $checkSql = "SELECT user_id, cover_image FROM recipes WHERE id = :id";
    $recipe = Database::fetchOne($checkSql, ['id' => $recipeId]);

    if (!$recipe) {
        $responseFormatter->notFound("Recipe not found");
        exit;
    }

    if ($recipe['user_id'] !== $userId) {
        $responseFormatter->unauthorized("You don't have permission to update this recipe");
        exit;
    }

    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }

    // Handle file uploads if present
    $coverImagePath = $recipe['cover_image']; // Keep existing if not updated

    if (!empty($_FILES['cover_image'])) {
        // Delete old cover image if exists
        if (!empty($coverImagePath)) {
            FileUpload::deleteFile($coverImagePath);
        }

        // Upload new cover image
        $uploadResult = FileUpload::uploadImage($_FILES['cover_image'], 'recipe', $userId);

        if ($uploadResult) {
            $coverImagePath = $uploadResult['relative_path'];
        } else {
            $coverImagePath = null;
        }
    }

    // Get form data
    $data = [];

    // Check if multipart form data
    if (!empty($_POST)) {
        // Get text fields from POST
        $textFields = [
            'title',
            'description',
            'origin',
            'difficulty',
            'is_paid',
            'is_public',
            'preparation_time',
            'cooking_time',
            'serving_size'
        ];

        foreach ($textFields as $field) {
            if (isset($_POST[$field])) {
                $data[$field] = $_POST[$field];
            }
        }

        // Parse JSON arrays if they were sent as form fields
        if (isset($_POST['ingredients'])) {
            $data['ingredients'] = json_decode($_POST['ingredients'], true);
        }

        if (isset($_POST['steps'])) {
            $data['steps'] = json_decode($_POST['steps'], true);
        }

        if (isset($_POST['metadata'])) {
            $data['metadata'] = json_decode($_POST['metadata'], true);
        }
    } else {
        // Handle JSON input
        $data = json_decode(file_get_contents('php://input'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $responseFormatter->error("Invalid JSON data", 400);
            exit;
        }
    }

    // Sanitize input
    $data = Validation::sanitizeInput($data);

    // Prepare update data
    $updateData = [];
    $allowedFields = [
        'title',
        'description',
        'origin',
        'preparation_time',
        'cooking_time',
        'serving_size',
        'difficulty',
        'is_paid',
        'is_public'
    ];

    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateData[$field] = $data[$field];
        }
    }

    // Add cover image if uploaded
    if ($coverImagePath !== $recipe['cover_image']) {
        $updateData['cover_image'] = $coverImagePath;
    }

    // Start transaction
    Database::query("START TRANSACTION");

    try {
        // Update recipe
        if (!empty($updateData)) {
            $updateData['updated_at'] = date('Y-m-d H:i:s');
            $where = "id = :id";
            $updateData['id'] = $recipeId;

            Database::update('recipes', $updateData, $where);
        }

        // Update metadata if provided
        if (!empty($data['metadata'])) {
            $metadataUpdate = [];
            $metadataFields = [
                'tags',
                'exp_reward',
                'gold_reward',
                'gem_reward',
                'gold_price',
                'gem_price',
                'total_calories',
                'total_protein',
                'total_carbs',
                'total_fat'
            ];

            foreach ($metadataFields as $field) {
                if (isset($data['metadata'][$field])) {
                    $metadataUpdate[$field] = $data['metadata'][$field];
                }
            }

            if (!empty($metadataUpdate)) {
                $metadataWhere = "recipe_id = :recipe_id";
                $metadataUpdate['recipe_id'] = $recipeId;

                Database::update('recipe_metadata', $metadataUpdate, $metadataWhere);
            }
        }

        // Handle ingredients update (replace all)
        if (isset($data['ingredients']) && is_array($data['ingredients'])) {
            // Delete existing ingredients
            Database::delete('recipe_ingredients', "recipe_id = :recipe_id", ['recipe_id' => $recipeId]);

            // Insert new ingredients
            foreach ($data['ingredients'] as $index => $ingredient) {
                $ingredientId = UUIDHelper::generateUniqueId('recipe_ingredients', 'id');
                $ingredientData = [
                    'id' => $ingredientId,
                    'recipe_id' => $recipeId,
                    'name' => $ingredient['name'] ?? '',
                    'amount' => isset($ingredient['amount']) ? (float)$ingredient['amount'] : null,
                    'unit' => $ingredient['unit'] ?? '',
                    'notes' => $ingredient['notes'] ?? '',
                    'order_index' => isset($ingredient['order_index']) ? (int)$ingredient['order_index'] : $index,
                    'calories_per_unit' => isset($ingredient['calories_per_unit']) ? (float)$ingredient['calories_per_unit'] : 0,
                    'protein_per_unit' => isset($ingredient['protein_per_unit']) ? (float)$ingredient['protein_per_unit'] : 0,
                    'carbs_per_unit' => isset($ingredient['carbs_per_unit']) ? (float)$ingredient['carbs_per_unit'] : 0,
                    'fat_per_unit' => isset($ingredient['fat_per_unit']) ? (float)$ingredient['fat_per_unit'] : 0
                ];

                Database::insert('recipe_ingredients', $ingredientData);
            }
        }

        // Handle steps update (replace all)
        if (isset($data['steps']) && is_array($data['steps'])) {
            // Get existing step images to delete later
            $existingStepsSql = "SELECT image FROM recipe_steps WHERE recipe_id = :recipe_id AND image IS NOT NULL";
            $existingSteps = Database::fetchAll($existingStepsSql, ['recipe_id' => $recipeId]);

            // Delete existing steps
            Database::delete('recipe_steps', "recipe_id = :recipe_id", ['recipe_id' => $recipeId]);

            // Insert new steps
            foreach ($data['steps'] as $index => $step) {
                $stepId = UUIDHelper::generateUniqueId('recipe_steps', 'id');
                $stepData = [
                    'id' => $stepId,
                    'recipe_id' => $recipeId,
                    'description' => $step['description'] ?? '',
                    'image' => $step['image'] ?? null,
                    'read_timer_duration' => isset($step['read_timer_duration']) ? (int)$step['read_timer_duration'] : 10,
                    'timer_duration' => isset($step['timer_duration']) ? (int)$step['timer_duration'] : null,
                    'timer_unit' => $step['timer_unit'] ?? 'seconds',
                    'exp_reward' => isset($step['exp_reward']) ? (int)$step['exp_reward'] : 0,
                    'gold_reward' => isset($step['gold_reward']) ? (int)$step['gold_reward'] : 0,
                    'gem_reward' => isset($step['gem_reward']) ? (int)$step['gem_reward'] : 0,
                    'order_index' => isset($step['order_index']) ? (int)$step['order_index'] : $index
                ];

                // Handle step image upload if provided
                if (!empty($_FILES['step_images'][$index])) {
                    $stepUploadResult = FileUpload::uploadImage($_FILES['step_images'][$index], 'step', $userId);
                    if ($stepUploadResult) {
                        $stepData['image'] = $stepUploadResult['relative_path'];
                    }
                }

                Database::insert('recipe_steps', $stepData);
            }

            // Delete old step images
            foreach ($existingSteps as $oldStep) {
                if (!empty($oldStep['image'])) {
                    FileUpload::deleteFile($oldStep['image']);
                }
            }
        }

        // Commit transaction
        Database::query("COMMIT");

        // Get updated recipe with full details
        $recipeSql = "SELECT r.*, rm.*, u.full_name as author_name 
                     FROM recipes r 
                     LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id 
                     LEFT JOIN users u ON r.user_id = u.id 
                     WHERE r.id = :id";
        $updatedRecipe = Database::fetchOne($recipeSql, ['id' => $recipeId]);

        // Add full URL for cover image
        if (!empty($updatedRecipe['cover_image'])) {
            $updatedRecipe['cover_image_url'] = FileUpload::getFileUrl($updatedRecipe['cover_image']);
        }

        $responseFormatter->success([
            'recipe' => $updatedRecipe,
            'message' => 'Recipe updated successfully'
        ], "Recipe updated successfully", 200);
    } catch (Exception $e) {
        // Rollback on error
        Database::query("ROLLBACK");
        throw $e;
    }
} catch (Exception $e) {
    $responseFormatter->error("Failed to update recipe: " . $e->getMessage(), 500);
}