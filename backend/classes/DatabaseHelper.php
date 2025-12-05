<?php

/**
 * DatabaseHelper Class
 * Handles database operations for CookTogether application
 */

require_once __DIR__ . '/../config/database.php';

class DatabaseHelper {
    
    /**
     * Register a new user
     * 
     * @param array $user_data User data including: full_name, email, password_hash, age, gender
     * @return array|false User data if successful, false on failure
     */
    public static function registerUser($user_data) {
        try {
            $pdo = Database::getConnection();
            
            // Start transaction
            $pdo->beginTransaction();
            
            // Generate user ID
            require_once __DIR__ . '/../utils/uuidHelper.php';
            $user_id = UUIDHelper::generateUniqueId('users', 'id');
            
            // Prepare user data
            $user_record = [
                'id' => $user_id,
                'full_name' => $user_data['full_name'],
                'email' => $user_data['email'],
                'password_hash' => $user_data['password_hash'],
                'age' => $user_data['age'] ?? null,
                'gender' => $user_data['gender'] ?? null,
                'profile_picture' => $user_data['profile_picture'] ?? null,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            // Insert user
            $user_result = Database::insert('users', $user_record);
            
            if (!$user_result) {
                throw new Exception('Failed to insert user');
            }
            
            // Generate stats ID
            $stats_id = UUIDHelper::generateUniqueId('user_stats', 'id');
            
            // Prepare user stats data
            $stats_data = [
                'id' => $stats_id,
                'user_id' => $user_id,
                'login_streak' => 1,
                'level' => 1,
                'current_exp' => 0,
                'current_level_ceiling' => 100,
                'gold_count' => 0,
                'gem_count' => 0,
                'recipes_created' => 0,
                'recipes_cooked' => 0,
                'challenges_completed' => 0,
                'recipes_sold' => 0,
                'max_exp_reward' => 100,
                'max_gold_reward' => 50,
                'max_gem_reward' => 5,
                'max_gold_price' => 100,
                'max_gem_price' => 10,
                'last_limit_update' => date('Y-m-d H:i:s'),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            // Insert user stats
            $stats_result = Database::insert('user_stats', $stats_data);
            
            if (!$stats_result) {
                throw new Exception('Failed to insert user stats');
            }
            
            // Commit transaction
            $pdo->commit();
            
            // Return complete user data (excluding password)
            return [
                'id' => $user_id,
                'full_name' => $user_record['full_name'],
                'email' => $user_record['email'],
                'age' => $user_record['age'],
                'gender' => $user_record['gender'],
                'profile_picture' => $user_record['profile_picture'],
                'created_at' => $user_record['created_at']
            ];
            
        } catch (Exception $e) {
            // Rollback transaction on error
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('User registration failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Validate user login credentials
     * 
     * @param string $email User email
     * @param string $password Plain text password
     * @return array|false User data if valid, false otherwise
     */
    public static function validateUserLogin($email, $password) {
        try {
            // Get user by email
            $sql = "SELECT u.*, us.level, us.gold_count, us.gem_count, us.login_streak 
                    FROM users u 
                    LEFT JOIN user_stats us ON u.id = us.user_id 
                    WHERE u.email = :email";
            
            $user = Database::fetchOne($sql, ['email' => $email]);
            
            if (!$user) {
                return false;
            }
            
            // Verify password
            require_once __DIR__ . '/AuthHelper.php';
            if (!AuthHelper::verifyPassword($password, $user['password_hash'])) {
                return false;
            }
            
            // Update login streak
            self::updateLoginStreak($user['id']);
            
            // Remove sensitive data from response
            unset($user['password_hash']);
            
            return $user;
            
        } catch (Exception $e) {
            error_log('Login validation failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get user by ID
     * 
     * @param string $user_id User ID
     * @return array|false User data if found, false otherwise
     */
    public static function getUserById($user_id) {
        try {
            $sql = "SELECT u.*, us.level, us.current_exp, us.current_level_ceiling, 
                           us.gold_count, us.gem_count, us.login_streak,
                           us.recipes_created, us.recipes_cooked, us.challenges_completed
                    FROM users u 
                    LEFT JOIN user_stats us ON u.id = us.user_id 
                    WHERE u.id = :user_id";
            
            $user = Database::fetchOne($sql, ['user_id' => $user_id]);
            
            if (!$user) {
                return false;
            }
            
            // Remove sensitive data
            unset($user['password_hash']);
            
            return $user;
            
        } catch (Exception $e) {
            error_log('Get user by ID failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get user by email
     * 
     * @param string $email User email
     * @return array|false User data if found, false otherwise
     */
    public static function getUserByEmail($email) {
        try {
            $sql = "SELECT * FROM users WHERE email = :email";
            $user = Database::fetchOne($sql, ['email' => $email]);
            
            if (!$user) {
                return false;
            }
            
            // Remove sensitive data
            unset($user['password_hash']);
            
            return $user;
            
        } catch (Exception $e) {
            error_log('Get user by email failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Update user profile
     * 
     * @param string $user_id User ID
     * @param array $data Updated profile data
     * @return bool True if successful, false otherwise
     */
    public static function updateUserProfile($user_id, $data) {
        try {
            // Remove any fields that shouldn't be updated directly
            $disallowed_fields = ['id', 'email', 'password_hash', 'created_at'];
            foreach ($disallowed_fields as $field) {
                if (isset($data[$field])) {
                    unset($data[$field]);
                }
            }
            
            // Add updated_at timestamp
            $data['updated_at'] = date('Y-m-d H:i:s');
            
            // Update user
            $result = Database::update('users', $data, 'id = :user_id', ['user_id' => $user_id]);
            
            return $result > 0;
            
        } catch (Exception $e) {
            error_log('Update user profile failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Update user password
     * 
     * @param string $user_id User ID
     * @param string $new_password_hash New hashed password
     * @return bool True if successful, false otherwise
     */
    public static function updateUserPassword($user_id, $new_password_hash) {
        try {
            $data = [
                'password_hash' => $new_password_hash,
                'updated_at' => date('Y-m-d H:i:s')
            ];
            
            $result = Database::update('users', $data, 'id = :user_id', ['user_id' => $user_id]);
            
            return $result > 0;
            
        } catch (Exception $e) {
            error_log('Update user password failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if email already exists
     * 
     * @param string $email Email to check
     * @param string $exclude_user_id User ID to exclude from check (for updates)
     * @return bool True if email exists, false otherwise
     */
    public static function emailExists($email, $exclude_user_id = null) {
        try {
            $sql = "SELECT COUNT(*) as count FROM users WHERE email = :email";
            $params = ['email' => $email];
            
            if ($exclude_user_id) {
                $sql .= " AND id != :exclude_user_id";
                $params['exclude_user_id'] = $exclude_user_id;
            }
            
            $result = Database::fetchOne($sql, $params);
            
            return $result['count'] > 0;
            
        } catch (Exception $e) {
            error_log('Email check failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Update user login streak
     * 
     * @param string $user_id User ID
     * @return bool True if successful, false otherwise
     */
    private static function updateLoginStreak($user_id) {
        try {
            // Get current stats
            $sql = "SELECT * FROM user_stats WHERE user_id = :user_id";
            $stats = Database::fetchOne($sql, ['user_id' => $user_id]);
            
            if (!$stats) {
                return false;
            }
            
            $last_login_date = $stats['last_limit_update'] ?? null;
            $current_streak = $stats['login_streak'];
            $today = date('Y-m-d');
            
            // Check if last login was yesterday
            $increment_streak = false;
            if ($last_login_date) {
                $last_login = date('Y-m-d', strtotime($last_login_date));
                $yesterday = date('Y-m-d', strtotime('-1 day'));
                
                if ($last_login == $yesterday) {
                    // Consecutive login
                    $increment_streak = true;
                } elseif ($last_login != $today) {
                    // Broken streak
                    $current_streak = 1;
                    $increment_streak = true;
                }
            } else {
                // First login
                $increment_streak = true;
            }
            
            // Update streak if needed
            if ($increment_streak) {
                $update_data = [
                    'login_streak' => $current_streak + 1,
                    'last_limit_update' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                
                Database::update('user_stats', $update_data, 'user_id = :user_id', ['user_id' => $user_id]);
            }
            
            return true;
            
        } catch (Exception $e) {
            error_log('Update login streak failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get user statistics
     * 
     * @param string $user_id User ID
     * @return array|false User stats if found, false otherwise
     */
    public static function getUserStats($user_id) {
        try {
            $sql = "SELECT * FROM user_stats WHERE user_id = :user_id";
            $stats = Database::fetchOne($sql, ['user_id' => $user_id]);
            
            return $stats ?: false;
            
        } catch (Exception $e) {
            error_log('Get user stats failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Update user statistics
     * 
     * @param string $user_id User ID
     * @param array $updates Stats fields to update
     * @return bool True if successful, false otherwise
     */
    public static function updateUserStats($user_id, $updates) {
        try {
            // Add updated_at timestamp
            $updates['updated_at'] = date('Y-m-d H:i:s');
            
            $result = Database::update('user_stats', $updates, 'user_id = :user_id', ['user_id' => $user_id]);
            
            return $result > 0;
            
        } catch (Exception $e) {
            error_log('Update user stats failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Increment user stat by amount
     * 
     * @param string $user_id User ID
     * @param string $field Stat field to increment
     * @param int $amount Amount to increment (default: 1)
     * @return bool True if successful, false otherwise
     */
    public static function incrementUserStat($user_id, $field, $amount = 1) {
        try {
            // Validate that field exists and is numeric
            $allowed_fields = [
                'login_streak', 'level', 'current_exp', 'gold_count', 'gem_count',
                'recipes_created', 'recipes_cooked', 'challenges_completed', 'recipes_sold'
            ];
            
            if (!in_array($field, $allowed_fields)) {
                throw new Exception("Invalid field for increment: $field");
            }
            
            $sql = "UPDATE user_stats 
                    SET $field = $field + :amount, 
                        updated_at = :updated_at 
                    WHERE user_id = :user_id";
            
            $params = [
                'amount' => $amount,
                'updated_at' => date('Y-m-d H:i:s'),
                'user_id' => $user_id
            ];
            
            $stmt = Database::getConnection()->prepare($sql);
            $result = $stmt->execute($params);
            
            return $result && $stmt->rowCount() > 0;
            
        } catch (Exception $e) {
            error_log('Increment user stat failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Search for users
     * 
     * @param string $query Search query
     * @param int $limit Maximum results
     * @param int $offset Results offset for pagination
     * @return array List of matching users
     */
    public static function searchUsers($query, $limit = 20, $offset = 0) {
        try {
            $sql = "SELECT u.id, u.full_name, u.profile_picture, u.email, 
                           us.level, us.recipes_created, us.recipes_cooked
                    FROM users u 
                    LEFT JOIN user_stats us ON u.id = us.user_id 
                    WHERE u.full_name LIKE :query OR u.email LIKE :query
                    ORDER BY u.full_name
                    LIMIT :limit OFFSET :offset";
            
            $params = [
                'query' => "%$query%",
                'limit' => $limit,
                'offset' => $offset
            ];
            
            $users = Database::fetchAll($sql, $params);
            
            // Count total matches for pagination
            $count_sql = "SELECT COUNT(*) as total 
                         FROM users u 
                         WHERE u.full_name LIKE :query OR u.email LIKE :query";
            
            $count_result = Database::fetchOne($count_sql, ['query' => "%$query%"]);
            $total = $count_result['total'] ?? 0;
            
            return [
                'users' => $users,
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset
            ];
            
        } catch (Exception $e) {
            error_log('User search failed: ' . $e->getMessage());
            return ['users' => [], 'total' => 0, 'limit' => $limit, 'offset' => $offset];
        }
    }
    
    /**
     * Delete user account
     * 
     * @param string $user_id User ID
     * @return bool True if successful, false otherwise
     */
    public static function deleteUser($user_id) {
        try {
            $pdo = Database::getConnection();
            
            // Start transaction (user deletion cascades to stats)
            $pdo->beginTransaction();
            
            $result = Database::delete('users', 'id = :user_id', ['user_id' => $user_id]);
            
            $pdo->commit();
            
            return $result > 0;
            
        } catch (Exception $e) {
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Delete user failed: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get user's followers
     * 
     * @param string $user_id User ID
     * @return array List of followers
     */
    public static function getFollowers($user_id) {
        try {
            $sql = "SELECT u.id, u.full_name, u.profile_picture, u.email, 
                           us.level, ur.created_at as followed_at
                    FROM user_relationships ur
                    JOIN users u ON ur.source_user_id = u.id
                    LEFT JOIN user_stats us ON u.id = us.user_id
                    WHERE ur.target_user_id = :user_id 
                      AND ur.relationship_type = 'following' 
                      AND ur.status = 'accepted'
                    ORDER BY ur.created_at DESC";
            
            return Database::fetchAll($sql, ['user_id' => $user_id]);
            
        } catch (Exception $e) {
            error_log('Get followers failed: ' . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Get users followed by a user
     * 
     * @param string $user_id User ID
     * @return array List of followed users
     */
    public static function getFollowing($user_id) {
        try {
            $sql = "SELECT u.id, u.full_name, u.profile_picture, u.email, 
                           us.level, ur.created_at as followed_at
                    FROM user_relationships ur
                    JOIN users u ON ur.target_user_id = u.id
                    LEFT JOIN user_stats us ON u.id = us.user_id
                    WHERE ur.source_user_id = :user_id 
                      AND ur.relationship_type = 'following' 
                      AND ur.status = 'accepted'
                    ORDER BY ur.created_at DESC";
            
            return Database::fetchAll($sql, ['user_id' => $user_id]);
            
        } catch (Exception $e) {
            error_log('Get following failed: ' . $e->getMessage());
            return [];
        }
    }
}