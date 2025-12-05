<?php
/**
 * CORS Configuration
 * Handles Cross-Origin Resource Sharing headers
 */

class CORS {
    /**
     * Sets CORS headers for API responses
     * @return void
     */
    public static function setCorsHeaders() {
        // Allow from any origin (for development)
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }
        
        // Allow specific frontend ports during development
        $allowed_origins = [
            'http://localhost:3000', // React dev server
            'http://127.0.0.1:3000',
            'http://localhost:8080', // Alternative port
        ];
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        
        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
                header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            }
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
            } else {
                header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
            }
            
            exit(0);
        }
        
        // Standard headers for all requests
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    }
    
    /**
     * Handles OPTIONS preflight requests
     * @return void
     */
    public static function handlePreflight() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            self::setCorsHeaders();
            http_response_code(200);
            exit();
        }
    }
}
?>