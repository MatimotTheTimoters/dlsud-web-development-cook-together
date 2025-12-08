<?php

// Required imports per backend_files.md
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Set CORS headers
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/cors.php';

$responseFormatter = new ResponseFormatter();

try {
    // Check request method
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }
    
    // Get session ID from URL
    $url_parts = explode('/', $_SERVER['REQUEST_URI']);
    $session_id = end($url_parts);
    
    if (empty($session_id)) {
        $responseFormatter->error("Session ID is required", 400);
        exit;
    }
    
    $dbHelper = new DatabaseHelper();
    
    // Get cooking session
    $sessionData = $dbHelper->getCookingSession($session_id);
    
    if (!$sessionData) {
        $responseFormatter->notFound("Cooking session not found");
        exit;
    }
    
    // Check visibility
    $session = $sessionData['session'];
    
    // If session is private, check if user is a participant
    if ($session['visibility'] === 'private') {
        require_once __DIR__ . '/../../classes/AuthHelper.php';
        $authHelper = new AuthHelper();
        
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!empty($authHeader) && str_starts_with($authHeader, 'Bearer ')) {
            $token = str_replace('Bearer ', '', $authHeader);
            $decoded = $authHelper->validateToken($token);
            
            if ($decoded) {
                $userId = $decoded['user_id'];
                
                // Check if user is a participant
                $isParticipant = false;
                foreach ($sessionData['participants'] as $participant) {
                    if ($participant['user_id'] === $userId) {
                        $isParticipant = true;
                        break;
                    }
                }
                
                if (!$isParticipant) {
                    $responseFormatter->unauthorized("You don't have permission to view this session");
                    exit;
                }
            } else {
                $responseFormatter->unauthorized("Authentication required");
                exit;
            }
        } else {
            $responseFormatter->unauthorized("Authentication required");
            exit;
        }
    }
    
    // Format response
    $responseData = [
        'session' => $session,
        'details' => $sessionData['details'],
        'participants' => $sessionData['participants'],
        'completed_steps' => $sessionData['completed_steps'],
        'votes' => $sessionData['votes'],
        'recipe_steps' => $sessionData['recipe_steps'],
        'progress' => [
            'current_step' => $sessionData['details']['current_step_index'] ?? 0,
            'completed_steps' => $sessionData['details']['completed_steps'] ?? 0,
            'total_steps' => $sessionData['details']['total_steps'] ?? 0,
            'percentage' => $sessionData['details']['total_steps'] > 0 ? 
                round(($sessionData['details']['completed_steps'] / $sessionData['details']['total_steps']) * 100, 1) : 0
        ]
    ];
    
    $responseFormatter->success($responseData, "Cooking session retrieved successfully", 200);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to retrieve cooking session: " . $e->getMessage(), 500);
}