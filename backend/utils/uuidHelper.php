<?php

/**
 * UUID Helper Class
 * Generates unique IDs for database records
 */
class UUIDHelper {
    
    /**
     * Generate a unique ID
     * 
     * @return string Unique ID
     */
    public static function makeId() {
        // Generate a v4 UUID (random)
        $data = random_bytes(16);
        
        // Set version to 0100
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        // Set bits 6-7 to 10
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        
        // Output the 36 character UUID
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
    
    /**
     * Generate a unique ID for a specific table and field
     * 
     * @param string $table Table name
     * @param string $field Field name to check for uniqueness
     * @return string Unique ID
     */
    public static function generateUniqueId($table, $field) {
        require_once __DIR__ . '/../config/database.php';
        
        $max_attempts = 10;
        $attempt = 0;
        
        while ($attempt < $max_attempts) {
            $id = self::makeId();
            
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
    
    /**
     * Generate a simple ID with prefix
     * 
     * @param string $prefix ID prefix (e.g., 'usr', 'rec')
     * @return string Formatted ID
     */
    public static function generateSimpleId($prefix = 'id') {
        $timestamp = time();
        $random = rand(1000, 9999);
        $microtime = microtime(true);
        $hash = substr(md5($microtime), 0, 8);
        
        return $prefix . '_' . $timestamp . '_' . $random . '_' . $hash;
    }
    
    /**
     * Generate ID in the format used by seed data
     * 
     * @param string $type Type of ID (usr, rec, stat, etc.)
     * @param int $number Sequential number
     * @return string Formatted ID
     */
    public static function generateSeedId($type, $number) {
        $padded_number = str_pad($number, 3, '0', STR_PAD_LEFT);
        return $type . '_' . $padded_number;
    }
}