<?php
// backend/utils/code-generator.php

/**
 * Generate a unique 6-character session code
 * @param mysqli $conn Database connection
 * @return string Unique 6-character code
 * @throws Exception If unable to generate unique code after max attempts
 */
function generateUniqueSessionCode($conn) {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $maxAttempts = 50;
    
    for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
        // Generate 6-character code
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        // Check if code already exists in database
        $checkStmt = $conn->prepare("SELECT COUNT(*) FROM cooking_sessions WHERE join_code = ?");
        $checkStmt->bind_param("s", $code);
        $checkStmt->execute();
        $checkStmt->bind_result($count);
        $checkStmt->fetch();
        $checkStmt->close();
        
        if ($count == 0) {
            // Log successful generation
            error_log("Generated unique session code: $code (attempt $attempt)");
            return $code;
        }
        
        // Wait a bit before next attempt if we're having many collisions
        if ($attempt % 10 == 0) {
            usleep(10000); // 10ms delay
        }
    }
    
    throw new Exception("Failed to generate unique session code after $maxAttempts attempts");
}

/**
 * Validate if a session code is valid format (6 alphanumeric characters)
 * @param string $code The code to validate
 * @return bool True if valid, false otherwise
 */
function isValidSessionCode($code) {
    return preg_match('/^[A-Z0-9]{6}$/', $code) === 1;
}
?>