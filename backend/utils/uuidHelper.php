<?php

/**
 * uuidHelper.php - Generates unique identifiers for database records
 * @see index.md: Generates unique identifiers for database records
 */

// Functions documented in index.md
function makeId() {
    // Generate a v4 UUID (random)
    $data = random_bytes(16);
    
    // Set version to 0100
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    // Set bits 6-7 to 10
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    
    // Output the 36 character UUID
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function generateUniqueId($table, $field) {
    require_once __DIR__ . '/../config/database.php';
    
    $max_attempts = 10;
    $attempt = 0;
    
    while ($attempt < $max_attempts) {
        $id = makeId();
        
        // Check if ID already exists in the table
        $sql = "SELECT COUNT(*) as count FROM $table WHERE $field = :id";
        try {
            $result = Database::fetchOne($sql, ['id' => $id]);
            if ($result && $result['count'] == 0) {
                return $id;
            }
        } catch (Exception $e) {
            // If table doesn't exist yet, just return the ID
            return $id;
        }
        
        $attempt++;
    }
    
    // Fallback to timestamp-based ID if UUID generation fails
    return 'id_' . time() . '_' . rand(1000, 9999);
}