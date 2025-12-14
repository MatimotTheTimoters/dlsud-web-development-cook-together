<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

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
    
    if (!isset($input['session_id']) || !isset($input['vote_type']) || !isset($input['vote_value'])) {
        ResponseFormatter::error('Session ID, vote type, and vote value are required', 400);
        exit;
    }
    
    $session_id = $input['session_id'];
    $vote_type = $input['vote_type'];
    $vote_value = (bool)$input['vote_value'];
    
    $dbHelper = new DatabaseHelper();
    
    // Validate user is in session
    if (!$dbHelper->isUserInSession($session_id, $user_id)) {
        ResponseFormatter::error('User is not in this cooking session', 403);
        exit;
    }
    
    // Handle session vote
    $success = $dbHelper->handleSessionVote($session_id, $user_id, $vote_type, $vote_value);
    
    if (!$success) {
        ResponseFormatter::error('Failed to process vote', 500);
        exit;
    }
    
    // Get vote results
    $voteResults = $dbHelper->getSessionVoteResults($session_id, $vote_type);
    
    ResponseFormatter::success([
        'vote_results' => $voteResults,
        'message' => 'Vote recorded successfully'
    ], 'Vote recorded', 200);
    
} catch (Exception $e) {
    error_log('Error processing vote: ' . $e->getMessage());
    ResponseFormatter::error('Server error: ' . $e->getMessage(), 500);
}
?>