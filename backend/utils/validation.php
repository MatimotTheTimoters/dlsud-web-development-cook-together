<?php

/**
 * Validation Helper Class
 */
class Validation {
    
    /**
     * Validate email format
     */
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Validate password strength
     */
    public static function validatePassword($password) {
        return strlen($password) >= 8;
    }
    
    /**
     * Sanitize input data
     */
    public static function sanitizeInput($input) {
        if (is_array($input)) {
            foreach ($input as $key => $value) {
                $input[$key] = self::sanitizeInput($value);
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
    
    /**
     * Validate required fields
     */
    public static function validateRequired($data, $fields) {
        $errors = [];
        
        foreach ($fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $errors[$field] = 'This field is required';
            }
        }
        
        return $errors;
    }
    
    /**
     * Validate number range
     */
    public static function validateNumber($value, $min = null, $max = null) {
        if (!is_numeric($value)) {
            return false;
        }
        
        $value = (float)$value;
        
        if ($min !== null && $value < $min) {
            return false;
        }
        
        if ($max !== null && $value > $max) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate URL format
     */
    public static function validateUrl($url) {
        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
}