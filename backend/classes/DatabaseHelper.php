<?php

/**
 * DatabaseHelper Class
 * Handles database operations for CookTogether application
 */

require_once __DIR__ . '/../config/database.php';

class DatabaseHelper
{

    /**
     * Register a new user
     * 
     * @param array $user_data User data including: full_name, email, password_hash, age, gender
     * @return array|false User data if successful, false on failure
     */
    public static function registerUser($user_data)
    {
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
    public static function validateUserLogin($email, $password)
    {
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
    public static function getUserById($user_id)
    {
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
    public static function getUserByEmail($email)
    {
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
    public static function updateUserProfile($user_id, $data)
    {
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
    public static function updateUserPassword($user_id, $new_password_hash)
    {
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
    public static function emailExists($email, $exclude_user_id = null)
    {
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
    private static function updateLoginStreak($user_id)
    {
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
    public static function getUserStats($user_id)
    {
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
    public static function updateUserStats($user_id, $updates)
    {
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
    public static function incrementUserStat($user_id, $field, $amount = 1)
    {
        try {
            // Validate that field exists and is numeric
            $allowed_fields = [
                'login_streak',
                'level',
                'current_exp',
                'gold_count',
                'gem_count',
                'recipes_created',
                'recipes_cooked',
                'challenges_completed',
                'recipes_sold'
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
    public static function searchUsers($query, $limit = 20, $offset = 0)
    {
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
    public static function deleteUser($user_id)
    {
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
    public static function getFollowers($user_id)
    {
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
    public static function getFollowing($user_id)
    {
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

    public static function isFollowing($source_user_id, $target_user_id)
    {
        try {
            $sql = "SELECT COUNT(*) as count 
                FROM user_relationships 
                WHERE source_user_id = :source_user_id 
                  AND target_user_id = :target_user_id 
                  AND relationship_type = 'following' 
                  AND status = 'accepted'";

            $result = Database::fetchOne($sql, [
                'source_user_id' => $source_user_id,
                'target_user_id' => $target_user_id
            ]);

            return $result['count'] > 0;
        } catch (Exception $e) {
            error_log('Check following failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Create a new recipe with ingredients and steps
     * 
     * @param array $recipe_data Recipe data
     * @param array $ingredients List of ingredients
     * @param array $steps List of steps
     * @return string|false Recipe ID if successful, false otherwise
     */
    public static function createRecipe($recipe_data, $ingredients, $steps)
    {
        try {
            $pdo = Database::getConnection();

            // Start transaction
            $pdo->beginTransaction();

            // Generate recipe ID
            require_once __DIR__ . '/../utils/uuidHelper.php';
            $recipe_id = UUIDHelper::generateUniqueId('recipes', 'id');

            // Prepare recipe data
            $recipe_record = [
                'id' => $recipe_id,
                'title' => $recipe_data['title'],
                'description' => $recipe_data['description'] ?? null,
                'origin' => $recipe_data['origin'] ?? null,
                'preparation_time' => $recipe_data['preparation_time'] ?? null,
                'cooking_time' => $recipe_data['cooking_time'] ?? null,
                'serving_size' => $recipe_data['serving_size'] ?? null,
                'difficulty' => $recipe_data['difficulty'] ?? 'medium',
                'cover_image' => $recipe_data['cover_image'] ?? null,
                'is_paid' => $recipe_data['is_paid'] ?? false,
                'is_public' => $recipe_data['is_public'] ?? true,
                'user_id' => $recipe_data['user_id'],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];

            // Insert recipe
            $recipe_result = Database::insert('recipes', $recipe_record);

            if (!$recipe_result) {
                throw new Exception('Failed to insert recipe');
            }

            // Insert metadata
            $metadata_id = UUIDHelper::generateUniqueId('recipe_metadata', 'id');
            $metadata_data = [
                'id' => $metadata_id,
                'recipe_id' => $recipe_id,
                'tags' => $recipe_data['tags'] ?? null,
                'exp_reward' => $recipe_data['exp_reward'] ?? 0,
                'gold_reward' => $recipe_data['gold_reward'] ?? 0,
                'gem_reward' => $recipe_data['gem_reward'] ?? 0,
                'gold_price' => $recipe_data['gold_price'] ?? 0,
                'gem_price' => $recipe_data['gem_price'] ?? 0,
                'purchase_count' => 0,
                'like_count' => 0,
                'dislike_count' => 0,
                'cook_count' => 0,
                'total_calories' => $recipe_data['total_calories'] ?? 0,
                'total_protein' => $recipe_data['total_protein'] ?? 0,
                'total_carbs' => $recipe_data['total_carbs'] ?? 0,
                'total_fat' => $recipe_data['total_fat'] ?? 0,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $metadata_result = Database::insert('recipe_metadata', $metadata_data);

            if (!$metadata_result) {
                throw new Exception('Failed to insert recipe metadata');
            }

            // Insert ingredients
            if (!empty($ingredients)) {
                $ingredient_order = 0;
                foreach ($ingredients as $ingredient) {
                    $ingredient_id = UUIDHelper::generateUniqueId('recipe_ingredients', 'id');
                    $ingredient_record = [
                        'id' => $ingredient_id,
                        'recipe_id' => $recipe_id,
                        'name' => $ingredient['name'],
                        'amount' => $ingredient['amount'] ?? null,
                        'unit' => $ingredient['unit'] ?? null,
                        'notes' => $ingredient['notes'] ?? null,
                        'order_index' => $ingredient_order++,
                        'calories_per_unit' => $ingredient['calories_per_unit'] ?? 0,
                        'protein_per_unit' => $ingredient['protein_per_unit'] ?? 0,
                        'carbs_per_unit' => $ingredient['carbs_per_unit'] ?? 0,
                        'fat_per_unit' => $ingredient['fat_per_unit'] ?? 0,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ];

                    $ingredient_result = Database::insert('recipe_ingredients', $ingredient_record);

                    if (!$ingredient_result) {
                        throw new Exception('Failed to insert ingredient: ' . $ingredient['name']);
                    }
                }
            }

            // Insert steps
            if (!empty($steps)) {
                $step_order = 0;
                foreach ($steps as $step) {
                    $step_id = UUIDHelper::generateUniqueId('recipe_steps', 'id');
                    $step_record = [
                        'id' => $step_id,
                        'recipe_id' => $recipe_id,
                        'description' => $step['description'],
                        'image' => $step['image'] ?? null,
                        'read_timer_duration' => $step['read_timer_duration'] ?? 10,
                        'timer_duration' => $step['timer_duration'] ?? null,
                        'timer_unit' => $step['timer_unit'] ?? 'seconds',
                        'exp_reward' => $step['exp_reward'] ?? 0,
                        'gold_reward' => $step['gold_reward'] ?? 0,
                        'gem_reward' => $step['gem_reward'] ?? 0,
                        'order_index' => $step_order++,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ];

                    $step_result = Database::insert('recipe_steps', $step_record);

                    if (!$step_result) {
                        throw new Exception('Failed to insert step: ' . ($step_order - 1));
                    }
                }
            }

            // Increment user's recipes_created stat
            self::incrementUserStat($recipe_data['user_id'], 'recipes_created', 1);

            // Commit transaction
            $pdo->commit();

            return $recipe_id;
        } catch (Exception $e) {
            // Rollback transaction on error
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Create recipe failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get full recipe with details, ingredients, and steps
     * 
     * @param string $recipe_id Recipe ID
     * @return array|false Full recipe data if found, false otherwise
     */
    public static function getRecipe($recipe_id)
    {
        try {
            // Get recipe basic info
            $recipe_sql = "SELECT r.*, u.full_name as creator_name, u.profile_picture as creator_avatar,
                                  rm.tags, rm.exp_reward, rm.gold_reward, rm.gem_reward,
                                  rm.gold_price, rm.gem_price, rm.purchase_count,
                                  rm.like_count, rm.dislike_count, rm.cook_count,
                                  rm.total_calories, rm.total_protein, rm.total_carbs, rm.total_fat
                           FROM recipes r
                           LEFT JOIN users u ON r.user_id = u.id
                           LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id
                           WHERE r.id = :recipe_id";

            $recipe = Database::fetchOne($recipe_sql, ['recipe_id' => $recipe_id]);

            if (!$recipe) {
                return false;
            }

            // Get ingredients
            $ingredients_sql = "SELECT * FROM recipe_ingredients 
                                WHERE recipe_id = :recipe_id 
                                ORDER BY order_index ASC";
            $ingredients = Database::fetchAll($ingredients_sql, ['recipe_id' => $recipe_id]);

            // Get steps
            $steps_sql = "SELECT * FROM recipe_steps 
                          WHERE recipe_id = :recipe_id 
                          ORDER BY order_index ASC";
            $steps = Database::fetchAll($steps_sql, ['recipe_id' => $recipe_id]);

            // Calculate total cooking time
            $total_time = ($recipe['preparation_time'] ?? 0) + ($recipe['cooking_time'] ?? 0);

            // Get user interaction status (if user is logged in)
            $user_has_interacted = [];
            if (isset($_SESSION['user_id'])) {
                $interaction_sql = "SELECT interaction_type FROM recipe_interactions 
                                    WHERE user_id = :user_id AND recipe_id = :recipe_id";
                $user_interactions = Database::fetchAll($interaction_sql, [
                    'user_id' => $_SESSION['user_id'],
                    'recipe_id' => $recipe_id
                ]);

                foreach ($user_interactions as $interaction) {
                    $user_has_interacted[$interaction['interaction_type']] = true;
                }
            }

            // Build response
            return [
                'recipe' => $recipe,
                'ingredients' => $ingredients,
                'steps' => $steps,
                'total_time' => $total_time,
                'user_has_interacted' => $user_has_interacted,
                'stats' => [
                    'rating' => self::calculateRecipeRating($recipe_id),
                    'difficulty_label' => self::getDifficultyLabel($recipe['difficulty']),
                    'popularity_score' => self::calculatePopularityScore($recipe_id)
                ]
            ];
        } catch (Exception $e) {
            error_log('Get recipe failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update recipe with ingredients and steps
     * 
     * @param string $recipe_id Recipe ID
     * @param array $recipe_data Updated recipe data
     * @param array $ingredients Updated ingredients list
     * @param array $steps Updated steps list
     * @return bool True if successful, false otherwise
     */
    public static function updateRecipe($recipe_id, $recipe_data, $ingredients, $steps)
    {
        try {
            $pdo = Database::getConnection();

            // Start transaction
            $pdo->beginTransaction();

            // Update recipe basic info
            $recipe_data['updated_at'] = date('Y-m-d H:i:s');
            $recipe_result = Database::update('recipes', $recipe_data, 'id = :recipe_id', ['recipe_id' => $recipe_id]);

            if (!$recipe_result) {
                throw new Exception('Failed to update recipe');
            }

            // Update metadata if provided
            if (isset($recipe_data['metadata'])) {
                $recipe_data['metadata']['updated_at'] = date('Y-m-d H:i:s');
                $metadata_result = Database::update(
                    'recipe_metadata',
                    $recipe_data['metadata'],
                    'recipe_id = :recipe_id',
                    ['recipe_id' => $recipe_id]
                );

                if (!$metadata_result) {
                    throw new Exception('Failed to update recipe metadata');
                }
            }

            // Handle ingredients - delete existing and insert new
            if ($ingredients !== null) {
                // Delete existing ingredients
                $delete_ingredients = Database::delete('recipe_ingredients', 'recipe_id = :recipe_id', ['recipe_id' => $recipe_id]);

                // Insert new ingredients
                if (!empty($ingredients)) {
                    $ingredient_order = 0;
                    foreach ($ingredients as $ingredient) {
                        $ingredient_id = UUIDHelper::generateUniqueId('recipe_ingredients', 'id');
                        $ingredient_record = [
                            'id' => $ingredient_id,
                            'recipe_id' => $recipe_id,
                            'name' => $ingredient['name'],
                            'amount' => $ingredient['amount'] ?? null,
                            'unit' => $ingredient['unit'] ?? null,
                            'notes' => $ingredient['notes'] ?? null,
                            'order_index' => $ingredient_order++,
                            'calories_per_unit' => $ingredient['calories_per_unit'] ?? 0,
                            'protein_per_unit' => $ingredient['protein_per_unit'] ?? 0,
                            'carbs_per_unit' => $ingredient['carbs_per_unit'] ?? 0,
                            'fat_per_unit' => $ingredient['fat_per_unit'] ?? 0,
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ];

                        $ingredient_result = Database::insert('recipe_ingredients', $ingredient_record);

                        if (!$ingredient_result) {
                            throw new Exception('Failed to insert ingredient: ' . $ingredient['name']);
                        }
                    }
                }
            }

            // Handle steps - delete existing and insert new
            if ($steps !== null) {
                // Delete existing steps
                $delete_steps = Database::delete('recipe_steps', 'recipe_id = :recipe_id', ['recipe_id' => $recipe_id]);

                // Insert new steps
                if (!empty($steps)) {
                    $step_order = 0;
                    foreach ($steps as $step) {
                        $step_id = UUIDHelper::generateUniqueId('recipe_steps', 'id');
                        $step_record = [
                            'id' => $step_id,
                            'recipe_id' => $recipe_id,
                            'description' => $step['description'],
                            'image' => $step['image'] ?? null,
                            'read_timer_duration' => $step['read_timer_duration'] ?? 10,
                            'timer_duration' => $step['timer_duration'] ?? null,
                            'timer_unit' => $step['timer_unit'] ?? 'seconds',
                            'exp_reward' => $step['exp_reward'] ?? 0,
                            'gold_reward' => $step['gold_reward'] ?? 0,
                            'gem_reward' => $step['gem_reward'] ?? 0,
                            'order_index' => $step_order++,
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ];

                        $step_result = Database::insert('recipe_steps', $step_record);

                        if (!$step_result) {
                            throw new Exception('Failed to insert step: ' . ($step_order - 1));
                        }
                    }
                }
            }

            // Commit transaction
            $pdo->commit();

            return true;
        } catch (Exception $e) {
            // Rollback transaction on error
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Update recipe failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete recipe and all related data
     * 
     * @param string $recipe_id Recipe ID
     * @return bool True if successful, false otherwise
     */
    public static function deleteRecipe($recipe_id)
    {
        try {
            $pdo = Database::getConnection();

            // Start transaction
            $pdo->beginTransaction();

            // Get user_id for stat decrement
            $recipe_sql = "SELECT user_id FROM recipes WHERE id = :recipe_id";
            $recipe = Database::fetchOne($recipe_sql, ['recipe_id' => $recipe_id]);

            if (!$recipe) {
                throw new Exception('Recipe not found');
            }

            // Delete recipe (cascades to ingredients, steps, metadata, interactions)
            $result = Database::delete('recipes', 'id = :recipe_id', ['recipe_id' => $recipe_id]);

            // Decrement user's recipes_created stat
            if ($result > 0) {
                self::incrementUserStat($recipe['user_id'], 'recipes_created', -1);
            }

            // Commit transaction
            $pdo->commit();

            return $result > 0;
        } catch (Exception $e) {
            // Rollback transaction on error
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Delete recipe failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Record recipe interaction (like, dislike, save, purchase)
     * 
     * @param string $user_id User ID
     * @param string $recipe_id Recipe ID
     * @param string $interaction_type Type of interaction
     * @param array $metadata Additional metadata
     * @return bool True if successful, false otherwise
     */
    public static function recordRecipeInteraction($user_id, $recipe_id, $interaction_type, $metadata = [])
    {
        try {
            $pdo = Database::getConnection();

            // Start transaction
            $pdo->beginTransaction();

            // Generate interaction ID
            require_once __DIR__ . '/../utils/uuidHelper.php';
            $interaction_id = UUIDHelper::generateUniqueId('recipe_interactions', 'id');

            // Check if interaction already exists
            $check_sql = "SELECT id FROM recipe_interactions 
                          WHERE user_id = :user_id 
                            AND recipe_id = :recipe_id 
                            AND interaction_type = :interaction_type";

            $existing = Database::fetchOne($check_sql, [
                'user_id' => $user_id,
                'recipe_id' => $recipe_id,
                'interaction_type' => $interaction_type
            ]);

            if ($existing) {
                // Update existing interaction
                $update_data = [
                    'metadata' => json_encode($metadata),
                    'created_at' => date('Y-m-d H:i:s')
                ];

                $result = Database::update(
                    'recipe_interactions',
                    $update_data,
                    'id = :id',
                    ['id' => $existing['id']]
                );
            } else {
                // Insert new interaction
                $interaction_data = [
                    'id' => $interaction_id,
                    'user_id' => $user_id,
                    'recipe_id' => $recipe_id,
                    'interaction_type' => $interaction_type,
                    'metadata' => json_encode($metadata),
                    'created_at' => date('Y-m-d H:i:s')
                ];

                $result = Database::insert('recipe_interactions', $interaction_data);
            }

            // Update recipe metadata counts
            if ($result) {
                self::updateRecipeInteractionCount($recipe_id, $interaction_type);

                // Handle purchase interaction
                if ($interaction_type === 'purchase') {
                    self::handleRecipePurchase($user_id, $recipe_id, $metadata);
                }
            }

            // Commit transaction
            $pdo->commit();

            return true;
        } catch (Exception $e) {
            // Rollback transaction on error
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log('Record recipe interaction failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update recipe interaction count in metadata
     * 
     * @param string $recipe_id Recipe ID
     * @param string $interaction_type Type of interaction
     * @return bool True if successful, false otherwise
     */
    private static function updateRecipeInteractionCount($recipe_id, $interaction_type)
    {
        try {
            $field_map = [
                'like' => 'like_count',
                'dislike' => 'dislike_count',
                'save' => 'save_count', // Note: save_count might not exist in schema
                'purchase' => 'purchase_count'
            ];

            if (!isset($field_map[$interaction_type])) {
                return false;
            }

            $field = $field_map[$interaction_type];
            $sql = "UPDATE recipe_metadata 
                    SET $field = $field + 1, 
                        updated_at = :updated_at 
                    WHERE recipe_id = :recipe_id";

            $params = [
                'updated_at' => date('Y-m-d H:i:s'),
                'recipe_id' => $recipe_id
            ];

            $stmt = Database::getConnection()->prepare($sql);
            return $stmt->execute($params);
        } catch (Exception $e) {
            error_log('Update recipe interaction count failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Handle recipe purchase
     * 
     * @param string $user_id User ID
     * @param string $recipe_id Recipe ID
     * @param array $metadata Purchase metadata
     * @return bool True if successful, false otherwise
     */
    private static function handleRecipePurchase($user_id, $recipe_id, $metadata)
    {
        try {
            // Get recipe price
            $recipe_sql = "SELECT rm.gold_price, rm.gem_price, r.user_id as seller_id
                           FROM recipes r
                           LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id
                           WHERE r.id = :recipe_id";

            $recipe = Database::fetchOne($recipe_sql, ['recipe_id' => $recipe_id]);

            if (!$recipe || (!$recipe['gold_price'] && !$recipe['gem_price'])) {
                return false;
            }

            // Deduct currency from buyer
            if ($recipe['gold_price'] > 0) {
                self::incrementUserStat($user_id, 'gold_count', -$recipe['gold_price']);
            }
            if ($recipe['gem_price'] > 0) {
                self::incrementUserStat($user_id, 'gem_count', -$recipe['gem_price']);
            }

            // Add currency to seller (if different from buyer)
            if ($recipe['seller_id'] && $recipe['seller_id'] !== $user_id) {
                if ($recipe['gold_price'] > 0) {
                    self::incrementUserStat($recipe['seller_id'], 'gold_count', $recipe['gold_price']);
                }
                if ($recipe['gem_price'] > 0) {
                    self::incrementUserStat($recipe['seller_id'], 'gem_count', $recipe['gem_price']);
                }

                // Increment seller's recipes_sold count
                self::incrementUserStat($recipe['seller_id'], 'recipes_sold', 1);
            }

            return true;
        } catch (Exception $e) {
            error_log('Handle recipe purchase failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Calculate recipe rating
     * 
     * @param string $recipe_id Recipe ID
     * @return float Calculated rating (0-5)
     */
    private static function calculateRecipeRating($recipe_id)
    {
        try {
            $sql = "SELECT like_count, dislike_count FROM recipe_metadata WHERE recipe_id = :recipe_id";
            $counts = Database::fetchOne($sql, ['recipe_id' => $recipe_id]);

            if (!$counts) {
                return 0;
            }

            $likes = $counts['like_count'] ?? 0;
            $dislikes = $counts['dislike_count'] ?? 0;
            $total = $likes + $dislikes;

            if ($total === 0) {
                return 0;
            }

            // Simple rating calculation: percentage of likes * 5
            $rating = ($likes / $total) * 5;
            return round($rating, 1);
        } catch (Exception $e) {
            error_log('Calculate recipe rating failed: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get difficulty label
     * 
     * @param string $difficulty Difficulty value
     * @return string Human-readable difficulty label
     */
    private static function getDifficultyLabel($difficulty)
    {
        $labels = [
            'easy' => 'Easy',
            'medium' => 'Medium',
            'hard' => 'Hard'
        ];

        return $labels[$difficulty] ?? 'Medium';
    }

    /**
     * Calculate recipe popularity score
     * 
     * @param string $recipe_id Recipe ID
     * @return int Popularity score
     */
    private static function calculatePopularityScore($recipe_id)
    {
        try {
            $sql = "SELECT 
                    (like_count * 3) + 
                    (cook_count * 2) + 
                    (purchase_count * 5) + 
                    (FLOOR(DATEDIFF(NOW(), created_at) / 7) * -1) as score
                    FROM recipe_metadata 
                    WHERE recipe_id = :recipe_id";

            $result = Database::fetchOne($sql, ['recipe_id' => $recipe_id]);

            return max(0, $result['score'] ?? 0);
        } catch (Exception $e) {
            error_log('Calculate popularity score failed: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get user's recipe interactions
     * 
     * @param string $user_id User ID
     * @param string $recipe_id Recipe ID
     * @return array User's interactions with the recipe
     */
    public static function getUserRecipeInteractions($user_id, $recipe_id)
    {
        try {
            $sql = "SELECT interaction_type, metadata, created_at 
                    FROM recipe_interactions 
                    WHERE user_id = :user_id AND recipe_id = :recipe_id";

            $interactions = Database::fetchAll($sql, [
                'user_id' => $user_id,
                'recipe_id' => $recipe_id
            ]);

            $result = [];
            foreach ($interactions as $interaction) {
                $result[$interaction['interaction_type']] = [
                    'metadata' => json_decode($interaction['metadata'], true),
                    'created_at' => $interaction['created_at']
                ];
            }

            return $result;
        } catch (Exception $e) {
            error_log('Get user recipe interactions failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get multiple recipes with pagination and filtering
     * 
     * @param array $filters Filter criteria
     * @param int $page Page number
     * @param int $limit Results per page
     * @return array Paginated recipes
     */
    public static function getRecipes($filters = [], $page = 1, $limit = 20)
    {
        try {
            $offset = ($page - 1) * $limit;
            $where_clauses = [];
            $params = ['limit' => $limit, 'offset' => $offset];

            // Build WHERE clauses based on filters
            if (isset($filters['user_id'])) {
                $where_clauses[] = "r.user_id = :user_id";
                $params['user_id'] = $filters['user_id'];
            }

            if (isset($filters['difficulty'])) {
                $where_clauses[] = "r.difficulty = :difficulty";
                $params['difficulty'] = $filters['difficulty'];
            }

            if (isset($filters['is_public'])) {
                $where_clauses[] = "r.is_public = :is_public";
                $params['is_public'] = $filters['is_public'];
            }

            if (isset($filters['is_paid'])) {
                $where_clauses[] = "r.is_paid = :is_paid";
                $params['is_paid'] = $filters['is_paid'];
            }

            if (isset($filters['search'])) {
                $where_clauses[] = "(r.title LIKE :search OR r.description LIKE :search OR rm.tags LIKE :search)";
                $params['search'] = "%{$filters['search']}%";
            }

            $where_sql = empty($where_clauses) ? '' : 'WHERE ' . implode(' AND ', $where_clauses);

            // Base query
            $sql = "SELECT r.*, u.full_name as creator_name, u.profile_picture as creator_avatar,
                           rm.like_count, rm.dislike_count, rm.cook_count, rm.purchase_count,
                           rm.exp_reward, rm.gold_reward, rm.gem_reward,
                           rm.gold_price, rm.gem_price
                    FROM recipes r
                    LEFT JOIN users u ON r.user_id = u.id
                    LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id
                    $where_sql
                    ORDER BY r.created_at DESC
                    LIMIT :limit OFFSET :offset";

            $recipes = Database::fetchAll($sql, $params);

            // Count total for pagination
            $count_sql = "SELECT COUNT(*) as total 
                          FROM recipes r
                          LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id
                          $where_sql";

            $count_params = array_diff_key($params, ['limit' => '', 'offset' => '']);
            $count_result = Database::fetchOne($count_sql, $count_params);
            $total = $count_result['total'] ?? 0;

            // Calculate ratings for each recipe
            foreach ($recipes as &$recipe) {
                $recipe['rating'] = self::calculateRecipeRating($recipe['id']);
                $recipe['difficulty_label'] = self::getDifficultyLabel($recipe['difficulty']);
            }

            return [
                'recipes' => $recipes,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'pages' => ceil($total / $limit)
                ]
            ];
        } catch (Exception $e) {
            error_log('Get recipes failed: ' . $e->getMessage());
            return [
                'recipes' => [],
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => 0,
                    'pages' => 0
                ]
            ];
        }
    }

    // Add to backend/classes/DatabaseHelper.php

// Add to "Cooking Session Operations" section

    /**
     * Create a new cooking session
     * 
     * @param array $session_data Session data
     * @return string|false Session ID or false on failure
     */
    public static function createCookingSession($session_data)
    {
        try {
            // Generate session ID
            require_once __DIR__ . '/../utils/uuidHelper.php';
            $session_id = UUIDHelper::generateUniqueId('cooking_sessions', 'id');

            // Prepare session data
            $session_data['id'] = $session_id;
            $session_data['created_at'] = date('Y-m-d H:i:s');
            $session_data['updated_at'] = date('Y-m-d H:i:s');

            // Insert session
            $session_inserted = Database::insert('cooking_sessions', $session_data);

            if (!$session_inserted) {
                return false;
            }

            // Create session details
            $details_id = UUIDHelper::generateUniqueId('cooking_session_details', 'id');
            $details_data = [
                'id' => $details_id,
                'cooking_session_id' => $session_id,
                'current_step_index' => 0,
                'total_steps' => $session_data['total_steps'] ?? 0,
                'completed_steps' => 0,
                'total_duration' => $session_data['total_duration'] ?? 0,
                'exp_earned' => 0,
                'gold_earned' => 0,
                'gems_earned' => 0
            ];

            Database::insert('cooking_session_details', $details_data);

            // Add host as participant
            if (isset($session_data['host_id'])) {
                self::joinCookingSession($session_id, $session_data['host_id'], 'host');
            }

            return $session_id;
        } catch (Exception $e) {
            error_log("Error creating cooking session: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get cooking session with details
     * 
     * @param string $session_id Session ID
     * @return array|false Session data or false on failure
     */
    public static function getCookingSession($session_id)
    {
        try {
            // Get session basic info
            $session_sql = "SELECT 
                cs.*, 
                r.title as recipe_title,
                r.cover_image as recipe_image,
                r.difficulty as recipe_difficulty,
                r.preparation_time + r.cooking_time as total_time,
                u.full_name as host_name,
                u.profile_picture as host_picture
            FROM cooking_sessions cs
            LEFT JOIN recipes r ON cs.recipe_id = r.id
            LEFT JOIN users u ON cs.host_id = u.id
            WHERE cs.id = :session_id";

            $session = Database::fetchOne($session_sql, ['session_id' => $session_id]);

            if (!$session) {
                return false;
            }

            // Get session details
            $details_sql = "SELECT * FROM cooking_session_details 
                       WHERE cooking_session_id = :session_id";
            $details = Database::fetchOne($details_sql, ['session_id' => $session_id]);

            // Get participants
            $participants_sql = "SELECT 
                cp.*,
                u.full_name,
                u.profile_picture,
                u.level
            FROM cooking_session_participants cp
            LEFT JOIN users u ON cp.user_id = u.id
            WHERE cp.cooking_session_id = :session_id
            ORDER BY 
                CASE cp.role 
                    WHEN 'host' THEN 1
                    WHEN 'participant' THEN 2
                    WHEN 'spectator' THEN 3
                END,
                cp.joined_at";

            $participants = Database::fetchAll($participants_sql, ['session_id' => $session_id]);

            // Get completed steps
            $completed_steps_sql = "SELECT 
                csc.*,
                rs.description as step_description,
                rs.order_index as step_order
            FROM cooking_step_completions csc
            LEFT JOIN recipe_steps rs ON csc.recipe_step_id = rs.id
            WHERE csc.cooking_session_id = :session_id
            ORDER BY csc.step_index";

            $completed_steps = Database::fetchAll($completed_steps_sql, ['session_id' => $session_id]);

            // Get votes
            $votes_sql = "SELECT * FROM cooking_session_votes 
                     WHERE cooking_session_id = :session_id";
            $votes = Database::fetchAll($votes_sql, ['session_id' => $session_id]);

            // Get recipe steps for current progress
            $recipe_steps_sql = "SELECT 
                id, description, image, timer_duration, timer_unit,
                order_index, exp_reward, gold_reward, gem_reward
            FROM recipe_steps 
            WHERE recipe_id = :recipe_id 
            ORDER BY order_index";

            $recipe_steps = Database::fetchAll($recipe_steps_sql, ['recipe_id' => $session['recipe_id']]);

            return [
                'session' => $session,
                'details' => $details,
                'participants' => $participants,
                'completed_steps' => $completed_steps,
                'votes' => $votes,
                'recipe_steps' => $recipe_steps
            ];
        } catch (Exception $e) {
            error_log("Error getting cooking session: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update cooking session
     * 
     * @param string $session_id Session ID
     * @param array $updates Update data
     * @return bool Success status
     */
    public static function updateCookingSession($session_id, $updates)
    {
        try {
            $updates['updated_at'] = date('Y-m-d H:i:s');
            $where = "id = :id";
            $updates['id'] = $session_id;

            return Database::update('cooking_sessions', $updates, $where) !== false;
        } catch (Exception $e) {
            error_log("Error updating cooking session: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update cooking session details
     * 
     * @param string $session_id Session ID
     * @param array $updates Details update data
     * @return bool Success status
     */
    public static function updateCookingSessionDetails($session_id, $updates)
    {
        try {
            $where = "cooking_session_id = :session_id";
            $updates['cooking_session_id'] = $session_id;

            return Database::update('cooking_session_details', $updates, $where) !== false;
        } catch (Exception $e) {
            error_log("Error updating cooking session details: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Join a cooking session
     * 
     * @param string $session_id Session ID
     * @param string $user_id User ID
     * @param string $role User role (host|participant|spectator)
     * @return bool Success status
     */
    public static function joinCookingSession($session_id, $user_id, $role = 'participant')
    {
        try {
            // Check if already joined
            $check_sql = "SELECT id FROM cooking_session_participants 
                     WHERE cooking_session_id = :session_id AND user_id = :user_id";
            $existing = Database::fetchOne($check_sql, [
                'session_id' => $session_id,
                'user_id' => $user_id
            ]);

            if ($existing) {
                // Update existing entry
                $update_data = [
                    'role' => $role,
                    'status' => 'joined',
                    'joined_at' => date('Y-m-d H:i:s'),
                    'left_at' => null
                ];
                $where = "id = :id";
                $update_data['id'] = $existing['id'];

                return Database::update('cooking_session_participants', $update_data, $where) !== false;
            }

            // Create new participant entry
            require_once __DIR__ . '/../utils/uuidHelper.php';
            $participant_id = UUIDHelper::generateUniqueId('cooking_session_participants', 'id');

            $participant_data = [
                'id' => $participant_id,
                'cooking_session_id' => $session_id,
                'user_id' => $user_id,
                'role' => $role,
                'status' => 'joined',
                'joined_at' => date('Y-m-d H:i:s')
            ];

            return Database::insert('cooking_session_participants', $participant_data) !== false;
        } catch (Exception $e) {
            error_log("Error joining cooking session: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Leave a cooking session
     * 
     * @param string $session_id Session ID
     * @param string $user_id User ID
     * @return bool Success status
     */
    public static function leaveCookingSession($session_id, $user_id)
    {
        try {
            $update_data = [
                'status' => 'left',
                'left_at' => date('Y-m-d H:i:s')
            ];
            $where = "cooking_session_id = :session_id AND user_id = :user_id";

            return Database::update('cooking_session_participants', $update_data, $where, [
                'session_id' => $session_id,
                'user_id' => $user_id
            ]) !== false;
        } catch (Exception $e) {
            error_log("Error leaving cooking session: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Complete a cooking step
     * 
     * @param string $session_id Session ID
     * @param string $step_id Recipe step ID
     * @param string $user_id User ID who completed the step
     * @param array $step_data Additional step data
     * @return bool Success status
     */
    public static function completeCookingStep($session_id, $step_id, $user_id, $step_data = [])
    {
        try {
            Database::query("START TRANSACTION");

            // Get step info
            $step_sql = "SELECT * FROM recipe_steps WHERE id = :step_id";
            $step = Database::fetchOne($step_sql, ['step_id' => $step_id]);

            if (!$step) {
                throw new Exception("Step not found");
            }

            // Check if step already completed for this session
            $check_sql = "SELECT id FROM cooking_step_completions 
                     WHERE cooking_session_id = :session_id 
                     AND recipe_step_id = :step_id";
            $existing = Database::fetchOne($check_sql, [
                'session_id' => $session_id,
                'step_id' => $step_id
            ]);

            if ($existing) {
                // Step already completed
                Database::query("ROLLBACK");
                return false;
            }

            // Create completion record
            require_once __DIR__ . '/../utils/uuidHelper.php';
            $completion_id = UUIDHelper::generateUniqueId('cooking_step_completions', 'id');

            $completion_data = [
                'id' => $completion_id,
                'cooking_session_id' => $session_id,
                'recipe_step_id' => $step_id,
                'step_index' => $step['order_index'],
                'completed_at' => date('Y-m-d H:i:s'),
                'duration_seconds' => $step_data['duration_seconds'] ?? null,
                'was_skipped' => $step_data['was_skipped'] ?? false,
                'notes' => $step_data['notes'] ?? null,
                'exp_earned' => $step['exp_reward'] ?? 0,
                'gold_earned' => $step['gold_reward'] ?? 0,
                'gems_earned' => $step['gem_reward'] ?? 0
            ];

            Database::insert('cooking_step_completions', $completion_data);

            // Update session details
            $details_sql = "SELECT * FROM cooking_session_details 
                       WHERE cooking_session_id = :session_id 
                       FOR UPDATE";
            $details = Database::fetchOne($details_sql, ['session_id' => $session_id]);

            if ($details) {
                $update_details = [
                    'completed_steps' => $details['completed_steps'] + 1,
                    'current_step_index' => $step['order_index'],
                    'exp_earned' => $details['exp_earned'] + ($step['exp_reward'] ?? 0),
                    'gold_earned' => $details['gold_earned'] + ($step['gold_reward'] ?? 0),
                    'gems_earned' => $details['gems_earned'] + ($step['gem_reward'] ?? 0)
                ];

                // If this is the last step, mark session as completed
                if (
                    $details['total_steps'] > 0 &&
                    ($details['completed_steps'] + 1) >= $details['total_steps']
                ) {

                    self::updateCookingSession($session_id, [
                        'status' => 'completed',
                        'completed_at' => date('Y-m-d H:i:s')
                    ]);
                }

                self::updateCookingSessionDetails($session_id, $update_details);
            }

            // Update user stats
            self::incrementUserStat($user_id, 'recipes_cooked', 1);

            Database::query("COMMIT");
            return true;
        } catch (Exception $e) {
            Database::query("ROLLBACK");
            error_log("Error completing cooking step: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Vote in a cooking session
     * 
     * @param string $session_id Session ID
     * @param string $user_id User ID
     * @param string $vote_type Vote type
     * @param bool $vote_value Vote value
     * @return bool Success status
     */
    public static function voteInCookingSession($session_id, $user_id, $vote_type, $vote_value)
    {
        try {
            // Check for existing vote
            $check_sql = "SELECT id FROM cooking_session_votes 
                     WHERE cooking_session_id = :session_id 
                     AND user_id = :user_id 
                     AND vote_type = :vote_type";

            $existing = Database::fetchOne($check_sql, [
                'session_id' => $session_id,
                'user_id' => $user_id,
                'vote_type' => $vote_type
            ]);

            if ($existing) {
                // Update existing vote
                $update_data = [
                    'vote_value' => $vote_value,
                    'created_at' => date('Y-m-d H:i:s')
                ];
                $where = "id = :id";
                $update_data['id'] = $existing['id'];

                return Database::update('cooking_session_votes', $update_data, $where) !== false;
            }

            // Create new vote
            require_once __DIR__ . '/../utils/uuidHelper.php';
            $vote_id = UUIDHelper::generateUniqueId('cooking_session_votes', 'id');

            $vote_data = [
                'id' => $vote_id,
                'cooking_session_id' => $session_id,
                'user_id' => $user_id,
                'vote_type' => $vote_type,
                'vote_value' => $vote_value,
                'created_at' => date('Y-m-d H:i:s')
            ];

            return Database::insert('cooking_session_votes', $vote_data) !== false;
        } catch (Exception $e) {
            error_log("Error voting in cooking session: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user's active cooking sessions
     * 
     * @param string $user_id User ID
     * @return array|false Array of sessions or false on failure
     */
    public static function getUserCookingSessions($user_id, $status = null)
    {
        try {
            $sql = "SELECT 
                cs.*,
                r.title as recipe_title,
                r.cover_image as recipe_image,
                csd.completed_steps,
                csd.total_steps,
                csd.exp_earned,
                csd.gold_earned,
                csd.gems_earned
            FROM cooking_sessions cs
            INNER JOIN cooking_session_participants csp ON cs.id = csp.cooking_session_id
            LEFT JOIN recipes r ON cs.recipe_id = r.id
            LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id
            WHERE csp.user_id = :user_id 
            AND csp.status = 'joined'";

            $params = ['user_id' => $user_id];

            if ($status) {
                $sql .= " AND cs.status = :status";
                $params['status'] = $status;
            }

            $sql .= " ORDER BY cs.created_at DESC";

            return Database::fetchAll($sql, $params);
        } catch (Exception $e) {
            error_log("Error getting user cooking sessions: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get public cooking sessions
     * 
     * @param int $limit Maximum number of sessions to return
     * @return array|false Array of sessions or false on failure
     */
    public static function getPublicCookingSessions($limit = 20)
    {
        try {
            $sql = "SELECT 
                cs.*,
                r.title as recipe_title,
                r.cover_image as recipe_image,
                u.full_name as host_name,
                COUNT(csp.id) as participant_count,
                csd.completed_steps,
                csd.total_steps
            FROM cooking_sessions cs
            LEFT JOIN recipes r ON cs.recipe_id = r.id
            LEFT JOIN users u ON cs.host_id = u.id
            LEFT JOIN cooking_session_participants csp ON cs.id = csp.cooking_session_id 
                AND csp.status = 'joined'
            LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id
            WHERE cs.visibility = 'public'
            AND cs.status IN ('planned', 'preparing', 'cooking')
            GROUP BY cs.id
            ORDER BY cs.created_at DESC
            LIMIT :limit";

            return Database::fetchAll($sql, ['limit' => $limit]);
        } catch (Exception $e) {
            error_log("Error getting public cooking sessions: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Follow a user
     * 
     * @param string $source_user_id User who is following
     * @param string $target_user_id User being followed
     * @param string $message Optional message for friend request
     * @return bool Success status
     */
    public static function followUser($source_user_id, $target_user_id, $message = null)
    {
        try {
            // Check if relationship already exists
            $existing_sql = "SELECT id, status FROM user_relationships 
                            WHERE source_user_id = :source_user_id 
                            AND target_user_id = :target_user_id 
                            AND relationship_type IN ('following', 'friend')";

            $existing = Database::fetchOne($existing_sql, [
                'source_user_id' => $source_user_id,
                'target_user_id' => $target_user_id
            ]);

            if ($existing) {
                // Update existing relationship
                $sql = "UPDATE user_relationships 
                        SET relationship_type = 'following', 
                            status = 'accepted',
                            message = :message,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE id = :id";

                return Database::query($sql, [
                    'id' => $existing['id'],
                    'message' => $message
                ]);
            } else {
                // Create new following relationship
                $sql = "INSERT INTO user_relationships (id, source_user_id, target_user_id, 
                         relationship_type, status, message)
                        VALUES (:id, :source_user_id, :target_user_id, 
                                'following', 'accepted', :message)";

                require_once __DIR__ . '/../utils/uuidHelper.php';
                $id = UUIDHelper::makeId();

                return Database::query($sql, [
                    'id' => $id,
                    'source_user_id' => $source_user_id,
                    'target_user_id' => $target_user_id,
                    'message' => $message
                ]);
            }
        } catch (Exception $e) {
            error_log('Follow user failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Unfollow a user
     * 
     * @param string $source_user_id User who is unfollowing
     * @param string $target_user_id User being unfollowed
     * @return bool Success status
     */
    public static function unfollowUser($source_user_id, $target_user_id)
    {
        try {
            $sql = "DELETE FROM user_relationships 
                    WHERE source_user_id = :source_user_id 
                    AND target_user_id = :target_user_id 
                    AND relationship_type = 'following'";

            return Database::query($sql, [
                'source_user_id' => $source_user_id,
                'target_user_id' => $target_user_id
            ]);
        } catch (Exception $e) {
            error_log('Unfollow user failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get friend requests for a user
     * 
     * @param string $user_id User ID
     * @param string $type 'received' or 'sent'
     * @return array List of friend requests
     */
    public static function getFriendRequests($user_id, $type = 'received')
    {
        try {
            if ($type === 'received') {
                // Requests received by the user
                $sql = "SELECT ur.id, ur.source_user_id, ur.target_user_id, ur.message, 
                               ur.created_at, ur.responded_at, ur.status,
                               u.full_name, u.profile_picture, u.email,
                               us.level
                        FROM user_relationships ur
                        JOIN users u ON ur.source_user_id = u.id
                        LEFT JOIN user_stats us ON u.id = us.user_id
                        WHERE ur.target_user_id = :user_id 
                          AND ur.relationship_type = 'friend' 
                          AND ur.status = 'pending'
                        ORDER BY ur.created_at DESC";
            } else {
                // Requests sent by the user
                $sql = "SELECT ur.id, ur.source_user_id, ur.target_user_id, ur.message, 
                               ur.created_at, ur.responded_at, ur.status,
                               u.full_name, u.profile_picture, u.email,
                               us.level
                        FROM user_relationships ur
                        JOIN users u ON ur.target_user_id = u.id
                        LEFT JOIN user_stats us ON u.id = us.user_id
                        WHERE ur.source_user_id = :user_id 
                          AND ur.relationship_type = 'friend' 
                          AND ur.status = 'pending'
                        ORDER BY ur.created_at DESC";
            }

            return Database::fetchAll($sql, ['user_id' => $user_id]);
        } catch (Exception $e) {
            error_log('Get friend requests failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Send friend request
     * 
     * @param string $source_user_id User sending request
     * @param string $target_user_id User receiving request
     * @param string $message Optional message
     * @return bool Success status
     */
    public static function sendFriendRequest($source_user_id, $target_user_id, $message = null)
    {
        try {
            // Check if request already exists
            $existing_sql = "SELECT id FROM user_relationships 
                            WHERE ((source_user_id = :source_user_id 
                                    AND target_user_id = :target_user_id)
                                OR (source_user_id = :target_user_id 
                                    AND target_user_id = :source_user_id))
                            AND relationship_type = 'friend'";

            $existing = Database::fetchOne($existing_sql, [
                'source_user_id' => $source_user_id,
                'target_user_id' => $target_user_id
            ]);

            if ($existing) {
                // Request already exists
                return false;
            }

            // Create new friend request
            $sql = "INSERT INTO user_relationships (id, source_user_id, target_user_id, 
                     relationship_type, status, message)
                    VALUES (:id, :source_user_id, :target_user_id, 
                            'friend', 'pending', :message)";

            require_once __DIR__ . '/../utils/uuidHelper.php';
            $id = UUIDHelper::makeId();

            return Database::query($sql, [
                'id' => $id,
                'source_user_id' => $source_user_id,
                'target_user_id' => $target_user_id,
                'message' => $message
            ]);
        } catch (Exception $e) {
            error_log('Send friend request failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Respond to friend request
     * 
     * @param string $request_id Relationship ID
     * @param string $status 'accepted' or 'rejected'
     * @return bool Success status
     */
    public static function respondToFriendRequest($request_id, $status)
    {
        try {
            // Get the request first
            $sql = "SELECT source_user_id, target_user_id, status 
                    FROM user_relationships 
                    WHERE id = :id AND relationship_type = 'friend'";

            $request = Database::fetchOne($sql, ['id' => $request_id]);

            if (!$request || $request['status'] !== 'pending') {
                return false;
            }

            if ($status === 'accepted') {
                // Update to accepted status
                $update_sql = "UPDATE user_relationships 
                              SET status = 'accepted', 
                                  responded_at = CURRENT_TIMESTAMP
                              WHERE id = :id";

                return Database::query($update_sql, ['id' => $request_id]);
            } else {
                // Update to rejected status
                $update_sql = "UPDATE user_relationships 
                              SET status = 'rejected', 
                                  responded_at = CURRENT_TIMESTAMP
                              WHERE id = :id";

                return Database::query($update_sql, ['id' => $request_id]);
            }
        } catch (Exception $e) {
            error_log('Respond to friend request failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user's friends
     * 
     * @param string $user_id User ID
     * @return array List of friends
     */
    public static function getFriends($user_id)
    {
        try {
            $sql = "SELECT u.id, u.full_name, u.profile_picture, u.email, 
                           us.level, ur.created_at as friends_since
                    FROM user_relationships ur
                    JOIN users u ON (
                        (ur.source_user_id = :user_id AND ur.target_user_id = u.id)
                        OR 
                        (ur.target_user_id = :user_id AND ur.source_user_id = u.id)
                    )
                    LEFT JOIN user_stats us ON u.id = us.user_id
                    WHERE ur.relationship_type = 'friend' 
                      AND ur.status = 'accepted'
                    ORDER BY ur.created_at DESC";

            return Database::fetchAll($sql, ['user_id' => $user_id]);
        } catch (Exception $e) {
            error_log('Get friends failed: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Remove friend
     * 
     * @param string $user_id User ID
     * @param string $friend_id Friend's user ID
     * @return bool Success status
     */
    public static function removeFriend($user_id, $friend_id)
    {
        try {
            $sql = "DELETE FROM user_relationships 
                    WHERE relationship_type = 'friend' 
                    AND status = 'accepted'
                    AND ((source_user_id = :user_id AND target_user_id = :friend_id)
                         OR (source_user_id = :friend_id AND target_user_id = :user_id))";

            return Database::query($sql, [
                'user_id' => $user_id,
                'friend_id' => $friend_id
            ]);
        } catch (Exception $e) {
            error_log('Remove friend failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Manage friend relationships (send/accept/reject/cancel/remove)
     */
    public static function manageFriendRelationships($action, $source_user_id, $target_user_id, $message = null)
    {
        try {
            $pdo = Database::getConnection();

            switch ($action) {
                case 'send_request':
                    // Check if request already exists
                    $checkStmt = $pdo->prepare("
                        SELECT id FROM user_relationships 
                        WHERE source_user_id = ? 
                        AND target_user_id = ? 
                        AND relationship_type = 'friend'
                    ");

                    $checkStmt->execute([$source_user_id, $target_user_id]);

                    if ($checkStmt->fetch()) {
                        return false; // Request already exists
                    }

                    // Send new friend request
                    $stmt = $pdo->prepare("
                        INSERT INTO user_relationships (id, source_user_id, target_user_id, relationship_type, status, message, created_at)
                        VALUES (?, ?, ?, 'friend', 'pending', ?, NOW())
                    ");

                    $relationship_id = uniqid('rel_', true);
                    return $stmt->execute([$relationship_id, $source_user_id, $target_user_id, $message]);

                case 'accept_request':
                    // Accept friend request (source sent to target, so we need to find that record)
                    $stmt = $pdo->prepare("
                        UPDATE user_relationships 
                        SET status = 'accepted', 
                            responded_at = NOW(),
                            updated_at = NOW()
                        WHERE source_user_id = ? 
                        AND target_user_id = ? 
                        AND relationship_type = 'friend'
                        AND status = 'pending'
                    ");

                    return $stmt->execute([$target_user_id, $source_user_id]);

                case 'reject_request':
                    // Reject friend request
                    $stmt = $pdo->prepare("
                        UPDATE user_relationships 
                        SET status = 'rejected', 
                            responded_at = NOW(),
                            updated_at = NOW()
                        WHERE source_user_id = ? 
                        AND target_user_id = ? 
                        AND relationship_type = 'friend'
                        AND status = 'pending'
                    ");

                    return $stmt->execute([$target_user_id, $source_user_id]);

                case 'cancel_request':
                    // Cancel a sent friend request
                    $stmt = $pdo->prepare("
                        UPDATE user_relationships 
                        SET status = 'cancelled', 
                            updated_at = NOW()
                        WHERE source_user_id = ? 
                        AND target_user_id = ? 
                        AND relationship_type = 'friend'
                        AND status = 'pending'
                    ");

                    return $stmt->execute([$source_user_id, $target_user_id]);

                case 'remove_friend':
                    // Remove a friend (delete the relationship)
                    $stmt = $pdo->prepare("
                        DELETE FROM user_relationships 
                        WHERE (
                            (source_user_id = ? AND target_user_id = ?) 
                            OR (source_user_id = ? AND target_user_id = ?)
                        ) 
                        AND relationship_type = 'friend'
                    ");

                    return $stmt->execute([$source_user_id, $target_user_id, $target_user_id, $source_user_id]);

                default:
                    return false;
            }
        } catch (PDOException $e) {
            error_log("Manage friend relationships error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user's friends list
     */
    public static function getFriendsList($user_id, $limit = 50, $offset = 0)
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
                SELECT 
                    CASE 
                        WHEN ur.source_user_id = ? THEN ur.target_user_id
                        ELSE ur.source_user_id
                    END as friend_id,
                    u.full_name,
                    u.profile_picture,
                    ur.updated_at as friends_since
                FROM user_relationships ur
                JOIN users u ON (
                    CASE 
                        WHEN ur.source_user_id = ? THEN ur.target_user_id
                        ELSE ur.source_user_id
                    END = u.id
                )
                WHERE (
                    (ur.source_user_id = ? OR ur.target_user_id = ?)
                    AND ur.relationship_type = 'friend'
                    AND ur.status = 'accepted'
                )
                ORDER BY ur.updated_at DESC
                LIMIT ? OFFSET ?
            ");

            $stmt->execute([$user_id, $user_id, $user_id, $user_id, $limit, $offset]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get friends list error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get user's followers
     */
    public static function getFollowersList($user_id, $limit = 50, $offset = 0)
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
                SELECT 
                    ur.source_user_id as follower_id,
                    u.full_name,
                    u.profile_picture,
                    ur.created_at as followed_at
                FROM user_relationships ur
                JOIN users u ON ur.source_user_id = u.id
                WHERE ur.target_user_id = ? 
                AND ur.relationship_type = 'following' 
                AND ur.status = 'accepted'
                ORDER BY ur.created_at DESC
                LIMIT ? OFFSET ?
            ");

            $stmt->execute([$user_id, $limit, $offset]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get followers list error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get users that a user is following
     */
    public static function getFollowingList($user_id, $limit = 50, $offset = 0)
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
                SELECT 
                    ur.target_user_id as following_id,
                    u.full_name,
                    u.profile_picture,
                    ur.created_at as followed_at
                FROM user_relationships ur
                JOIN users u ON ur.target_user_id = u.id
                WHERE ur.source_user_id = ? 
                AND ur.relationship_type = 'following' 
                AND ur.status = 'accepted'
                ORDER BY ur.created_at DESC
                LIMIT ? OFFSET ?
            ");

            $stmt->execute([$user_id, $limit, $offset]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get following list error: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Check if two users are friends
     */
    public static function areFriends($user1_id, $user2_id)
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
                SELECT COUNT(*) as count 
                FROM user_relationships 
                WHERE (
                    (source_user_id = ? AND target_user_id = ?)
                    OR (source_user_id = ? AND target_user_id = ?)
                )
                AND relationship_type = 'friend'
                AND status = 'accepted'
            ");

            $stmt->execute([$user1_id, $user2_id, $user2_id, $user1_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result && $result['count'] > 0;
        } catch (PDOException $e) {
            error_log("Check friends error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get follower count for a user
     */
    public static function getFollowerCount($user_id)
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
                SELECT COUNT(*) as count 
                FROM user_relationships 
                WHERE target_user_id = ? 
                AND relationship_type = 'following' 
                AND status = 'accepted'
            ");

            $stmt->execute([$user_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result ? (int)$result['count'] : 0;
        } catch (PDOException $e) {
            error_log("Get follower count error: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get following count for a user
     */
    public static function getFollowingCount($user_id)
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
                SELECT COUNT(*) as count 
                FROM user_relationships 
                WHERE source_user_id = ? 
                AND relationship_type = 'following' 
                AND status = 'accepted'
            ");

            $stmt->execute([$user_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result ? (int)$result['count'] : 0;
        } catch (PDOException $e) {
            error_log("Get following count error: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get friends count for a user
     */
    public static function getFriendsCount($user_id)
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
                SELECT COUNT(*) as count 
                FROM user_relationships 
                WHERE (
                    (source_user_id = ? OR target_user_id = ?)
                    AND relationship_type = 'friend'
                    AND status = 'accepted'
                )
            ");

            $stmt->execute([$user_id, $user_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return $result ? (int)$result['count'] : 0;
        } catch (PDOException $e) {
            error_log("Get friends count error: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Shop Operations
     */

    /**
     * Get available shop items
     */
    public static function getShopItems($filters = [])
    {
        try {
            $pdo = Database::getConnection();

            $whereConditions = [];
            $params = [];

            // Build filter conditions
            if (isset($filters['category']) && $filters['category']) {
                $whereConditions[] = "category = ?";
                $params[] = $filters['category'];
            }

            if (isset($filters['is_available']) && $filters['is_available']) {
                $whereConditions[] = "is_available = ?";
                $params[] = $filters['is_available'];
            }

            if (isset($filters['min_price']) && $filters['min_price'] > 0) {
                $whereConditions[] = "(gold_price >= ? OR gem_price >= ?)";
                $params[] = $filters['min_price'];
                $params[] = $filters['min_price'];
            }

            if (isset($filters['max_price']) && $filters['max_price'] > 0) {
                $whereConditions[] = "(gold_price <= ? OR gem_price <= ?)";
                $params[] = $filters['max_price'];
                $params[] = $filters['max_price'];
            }

            // Build WHERE clause
            $whereClause = '';
            if (!empty($whereConditions)) {
                $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
            }

            $sql = "SELECT * FROM shop_items $whereClause ORDER BY category, gold_price, gem_price";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get shop items error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Purchase a shop item for a user
     */
    public static function purchaseItem($user_id, $item_id)
    {
        try {
            $pdo = Database::getConnection();

            // Start transaction
            $pdo->beginTransaction();

            // Get item details
            $itemStmt = $pdo->prepare("SELECT * FROM shop_items WHERE id = ? AND is_available = 1");
            $itemStmt->execute([$item_id]);
            $item = $itemStmt->fetch(PDO::FETCH_ASSOC);

            if (!$item) {
                throw new Exception("Item not available or not found");
            }

            // Get user stats
            $userStmt = $pdo->prepare("SELECT gold_count, gem_count FROM user_stats WHERE user_id = ?");
            $userStmt->execute([$user_id]);
            $userStats = $userStmt->fetch(PDO::FETCH_ASSOC);

            if (!$userStats) {
                throw new Exception("User stats not found");
            }

            // Check if user can afford the item
            $canAfford = false;
            $currencyType = '';
            $price = 0;

            if ($item['gold_price'] > 0 && $userStats['gold_count'] >= $item['gold_price']) {
                $canAfford = true;
                $currencyType = 'gold';
                $price = $item['gold_price'];
            } elseif ($item['gem_price'] > 0 && $userStats['gem_count'] >= $item['gem_price']) {
                $canAfford = true;
                $currencyType = 'gem';
                $price = $item['gem_price'];
            }

            if (!$canAfford) {
                throw new Exception("Insufficient funds");
            }

            // Deduct currency
            if ($currencyType === 'gold') {
                $updateStmt = $pdo->prepare("UPDATE user_stats SET gold_count = gold_count - ? WHERE user_id = ?");
            } else {
                $updateStmt = $pdo->prepare("UPDATE user_stats SET gem_count = gem_count - ? WHERE user_id = ?");
            }
            $updateStmt->execute([$price, $user_id]);

            // Record purchase
            $purchaseId = UUIDHelper::makeId();
            $purchaseStmt = $pdo->prepare("
            INSERT INTO user_purchases (id, user_id, item_id, currency_type, price, purchased_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
            $purchaseStmt->execute([$purchaseId, $user_id, $item_id, $currencyType, $price]);

            // Update item purchase count
            $itemUpdateStmt = $pdo->prepare("UPDATE shop_items SET purchase_count = purchase_count + 1 WHERE id = ?");
            $itemUpdateStmt->execute([$item_id]);

            // Commit transaction
            $pdo->commit();

            return [
                'purchase_id' => $purchaseId,
                'item' => $item,
                'currency_type' => $currencyType,
                'price' => $price,
                'remaining_balance' => [
                    'gold_count' => $currencyType === 'gold' ? $userStats['gold_count'] - $price : $userStats['gold_count'],
                    'gem_count' => $currencyType === 'gem' ? $userStats['gem_count'] - $price : $userStats['gem_count']
                ]
            ];
        } catch (Exception $e) {
            if (isset($pdo) && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            error_log("Purchase item error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user's purchased items
     */
    public static function getUserPurchases($user_id, $limit = 50, $offset = 0)
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
            SELECT 
                up.*,
                si.name as item_name,
                si.description as item_description,
                si.item_type,
                si.category,
                si.effect_value,
                si.duration_days,
                si.image_url
            FROM user_purchases up
            JOIN shop_items si ON up.item_id = si.id
            WHERE up.user_id = ?
            ORDER BY up.purchased_at DESC
            LIMIT ? OFFSET ?
        ");

            $stmt->execute([$user_id, $limit, $offset]);
            $purchases = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get total count for pagination
            $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM user_purchases WHERE user_id = ?");
            $countStmt->execute([$user_id]);
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

            return [
                'purchases' => $purchases,
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset
            ];
        } catch (PDOException $e) {
            error_log("Get user purchases error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get shop item categories
     */
    public static function getItemCategories()
    {
        try {
            $pdo = Database::getConnection();

            $stmt = $pdo->prepare("
            SELECT DISTINCT category, COUNT(*) as item_count 
            FROM shop_items 
            WHERE is_available = 1 
            GROUP BY category 
            ORDER BY category
        ");
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get item categories error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get user's cookbooks
     */
    public static function getCookbooks($user_id, $include_public = false)
    {
        try {
            $pdo = Database::getConnection();

            $params = [$user_id];
            $visibilityCondition = "user_id = ?";

            if ($include_public) {
                $visibilityCondition = "(user_id = ? OR is_public = 1)";
            }

            $sql = "
            SELECT cb.*, 
                   u.full_name as owner_name,
                   u.profile_picture as owner_picture,
                   (SELECT COUNT(*) FROM cookbook_recipes cr WHERE cr.cookbook_id = cb.id) as recipe_count
            FROM cookbooks cb
            JOIN users u ON cb.user_id = u.id
            WHERE $visibilityCondition
            ORDER BY cb.updated_at DESC
        ";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            $cookbooks = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get recipe previews for each cookbook
            foreach ($cookbooks as &$cookbook) {
                $previewStmt = $pdo->prepare("
                SELECT r.id, r.title, r.cover_image
                FROM cookbook_recipes cr
                JOIN recipes r ON cr.recipe_id = r.id
                WHERE cr.cookbook_id = ?
                ORDER BY cr.added_at DESC
                LIMIT 3
            ");
                $previewStmt->execute([$cookbook['id']]);
                $cookbook['recipe_previews'] = $previewStmt->fetchAll(PDO::FETCH_ASSOC);
            }

            return $cookbooks;
        } catch (PDOException $e) {
            error_log("Get cookbooks error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Create a new cookbook
     */
    public static function createCookbook($cookbook_data)
    {
        try {
            $pdo = Database::getConnection();

            // Generate ID
            $cookbook_id = UUIDHelper::makeId();

            // Insert cookbook
            $sql = "INSERT INTO cookbooks (id, user_id, name, description, is_public, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $cookbook_id,
                $cookbook_data['user_id'],
                $cookbook_data['name'],
                $cookbook_data['description'] ?? null,
                $cookbook_data['is_public'] ?? false
            ]);

            return $cookbook_id;
        } catch (PDOException $e) {
            error_log("Create cookbook error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Add recipe to cookbook
     */
    public static function addRecipeToCookbook($cookbook_id, $recipe_id, $user_id)
    {
        try {
            $pdo = Database::getConnection();

            // Check if cookbook exists and belongs to user
            $checkStmt = $pdo->prepare("SELECT user_id FROM cookbooks WHERE id = ?");
            $checkStmt->execute([$cookbook_id]);
            $cookbook = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if (!$cookbook) {
                throw new Exception("Cookbook not found");
            }

            if ($cookbook['user_id'] != $user_id) {
                throw new Exception("You don't have permission to add recipes to this cookbook");
            }

            // Check if recipe exists
            $recipeStmt = $pdo->prepare("SELECT id FROM recipes WHERE id = ?");
            $recipeStmt->execute([$recipe_id]);

            if (!$recipeStmt->fetch()) {
                throw new Exception("Recipe not found");
            }

            // Check if recipe already in cookbook
            $duplicateStmt = $pdo->prepare("SELECT id FROM cookbook_recipes WHERE cookbook_id = ? AND recipe_id = ?");
            $duplicateStmt->execute([$cookbook_id, $recipe_id]);

            if ($duplicateStmt->fetch()) {
                throw new Exception("Recipe already in cookbook");
            }

            // Add recipe to cookbook
            $entry_id = UUIDHelper::makeId();
            $insertStmt = $pdo->prepare("
            INSERT INTO cookbook_recipes (id, cookbook_id, recipe_id, added_by, added_at) 
            VALUES (?, ?, ?, ?, NOW())
        ");
            $insertStmt->execute([$entry_id, $cookbook_id, $recipe_id, $user_id]);

            // Update cookbook's updated_at timestamp
            $updateStmt = $pdo->prepare("UPDATE cookbooks SET updated_at = NOW() WHERE id = ?");
            $updateStmt->execute([$cookbook_id]);

            return $entry_id;
        } catch (Exception $e) {
            error_log("Add recipe to cookbook error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get recipes in a cookbook
     */
    public static function getCookbookRecipes($cookbook_id, $limit = 50, $offset = 0)
    {
        try {
            $pdo = Database::getConnection();

            // Get cookbook info
            $cookbookStmt = $pdo->prepare("
            SELECT cb.*, u.full_name as owner_name, u.profile_picture as owner_picture
            FROM cookbooks cb
            JOIN users u ON cb.user_id = u.id
            WHERE cb.id = ?
        ");
            $cookbookStmt->execute([$cookbook_id]);
            $cookbook = $cookbookStmt->fetch(PDO::FETCH_ASSOC);

            if (!$cookbook) {
                throw new Exception("Cookbook not found");
            }

            // Get recipes in cookbook with details
            $recipesStmt = $pdo->prepare("
            SELECT 
                r.*,
                u.full_name as author_name,
                u.profile_picture as author_picture,
                rm.like_count,
                rm.dislike_count,
                rm.cook_count,
                cr.added_at as added_to_cookbook_at,
                cr.notes as cookbook_notes
            FROM cookbook_recipes cr
            JOIN recipes r ON cr.recipe_id = r.id
            JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id
            WHERE cr.cookbook_id = ?
            ORDER BY cr.added_at DESC
            LIMIT ? OFFSET ?
        ");

            $recipesStmt->execute([$cookbook_id, $limit, $offset]);
            $recipes = $recipesStmt->fetchAll(PDO::FETCH_ASSOC);

            // Get total count for pagination
            $countStmt = $pdo->prepare("SELECT COUNT(*) as total FROM cookbook_recipes WHERE cookbook_id = ?");
            $countStmt->execute([$cookbook_id]);
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

            return [
                'cookbook' => $cookbook,
                'recipes' => $recipes,
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset
            ];
        } catch (Exception $e) {
            error_log("Get cookbook recipes error: " . $e->getMessage());
            return false;
        }
    }
}
