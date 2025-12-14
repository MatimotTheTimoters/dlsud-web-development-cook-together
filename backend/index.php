<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

// Define application root
define('APP_ROOT', dirname(__FILE__));

// Include required classes and utilities
require_once APP_ROOT . '/config/database.php';
require_once APP_ROOT . '/classes/AuthHelper.php';
require_once APP_ROOT . '/classes/DatabaseHelper.php';
require_once APP_ROOT . '/classes/ResponseFormatter.php';
require_once APP_ROOT . '/classes/UserCalculations.php';

// Parse request URI
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = $_SERVER['SCRIPT_NAME'];

// Remove query string from request URI
$request_path = parse_url($request_uri, PHP_URL_PATH);
$query_string = parse_url($request_uri, PHP_URL_QUERY);

// Remove the base path (if running from subdirectory)
$base_path = dirname($script_name);
if ($base_path !== '/' && strpos($request_path, $base_path) === 0) {
    $request_path = substr($request_path, strlen($base_path));
}

// Normalize path
$request_path = trim($request_path, '/');
$path_segments = explode('/', $request_path);

// Debug mode (set to false in production)
define('DEBUG_MODE', true);

// Error handling
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Set timezone
date_default_timezone_set('UTC');

// Route the request
try {
    // API version (could be extended for future versions)
    $api_version = 'v1';
    
    // Check if this is an API request
    if (empty($path_segments[0]) || $path_segments[0] !== 'api') {
        // Not an API request, could serve frontend or show API info
        if (empty($path_segments[0])) {
            // Root path - show API info
            showApiInfo();
        } else {
            // Not found
            ResponseFormatter::notFound('Endpoint not found');
        }
        exit();
    }
    
    // Remove 'api' from path segments
    array_shift($path_segments);
    
    // Handle empty path after /api
    if (empty($path_segments[0])) {
        ResponseFormatter::error('No endpoint specified', 400);
        exit();
    }
    
    // Route to the appropriate endpoint
    routeRequest($path_segments);
    
} catch (Exception $e) {
    // Handle unexpected errors
    error_log("Unhandled exception in index.php: " . $e->getMessage());
    if (DEBUG_MODE) {
        ResponseFormatter::error('Internal server error: ' . $e->getMessage(), 500);
    } else {
        ResponseFormatter::error('Internal server error', 500);
    }
}

/**
 * Route the request to the appropriate API endpoint
 * 
 * @param array $path_segments URL path segments
 */
function routeRequest($path_segments) {
    // Map URL segments to file paths
    $endpoint_file = getEndpointFilePath($path_segments);
    
    if ($endpoint_file === null) {
        ResponseFormatter::notFound('Endpoint not found: /api/' . implode('/', $path_segments));
        return;
    }
    
    // Check if the endpoint file exists
    if (!file_exists($endpoint_file)) {
        ResponseFormatter::notFound('Endpoint file not found: ' . implode('/', $path_segments));
        return;
    }
    
    // Include the endpoint file
    require_once $endpoint_file;
}

/**
 * Get the file path for an API endpoint based on URL segments
 * 
 * @param array $path_segments URL path segments
 * @return string|null File path or null if not found
 */
function getEndpointFilePath($path_segments) {
    $base_path = APP_ROOT . '/api/';
    
    // Handle special cases first
    if (count($path_segments) === 1) {
        // Check for root-level endpoints like /api/auth (should redirect to auth/index.php if exists)
        $possible_paths = [
            $base_path . $path_segments[0] . '/index.php',
            $base_path . $path_segments[0] . '.php'
        ];
        
        foreach ($possible_paths as $path) {
            if (file_exists($path)) {
                return $path;
            }
        }
    }
    
    // Build the file path from segments
    $file_path = $base_path . implode('/', $path_segments) . '.php';
    
    // Check if the file exists
    if (file_exists($file_path)) {
        return $file_path;
    }
    
    // Check if it's a directory with index.php
    $dir_path = $base_path . implode('/', $path_segments);
    if (is_dir($dir_path) && file_exists($dir_path . '/index.php')) {
        return $dir_path . '/index.php';
    }
    
    // Try with nested index.php for the last segment
    if (count($path_segments) > 1) {
        $last_segment = array_pop($path_segments);
        $dir_path = $base_path . implode('/', $path_segments);
        $index_path = $dir_path . '/index.php';
        
        if (file_exists($index_path)) {
            // Pass the last segment as a parameter
            $_GET['action'] = $last_segment;
            return $index_path;
        }
    }
    
    return null;
}

/**
 * Show API information for the root path
 */
function showApiInfo() {
    $api_info = [
        'name' => 'CookTogether API',
        'version' => '1.0.0',
        'description' => 'A gamified cooking collaboration platform API',
        'endpoints' => [
            'auth' => [
                'POST /api/auth/register' => 'Register a new user',
                'POST /api/auth/login' => 'Login user',
                'GET /api/auth/me' => 'Get current user info',
                'POST /api/auth/logout' => 'Logout user',
                'POST /api/auth/refresh-token' => 'Refresh authentication token'
            ],
            'users' => [
                'GET /api/users/profile/{id}' => 'Get user profile',
                'PUT /api/users/update' => 'Update user profile',
                'GET /api/users/stats' => 'Get user statistics',
                'GET /api/users/search' => 'Search users'
            ],
            'recipes' => [
                'GET /api/recipes' => 'List recipes',
                'POST /api/recipes/create' => 'Create recipe',
                'GET /api/recipes/{id}' => 'Get recipe details',
                'PUT /api/recipes/update/{id}' => 'Update recipe',
                'DELETE /api/recipes/delete/{id}' => 'Delete recipe',
                'POST /api/recipes/purchase' => 'Purchase recipe',
                'POST /api/recipes/interact' => 'Like/save recipe'
            ],
            'cooking-sessions' => [
                'GET /api/cooking-sessions' => 'List sessions',
                'POST /api/cooking-sessions/create' => 'Create session',
                'GET /api/cooking-sessions/{id}' => 'Get session details',
                'PUT /api/cooking-sessions/update/{id}' => 'Update session',
                'POST /api/cooking-sessions/join' => 'Join session',
                'POST /api/cooking-sessions/complete-step' => 'Complete step',
                'POST /api/cooking-sessions/vote' => 'Vote in session'
            ],
            'cookbooks' => [
                'GET /api/cookbooks' => 'List cookbooks',
                'POST /api/cookbooks/create' => 'Create cookbook',
                'GET /api/cookbooks/{id}' => 'Get cookbook details',
                'POST /api/cookbooks/add-recipe' => 'Add recipe to cookbook',
                'POST /api/cookbooks/remove-recipe' => 'Remove recipe from cookbook'
            ],
            'relationships' => [
                'POST /api/relationships/follow' => 'Follow/unfollow user',
                'POST /api/relationships/friends' => 'Manage friend requests',
                'GET /api/relationships/list' => 'List relationships'
            ],
            'shop' => [
                'GET /api/shop/items' => 'List shop items',
                'POST /api/shop/purchase' => 'Purchase shop item'
            ],
            'inventory' => [
                'GET /api/inventory/list' => 'List inventory items',
                'POST /api/inventory/use' => 'Use inventory item'
            ],
            'activity' => [
                'GET /api/activity/feed' => 'Get activity feed'
            ],
            'sessions' => [
                'GET /api/sessions/history' => 'Get session history'
            ],
            'chat' => [
                'POST /api/chat/messages' => 'Send chat message',
                'GET /api/chat/messages' => 'Get chat messages'
            ],
            'upload' => [
                'POST /api/upload/image' => 'Upload image'
            ]
        ],
        'documentation' => 'See index.md for detailed API documentation',
        'status' => 'online',
        'timestamp' => date('Y-m-d H:i:s'),
        'timezone' => date_default_timezone_get()
    ];
    
    // Set response headers
    header('Content-Type: application/json; charset=utf-8');
    
    // Output the API info
    echo json_encode($api_info, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}

/**
 * Handle preflight CORS requests
 */
function handlePreflight() {
    http_response_code(200);
    exit();
}

/**
 * Set CORS headers
 */
function setCorsHeaders() {
    $allowed_origins = ['http://localhost:3000', 'http://localhost:8080'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // If not in allowed list, don't set the header (safer)
        // Or set to a specific default
        header("Access-Control-Allow-Origin: http://localhost:3000");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
}

/**
 * Log API request for debugging
 * 
 * @param string $method HTTP method
 * @param string $endpoint Requested endpoint
 * @param int $status HTTP status code
 * @param array $data Optional request/response data
 */
function logApiRequest($method, $endpoint, $status, $data = []) {
    if (!DEBUG_MODE) return;
    
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => $method,
        'endpoint' => $endpoint,
        'status' => $status,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'data' => $data
    ];
    
    $log_file = APP_ROOT . '/logs/api_requests.log';
    $log_dir = dirname($log_file);
    
    // Create logs directory if it doesn't exist
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }
    
    // Append to log file
    file_put_contents($log_file, json_encode($log_entry) . PHP_EOL, FILE_APPEND | LOCK_EX);
}

// Register shutdown function to log requests
register_shutdown_function(function() {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'UNKNOWN';
    $endpoint = $_SERVER['REQUEST_URI'] ?? '/';
    $status = http_response_code();
    
    // Log request (only in debug mode)
    if (DEBUG_MODE) {
        logApiRequest($method, $endpoint, $status, [
            'get' => $_GET,
            'post' => $_POST,
            'files' => $_FILES
        ]);
    }
});