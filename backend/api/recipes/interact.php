<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

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
    
    // Check if recipe exists
    $checkSql = "SELECT id, user_id, is_paid FROM recipes WHERE id = :id";
    $recipe = Database::fetchOne($checkSql, ['id' => $recipeId]);
    
    if (!$recipe) {
        $responseFormatter->notFound("Recipe not found");
        exit;
    }
    
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }
    
    // Get interaction data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $responseFormatter->error("Invalid JSON data", 400);
        exit;
    }
    
    if (!isset($data['interaction_type'])) {
        $responseFormatter->error("Interaction type is required", 400);
        exit;
    }
    
    $interactionType = $data['interaction_type'];
    $allowedInteractions = ['like', 'dislike', 'save', 'purchase'];
    
    if (!in_array($interactionType, $allowedInteractions)) {
        $responseFormatter->error("Invalid interaction type. Allowed: " . implode(', ', $allowedInteractions), 400);
        exit;
    }
    
    // Handle purchase interaction
    if ($interactionType === 'purchase') {
        if ($recipe['user_id'] === $userId) {
            $responseFormatter->error("You cannot purchase your own recipe", 400);
            exit;
        }
        
        if (!$recipe['is_paid']) {
            $responseFormatter->error("This recipe is not available for purchase", 400);
            exit;
        }
        
        // Check if user already purchased
        $checkPurchaseSql = "SELECT id FROM recipe_interactions 
                            WHERE user_id = :user_id AND recipe_id = :recipe_id 
                            AND interaction_type = 'purchase'";
        $existingPurchase = Database::fetchOne($checkPurchaseSql, [
            'user_id' => $userId,
            'recipe_id' => $recipeId
        ]);
        
        if ($existingPurchase) {
            $responseFormatter->error("You have already purchased this recipe", 400);
            exit;
        }
        
        // TODO: Handle currency deduction (gold/gems)
        // This would require checking user balance and updating it
    }
    
    // Start transaction
    Database::query("START TRANSACTION");
    
    try {
        // Check for existing interaction of same type
        $checkSql = "SELECT id FROM recipe_interactions 
                    WHERE user_id = :user_id AND recipe_id = :recipe_id 
                    AND interaction_type = :interaction_type";
        
        $existing = Database::fetchOne($checkSql, [
            'user_id' => $userId,
            'recipe_id' => $recipeId,
            'interaction_type' => $interactionType
        ]);
        
        $response = [];
        
        if ($existing) {
            // Remove interaction (toggle off)
            Database::delete('recipe_interactions', "id = :id", ['id' => $existing['id']]);
            
            // Decrement count in metadata
            $countField = $interactionType . '_count';
            $updateSql = "UPDATE recipe_metadata 
                         SET $countField = $countField - 1 
                         WHERE recipe_id = :recipe_id AND $countField > 0";
            Database::query($updateSql, ['recipe_id' => $recipeId]);
            
            $action = 'removed';
        } else {
            // Remove opposite interactions for like/dislike
            if ($interactionType === 'like' || $interactionType === 'dislike') {
                $opposite = $interactionType === 'like' ? 'dislike' : 'like';
                
                // Check for opposite interaction
                $oppositeSql = "SELECT id FROM recipe_interactions 
                              WHERE user_id = :user_id AND recipe_id = :recipe_id 
                              AND interaction_type = :interaction_type";
                
                $oppositeExisting = Database::fetchOne($oppositeSql, [
                    'user_id' => $userId,
                    'recipe_id' => $recipeId,
                    'interaction_type' => $opposite
                ]);
                
                if ($oppositeExisting) {
                    // Remove opposite interaction
                    Database::delete('recipe_interactions', "id = :id", ['id' => $oppositeExisting['id']]);
                    
                    // Decrement opposite count
                    $oppositeField = $opposite . '_count';
                    $updateOppositeSql = "UPDATE recipe_metadata 
                                         SET $oppositeField = $oppositeField - 1 
                                         WHERE recipe_id = :recipe_id AND $oppositeField > 0";
                    Database::query($updateOppositeSql, ['recipe_id' => $recipeId]);
                }
            }
            
            // Add new interaction
            require_once __DIR__ . '/../../utils/uuidHelper.php';
            $interactionId = UUIDHelper::generateUniqueId('recipe_interactions', 'id');
            
            $interactionData = [
                'id' => $interactionId,
                'user_id' => $userId,
                'recipe_id' => $recipeId,
                'interaction_type' => $interactionType,
                'metadata' => isset($data['metadata']) ? json_encode($data['metadata']) : null
            ];
            
            Database::insert('recipe_interactions', $interactionData);
            
            // Increment count in metadata
            $countField = $interactionType . '_count';
            $updateSql = "UPDATE recipe_metadata 
                         SET $countField = $countField + 1 
                         WHERE recipe_id = :recipe_id";
            Database::query($updateSql, ['recipe_id' => $recipeId]);
            
            $action = 'added';
            
            // Handle purchase-specific logic
            if ($interactionType === 'purchase') {
                // Increment purchase count
                $purchaseSql = "UPDATE recipe_metadata 
                               SET purchase_count = purchase_count + 1 
                               WHERE recipe_id = :recipe_id";
                Database::query($purchaseSql, ['recipe_id' => $recipeId]);
                
                // TODO: Transfer currency from buyer to seller
                // This would require additional logic
            }
        }
        
        // Get updated counts
        $countsSql = "SELECT like_count, dislike_count, cook_count, purchase_count 
                     FROM recipe_metadata 
                     WHERE recipe_id = :recipe_id";
        $updatedCounts = Database::fetchOne($countsSql, ['recipe_id' => $recipeId]);
        
        // Commit transaction
        Database::query("COMMIT");
        
        $response = [
            'interaction_type' => $interactionType,
            'action' => $action,
            'current_user_has_' . $interactionType => $action === 'added',
            'counts' => $updatedCounts,
            'message' => ucfirst($interactionType) . ' ' . $action . ' successfully'
        ];
        
        $responseFormatter->success($response, "Interaction processed successfully", 200);
        
    } catch (Exception $e) {
        // Rollback on error
        Database::query("ROLLBACK");
        throw $e;
    }
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to process interaction: " . $e->getMessage(), 500);
}