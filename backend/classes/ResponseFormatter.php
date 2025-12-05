<?php

/**
 * ResponseFormatter Class
 * Standardizes API responses for consistent client-side handling
 */
class ResponseFormatter {
    
    /**
     * Send a success response
     * 
     * @param mixed $data Response data (array, object, or scalar)
     * @param string $message Success message
     * @param int $code HTTP status code (default: 200)
     * @return void Outputs JSON response and exits
     */
    public static function success($data = null, $message = 'Success', $code = 200) {
        http_response_code($code);
        
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('c')
        ];
        
        header('Content-Type: application/json');
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Send an error response
     * 
     * @param string $message Error message
     * @param int $code HTTP status code (default: 500)
     * @param mixed $details Additional error details
     * @return void Outputs JSON response and exits
     */
    public static function error($message = 'An error occurred', $code = 500, $details = null) {
        http_response_code($code);
        
        $response = [
            'success' => false,
            'message' => $message,
            'errors' => $details,
            'timestamp' => date('c')
        ];
        
        // Remove errors if null to keep response clean
        if ($details === null) {
            unset($response['errors']);
        }
        
        header('Content-Type: application/json');
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Send a validation error response
     * 
     * @param array $errors Validation errors (field => messages)
     * @param string $message Error message (default: 'Validation failed')
     * @return void Outputs JSON response and exits
     */
    public static function validationError($errors, $message = 'Validation failed') {
        self::error($message, 422, $errors);
    }
    
    /**
     * Send an unauthorized error response
     * 
     * @param string $message Error message (default: 'Unauthorized')
     * @return void Outputs JSON response and exits
     */
    public static function unauthorized($message = 'Unauthorized') {
        self::error($message, 401);
    }
    
    /**
     * Send a forbidden error response
     * 
     * @param string $message Error message (default: 'Forbidden')
     * @return void Outputs JSON response and exits
     */
    public static function forbidden($message = 'Forbidden') {
        self::error($message, 403);
    }
    
    /**
     * Send a not found error response
     * 
     * @param string $message Error message (default: 'Resource not found')
     * @return void Outputs JSON response and exits
     */
    public static function notFound($message = 'Resource not found') {
        self::error($message, 404);
    }
    
    /**
     * Send a bad request error response
     * 
     * @param string $message Error message (default: 'Bad request')
     * @param mixed $details Additional error details
     * @return void Outputs JSON response and exits
     */
    public static function badRequest($message = 'Bad request', $details = null) {
        self::error($message, 400, $details);
    }
    
    /**
     * Send a conflict error response (e.g., duplicate resource)
     * 
     * @param string $message Error message (default: 'Conflict')
     * @param mixed $details Additional error details
     * @return void Outputs JSON response and exits
     */
    public static function conflict($message = 'Conflict', $details = null) {
        self::error($message, 409, $details);
    }
    
    /**
     * Send a created response (201)
     * 
     * @param mixed $data Created resource data
     * @param string $message Success message (default: 'Resource created')
     * @return void Outputs JSON response and exits
     */
    public static function created($data, $message = 'Resource created') {
        self::success($data, $message, 201);
    }
    
    /**
     * Send an accepted response (202)
     * 
     * @param mixed $data Response data
     * @param string $message Success message (default: 'Request accepted')
     * @return void Outputs JSON response and exits
     */
    public static function accepted($data, $message = 'Request accepted') {
        self::success($data, $message, 202);
    }
    
    /**
     * Send a no content response (204)
     * 
     * @return void Sets HTTP status to 204 and exits
     */
    public static function noContent() {
        http_response_code(204);
        exit;
    }
    
    /**
     * Send a paginated response
     * 
     * @param array $data Array of items
     * @param int $total Total number of items
     * @param int $page Current page
     * @param int $limit Items per page
     * @param string $message Success message
     * @return void Outputs JSON response and exits
     */
    public static function paginated($data, $total, $page, $limit, $message = 'Success') {
        $total_pages = ceil($total / $limit);
        $has_more = ($page * $limit) < $total;
        
        $pagination = [
            'current_page' => (int)$page,
            'items_per_page' => (int)$limit,
            'total_items' => (int)$total,
            'total_pages' => $total_pages,
            'has_previous' => $page > 1,
            'has_next' => $has_more
        ];
        
        $response_data = [
            'items' => $data,
            'pagination' => $pagination
        ];
        
        self::success($response_data, $message);
    }
    
    /**
     * Send a response with custom structure
     * 
     * @param array $data Custom response data
     * @param int $code HTTP status code
     * @return void Outputs JSON response and exits
     */
    public static function custom($data, $code = 200) {
        http_response_code($code);
        
        // Ensure basic structure
        if (!isset($data['success'])) {
            $data['success'] = ($code >= 200 && $code < 300);
        }
        
        if (!isset($data['timestamp'])) {
            $data['timestamp'] = date('c');
        }
        
        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Send a maintenance mode response
     * 
     * @param string $message Maintenance message
     * @param string $estimated_time Estimated downtime
     * @return void Outputs JSON response and exits
     */
    public static function maintenance($message = 'Service temporarily unavailable', $estimated_time = null) {
        http_response_code(503);
        
        $response = [
            'success' => false,
            'message' => $message,
            'timestamp' => date('c')
        ];
        
        if ($estimated_time) {
            $response['estimated_resume'] = $estimated_time;
        }
        
        header('Content-Type: application/json');
        header('Retry-After: 3600'); // Retry after 1 hour
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Send a rate limit exceeded response
     * 
     * @param string $message Rate limit message
     * @param int $retry_after Seconds to wait before retrying
     * @return void Outputs JSON response and exits
     */
    public static function rateLimit($message = 'Rate limit exceeded', $retry_after = 60) {
        http_response_code(429);
        
        $response = [
            'success' => false,
            'message' => $message,
            'retry_after' => $retry_after,
            'timestamp' => date('c')
        ];
        
        header('Content-Type: application/json');
        header("Retry-After: $retry_after");
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * Helper method to check if response should be JSON
     * Based on Accept header or file extension
     * 
     * @return bool True if JSON response expected
     */
    public static function expectsJson() {
        // Check Accept header
        if (isset($_SERVER['HTTP_ACCEPT'])) {
            $accept = strtolower($_SERVER['HTTP_ACCEPT']);
            if (strpos($accept, 'application/json') !== false || 
                strpos($accept, 'json') !== false) {
                return true;
            }
        }
        
        // Check if request is for API endpoint (based on URL pattern)
        if (isset($_SERVER['REQUEST_URI'])) {
            $uri = $_SERVER['REQUEST_URI'];
            if (strpos($uri, '/api/') !== false) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Set CORS headers for API responses
     * 
     * @param array $allowed_origins Array of allowed origins
     * @param array $allowed_methods Array of allowed methods
     * @param array $allowed_headers Array of allowed headers
     * @return void Sets appropriate headers
     */
    public static function setCorsHeaders($allowed_origins = ['*'], $allowed_methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], $allowed_headers = ['Content-Type', 'Authorization']) {
        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            $origin = $_SERVER['HTTP_ORIGIN'];
            if (in_array('*', $allowed_origins) || in_array($origin, $allowed_origins)) {
                header("Access-Control-Allow-Origin: $origin");
            }
        } else {
            header("Access-Control-Allow-Origin: *");
        }
        
        // Allow specific methods
        header("Access-Control-Allow-Methods: " . implode(', ', $allowed_methods));
        
        // Allow specific headers
        header("Access-Control-Allow-Headers: " . implode(', ', $allowed_headers));
        
        // Allow credentials if needed
        header("Access-Control-Allow-Credentials: true");
        
        // Cache preflight for 1 hour
        header("Access-Control-Max-Age: 3600");
    }
    
    /**
     * Handle OPTIONS preflight request
     * 
     * @return void Sends preflight response and exits
     */
    public static function handlePreflight() {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            self::setCorsHeaders();
            http_response_code(200);
            exit;
        }
    }
    
    /**
     * Log error for debugging (optional)
     * 
     * @param string $message Error message
     * @param mixed $details Error details
     * @param string $level Log level (error, warning, info)
     * @return void Logs error to file or system
     */
    private static function logError($message, $details = null, $level = 'error') {
        // Basic error logging - extend based on your needs
        $log_entry = date('Y-m-d H:i:s') . " [$level] $message";
        
        if ($details !== null) {
            if (is_array($details) || is_object($details)) {
                $details = json_encode($details);
            }
            $log_entry .= " - Details: $details";
        }
        
        $log_entry .= PHP_EOL;
        
        // Log to file (adjust path as needed)
        $log_file = __DIR__ . '/../logs/errors.log';
        file_put_contents($log_file, $log_entry, FILE_APPEND);
    }
}

// Optional helper functions for quick access
if (!function_exists('json_success')) {
    function json_success($data = null, $message = 'Success', $code = 200) {
        ResponseFormatter::success($data, $message, $code);
    }
}

if (!function_exists('json_error')) {
    function json_error($message = 'An error occurred', $code = 500, $details = null) {
        ResponseFormatter::error($message, $code, $details);
    }
}

if (!function_exists('json_validation_error')) {
    function json_validation_error($errors, $message = 'Validation failed') {
        ResponseFormatter::validationError($errors, $message);
    }
}

if (!function_exists('json_unauthorized')) {
    function json_unauthorized($message = 'Unauthorized') {
        ResponseFormatter::unauthorized($message);
    }
}

if (!function_exists('json_not_found')) {
    function json_not_found($message = 'Resource not found') {
        ResponseFormatter::notFound($message);
    }
}