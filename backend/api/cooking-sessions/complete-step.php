<?php
// backend/api/cooking-sessions/complete-step.php

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
    
    if (empty($data['step_id'])) {
        $responseFormatter->error("Step ID is required", 400);
        exit;
    }
    
    $step_id = $data['step_id'];
    $duration_seconds = $data['duration_seconds'] ?? null;
    $was_skipped = $data['was_skipped'] ?? false;
    $notes = $data['notes'] ?? null;
    
    $dbHelper = new DatabaseHelper();
    
    // Get session
    $sessionData = $dbHelper->getCookingSession($session_id);
    
    if (!$sessionData) {
        $responseFormatter->notFound("Cooking session not found");
        exit;
    }
    
    $session = $sessionData['session'];
    
    // Check if user is a participant
    $isParticipant = false;
    foreach ($sessionData['participants'] as $participant) {
        if ($participant['user_id'] === $userId && $participant['status'] === 'joined') {
            $isParticipant = true;
            break;
        }
    }
    
    if (!$isParticipant) {
        $responseFormatter->unauthorized("You are not a participant in this session");
        exit;
    }
    
    // Check session status
    if ($session['status'] !== 'cooking' && $session['status'] !== 'preparing') {
        $responseFormatter->error("Cannot complete steps in a session that is " . $session['status'], 400);
        exit;
    }
    
    // Complete step
    $stepData = [
        'duration_seconds' => $duration_seconds,
        'was_skipped' => $was_skipped,
        'notes' => $notes
    ];
    
    $completed = $dbHelper->completeCookingStep($session_id, $step_id, $userId, $stepData);
    
    if (!$completed) {
        $responseFormatter->error("Failed to complete step. It may have already been completed.", 400);
        exit;
    }
    
    // Get updated session data
    $updatedSession = $dbHelper->getCookingSession($session_id);
    
    // Calculate rewards
    $totalExp = $updatedSession['details']['exp_earned'] ?? 0;
    $totalGold = $updatedSession['details']['gold_earned'] ?? 0;
    $totalGems = $updatedSession['details']['gems_earned'] ?? 0;
    
    // Get step info for response
    $stepSql = "SELECT * FROM recipe_steps WHERE id = :step_id";
    $step = Database::fetchOne($stepSql, ['step_id' => $step_id]);
    
    $responseData = [
        'session' => $updatedSession['session'],
        'details' => $updatedSession['details'],
        'completed_step' => [
            'step_id' => $step_id,
            'step_index' => $step['order_index'] ?? 0,
            'exp_earned' => $step['exp_reward'] ?? 0,
            'gold_earned' => $step['gold_reward'] ?? 0,
            'gem_earned' => $step['gem_reward'] ?? 0
        ],
        'total_rewards' => [
            'exp' => $totalExp,
            'gold' => $totalGold,
            'gems' => $totalGems
        ],
        'progress' => [
            'current_step' => $updatedSession['details']['current_step_index'] ?? 0,
            'completed_steps' => $updatedSession['details']['completed_steps'] ?? 0,
            'total_steps' => $updatedSession['details']['total_steps'] ?? 0,
            'percentage' => $updatedSession['details']['total_steps'] > 0 ? 
                round(($updatedSession['details']['completed_steps'] / $updatedSession['details']['total_steps']) * 100, 1) : 0
        ],
        'message' => 'Step completed successfully'
    ];
    
    $responseFormatter->success($responseData, "Step completed successfully", 200);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to complete step: " . $e->getMessage(), 500);
}