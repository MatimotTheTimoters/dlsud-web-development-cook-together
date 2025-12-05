<?php

/**
 * AuthHelper Class
 * Handles JWT authentication, token generation/validation, and password hashing
 */
class AuthHelper {
    
    // JWT Configuration
    private static $secret_key = 'cooktogether_secret_key_2024_change_in_production';
    private static $algorithm = 'HS256';
    private static $token_expiry = 3600; // 1 hour in seconds
    private static $refresh_token_expiry = 604800; // 7 days in seconds
    
    /**
     * Generate JWT token for user
     * 
     * @param string $user_id User's unique identifier
     * @param string $email User's email
     * @param array $additional_data Additional user data to include in token
     * @return string JWT token
     */
    public static function generateToken($user_id, $email, $additional_data = []) {
        $issued_at = time();
        $expire_at = $issued_at + self::$token_expiry;
        
        $payload = array(
            "iss" => "cooktogether_api", // Issuer
            "aud" => "cooktogether_app", // Audience
            "iat" => $issued_at, // Issued at
            "exp" => $expire_at, // Expiration time
            "sub" => $user_id, // Subject (user ID)
            "email" => $email,
            "user_id" => $user_id
        );
        
        // Merge additional data if provided
        if (!empty($additional_data)) {
            $payload = array_merge($payload, $additional_data);
        }
        
        // Encode headers
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => self::$algorithm
        ]);
        
        // Encode payload
        $payload_encoded = json_encode($payload);
        
        // Base64Url encode header and payload
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload_encoded);
        
        // Create signature
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        // Create JWT
        $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
        
        return $jwt;
    }
    
    /**
     * Generate refresh token
     * 
     * @param string $user_id User's unique identifier
     * @return string Refresh token
     */
    public static function generateRefreshToken($user_id) {
        $issued_at = time();
        $expire_at = $issued_at + self::$refresh_token_expiry;
        
        $payload = array(
            "type" => "refresh",
            "user_id" => $user_id,
            "iat" => $issued_at,
            "exp" => $expire_at
        );
        
        $payload_encoded = json_encode($payload);
        $token = self::base64UrlEncode($payload_encoded);
        
        // Add random bytes for security
        $random_bytes = bin2hex(random_bytes(16));
        $refresh_token = $token . '.' . $random_bytes;
        
        return $refresh_token;
    }
    
    /**
     * Validate JWT token
     * 
     * @param string $token JWT token to validate
     * @return array|false Decoded token payload if valid, false otherwise
     */
    public static function validateToken($token) {
        if (empty($token)) {
            return false;
        }
        
        // Split the token
        $token_parts = explode('.', $token);
        
        if (count($token_parts) != 3) {
            return false;
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $token_parts;
        
        // Verify signature
        $signature = self::base64UrlDecode($base64UrlSignature);
        $expected_signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        
        if (!hash_equals($signature, $expected_signature)) {
            return false;
        }
        
        // Decode payload
        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        // Check required fields
        if (!isset($payload['user_id']) || !isset($payload['email'])) {
            return false;
        }
        
        return $payload;
    }
    
    /**
     * Extract token from Authorization header
     * 
     * @return string|null Token if found, null otherwise
     */
    public static function getBearerToken() {
        $headers = self::getAuthorizationHeader();
        
        // HEADER: Get the access token from the header
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
    
    /**
     * Get authorization header
     * 
     * @return string|null Authorization header if present
     */
    private static function getAuthorizationHeader() {
        $headers = null;
        
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER['Authorization']);
        } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        
        return $headers;
    }
    
    /**
     * Hash password using bcrypt
     * 
     * @param string $password Plain text password
     * @return string Hashed password
     */
    public static function hashPassword($password) {
        // Use password_hash with bcrypt (default algorithm)
        $hashed_password = password_hash($password, PASSWORD_BCRYPT, [
            'cost' => 12 // Good balance between security and performance
        ]);
        
        return $hashed_password;
    }
    
    /**
     * Verify password against hash
     * 
     * @param string $password Plain text password
     * @param string $hash Hashed password
     * @return bool True if password matches hash
     */
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    /**
     * Validate password strength
     * 
     * @param string $password Password to validate
     * @return array Validation result with success flag and message
     */
    public static function validatePasswordStrength($password) {
        $errors = [];
        
        // Check minimum length
        if (strlen($password) < 8) {
            $errors[] = "Password must be at least 8 characters long";
        }
        
        // Check for at least one uppercase letter
        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = "Password must contain at least one uppercase letter";
        }
        
        // Check for at least one lowercase letter
        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = "Password must contain at least one lowercase letter";
        }
        
        // Check for at least one number
        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = "Password must contain at least one number";
        }
        
        // Check for at least one special character
        if (!preg_match('/[!@#$%^&*()\-_=+{};:,<.>]/', $password)) {
            $errors[] = "Password must contain at least one special character";
        }
        
        if (empty($errors)) {
            return [
                'success' => true,
                'message' => 'Password strength is good'
            ];
        } else {
            return [
                'success' => false,
                'message' => implode('. ', $errors)
            ];
        }
    }
    
    /**
     * Generate a secure random token for various purposes
     * 
     * @param int $length Length of token in bytes (will be doubled for hex)
     * @return string Random token
     */
    public static function generateRandomToken($length = 32) {
        return bin2hex(random_bytes($length));
    }
    
    /**
     * Base64Url encode
     * 
     * @param string $data Data to encode
     * @return string Base64Url encoded string
     */
    private static function base64UrlEncode($data) {
        $base64 = base64_encode($data);
        $base64Url = strtr($base64, '+/', '-_');
        return rtrim($base64Url, '=');
    }
    
    /**
     * Base64Url decode
     * 
     * @param string $base64Url Base64Url encoded string
     * @return string Decoded data
     */
    private static function base64UrlDecode($base64Url) {
        $base64 = strtr($base64Url, '-_', '+/');
        $base64 = str_pad($base64, strlen($base64) + (4 - strlen($base64) % 4) % 4, '=', STR_PAD_RIGHT);
        return base64_decode($base64);
    }
    
    /**
     * Get user ID from token (convenience method)
     * 
     * @param string $token JWT token
     * @return string|null User ID if valid token, null otherwise
     */
    public static function getUserIdFromToken($token = null) {
        if ($token === null) {
            $token = self::getBearerToken();
        }
        
        $payload = self::validateToken($token);
        
        if ($payload && isset($payload['user_id'])) {
            return $payload['user_id'];
        }
        
        return null;
    }
    
    /**
     * Check if token is about to expire (for proactive refresh)
     * 
     * @param string $token JWT token
     * @param int $threshold Seconds before expiry to consider "about to expire"
     * @return bool True if token is about to expire
     */
    public static function isTokenAboutToExpire($token, $threshold = 300) {
        $payload = self::validateToken($token);
        
        if (!$payload || !isset($payload['exp'])) {
            return true; // Invalid token, treat as expired
        }
        
        $time_until_expiry = $payload['exp'] - time();
        return $time_until_expiry < $threshold;
    }
    
    /**
     * Refresh an expired or about-to-expire token
     * 
     * @param string $old_token Old JWT token
     * @param array $user_data Current user data
     * @return array|false New token data or false if refresh failed
     */
    public static function refreshToken($old_token, $user_data) {
        // Even if token is expired, we can still decode it to get user info
        $token_parts = explode('.', $old_token);
        
        if (count($token_parts) != 3) {
            return false;
        }
        
        $base64UrlPayload = $token_parts[1];
        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        
        // Check if we have the necessary user data
        if (!isset($payload['user_id']) || !isset($payload['email'])) {
            return false;
        }
        
        // Verify user data matches
        if ($user_data['id'] !== $payload['user_id'] || $user_data['email'] !== $payload['email']) {
            return false;
        }
        
        // Generate new token
        $new_token = self::generateToken(
            $user_data['id'],
            $user_data['email'],
            ['full_name' => $user_data['full_name']]
        );
        
        $new_refresh_token = self::generateRefreshToken($user_data['id']);
        
        return [
            'token' => $new_token,
            'refresh_token' => $new_refresh_token,
            'expires_in' => self::$token_expiry
        ];
    }
    
    /**
     * Set custom secret key (for testing or environment-specific config)
     * 
     * @param string $secret_key New secret key
     */
    public static function setSecretKey($secret_key) {
        self::$secret_key = $secret_key;
    }
    
    /**
     * Set token expiry time
     * 
     * @param int $seconds Expiry time in seconds
     */
    public static function setTokenExpiry($seconds) {
        self::$token_expiry = $seconds;
    }
    
    /**
     * Get current configuration (for debugging)
     * 
     * @return array Current configuration
     */
    public static function getConfig() {
        return [
            'algorithm' => self::$algorithm,
            'token_expiry' => self::$token_expiry,
            'refresh_token_expiry' => self::$refresh_token_expiry
        ];
    }
}

// Optional: Create a helper function for easier access
if (!function_exists('validate_jwt_token')) {
    function validate_jwt_token($token) {
        return AuthHelper::validateToken($token);
    }
}

if (!function_exists('get_bearer_token')) {
    function get_bearer_token() {
        return AuthHelper::getBearerToken();
    }
}

if (!function_exists('hash_password')) {
    function hash_password($password) {
        return AuthHelper::hashPassword($password);
    }
}

if (!function_exists('verify_password')) {
    function verify_password($password, $hash) {
        return AuthHelper::verifyPassword($password, $hash);
    }
}