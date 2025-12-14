<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error('Method not allowed', 405);
}

try {
    // Note: In JWT, logout is typically handled client-side
    // by removing the token. Server-side blacklisting would
    // require additional infrastructure.
    
    // Return success response
    ResponseFormatter::success(null, 'Logout successful');
    
} catch (Exception $e) {
    error_log('Logout error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred during logout', 500);
}
?>