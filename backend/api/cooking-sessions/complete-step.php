<?php
// backend/api/cooking-sessions/complete-step.php
// Required Imports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error('Method not allowed', 405);
    exit;
}

try {
    // Get authorization token
    $authHelper = new AuthHelper();
    $token = $authHelper->getBearerToken();
    
    if (!$token) {
        ResponseFormatter::unauthorized('No authentication token provided');
        exit;
    }
    
    // Validate token
    $tokenData = $authHelper->validateToken($token);
    if (!$tokenData) {
        ResponseFormatter::unauthorized('Invalid or expired token');
        exit;
    }
    
    $user_id = $tokenData['user_id'];
    
    // Get input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['session_id']) || !isset($input['step_id'])) {
        ResponseFormatter::error('Session ID and Step ID are required', 400);
        exit;
    }
    
    $session_id = $input['session_id'];
    $step_id = $input['step_id'];
    $completion_data = $input['completion_data'] ?? [];
    
    $dbHelper = new DatabaseHelper();
    
    // Validate user is in session
    if (!$dbHelper->isUserInSession($session_id, $user_id)) {
        ResponseFormatter::error('User is not in this cooking session', 403);
        exit;
    }
    
    // Complete cooking step
    $success = $dbHelper->completeCookingStep($session_id, $step_id, $user_id, $completion_data);
    
    if (!$success) {
        ResponseFormatter::error('Failed to complete cooking step', 500);
        exit;
    }
    
    // Get updated session
    $updatedSession = $dbHelper->getCookingSession($session_id);
    
    // Calculate rewards if step has rewards
    $rewards = [];
    if (isset($completion_data['calculate_rewards']) && $completion_data['calculate_rewards']) {
        require_once __DIR__ . '/../../classes/UserCalculations.php';
        $userCalculations = new UserCalculations();
        
        // Get recipe details for reward calculation
        $session = $dbHelper->getCookingSession($session_id);
        if ($session && isset($session['recipe'])) {
            $recipe = $session['recipe'];
            $user_stats = $dbHelper->getUserStats($user_id);
            
            if ($user_stats) {
                $rewards = $userCalculations->calculateStepRewards(
                    $completion_data['step_index'] ?? 0,
                    $completion_data['total_steps'] ?? 1,
                    $recipe
                );
            }
        }
    }
    
    ResponseFormatter::success([
        'session' => $updatedSession,
        'rewards' => $rewards,
        'message' => 'Step completed successfully'
    ], 'Step completed', 200);
    
} catch (Exception $e) {
    error_log('Error completing cooking step: ' . $e->getMessage());
    ResponseFormatter::error('Server error: ' . $e->getMessage(), 500);
}
?>