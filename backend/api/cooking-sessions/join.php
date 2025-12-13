<?php
// backend/api/cooking-sessions/join.php
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
    
    if (!isset($input['session_id'])) {
        ResponseFormatter::error('Session ID is required', 400);
        exit;
    }
    
    $session_id = $input['session_id'];
    
    $dbHelper = new DatabaseHelper();
    
    // Check session visibility and status
    $session = $dbHelper->getCookingSession($session_id);
    
    if (!$session) {
        ResponseFormatter::error('Cooking session not found', 404);
        exit;
    }
    
    // Check if session is joinable
    if (!in_array($session['status'], ['planned', 'preparing'])) {
        ResponseFormatter::error('Session is not currently joinable', 400);
        exit;
    }
    
    // Check visibility restrictions
    if ($session['visibility'] === 'private') {
        ResponseFormatter::error('This is a private session', 403);
        exit;
    }
    
    // Check if already joined
    if ($dbHelper->isUserInSession($session_id, $user_id)) {
        ResponseFormatter::error('User already joined this session', 400);
        exit;
    }
    
    // Join cooking session
    $success = $dbHelper->joinCookingSession($session_id, $user_id);
    
    if (!$success) {
        ResponseFormatter::error('Failed to join cooking session', 500);
        exit;
    }
    
    // Get updated session with participants
    $updatedSession = $dbHelper->getCookingSession($session_id);
    
    ResponseFormatter::success([
        'session' => $updatedSession,
        'message' => 'Successfully joined cooking session'
    ], 'Joined session', 200);
    
} catch (Exception $e) {
    error_log('Error joining cooking session: ' . $e->getMessage());
    ResponseFormatter::error('Server error: ' . $e->getMessage(), 500);
}
?>