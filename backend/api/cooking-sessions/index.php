<?php
// backend/api/cooking-sessions/index.php

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
    
    // Get query parameters
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $status = isset($_GET['status']) ? $_GET['status'] : null;
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
    $visibility = isset($_GET['visibility']) ? $_GET['visibility'] : null;
    
    $dbHelper = new DatabaseHelper();
    
    if ($user_id) {
        // Get user's cooking sessions
        $sessions = $dbHelper->getUserCookingSessions($user_id, $status);
        
        if ($sessions === false) {
            throw new Exception("Failed to fetch user cooking sessions");
        }
        
        $responseData = [
            'sessions' => $sessions,
            'total' => count($sessions)
        ];
    } else {
        // Get public cooking sessions
        $sessions = $dbHelper->getPublicCookingSessions($limit);
        
        if ($sessions === false) {
            throw new Exception("Failed to fetch public cooking sessions");
        }
        
        // Filter by visibility if specified
        if ($visibility) {
            $sessions = array_filter($sessions, function($session) use ($visibility) {
                return $session['visibility'] === $visibility;
            });
            $sessions = array_values($sessions); // Reindex array
        }
        
        // Filter by status if specified
        if ($status) {
            $sessions = array_filter($sessions, function($session) use ($status) {
                return $session['status'] === $status;
            });
            $sessions = array_values($sessions); // Reindex array
        }
        
        // Pagination
        $totalSessions = count($sessions);
        $totalPages = ceil($totalSessions / $limit);
        $offset = ($page - 1) * $limit;
        $paginatedSessions = array_slice($sessions, $offset, $limit);
        
        $responseData = [
            'sessions' => $paginatedSessions,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $totalSessions,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ];
    }
    
    $responseFormatter->success($responseData, "Cooking sessions retrieved successfully", 200);
    
} catch (Exception $e) {
    $responseFormatter->error("Failed to retrieve cooking sessions: " . $e->getMessage(), 500);
}