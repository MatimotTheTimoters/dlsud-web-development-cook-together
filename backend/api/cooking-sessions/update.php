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
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        $responseFormatter->error("Method not allowed", 405);
        exit;
    }
    
    // Get and validate input data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        $responseFormatter->error("Invalid JSON data", 400);
        exit;
    }
    
    $dbHelper = new DatabaseHelper();
    
    // Get current session
    $sessionData = $dbHelper->getCookingSession($session_id);
    
    if (!$sessionData) {
        $responseFormatter->notFound("Cooking session not found");
        exit;
    }
    
    $session = $sessionData['session'];
    
    // Check permission - only host or admin can update session
    $isHost = ($session['host_id'] === $userId);
    
    if (!$isHost) {
        // Check if user is admin (you might have an admin check here)
        $responseFormatter->unauthorized("Only the session host can update the session");
        exit;
    }
    
    // Prepare update data
    $updateData = [];
    $allowedFields = [
        'mode', 'visibility', 'status', 'notes', 
        'started_at', 'paused_at', 'completed_at'
    ];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updateData[$field] = $data[$field];
        }
    }
    
    // Handle status transitions
    if (isset($data['status'])) {
        $currentStatus = $session['status'];
        $newStatus = $data['status'];
        
        // Validate status transition
        $validTransitions = [
            'planned' => ['preparing', 'cooking', 'cancelled'],
            'preparing' => ['cooking', 'paused', 'cancelled'],
            'cooking' => ['paused', 'completed', 'abandoned'],
            'paused' => ['cooking', 'completed', 'cancelled'],
            'completed' => [], // No transitions from completed
            'cancelled' => [], // No transitions from cancelled
            'abandoned' => []  // No transitions from abandoned
        ];
        
        if (!in_array($newStatus, $validTransitions[$currentStatus] ?? [])) {
            $responseFormatter->error("Invalid status transition from $currentStatus to $newStatus", 400);
            exit;
        }
        
        // Set timestamps based on status
        if ($newStatus === 'cooking' && $currentStatus !== 'cooking') {
            $updateData['started_at'] = date('Y-m-d H:i:s');
        } elseif ($newStatus === 'paused' && $currentStatus === 'cooking') {
            $updateData['paused_at'] = date('Y-m-d H:i:s');
        } elseif ($newStatus === 'completed' && in_array($currentStatus, ['cooking', 'paused'])) {
            $updateData['completed_at'] = date('Y-m-d H:i:s');
        }
    }
    
    if (empty($updateData)) {
        $responseFormatter->error("No valid fields to update", 400);
        exit;
    }
    
    // Update session
    $updated = $dbHelper->updateCookingSession($session_id, $updateData);
    
    if (!$updated) {
        throw new Exception("Failed to update cooking session");
    }
    
    // Get updated session
    $updatedSession = $dbHelper->getCookingSession($session_id);
    
    $responseData = [
        'session' => $updatedSession['session'],
        'message' => 'Cooking session updated successfully'
    ];
    
    $responseFormatter->success($responseData, "Cooking session updated successfully", 200);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to update cooking session: " . $e->getMessage(), 500);
}