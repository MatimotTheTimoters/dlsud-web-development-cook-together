<?php
// backend/api/recipes/index.php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Set CORS headers
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/cors.php';

$responseFormatter = new ResponseFormatter();

try {
    // Get query parameters for filtering/pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;
    
    $difficulty = isset($_GET['difficulty']) ? $_GET['difficulty'] : null;
    $search = isset($_GET['search']) ? $_GET['search'] : null;
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
    $is_public = isset($_GET['is_public']) ? $_GET['is_public'] : true;
    
    // Build WHERE clause
    $whereClauses = [];
    $params = [];
    
    if ($difficulty) {
        $whereClauses[] = "r.difficulty = :difficulty";
        $params['difficulty'] = $difficulty;
    }
    
    if ($search) {
        $whereClauses[] = "(r.title LIKE :search OR r.description LIKE :search)";
        $params['search'] = "%$search%";
    }
    
    if ($user_id) {
        $whereClauses[] = "r.user_id = :user_id";
        $params['user_id'] = $user_id;
    }
    
    if ($is_public !== null) {
        $whereClauses[] = "r.is_public = :is_public";
        $params['is_public'] = $is_public ? 1 : 0;
    }
    
    $whereSQL = empty($whereClauses) ? "1=1" : implode(" AND ", $whereClauses);
    
    // Get total count for pagination
    $countSql = "SELECT COUNT(*) as total 
                 FROM recipes r 
                 WHERE $whereSQL";
    $countResult = Database::fetchOne($countSql, $params);
    $totalRecipes = $countResult['total'];
    $totalPages = ceil($totalRecipes / $limit);
    
    // Get recipes with user info and metadata
    $sql = "SELECT 
                r.id, r.created_at, r.updated_at, r.cover_image, 
                r.title, r.description, r.origin, 
                r.preparation_time, r.cooking_time, r.serving_size, 
                r.difficulty, r.is_paid, r.is_public, r.user_id,
                u.full_name as author_name, u.profile_picture as author_picture,
                rm.like_count, rm.dislike_count, rm.cook_count,
                rm.exp_reward, rm.gold_reward, rm.gem_reward,
                rm.gold_price, rm.gem_price
            FROM recipes r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id
            WHERE $whereSQL
            ORDER BY r.created_at DESC
            LIMIT :limit OFFSET :offset";
    
    $params['limit'] = $limit;
    $params['offset'] = $offset;
    
    $recipes = Database::fetchAll($sql, $params);
    
    // Format response
    $responseData = [
        'recipes' => $recipes,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total_recipes' => $totalRecipes,
            'total_pages' => $totalPages,
            'has_next' => $page < $totalPages,
            'has_prev' => $page > 1
        ]
    ];
    
    $responseFormatter->success($responseData, "Recipes retrieved successfully", 200);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to retrieve recipes: " . $e->getMessage(), 500);
}