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
    
    if (empty($data['vote_type'])) {
        $responseFormatter->error("Vote type is required", 400);
        exit;
    }
    
    $vote_type = $data['vote_type'];
    $vote_value = $data['vote_value'] ?? true;
    
    // Validate vote type
    $allowedVoteTypes = ['skip_read_timer', 'skip_step', 'other'];
    if (!in_array($vote_type, $allowedVoteTypes)) {
        $responseFormatter->error("Invalid vote type. Allowed: " . implode(', ', $allowedVoteTypes), 400);
        exit;
    }
    
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
        $responseFormatter->error("Cannot vote in a session that is " . $session['status'], 400);
        exit;
    }
    
    // Submit vote
    $voted = $dbHelper->voteInCookingSession($session_id, $userId, $vote_type, $vote_value);
    
    if (!$voted) {
        throw new Exception("Failed to submit vote");
    }
    
    // Get vote counts
    $votesSql = "SELECT 
                    vote_type,
                    SUM(CASE WHEN vote_value = 1 THEN 1 ELSE 0 END) as yes_votes,
                    SUM(CASE WHEN vote_value = 0 THEN 1 ELSE 0 END) as no_votes,
                    COUNT(*) as total_votes
                FROM cooking_session_votes 
                WHERE cooking_session_id = :session_id 
                GROUP BY vote_type";
    
    $voteCounts = Database::fetchAll($votesSql, ['session_id' => $session_id]);
    
    // Calculate if vote passed (simple majority)
    $voteResults = [];
    foreach ($voteCounts as $voteCount) {
        $voteResults[$voteCount['vote_type']] = [
            'yes' => (int)$voteCount['yes_votes'],
            'no' => (int)$voteCount['no_votes'],
            'total' => (int)$voteCount['total_votes'],
            'passed' => $voteCount['yes_votes'] > $voteCount['no_votes']
        ];
    }
    
    $responseData = [
        'vote' => [
            'type' => $vote_type,
            'value' => $vote_value,
            'user_id' => $userId
        ],
        'vote_results' => $voteResults,
        'current_votes' => $voteResults[$vote_type] ?? null,
        'message' => 'Vote submitted successfully'
    ];
    
    $responseFormatter->success($responseData, "Vote submitted successfully", 200);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to submit vote: " . $e->getMessage(), 500);
}