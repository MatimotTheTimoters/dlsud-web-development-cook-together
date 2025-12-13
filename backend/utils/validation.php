<?php

/**
 * validation.php - Input validation and sanitization functions
 * @see index.md: Input validation and sanitization functions
 */

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validatePassword($password) {
    // Password must be at least 8 characters with at least one letter and one number
    if (strlen($password) < 8) {
        return false;
    }
    
    // Check for at least one letter
    if (!preg_match('/[a-zA-Z]/', $password)) {
        return false;
    }
    
    // Check for at least one number
    if (!preg_match('/[0-9]/', $password)) {
        return false;
    }
    
    return true;
}

function sanitizeInput($input) {
    if (is_array($input)) {
        foreach ($input as $key => $value) {
            $input[$key] = sanitizeInput($value);
        }
        return $input;
    }
    
    if (is_string($input)) {
        $input = trim($input);
        $input = stripslashes($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
    
    return $input;
}