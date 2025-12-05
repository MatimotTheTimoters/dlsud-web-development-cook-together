<?php
/**
 * Main API Router
 * Routes requests to appropriate endpoints
 */

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include CORS configuration
require_once __DIR__ . '/config/cors.php';

// Set CORS headers
CORS::setCorsHeaders();
CORS::handlePreflight();

// Get the requested path
$request_path = $_GET['path'] ?? '';
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove trailing slash
$request_path = rtrim($request_path, '/');

// Parse the path into segments
$path_segments = $request_path ? explode('/', $request_path) : [];

// Route to the appropriate endpoint
$api_base = __DIR__ . '/api';
$endpoint_found = false;

// Define API route patterns
$routes = [
    'auth' => [
        'register' => 'auth/register.php',
        'login' => 'auth/login.php',
        'me' => 'auth/me.php',
        'logout' => 'auth/logout.php',
        'refresh-token' => 'auth/refresh-token.php'
    ],
    'users' => [
        'profile' => 'users/profile.php',
        'update' => 'users/update.php',
        'stats' => 'users/stats.php',
        'search' => 'users/search.php'
    ],
    'recipes' => [
        '' => 'recipes/index.php',
        '{id}' => 'recipes/show.php',
        '{id}/interact' => 'recipes/interact.php'
    ],
    'cooking-sessions' => [
        '' => 'cooking-sessions/index.php',
        '{id}' => 'cooking-sessions/show.php',
        '{id}/join' => 'cooking-sessions/join.php',
        '{id}/complete-step' => 'cooking-sessions/complete-step.php',
        '{id}/vote' => 'cooking-sessions/vote.php'
    ],
    'relationships' => [
        'follow' => 'relationships/follow.php',
        'friends' => 'relationships/friends.php',
        'list' => 'relationships/list.php'
    ],
    'cookbooks' => [
        '' => 'cookbooks/index.php',
        '{id}' => 'cookbooks/show.php',
        '{id}/add-recipe' => 'cookbooks/add-recipe.php',
        '{id}/remove-recipe' => 'cookbooks/remove-recipe.php'
    ],
    'upload' => [
        'image' => 'upload/image.php'
    ]
];

// Simple router logic
if (count($path_segments) >= 2) {
    $category = $path_segments[0];
    $action = $path_segments[1];
    $id = isset($path_segments[2]) ? $path_segments[2] : null;
    
    if (isset($routes[$category])) {
        if (isset($routes[$category][$action])) {
            $endpoint_file = $routes[$category][$action];
        } elseif (isset($routes[$category]['']) && $id) {
            // Handle routes like /recipes/{id}
            $endpoint_file = $routes[$category][''];
            $_GET['id'] = $id;
        } elseif (isset($routes[$category][$action . '/' . $id])) {
            // Handle routes like /recipes/{id}/interact
            $endpoint_file = $routes[$category][$action . '/' . $id];
        } else {
            // Check for dynamic routes with {id}
            foreach ($routes[$category] as $route => $file) {
                if (strpos($route, '{id}') !== false) {
                    if ($action && !$id && $route === $action) {
                        $endpoint_file = $file;
                        break;
                    }
                }
            }
        }
        
        if (isset($endpoint_file)) {
            $endpoint_path = $api_base . '/' . $endpoint_file;
            if (file_exists($endpoint_path)) {
                require_once $endpoint_path;
                $endpoint_found = true;
            }
        }
    }
} elseif (count($path_segments) === 1) {
    $category = $path_segments[0];
    if (isset($routes[$category][''])) {
        $endpoint_file = $routes[$category][''];
        $endpoint_path = $api_base . '/' . $endpoint_file;
        if (file_exists($endpoint_path)) {
            require_once $endpoint_path;
            $endpoint_found = true;
        }
    }
}

// If no endpoint found, return 404
if (!$endpoint_found) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Endpoint not found',
        'path' => $request_path,
        'method' => $request_method
    ]);
    exit;
}

// Handle any uncaught errors
function handleShutdown() {
    $error = error_get_last();
    if ($error && $error['type'] === E_ERROR) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Internal server error',
            'error' => $error['message']
        ]);
    }
}
register_shutdown_function('handleShutdown');
?>