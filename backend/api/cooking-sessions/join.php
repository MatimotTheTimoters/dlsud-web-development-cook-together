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
    
    // Get session ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $session_id = end($url_parts);
    
    if (empty($session_id)) {
        $responseFormatter->error("Session ID is required", 400);
        exit;
    }
    
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }
    
    // Get input data
    $data = json_decode(file_get_contents('php://input'), true);
    $role = $data['role'] ?? 'participant';
    
    $dbHelper = new DatabaseHelper();
    
    // Get session
    $sessionData = $dbHelper->getCookingSession($session_id);
    
    if (!$sessionData) {
        $responseFormatter->notFound("Cooking session not found");
        exit;
    }
    
    $session = $sessionData['session'];
    
    // Check session status
    if ($session['status'] === 'completed' || $session['status'] === 'cancelled' || $session['status'] === 'abandoned') {
        $responseFormatter->error("Cannot join a session that is " . $session['status'], 400);
        exit;
    }
    
    // Check visibility
    if ($session['visibility'] === 'private') {
        // For private sessions, check if user is friends with host
        // This is a simplified check - you might want to implement proper friend checking
        if ($session['host_id'] !== $userId) {
            $responseFormatter->unauthorized("This is a private session");
            exit;
        }
    } elseif ($session['visibility'] === 'friends_only') {
        // Check if user is friends with host
        $friendSql = "SELECT id FROM user_relationships 
                     WHERE ((source_user_id = :host_id AND target_user_id = :user_id) 
                     OR (source_user_id = :user_id AND target_user_id = :host_id))
                     AND relationship_type = 'friend' 
                     AND status = 'accepted'";
        
        $isFriend = Database::fetchOne($friendSql, [
            'host_id' => $session['host_id'],
            'user_id' => $userId
        ]);
        
        if (!$isFriend && $session['host_id'] !== $userId) {
            $responseFormatter->unauthorized("This session is for friends only");
            exit;
        }
    }
    
    // Check if recipe is paid and user has purchased it
    $recipeSql = "SELECT is_paid FROM recipes WHERE id = :recipe_id";
    $recipe = Database::fetchOne($recipeSql, ['recipe_id' => $session['recipe_id']]);
    
    if ($recipe && $recipe['is_paid']) {
        $purchaseSql = "SELECT id FROM recipe_interactions 
                       WHERE user_id = :user_id 
                       AND recipe_id = :recipe_id 
                       AND interaction_type = 'purchase'";
        
        $purchase = Database::fetchOne($purchaseSql, [
            'user_id' => $userId,
            'recipe_id' => $session['recipe_id']
        ]);
        
        if (!$purchase) {
            $responseFormatter->error("You need to purchase this recipe before joining the cooking session", 403);
            exit;
        }
    }
    
    // Join session
    $joined = $dbHelper->joinCookingSession($session_id, $userId, $role);
    
    if (!$joined) {
        throw new Exception("Failed to join cooking session");
    }
    
    // Get updated session data
    $updatedSession = $dbHelper->getCookingSession($session_id);
    
    $responseData = [
        'session' => $updatedSession['session'],
        'participants' => $updatedSession['participants'],
        'message' => 'Successfully joined cooking session'
    ];
    
    $responseFormatter->success($responseData, "Successfully joined cooking session", 200);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to join cooking session: " . $e->getMessage(), 500);
}