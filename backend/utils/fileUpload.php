<?php
/**
 * File upload utility for handling image uploads
 */

class FileUpload
{

    // Allowed image types
    private static $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    // Maximum file size in bytes (5MB)
    private static $maxFileSize = 5 * 1024 * 1024;

    // Upload directories
    private static $uploadDirs = [
        'profile' => 'profile-pictures/',
        'recipe' => 'recipe-images/',
        'step' => 'step-images/'
    ];

    /**
     * Upload an image file
     * 
     * @param array $file The $_FILES array element
     * @param string $type Type of upload: 'profile', 'recipe', or 'step'
     * @param string $userId User ID for organization
     * @return array|false Returns array with path and URL on success, false on failure
     */
    public static function uploadImage($file, $type, $userId)
    {
        try {
            // Validate input
            if (!isset(self::$uploadDirs[$type])) {
                throw new Exception("Invalid upload type: $type");
            }

            if (!self::validateImage($file)) {
                throw new Exception("Image validation failed");
            }

            // Create user-specific directory
            $uploadDir = __DIR__ . '/../uploads/' . self::$uploadDirs[$type] . $userId . '/';

            // Ensure directory exists
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            // Generate unique filename
            $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = uniqid('img_', true) . '_' . time() . '.' . $fileExtension;
            $filePath = $uploadDir . $filename;

            // Move uploaded file
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                // Generate relative path for database storage
                $relativePath = 'uploads/' . self::$uploadDirs[$type] . $userId . '/' . $filename;

                return [
                    'success' => true,
                    'file_path' => $filePath,
                    'relative_path' => $relativePath,
                    'file_name' => $filename,
                    'file_size' => $file['size'],
                    'mime_type' => $file['type']
                ];
            } else {
                throw new Exception("Failed to move uploaded file");
            }
        } catch (Exception $e) {
            error_log("File upload error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Validate image file
     * 
     * @param array $file The $_FILES array element
     * @return bool True if valid, false otherwise
     */
    public static function validateImage($file)
    {
        // Check if file was uploaded
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return false;
        }

        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            error_log("Upload error code: " . $file['error']);
            return false;
        }

        // Check file size
        if ($file['size'] > self::$maxFileSize) {
            error_log("File too large: " . $file['size'] . " bytes");
            return false;
        }

        // Check file type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, self::$allowedTypes)) {
            error_log("Invalid file type: " . $mimeType);
            return false;
        }

        // Additional image validation
        $imageInfo = getimagesize($file['tmp_name']);
        if (!$imageInfo) {
            error_log("Not a valid image file");
            return false;
        }

        return true;
    }

    /**
     * Delete a file
     * 
     * @param string $path Path to the file
     * @return bool True if deleted, false otherwise
     */
    public static function deleteFile($path)
    {
        try {
            // Ensure path is within uploads directory for security
            $uploadsPath = realpath(__DIR__ . '/../uploads/');
            $filePath = realpath(__DIR__ . '/../' . $path);

            if (!$filePath || strpos($filePath, $uploadsPath) !== 0) {
                throw new Exception("Invalid file path or outside uploads directory");
            }

            if (file_exists($filePath)) {
                return unlink($filePath);
            }

            return false;
        } catch (Exception $e) {
            error_log("File delete error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get upload directory for a specific type
     * 
     * @param string $type Type of upload
     * @return string Relative directory path
     */
    public static function getUploadDir($type)
    {
        return self::$uploadDirs[$type] ?? '';
    }

    /**
     * Get full URL for an uploaded file
     * 
     * @param string $relativePath Relative path from uploads directory
     * @return string Full URL
     */
    public static function getFileUrl($relativePath)
    {
        $baseUrl = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
        $baseUrl .= $_SERVER['HTTP_HOST'] . '/backend/';

        return $baseUrl . $relativePath;
    }
}