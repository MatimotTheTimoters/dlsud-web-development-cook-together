<?php
// backend/utils/fileUpload.php

function validateImage(array $file): bool
{
    // Check if file exists
    if (!isset($file['tmp_name']) || !file_exists($file['tmp_name'])) {
        return false;
    }

    // Check file size (max 5MB)
    $maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if ($file['size'] > $maxSize) {
        return false;
    }

    // Check MIME type
    $allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedMimeTypes)) {
        return false;
    }

    // Check if it's actually an image
    $imageInfo = getimagesize($file['tmp_name']);
    if (!$imageInfo) {
        return false;
    }

    return true;
}

function uploadImage(array $file, string $type, ?string $user_id = null, ?string $recipe_id = null, ?int $max_width = null, ?int $max_height = null): array|false
{
    // Create upload directory if it doesn't exist
    $uploadDir = getUploadDirectory($type, $user_id);
    if (!file_exists($uploadDir) && !mkdir($uploadDir, 0755, true)) {
        error_log("Failed to create directory: $uploadDir");
        return false;
    }

    // Generate unique filename
    $timestamp = time();
    $originalName = pathinfo($file['name'], PATHINFO_FILENAME);
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);

    // Sanitize filename
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $originalName);
    $safeName = substr($safeName, 0, 50); // Limit length

    $fileName = '';
    if ($user_id) {
        $fileName = $user_id . '_' . $timestamp;
    } elseif ($recipe_id) {
        $fileName = $recipe_id . '_' . $timestamp;
    } else {
        $fileName = 'upload_' . $timestamp;
    }

    if (!empty($safeName)) {
        $fileName .= '_' . $safeName;
    }

    $fileName .= '.' . $extension;

    $filePath = $uploadDir . '/' . $fileName;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        return false;
    }

    // Get image dimensions
    $imageInfo = getimagesize($filePath);
    $dimensions = [
        'width' => $imageInfo[0],
        'height' => $imageInfo[1]
    ];

    // Create optimized versions if needed
    $optimizedPath = null;
    $thumbnailPath = null;

    if (in_array($type, ['profile_picture', 'recipe_cover', 'cookbook_cover'])) {
        // Create optimized version (resized)
        $optimizedPath = createOptimizedImage($filePath, $uploadDir, $fileName, 800, 600);

        // Create thumbnail version
        $thumbnailPath = createThumbnail($filePath, $uploadDir, $fileName, 200, 200);
    }

    // Return upload result
    return [
        'url' => str_replace($_SERVER['DOCUMENT_ROOT'], '', $filePath),
        'file_name' => $fileName,
        'file_size' => filesize($filePath),
        'mime_type' => $file['type'],
        'dimensions' => $dimensions,
        'optimized_url' => $optimizedPath ? str_replace($_SERVER['DOCUMENT_ROOT'], '', $optimizedPath) : null,
        'thumbnail_url' => $thumbnailPath ? str_replace($_SERVER['DOCUMENT_ROOT'], '', $thumbnailPath) : null
    ];
}

function getUploadDirectory(string $type, ?string $user_id = null): string
{
    $baseDir = $_SERVER['DOCUMENT_ROOT'] . '/backend/uploads/';

    switch ($type) {
        case 'profile_picture':
            return $baseDir . 'profile-pictures' . ($user_id ? '/' . substr($user_id, 0, 2) : '');
        case 'recipe_cover':
            return $baseDir . 'recipe-images' . ($user_id ? '/' . substr($user_id, 0, 2) : '');
        case 'step_image':
            return $baseDir . 'step-images' . ($user_id ? '/' . substr($user_id, 0, 2) : '');
        case 'cookbook_cover':
            return $baseDir . 'cookbook-covers' . ($user_id ? '/' . substr($user_id, 0, 2) : '');
        default:
            return $baseDir . 'misc';
    }
}

function createOptimizedImage(string $sourcePath, string $uploadDir, string $fileName, int $maxWidth, int $maxHeight): ?string
{
    try {
        $image = imagecreatefromstring(file_get_contents($sourcePath));
        if (!$image) {
            return null;
        }

        $originalWidth = imagesx($image);
        $originalHeight = imagesy($image);

        // Calculate new dimensions while maintaining aspect ratio
        $ratio = min($maxWidth / $originalWidth, $maxHeight / $originalHeight);
        $newWidth = (int)($originalWidth * $ratio);
        $newHeight = (int)($originalHeight * $ratio);

        // Create new image
        $optimizedImage = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency for PNG and GIF
        if (pathinfo($sourcePath, PATHINFO_EXTENSION) === 'png' || pathinfo($sourcePath, PATHINFO_EXTENSION) === 'gif') {
            imagealphablending($optimizedImage, false);
            imagesavealpha($optimizedImage, true);
            $transparent = imagecolorallocatealpha($optimizedImage, 255, 255, 255, 127);
            imagefilledrectangle($optimizedImage, 0, 0, $newWidth, $newHeight, $transparent);
        }

        // Resize image
        imagecopyresampled($optimizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);

        // Save optimized image
        $optimizedFileName = pathinfo($fileName, PATHINFO_FILENAME) . '_optimized.' . pathinfo($fileName, PATHINFO_EXTENSION);
        $optimizedPath = $uploadDir . '/' . $optimizedFileName;

        switch (strtolower(pathinfo($fileName, PATHINFO_EXTENSION))) {
            case 'jpg':
            case 'jpeg':
                imagejpeg($optimizedImage, $optimizedPath, 85);
                break;
            case 'png':
                imagepng($optimizedImage, $optimizedPath, 8);
                break;
            case 'gif':
                imagegif($optimizedImage, $optimizedPath);
                break;
            case 'webp':
                imagewebp($optimizedImage, $optimizedPath, 85);
                break;
        }

        imagedestroy($image);
        imagedestroy($optimizedImage);

        return $optimizedPath;
    } catch (Exception $e) {
        error_log("Optimized image creation failed: " . $e->getMessage());
        return null;
    }
}

function createThumbnail(string $sourcePath, string $uploadDir, string $fileName, int $thumbWidth, int $thumbHeight): ?string
{
    try {
        $image = imagecreatefromstring(file_get_contents($sourcePath));
        if (!$image) {
            return null;
        }

        $originalWidth = imagesx($image);
        $originalHeight = imagesy($image);

        // Create thumbnail (cropped square)
        $thumbImage = imagecreatetruecolor($thumbWidth, $thumbHeight);

        // Preserve transparency for PNG and GIF
        if (pathinfo($sourcePath, PATHINFO_EXTENSION) === 'png' || pathinfo($sourcePath, PATHINFO_EXTENSION) === 'gif') {
            imagealphablending($thumbImage, false);
            imagesavealpha($thumbImage, true);
            $transparent = imagecolorallocatealpha($thumbImage, 255, 255, 255, 127);
            imagefilledrectangle($thumbImage, 0, 0, $thumbWidth, $thumbHeight, $transparent);
        }

        // Calculate cropping
        $srcX = $srcY = 0;
        $srcW = $originalWidth;
        $srcH = $originalHeight;

        if ($originalWidth > $originalHeight) {
            $srcX = (int)(($originalWidth - $originalHeight) / 2);
            $srcW = $originalHeight;
        } else {
            $srcY = (int)(($originalHeight - $originalWidth) / 2);
            $srcH = $originalWidth;
        }

        // Create cropped thumbnail
        imagecopyresampled($thumbImage, $image, 0, 0, $srcX, $srcY, $thumbWidth, $thumbHeight, $srcW, $srcH);

        // Save thumbnail
        $thumbFileName = pathinfo($fileName, PATHINFO_FILENAME) . '_thumb.' . pathinfo($fileName, PATHINFO_EXTENSION);
        $thumbPath = $uploadDir . '/' . $thumbFileName;

        switch (strtolower(pathinfo($fileName, PATHINFO_EXTENSION))) {
            case 'jpg':
            case 'jpeg':
                imagejpeg($thumbImage, $thumbPath, 85);
                break;
            case 'png':
                imagepng($thumbImage, $thumbPath, 8);
                break;
            case 'gif':
                imagegif($thumbImage, $thumbPath);
                break;
            case 'webp':
                imagewebp($thumbImage, $thumbPath, 85);
                break;
        }

        imagedestroy($image);
        imagedestroy($thumbImage);

        return $thumbPath;
    } catch (Exception $e) {
        error_log("Thumbnail creation failed: " . $e->getMessage());
        return null;
    }
}

function deleteFile(string $path): bool
{
    if (file_exists($path)) {
        return unlink($path);
    }
    return false;
}