<?php
// backend/api/cooking-sessions/update.php
// Required Imports: ../../config/database.php, ../../classes/AuthHelper.php, ../../classes/DatabaseHelper.php, ../../classes/ResponseFormatter.php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

header('Content-Type: application/json');

// Check if it's a PUT request
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
    $updates = $input['updates'] ?? [];
    
    if (empty($updates)) {
        ResponseFormatter::error('No updates provided', 400);
        exit;
    }
    
    $dbHelper = new DatabaseHelper();
    
    // Check if user is the host or has permission to update
    $session = $dbHelper->getCookingSession($session_id);
    
    if (!$session) {
        ResponseFormatter::error('Cooking session not found', 404);
        exit;
    }
    
    // Only host can update session
    if ($session['host_id'] !== $user_id) {
        ResponseFormatter::forbidden('Only the session host can update the session');
        exit;
    }
    
    // Validate allowed update fields
    $allowedFields = ['status', 'visibility', 'notes', 'started_at', 'paused_at', 'completed_at'];
    $filteredUpdates = array_intersect_key($updates, array_flip($allowedFields));
    
    if (empty($filteredUpdates)) {
        ResponseFormatter::error('No valid fields to update', 400);
        exit;
    }
    
    // Update cooking session
    $success = $dbHelper->updateCookingSession($session_id, $filteredUpdates);
    
    if (!$success) {
        ResponseFormatter::error('Failed to update cooking session', 500);
        exit;
    }
    
    // Get updated session
    $updatedSession = $dbHelper->getCookingSession($session_id);
    
    ResponseFormatter::success([
        'session' => $updatedSession,
        'message' => 'Cooking session updated successfully'
    ], 'Session updated', 200);
    
} catch (Exception $e) {
    error_log('Error updating cooking session: ' . $e->getMessage());
    ResponseFormatter::error('Server error: ' . $e->getMessage(), 500);
}
?>