<?php

/**
 * fileUpload.php - Handles image uploads for profile pictures, recipe images, and step images
 * @see index.md: Handles image uploads for profile pictures, recipe images, and step images
 */

function uploadImage($file, $type, $user_id) {
    // Define allowed image types
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $maxFileSize = 5 * 1024 * 1024; // 5MB
    
    // Define upload directories based on type
    $uploadDirs = [
        'profile' => 'uploads/profile-pictures/',
        'recipe' => 'uploads/recipe-images/',
        'step' => 'uploads/step-images/'
    ];
    
    // Validate type
    if (!isset($uploadDirs[$type])) {
        return false;
    }
    
    // Validate image using validateImage function
    if (!validateImage($file)) {
        return false;
    }
    
    // Create user-specific directory if it doesn't exist
    $uploadDir = $uploadDirs[$type] . $user_id . '/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = uniqid('img_', true) . '_' . time() . '.' . $fileExtension;
    $destination = $uploadDir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        return [
            'success' => true,
            'file_path' => $destination,
            'file_name' => $filename,
            'file_size' => $file['size'],
            'mime_type' => $file['type']
        ];
    }
    
    return false;
}

function validateImage($file) {
    // Check if file was uploaded
    if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
        return false;
    }
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    
    // Check file size (5MB max)
    if ($file['size'] > (5 * 1024 * 1024)) {
        return false;
    }
    
    // Check MIME type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        return false;
    }
    
    // Additional image validation
    $imageInfo = getimagesize($file['tmp_name']);
    if (!$imageInfo) {
        return false;
    }
    
    return true;
}

function deleteFile($path) {
    if (file_exists($path)) {
        return unlink($path);
    }
    return false;
}