<?php

CORS::setCorsHeaders();
CORS::handlePreflight();

/**
 * CORS Configuration
 * Handles Cross-Origin Resource Sharing headers
 */

class CORS
{
    /**
     * Sets CORS headers for API responses
     * @return void
     */
    public static function setCorsHeaders()
    {
        // For development only - allow all origins
        header("Access-Control-Allow-Origin: http://localhost:3000");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Content-Type: application/json");
    }

    /**
     * Handles OPTIONS preflight requests
     * @return void
     */
    public static function handlePreflight()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}
