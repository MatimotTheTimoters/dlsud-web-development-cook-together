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
}
