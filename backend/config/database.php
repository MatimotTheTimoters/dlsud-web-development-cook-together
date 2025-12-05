<?php
/**
 * Database Connection Helper
 * Handles PDO connection and basic database operations
 */

require_once __DIR__ . '/environment.php';

class Database {
    private static $connection = null;
    
    /**
     * Establishes database connection
     * @return PDO
     * @throws PDOException
     */
    public static function connect() {
        if (self::$connection === null) {
            $config = EnvironmentConfig::getDatabaseConfig();
            
            try {
                $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
                self::$connection = new PDO($dsn, $config['username'], $config['password'], [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                throw new PDOException("Connection failed: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
    
    /**
     * Executes prepared statement
     * @param string $sql
     * @param array $params
     * @return PDOStatement
     */
    public static function query($sql, $params = []) {
        $stmt = self::connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
    
    /**
     * Fetches all results
     * @param string $sql
     * @param array $params
     * @return array
     */
    public static function fetchAll($sql, $params = []) {
        $stmt = self::query($sql, $params);
        return $stmt->fetchAll();
    }
    
    /**
     * Fetches single row
     * @param string $sql
     * @param array $params
     * @return array|false
     */
    public static function fetchOne($sql, $params = []) {
        $stmt = self::query($sql, $params);
        return $stmt->fetch();
    }
    
    /**
     * Inserts record and returns last insert ID
     * @param string $table
     * @param array $data
     * @return string|false
     */
    public static function insert($table, $data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        
        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
        $stmt = self::connect()->prepare($sql);
        
        if ($stmt->execute($data)) {
            return self::connect()->lastInsertId();
        }
        return false;
    }
    
    /**
     * Updates record
     * @param string $table
     * @param array $data
     * @param string $where
     * @param array $whereParams
     * @return int Number of affected rows
     */
    public static function update($table, $data, $where, $whereParams = []) {
        $setParts = [];
        foreach (array_keys($data) as $key) {
            $setParts[] = "$key = :$key";
        }
        $setClause = implode(', ', $setParts);
        
        $sql = "UPDATE $table SET $setClause WHERE $where";
        $params = array_merge($data, $whereParams);
        
        $stmt = self::connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }
    
    /**
     * Deletes record
     * @param string $table
     * @param string $where
     * @param array $params
     * @return int Number of affected rows
     */
    public static function delete($table, $where, $params = []) {
        $sql = "DELETE FROM $table WHERE $where";
        $stmt = self::connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    }
    
    /**
     * Get connection for direct PDO operations
     * @return PDO
     */
    public static function getConnection() {
        return self::connect();
    }
}
?>