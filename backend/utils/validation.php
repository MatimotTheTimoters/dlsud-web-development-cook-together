<?php
class Validation
{
    public static function validateEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    public static function validatePassword($password)
    {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return strlen($password) >= 8 &&
            preg_match('/[A-Z]/', $password) &&
            preg_match('/[a-z]/', $password) &&
            preg_match('/[0-9]/', $password);
    }

    public static function validateUsername($username)
    {
        // 3-20 characters, letters, numbers, underscores only
        return preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username);
    }

    public static function sanitizeInput($input)
    {
        if (is_array($input)) {
            return array_map([self::class, 'sanitizeInput'], $input);
        }
        return htmlspecialchars(stripslashes(trim($input)));
    }
}
