<?php

/**
 * DatabaseHelper Class - Complete implementation matching index.md
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/uuidHelper.php';

class DatabaseHelper
{
    // User Operations
    public static function registerUser($user_data)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        $user_id = generateUniqueId('users', 'id');
        $user_record = [
            'id' => $user_id,
            'full_name' => $user_data['full_name'],
            'email' => $user_data['email'],
            'password_hash' => $user_data['password_hash'],
            'age' => $user_data['age'] ?? null,
            'gender' => $user_data['gender'] ?? null,
            'profile_picture' => $user_data['profile_picture'] ?? null
        ];

        if (!Database::insert('users', $user_record)) return $pdo->rollBack() && false;

        $stats_id = generateUniqueId('user_stats', 'id');
        $stats_data = [
            'id' => $stats_id,
            'user_id' => $user_id,
            'login_streak' => 0,
            'level' => 1,
            'current_exp' => 0,
            'current_level_ceiling' => 100,
            'gold_count' => 0,
            'gem_count' => 0,
            'recipes_created' => 0,
            'recipes_cooked' => 0,
            'challenges_completed' => 0,
            'recipes_sold' => 0,
            'total_cooking_time' => 0,
            'max_exp_reward' => 100,
            'max_gold_reward' => 50,
            'max_gem_reward' => 5,
            'max_gold_price' => 100,
            'max_gem_price' => 10,
            'last_limit_update' => date('Y-m-d H:i:s')
        ];

        if (!Database::insert('user_stats', $stats_data)) return $pdo->rollBack() && false;

        $pdo->commit();
        return $user_id;
    }

    public static function validateUserLogin($email, $password)
    {
        $sql = "SELECT u.*, us.* FROM users u LEFT JOIN user_stats us ON u.id = us.user_id WHERE u.email = :email";
        $user = Database::fetchOne($sql, ['email' => $email]);

        if (!$user || !password_verify($password, $user['password_hash'])) return false;

        unset($user['password_hash']);
        return $user;
    }

    public static function getUserById($user_id)
    {
        $sql = "SELECT u.*, us.* FROM users u LEFT JOIN user_stats us ON u.id = us.user_id WHERE u.id = :user_id";
        $user = Database::fetchOne($sql, ['user_id' => $user_id]);
        if ($user) unset($user['password_hash']);
        return $user;
    }

    public static function updateUserProfile($user_id, $data)
    {
        $allowed = ['full_name', 'age', 'gender', 'profile_picture'];
        $update_data = array_intersect_key($data, array_flip($allowed));
        return Database::update('users', $update_data, "id = '$user_id'") > 0;
    }

    public static function searchUsers($query, $limit = 20, $offset = 0)
    {
        $sql = "SELECT u.id, u.full_name, u.profile_picture, us.level FROM users u 
                LEFT JOIN user_stats us ON u.id = us.user_id 
                WHERE u.full_name LIKE :query LIMIT :limit OFFSET :offset";
        return Database::fetchAll($sql, ['query' => "%$query%", 'limit' => $limit, 'offset' => $offset]);
    }

    // User Stats Operations
    public static function getUserStats($user_id)
    {
        return Database::fetchOne("SELECT * FROM user_stats WHERE user_id = :user_id", ['user_id' => $user_id]);
    }

    public static function updateUserStats($user_id, $updates)
    {
        return Database::update('user_stats', $updates, "user_id = '$user_id'") > 0;
    }

    public static function incrementUserStat($user_id, $field, $amount)
    {
        $sql = "UPDATE user_stats SET $field = $field + :amount WHERE user_id = :user_id";
        return Database::query($sql, ['user_id' => $user_id, 'amount' => $amount]);
    }

    // Recipe Operations
    public static function createRecipe($recipe_data, $ingredients, $steps)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        $recipe_id = generateUniqueId('recipes', 'id');
        $recipe_data['id'] = $recipe_id;

        if (!Database::insert('recipes', $recipe_data)) return $pdo->rollBack() && false;

        foreach ($ingredients as $index => $ingredient) {
            $ingredient['id'] = generateUniqueId('recipe_ingredients', 'id');
            $ingredient['recipe_id'] = $recipe_id;
            $ingredient['order_index'] = $index;
            if (!Database::insert('recipe_ingredients', $ingredient)) return $pdo->rollBack() && false;
        }

        foreach ($steps as $index => $step) {
            $step['id'] = generateUniqueId('recipe_steps', 'id');
            $step['recipe_id'] = $recipe_id;
            $step['order_index'] = $index;
            if (!Database::insert('recipe_steps', $step)) return $pdo->rollBack() && false;
        }

        $metadata_id = generateUniqueId('recipe_metadata', 'id');
        $metadata = [
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
            'total_fat' => $recipe_data['total_fat'] ?? 0
        ];

        if (!Database::insert('recipe_metadata', $metadata)) return $pdo->rollBack() && false;

        $pdo->commit();
        return $recipe_id;
    }

    public static function getRecipe($recipe_id, $user_id = null)
    {
        $sql = "SELECT r.*, rm.*, u.full_name as creator_name FROM recipes r 
                LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id 
                LEFT JOIN users u ON r.user_id = u.id WHERE r.id = :recipe_id";

        $recipe = Database::fetchOne($sql, ['recipe_id' => $recipe_id]);
        if (!$recipe) return false;

        $recipe['ingredients'] = Database::fetchAll(
            "SELECT * FROM recipe_ingredients WHERE recipe_id = :recipe_id ORDER BY order_index",
            ['recipe_id' => $recipe_id]
        );

        $recipe['steps'] = Database::fetchAll(
            "SELECT * FROM recipe_steps WHERE recipe_id = :recipe_id ORDER BY order_index",
            ['recipe_id' => $recipe_id]
        );

        if ($user_id) $recipe['has_access'] = self::checkRecipeAccess($user_id, $recipe_id);

        return $recipe;
    }

    public static function updateRecipe($recipe_id, $recipe_data, $ingredients = [], $steps = [])
    {
        return Database::update('recipes', $recipe_data, "id = '$recipe_id'") > 0;
    }

    public static function deleteRecipe($recipe_id)
    {
        return Database::delete('recipes', "id = '$recipe_id'") > 0;
    }

    public static function getRecipes($filters = [], $limit = 20, $offset = 0)
    {
        $where = ['r.is_public = 1'];
        $params = ['limit' => $limit, 'offset' => $offset];

        if (!empty($filters['difficulty'])) {
            $where[] = "r.difficulty = :difficulty";
            $params['difficulty'] = $filters['difficulty'];
        }

        $sql = "SELECT r.*, rm.*, u.full_name as creator_name FROM recipes r 
                LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id 
                LEFT JOIN users u ON r.user_id = u.id 
                WHERE " . implode(' AND ', $where) . " LIMIT :limit OFFSET :offset";

        return Database::fetchAll($sql, $params);
    }

    public static function purchaseRecipe($user_id, $recipe_id, $currency_type, $price)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        $currency_field = $currency_type . '_count';
        $sql = "UPDATE user_stats SET $currency_field = $currency_field - :price WHERE user_id = :user_id AND $currency_field >= :price";
        if (!Database::query($sql, ['user_id' => $user_id, 'price' => $price])) return $pdo->rollBack() && false;

        $purchase_id = generateUniqueId('user_recipe_purchases', 'id');
        $purchase_data = [
            'id' => $purchase_id,
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'purchased_at' => date('Y-m-d H:i:s'),
            'currency_used' => $currency_type,
            'price_paid' => $price
        ];

        if (!Database::insert('user_recipe_purchases', $purchase_data)) return $pdo->rollBack() && false;

        Database::query("UPDATE recipe_metadata SET purchase_count = purchase_count + 1 WHERE recipe_id = :recipe_id", ['recipe_id' => $recipe_id]);

        $pdo->commit();
        return true;
    }

    public static function checkRecipeAccess($user_id, $recipe_id)
    {
        if (Database::fetchOne("SELECT 1 FROM recipes WHERE id = :recipe_id AND user_id = :user_id", ['recipe_id' => $recipe_id, 'user_id' => $user_id])) {
            return ['has_access' => true, 'access_type' => 'creator'];
        }

        if (Database::fetchOne("SELECT 1 FROM user_recipe_purchases WHERE recipe_id = :recipe_id AND user_id = :user_id", ['recipe_id' => $recipe_id, 'user_id' => $user_id])) {
            return ['has_access' => true, 'access_type' => 'purchased'];
        }

        if (Database::fetchOne("SELECT 1 FROM recipes WHERE id = :recipe_id AND is_paid = 0", ['recipe_id' => $recipe_id])) {
            return ['has_access' => true, 'access_type' => 'free'];
        }

        return ['has_access' => false];
    }

    // Recipe Interactions
    public static function handleRecipeInteraction($user_id, $recipe_id, $interaction_type, $metadata = [])
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        $sql = "SELECT id FROM recipe_interactions WHERE user_id = :user_id AND recipe_id = :recipe_id AND interaction_type = :type";
        $existing = Database::fetchOne($sql, ['user_id' => $user_id, 'recipe_id' => $recipe_id, 'type' => $interaction_type]);

        if ($existing) {
            Database::delete('recipe_interactions', "id = '{$existing['id']}'");
            $field = $interaction_type . '_count';
            Database::query("UPDATE recipe_metadata SET $field = $field - 1 WHERE recipe_id = :recipe_id", ['recipe_id' => $recipe_id]);
        } else {
            $interaction_id = generateUniqueId('recipe_interactions', 'id');
            $interaction_data = [
                'id' => $interaction_id,
                'user_id' => $user_id,
                'recipe_id' => $recipe_id,
                'interaction_type' => $interaction_type,
                'metadata' => json_encode($metadata)
            ];

            if (!Database::insert('recipe_interactions', $interaction_data)) return $pdo->rollBack() && false;

            $field = $interaction_type . '_count';
            Database::query("UPDATE recipe_metadata SET $field = $field + 1 WHERE recipe_id = :recipe_id", ['recipe_id' => $recipe_id]);
        }

        $pdo->commit();
        return true;
    }

    public static function getRecipeInteractions($recipe_id)
    {
        $sql = "SELECT interaction_type, COUNT(*) as count FROM recipe_interactions WHERE recipe_id = :recipe_id GROUP BY interaction_type";
        return Database::fetchAll($sql, ['recipe_id' => $recipe_id]);
    }

    // Cooking Session Operations
    public static function createCookingSession($session_data)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        $session_id = generateUniqueId('cooking_sessions', 'id');
        $session_data['id'] = $session_id;

        if (!Database::insert('cooking_sessions', $session_data)) return $pdo->rollBack() && false;

        $details_id = generateUniqueId('cooking_session_details', 'id');
        $details_data = [
            'id' => $details_id,
            'cooking_session_id' => $session_id,
            'current_step_index' => 0,
            'total_steps' => $session_data['total_steps'] ?? 0,
            'completed_steps' => 0
        ];

        if (!Database::insert('cooking_session_details', $details_data)) return $pdo->rollBack() && false;

        $participant_id = generateUniqueId('cooking_session_participants', 'id');
        $participant_data = [
            'id' => $participant_id,
            'cooking_session_id' => $session_id,
            'user_id' => $session_data['host_id'],
            'role' => 'host',
            'status' => 'joined'
        ];

        if (!Database::insert('cooking_session_participants', $participant_data)) return $pdo->rollBack() && false;

        $pdo->commit();
        return $session_id;
    }

    public static function getCookingSession($session_id)
    {
        $sql = "SELECT cs.*, csd.*, r.title as recipe_title, u.full_name as host_name 
                FROM cooking_sessions cs LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id 
                LEFT JOIN recipes r ON cs.recipe_id = r.id LEFT JOIN users u ON cs.host_id = u.id 
                WHERE cs.id = :session_id";
        return Database::fetchOne($sql, ['session_id' => $session_id]);
    }

    public static function updateCookingSession($session_id, $updates)
    {
        return Database::update('cooking_sessions', $updates, "id = '$session_id'") > 0;
    }

    public static function joinCookingSession($session_id, $user_id)
    {
        if (Database::fetchOne(
            "SELECT 1 FROM cooking_session_participants WHERE cooking_session_id = :session_id AND user_id = :user_id",
            ['session_id' => $session_id, 'user_id' => $user_id]
        )) return true;

        $participant_id = generateUniqueId('cooking_session_participants', 'id');
        $participant_data = [
            'id' => $participant_id,
            'cooking_session_id' => $session_id,
            'user_id' => $user_id,
            'role' => 'participant',
            'status' => 'joined'
        ];

        return Database::insert('cooking_session_participants', $participant_data);
    }

    public static function completeCookingStep($session_id, $step_id, $user_id, $completion_data)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        $completion_id = generateUniqueId('cooking_step_completions', 'id');
        $completion_data['id'] = $completion_id;
        $completion_data['cooking_session_id'] = $session_id;
        $completion_data['recipe_step_id'] = $step_id;
        $completion_data['completed_at'] = date('Y-m-d H:i:s');

        if (!Database::insert('cooking_step_completions', $completion_data)) return $pdo->rollBack() && false;

        Database::query("UPDATE cooking_session_details SET completed_steps = completed_steps + 1, current_step_index = current_step_index + 1 WHERE cooking_session_id = :session_id", ['session_id' => $session_id]);

        $pdo->commit();
        return true;
    }

    public static function getUserSessionHistory($user_id, $limit = 20, $offset = 0)
    {
        $sql = "SELECT cs.*, csd.*, r.title as recipe_title FROM cooking_sessions cs 
                LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id 
                LEFT JOIN recipes r ON cs.recipe_id = r.id 
                WHERE cs.host_id = :user_id OR cs.id IN (
                    SELECT cooking_session_id FROM cooking_session_participants WHERE user_id = :user_id2
                ) ORDER BY cs.created_at DESC LIMIT :limit OFFSET :offset";

        return Database::fetchAll($sql, ['user_id' => $user_id, 'user_id2' => $user_id, 'limit' => $limit, 'offset' => $offset]);
    }

    public static function getSessionStatistics($user_id)
    {
        $sql = "SELECT COUNT(*) as total_sessions, SUM(csd.cook_duration) as total_cooking_time,
                SUM(csd.exp_earned) as total_exp_earned, SUM(csd.gold_earned) as total_gold_earned,
                SUM(csd.gems_earned) as total_gems_earned
                FROM cooking_sessions cs LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id 
                WHERE cs.host_id = :user_id OR cs.id IN (
                    SELECT cooking_session_id FROM cooking_session_participants WHERE user_id = :user_id2
                )";

        return Database::fetchOne($sql, ['user_id' => $user_id, 'user_id2' => $user_id]);
    }

    /**
     * Check if a user is participating in a cooking session
     * 
     * @param string $session_id Cooking session ID
     * @param string $user_id User ID
     * @return bool|array False if not in session, participant data if in session
     */
    public static function isUserInSession($session_id, $user_id)
    {
        try {
            $sql = "SELECT csp.*, cs.status as session_status, cs.visibility, cs.mode
                    FROM cooking_session_participants csp
                    LEFT JOIN cooking_sessions cs ON csp.cooking_session_id = cs.id
                    WHERE csp.cooking_session_id = :session_id 
                    AND csp.user_id = :user_id
                    AND csp.status != 'left'
                    AND cs.status NOT IN ('completed', 'cancelled', 'abandoned')";

            $participant = Database::fetchOne($sql, [
                'session_id' => $session_id,
                'user_id' => $user_id
            ]);

            return $participant ? $participant : false;
        } catch (Exception $e) {
            error_log('Error checking user in session: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get cooking sessions with filters and pagination
     * 
     * @param array $filters Filters to apply
     * @param int $limit Number of sessions to return
     * @param int $offset Pagination offset
     * @return array Array of cooking sessions
     */
    public static function getCookingSessions($filters = [], $limit = 20, $offset = 0)
    {
        try {
            $where = ['1=1'];
            $params = ['limit' => $limit, 'offset' => $offset];

            // Apply filters
            if (!empty($filters['user_id'])) {
                $where[] = '(cs.host_id = :user_id OR cs.id IN (
                    SELECT cooking_session_id FROM cooking_session_participants 
                    WHERE user_id = :user_id2 AND status != "left"
                ))';
                $params['user_id'] = $filters['user_id'];
                $params['user_id2'] = $filters['user_id'];
            }

            if (!empty($filters['recipe_id'])) {
                $where[] = 'cs.recipe_id = :recipe_id';
                $params['recipe_id'] = $filters['recipe_id'];
            }

            if (!empty($filters['status'])) {
                $where[] = 'cs.status = :status';
                $params['status'] = $filters['status'];
            }

            if (!empty($filters['mode'])) {
                $where[] = 'cs.mode = :mode';
                $params['mode'] = $filters['mode'];
            }

            if (!empty($filters['visibility'])) {
                $where[] = 'cs.visibility = :visibility';
                $params['visibility'] = $filters['visibility'];
            }

            // For non-authenticated users, only show public sessions
            if (empty($filters['user_id']) && !isset($filters['include_public'])) {
                $where[] = 'cs.visibility = "public"';
            }

            // Build main query
            $sql = "SELECT cs.*, 
                    r.title as recipe_title, r.cover_image as recipe_image,
                    u.full_name as host_name, u.profile_picture as host_avatar,
                    csd.current_step_index, csd.total_steps, csd.completed_steps,
                    csd.active_timer_step_id, csd.timer_ends_at,
                    (SELECT COUNT(*) FROM cooking_session_participants csp2 
                     WHERE csp2.cooking_session_id = cs.id AND csp2.status != 'left') as participant_count
                    FROM cooking_sessions cs
                    LEFT JOIN recipes r ON cs.recipe_id = r.id
                    LEFT JOIN users u ON cs.host_id = u.id
                    LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id
                    WHERE " . implode(' AND ', $where) . "
                    ORDER BY cs.created_at DESC
                    LIMIT :limit OFFSET :offset";

            $sessions = Database::fetchAll($sql, $params);

            // Get participants for each session
            foreach ($sessions as &$session) {
                $participants_sql = "SELECT csp.*, u.full_name, u.profile_picture, us.level
                                     FROM cooking_session_participants csp
                                     LEFT JOIN users u ON csp.user_id = u.id
                                     LEFT JOIN user_stats us ON u.id = us.user_id
                                     WHERE csp.cooking_session_id = :session_id 
                                     AND csp.status != 'left'
                                     ORDER BY 
                                        CASE WHEN csp.role = 'host' THEN 1 
                                             WHEN csp.role = 'participant' THEN 2
                                             ELSE 3 END,
                                        csp.joined_at";

                $session['participants'] = Database::fetchAll($participants_sql, [
                    'session_id' => $session['id']
                ]);

                // Get recent chat messages
                $chat_sql = "SELECT scm.*, u.full_name, u.profile_picture
                             FROM session_chat_messages scm
                             LEFT JOIN users u ON scm.user_id = u.id
                             WHERE scm.cooking_session_id = :session_id
                             ORDER BY scm.created_at DESC
                             LIMIT 10";

                $session['recent_chat'] = Database::fetchAll($chat_sql, [
                    'session_id' => $session['id']
                ]);
            }

            return $sessions;
        } catch (Exception $e) {
            error_log('Error getting cooking sessions: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get total count of cooking sessions matching filters
     * 
     * @param array $filters Filters to apply
     * @return int Total count
     */
    public static function getCookingSessionsCount($filters = [])
    {
        try {
            $where = ['1=1'];
            $params = [];

            // Apply filters (same as getCookingSessions)
            if (!empty($filters['user_id'])) {
                $where[] = '(cs.host_id = :user_id OR cs.id IN (
                    SELECT cooking_session_id FROM cooking_session_participants 
                    WHERE user_id = :user_id2 AND status != "left"
                ))';
                $params['user_id'] = $filters['user_id'];
                $params['user_id2'] = $filters['user_id'];
            }

            if (!empty($filters['recipe_id'])) {
                $where[] = 'cs.recipe_id = :recipe_id';
                $params['recipe_id'] = $filters['recipe_id'];
            }

            if (!empty($filters['status'])) {
                $where[] = 'cs.status = :status';
                $params['status'] = $filters['status'];
            }

            if (!empty($filters['mode'])) {
                $where[] = 'cs.mode = :mode';
                $params['mode'] = $filters['mode'];
            }

            if (!empty($filters['visibility'])) {
                $where[] = 'cs.visibility = :visibility';
                $params['visibility'] = $filters['visibility'];
            }

            // For non-authenticated users, only show public sessions
            if (empty($filters['user_id']) && !isset($filters['include_public'])) {
                $where[] = 'cs.visibility = "public"';
            }

            $sql = "SELECT COUNT(DISTINCT cs.id) as total
                    FROM cooking_sessions cs
                    WHERE " . implode(' AND ', $where);

            $result = Database::fetchOne($sql, $params);
            return $result['total'] ?? 0;
        } catch (Exception $e) {
            error_log('Error getting cooking sessions count: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get vote results for a specific vote type in a session
     * 
     * @param string $session_id Cooking session ID
     * @param string $vote_type Vote type (skip_read_timer, skip_step, other)
     * @return array Vote results
     */
    public static function getSessionVoteResults($session_id, $vote_type)
    {
        try {
            // Get total vote counts
            $sql = "SELECT 
                    COUNT(CASE WHEN vote_value = 1 THEN 1 END) as yes_votes,
                    COUNT(CASE WHEN vote_value = 0 THEN 1 END) as no_votes,
                    COUNT(*) as total_votes,
                    COUNT(DISTINCT user_id) as unique_voters
                    FROM cooking_session_votes
                    WHERE cooking_session_id = :session_id 
                    AND vote_type = :vote_type";

            $result = Database::fetchOne($sql, [
                'session_id' => $session_id,
                'vote_type' => $vote_type
            ]);

            // Get participant count
            $participant_sql = "SELECT COUNT(*) as participant_count
                                FROM cooking_session_participants
                                WHERE cooking_session_id = :session_id 
                                AND status != 'left'";

            $participant_result = Database::fetchOne($participant_sql, [
                'session_id' => $session_id
            ]);

            $participant_count = $participant_result['participant_count'] ?? 0;

            // Get individual votes with user info
            $votes_sql = "SELECT csv.*, u.full_name, u.profile_picture
                          FROM cooking_session_votes csv
                          LEFT JOIN users u ON csv.user_id = u.id
                          WHERE csv.cooking_session_id = :session_id 
                          AND csv.vote_type = :vote_type
                          ORDER BY csv.created_at DESC";

            $votes = Database::fetchAll($votes_sql, [
                'session_id' => $session_id,
                'vote_type' => $vote_type
            ]);

            return [
                'session_id' => $session_id,
                'vote_type' => $vote_type,
                'yes_votes' => $result['yes_votes'] ?? 0,
                'no_votes' => $result['no_votes'] ?? 0,
                'total_votes' => $result['total_votes'] ?? 0,
                'unique_voters' => $result['unique_voters'] ?? 0,
                'participant_count' => $participant_count,
                'yes_percentage' => $participant_count > 0 ? round(($result['yes_votes'] ?? 0) / $participant_count * 100, 1) : 0,
                'votes_needed' => $participant_count > 0 ? ceil($participant_count * 0.51) : 1, // 51% majority
                'individual_votes' => $votes,
                'has_majority' => ($result['yes_votes'] ?? 0) >= ceil($participant_count * 0.51),
                'has_quorum' => ($result['total_votes'] ?? 0) >= ceil($participant_count * 0.5), // 50% quorum
                'updated_at' => date('Y-m-d H:i:s')
            ];
        } catch (Exception $e) {
            error_log('Error getting session vote results: ' . $e->getMessage());
            return [
                'session_id' => $session_id,
                'vote_type' => $vote_type,
                'yes_votes' => 0,
                'no_votes' => 0,
                'total_votes' => 0,
                'unique_voters' => 0,
                'participant_count' => 0,
                'yes_percentage' => 0,
                'votes_needed' => 1,
                'individual_votes' => [],
                'has_majority' => false,
                'has_quorum' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    // Relationship Operations
    public static function manageRelationship($source_user_id, $target_user_id, $action, $data = [])
    {
        $sql = "SELECT id FROM user_relationships WHERE source_user_id = :source_id AND target_user_id = :target_id AND relationship_type = :type";
        $existing = Database::fetchOne($sql, ['source_id' => $source_user_id, 'target_id' => $target_user_id, 'type' => $data['type'] ?? 'following']);

        if ($action === 'create') {
            if ($existing) {
                return Database::update('user_relationships', ['status' => $data['status'] ?? 'pending'], "id = '{$existing['id']}'") > 0;
            } else {
                $relationship_id = generateUniqueId('user_relationships', 'id');
                $relationship_data = [
                    'id' => $relationship_id,
                    'source_user_id' => $source_user_id,
                    'target_user_id' => $target_user_id,
                    'relationship_type' => $data['type'] ?? 'following',
                    'status' => $data['status'] ?? 'pending'
                ];
                return Database::insert('user_relationships', $relationship_data);
            }
        } elseif ($action === 'delete') {
            return $existing ? Database::delete('user_relationships', "id = '{$existing['id']}'") > 0 : true;
        }

        return false;
    }

    public static function getRelationships($user_id, $type = 'following', $limit = 50)
    {
        $sql = "SELECT ur.*, u.full_name, u.profile_picture, us.level FROM user_relationships ur 
                LEFT JOIN users u ON ur.target_user_id = u.id LEFT JOIN user_stats us ON u.id = us.user_id 
                WHERE ur.source_user_id = :user_id AND ur.relationship_type = :type LIMIT :limit";
        return Database::fetchAll($sql, ['user_id' => $user_id, 'type' => $type, 'limit' => $limit]);
    }

    public static function updateRelationshipStatus($relationship_id, $status)
    {
        return Database::update('user_relationships', ['status' => $status], "id = '$relationship_id'") > 0;
    }

    /**
     * Check if one user is following another
     * 
     * @param string $source_user_id User who might be following
     * @param string $target_user_id User who might be followed
     * @return bool True if following, false otherwise
     */
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

            return ($result['count'] ?? 0) > 0;
        } catch (Exception $e) {
            error_log('Error checking follow status: ' . $e->getMessage());
            return false;
        }
    }

    // Cookbook Operations
    public static function createCookbook($cookbook_data)
    {
        $cookbook_id = generateUniqueId('cookbooks', 'id');
        $cookbook_data['id'] = $cookbook_id;
        return Database::insert('cookbooks', $cookbook_data) ? $cookbook_id : false;
    }

    public static function getCookbook($cookbook_id, $include_recipes = true)
    {
        $sql = "SELECT c.*, u.full_name as owner_name FROM cookbooks c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = :cookbook_id";
        $cookbook = Database::fetchOne($sql, ['cookbook_id' => $cookbook_id]);

        if ($cookbook && $include_recipes) {
            $sql = "SELECT r.* FROM recipes r INNER JOIN cookbook_recipes cr ON r.id = cr.recipe_id WHERE cr.cookbook_id = :cookbook_id";
            $cookbook['recipes'] = Database::fetchAll($sql, ['cookbook_id' => $cookbook_id]);
        }

        return $cookbook;
    }

    public static function updateCookbook($cookbook_id, $updates)
    {
        return Database::update('cookbooks', $updates, "id = '$cookbook_id'") > 0;
    }

    public static function manageCookbookRecipe($cookbook_id, $recipe_id, $action, $user_id)
    {
        if ($action === 'add') {
            if (Database::fetchOne(
                "SELECT 1 FROM cookbook_recipes WHERE cookbook_id = :cookbook_id AND recipe_id = :recipe_id",
                ['cookbook_id' => $cookbook_id, 'recipe_id' => $recipe_id]
            )) return true;

            $entry_id = generateUniqueId('cookbook_recipes', 'id');
            $entry_data = ['id' => $entry_id, 'cookbook_id' => $cookbook_id, 'recipe_id' => $recipe_id, 'added_by' => $user_id];
            return Database::insert('cookbook_recipes', $entry_data);
        } else {
            return Database::delete('cookbook_recipes', "cookbook_id = '$cookbook_id' AND recipe_id = '$recipe_id'") > 0;
        }
    }

    /**
     * Check if a recipe already exists in a cookbook
     * 
     * @param string $cookbook_id Cookbook ID
     * @param string $recipe_id Recipe ID
     * @return bool|array False if not found, array of entry data if found
     */
    public static function checkRecipeInCookbook($cookbook_id, $recipe_id)
    {
        try {
            $sql = "SELECT cr.*, r.title as recipe_title, c.name as cookbook_name 
                    FROM cookbook_recipes cr 
                    LEFT JOIN recipes r ON cr.recipe_id = r.id 
                    LEFT JOIN cookbooks c ON cr.cookbook_id = c.id 
                    WHERE cr.cookbook_id = :cookbook_id AND cr.recipe_id = :recipe_id";

            $result = Database::fetchOne($sql, [
                'cookbook_id' => $cookbook_id,
                'recipe_id' => $recipe_id
            ]);

            return $result ? $result : false;
        } catch (Exception $e) {
            error_log('Error checking recipe in cookbook: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get cookbooks with optional filtering
     * 
     * @param array $filters Filters to apply (user_id, is_public, etc.)
     * @param int $limit Number of cookbooks to return
     * @param int $offset Pagination offset
     * @return array Array of cookbooks
     */
    public static function getCookbooks($filters = [], $limit = 20, $offset = 0)
    {
        try {
            $where = ['1=1'];
            $params = ['limit' => $limit, 'offset' => $offset];

            // Apply filters
            if (!empty($filters['user_id'])) {
                $where[] = 'c.user_id = :user_id';
                $params['user_id'] = $filters['user_id'];
            }

            if (isset($filters['is_public'])) {
                $where[] = 'c.is_public = :is_public';
                $params['is_public'] = $filters['is_public'] ? 1 : 0;
            }

            if (!empty($filters['search'])) {
                $where[] = '(c.name LIKE :search OR c.description LIKE :search)';
                $params['search'] = '%' . $filters['search'] . '%';
            }

            // Build SQL query
            $sql = "SELECT c.*, u.full_name as owner_name, 
                    COUNT(cr.recipe_id) as recipe_count,
                    MAX(cr.added_at) as last_recipe_added
                    FROM cookbooks c
                    LEFT JOIN users u ON c.user_id = u.id
                    LEFT JOIN cookbook_recipes cr ON c.id = cr.cookbook_id
                    WHERE " . implode(' AND ', $where) . "
                    GROUP BY c.id
                    ORDER BY c.created_at DESC
                    LIMIT :limit OFFSET :offset";

            $cookbooks = Database::fetchAll($sql, $params);

            // Get recipe counts for each cookbook
            foreach ($cookbooks as &$cookbook) {
                $recipe_sql = "SELECT COUNT(*) as count FROM cookbook_recipes WHERE cookbook_id = :cookbook_id";
                $recipe_count = Database::fetchOne($recipe_sql, ['cookbook_id' => $cookbook['id']]);
                $cookbook['recipe_count'] = $recipe_count['count'] ?? 0;
            }

            return $cookbooks;
        } catch (Exception $e) {
            error_log('Error getting cookbooks: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get user's cookbooks with additional options
     * (Enhanced version of existing getUserCookbooks with pagination)
     * 
     * @param string $user_id User ID
     * @param bool $include_public Include public cookbooks from other users
     * @param int $limit Number of cookbooks to return
     * @param int $offset Pagination offset
     * @return array Array of cookbooks
     */
    public static function getUserCookbooks($user_id, $include_public = false, $limit = 20, $offset = 0)
    {
        try {
            // If including public, get user's cookbooks plus public ones
            if ($include_public) {
                $sql = "SELECT c.*, u.full_name as owner_name,
                        CASE WHEN c.user_id = :user_id THEN 'owner' ELSE 'public' END as access_level,
                        COUNT(cr.recipe_id) as recipe_count
                        FROM cookbooks c
                        LEFT JOIN users u ON c.user_id = u.id
                        LEFT JOIN cookbook_recipes cr ON c.id = cr.cookbook_id
                        WHERE (c.user_id = :user_id OR c.is_public = 1)
                        GROUP BY c.id
                        ORDER BY 
                            CASE WHEN c.user_id = :user_id THEN 0 ELSE 1 END,
                            c.created_at DESC
                        LIMIT :limit OFFSET :offset";

                $params = [
                    'user_id' => $user_id,
                    'limit' => $limit,
                    'offset' => $offset
                ];
            } else {
                // Only user's own cookbooks
                $sql = "SELECT c.*, u.full_name as owner_name,
                        COUNT(cr.recipe_id) as recipe_count
                        FROM cookbooks c
                        LEFT JOIN users u ON c.user_id = u.id
                        LEFT JOIN cookbook_recipes cr ON c.id = cr.cookbook_id
                        WHERE c.user_id = :user_id
                        GROUP BY c.id
                        ORDER BY c.created_at DESC
                        LIMIT :limit OFFSET :offset";

                $params = [
                    'user_id' => $user_id,
                    'limit' => $limit,
                    'offset' => $offset
                ];
            }

            $cookbooks = Database::fetchAll($sql, $params);

            // Add recipe details for each cookbook
            foreach ($cookbooks as &$cookbook) {
                $recipes_sql = "SELECT r.id, r.title, r.cover_image, r.difficulty, r.preparation_time, r.cooking_time
                                FROM cookbook_recipes cr
                                LEFT JOIN recipes r ON cr.recipe_id = r.id
                                WHERE cr.cookbook_id = :cookbook_id
                                ORDER BY cr.added_at DESC
                                LIMIT 5";

                $cookbook['recent_recipes'] = Database::fetchAll($recipes_sql, ['cookbook_id' => $cookbook['id']]);
            }

            return $cookbooks;
        } catch (Exception $e) {
            error_log('Error getting user cookbooks: ' . $e->getMessage());
            return [];
        }
    }

    // Shop & Inventory Operations
    public static function getShopItems($filters = [], $limit = 50)
    {
        $where = ['is_available = 1'];
        $params = ['limit' => $limit];

        if (!empty($filters['category'])) {
            $where[] = "category = :category";
            $params['category'] = $filters['category'];
        }

        if (!empty($filters['item_type'])) {
            $where[] = "item_type = :item_type";
            $params['item_type'] = $filters['item_type'];
        }

        $sql = "SELECT * FROM shop_items WHERE " . implode(' AND ', $where) . " ORDER BY category, name LIMIT :limit";
        return Database::fetchAll($sql, $params);
    }



    public static function purchaseShopItem($user_id, $item_id, $currency_type, $price)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        try {
            // Get item
            $item = Database::fetchOne(
                "SELECT * FROM shop_items WHERE id = :item_id AND is_available = 1",
                ['item_id' => $item_id]
            );

            if (!$item) {
                $pdo->rollBack();
                return false;
            }

            // Check user currency
            $currency_field = $currency_type . '_count';
            $user_currency = Database::fetchOne(
                "SELECT $currency_field FROM user_stats WHERE user_id = :user_id",
                ['user_id' => $user_id]
            );

            if (!$user_currency || $user_currency[$currency_field] < $price) {
                $pdo->rollBack();
                return false;
            }

            // Deduct currency
            $sql = "UPDATE user_stats SET $currency_field = $currency_field - :price WHERE user_id = :user_id";
            $deducted = Database::query($sql, ['user_id' => $user_id, 'price' => $price]);

            if (!$deducted) {
                $pdo->rollBack();
                return false;
            }

            // Record purchase
            $purchase_id = generateUniqueId('user_shop_purchases', 'id');
            $expires_at = null;
            if ($item['duration_days']) {
                $expires_at = date('Y-m-d H:i:s', strtotime("+{$item['duration_days']} days"));
            }

            $purchase_data = [
                'id' => $purchase_id,
                'user_id' => $user_id,
                'item_id' => $item_id,
                'currency_type' => $currency_type,
                'price' => $price,
                'expires_at' => $expires_at
            ];

            $purchased = Database::insert('user_shop_purchases', $purchase_data);

            if (!$purchased) {
                $pdo->rollBack();
                return false;
            }

            // Add to inventory
            $inventory_id = generateUniqueId('user_inventory', 'id');
            $inventory_data = [
                'id' => $inventory_id,
                'user_id' => $user_id,
                'item_id' => $item_id,
                'quantity' => 1,
                'expires_at' => $expires_at
            ];

            $added = Database::insert('user_inventory', $inventory_data);

            if (!$added) {
                $pdo->rollBack();
                return false;
            }

            // Update purchase count
            Database::query(
                "UPDATE shop_items SET purchase_count = purchase_count + 1 WHERE id = :item_id",
                ['item_id' => $item_id]
            );

            $pdo->commit();
            return true;
        } catch (Exception $e) {
            $pdo->rollBack();
            error_log('Purchase shop item error: ' . $e->getMessage());
            return false;
        }
    }

    public static function addToInventory($user_id, $item_id, $quantity = 1, $item_data = [])
    {
        try {
            // Check if item already exists in inventory
            $existing = Database::fetchOne(
                "SELECT id, quantity FROM user_inventory WHERE user_id = :user_id AND item_id = :item_id",
                ['user_id' => $user_id, 'item_id' => $item_id]
            );

            if ($existing) {
                // Update quantity
                return Database::query(
                    "UPDATE user_inventory SET quantity = quantity + :quantity WHERE id = :id",
                    ['id' => $existing['id'], 'quantity' => $quantity]
                );
            } else {
                // Insert new item
                $inventory_id = generateUniqueId('user_inventory', 'id');
                $inventory_data = array_merge([
                    'id' => $inventory_id,
                    'user_id' => $user_id,
                    'item_id' => $item_id,
                    'quantity' => $quantity
                ], $item_data);

                return Database::insert('user_inventory', $inventory_data);
            }
        } catch (Exception $e) {
            error_log('Add to inventory error: ' . $e->getMessage());
            return false;
        }
    }

    public static function getUserInventory($user_id, $category = null)
    {
        $sql = "SELECT ui.*, si.* FROM user_inventory ui LEFT JOIN shop_items si ON ui.item_id = si.id WHERE ui.user_id = :user_id";
        $params = ['user_id' => $user_id];

        if ($category) {
            $sql .= " AND si.category = :category";
            $params['category'] = $category;
        }

        $sql .= " ORDER BY si.category, si.name";
        return Database::fetchAll($sql, $params);
    }

    public static function useInventoryItem($user_id, $inventory_id)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        try {
            $sql = "SELECT ui.*, si.* FROM user_inventory ui LEFT JOIN shop_items si ON ui.item_id = si.id WHERE ui.id = :inventory_id AND ui.user_id = :user_id";
            $item = Database::fetchOne($sql, ['inventory_id' => $inventory_id, 'user_id' => $user_id]);

            if (!$item) {
                $pdo->rollBack();
                return false;
            }

            if ($item['quantity'] > 1) {
                // Reduce quantity
                Database::query("UPDATE user_inventory SET quantity = quantity - 1 WHERE id = :id", ['id' => $inventory_id]);
            } else {
                // Remove item
                Database::delete('user_inventory', "id = '$inventory_id'");
            }

            $pdo->commit();

            return [
                'effect_type' => $item['item_type'],
                'effect_value' => $item['effect_value'],
                'duration' => $item['duration_days'],
                'item_name' => $item['name'],
                'item_description' => $item['description'],
                'item_id' => $item['item_id'],
                'inventory_id' => $inventory_id,
                'remaining_quantity' => max(0, $item['quantity'] - 1)
            ];
        } catch (Exception $e) {
            $pdo->rollBack();
            error_log('Use inventory item error: ' . $e->getMessage());
            return false;
        }
    }

    public static function getEquippedItems($user_id)
    {
        $sql = "SELECT ui.*, si.* FROM user_inventory ui LEFT JOIN shop_items si ON ui.item_id = si.id WHERE ui.user_id = :user_id AND ui.is_equipped = 1";
        return Database::fetchAll($sql, ['user_id' => $user_id]);
    }


    /**
     * Gets detailed information about an inventory item
     * 
     * @param string $item_id Item ID from shop_items table
     * @return array Item details
     */
    public static function getItemDetails($item_id)
    {
        return Database::fetchOne("SELECT * FROM shop_items WHERE id = :item_id", ['item_id' => $item_id]);
    }

    /**
     * Gets list of possible consumable effects
     * 
     * @return array Consumable effects
     */
    public static function getConsumableEffects()
    {
        return [
            'exp_boost' => [
                'name' => 'EXP Boost',
                'description' => 'Increases EXP earned from activities',
                'max_effect' => 100
            ],
            'gold_boost' => [
                'name' => 'Gold Boost',
                'description' => 'Increases Gold earned from activities',
                'max_effect' => 100
            ],
            'stamina' => [
                'name' => 'Stamina Restore',
                'description' => 'Restores cooking stamina',
                'max_effect' => 100
            ],
            'cooking_speed' => [
                'name' => 'Cooking Speed',
                'description' => 'Reduces cooking time',
                'max_effect' => 50
            ],
            'luck' => [
                'name' => 'Luck Boost',
                'description' => 'Increases chance of rare drops',
                'max_effect' => 30
            ]
        ];
    }

    /**
     * Equips or unequips an inventory item
     * 
     * @param string $user_id User ID
     * @param string $inventory_id Inventory item ID
     * @param string $action 'equip' or 'unequip'
     * @return bool Success status
     */
    public static function equipInventoryItem($user_id, $inventory_id, $action)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();

        try {
            // Get inventory item details
            $sql = "SELECT ui.*, si.* FROM user_inventory ui 
                    LEFT JOIN shop_items si ON ui.item_id = si.id 
                    WHERE ui.id = :inventory_id AND ui.user_id = :user_id";
            $item = Database::fetchOne($sql, ['inventory_id' => $inventory_id, 'user_id' => $user_id]);

            if (!$item) {
                $pdo->rollBack();
                return false;
            }

            // Only equipment items can be equipped
            if ($item['item_type'] !== 'equipment') {
                $pdo->rollBack();
                return false;
            }

            $category = $item['category'];

            if ($action === 'equip') {
                // Unequip any other item in the same category first
                $sql = "UPDATE user_inventory ui
                        JOIN shop_items si ON ui.item_id = si.id
                        SET ui.is_equipped = 0
                        WHERE ui.user_id = :user_id 
                        AND si.category = :category 
                        AND ui.is_equipped = 1
                        AND ui.id != :inventory_id";
                Database::query($sql, [
                    'user_id' => $user_id,
                    'category' => $category,
                    'inventory_id' => $inventory_id
                ]);

                // Equip the selected item
                Database::query("UPDATE user_inventory SET is_equipped = 1 WHERE id = :id", ['id' => $inventory_id]);
            } else { // unequip
                Database::query("UPDATE user_inventory SET is_equipped = 0 WHERE id = :id", ['id' => $inventory_id]);
            }

            $pdo->commit();
            return true;
        } catch (Exception $e) {
            $pdo->rollBack();
            error_log('Equip inventory item error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Validates if a consumable can be used
     * 
     * @param string $user_id User ID
     * @param string $inventory_id Inventory item ID
     * @return array Validation result
     */
    public static function validateConsumableUse($user_id, $inventory_id)
    {
        try {
            $sql = "SELECT ui.*, si.* FROM user_inventory ui 
                    LEFT JOIN shop_items si ON ui.item_id = si.id 
                    WHERE ui.id = :inventory_id AND ui.user_id = :user_id";
            $item = Database::fetchOne($sql, ['inventory_id' => $inventory_id, 'user_id' => $user_id]);

            if (!$item) {
                return ['valid' => false, 'message' => 'Item not found'];
            }

            if ($item['item_type'] !== 'consumable') {
                return ['valid' => false, 'message' => 'Only consumable items can be used'];
            }

            if ($item['quantity'] <= 0) {
                return ['valid' => false, 'message' => 'Item quantity is zero'];
            }

            if ($item['expires_at'] && strtotime($item['expires_at']) < time()) {
                return ['valid' => false, 'message' => 'Item has expired'];
            }

            return [
                'valid' => true,
                'item' => $item,
                'can_use' => true
            ];
        } catch (Exception $e) {
            return ['valid' => false, 'message' => 'Validation error: ' . $e->getMessage()];
        }
    }

    /**
     * Logs user activity
     * 
     * @param string $user_id User ID
     * @param string $action Action type
     * @param array $details Action details
     * @return bool Success status
     */
    public static function logActivity($user_id, $action, $details = [])
    {
        try {
            // Note: This would normally insert into an activity_log table
            // For now, we'll just log to error_log for debugging
            error_log("Activity logged - User: $user_id, Action: $action, Details: " . json_encode($details));
            return true;
        } catch (Exception $e) {
            error_log('Log activity error: ' . $e->getMessage());
            return false;
        }
    }


    // Activity Feed Operations
    public static function getActivityFeed($user_id = null, $limit = 20, $offset = 0)
    {
        $following = Database::fetchAll(
            "SELECT target_user_id FROM user_relationships WHERE source_user_id = :user_id AND relationship_type = 'following' AND status = 'accepted'",
            ['user_id' => $user_id]
        );

        $following_ids = array_column($following, 'target_user_id');
        if (empty($following_ids)) $following_ids = ['0'];

        $params = ['limit' => $limit, 'offset' => $offset];
        $sql = "(
            SELECT 'recipe_created' as activity_type, r.id as target_id, r.title as title, u.full_name as user_name, u.profile_picture,
                   'created a recipe: ' || r.title as description, r.created_at as timestamp
            FROM recipes r LEFT JOIN users u ON r.user_id = u.id WHERE r.user_id IN (" . implode(',', array_fill(0, count($following_ids), '?')) . ")
            UNION ALL
            SELECT 'recipe_cooked' as activity_type, cs.id as target_id, r.title as title, u.full_name as user_name, u.profile_picture,
                   'cooked ' || r.title as description, cs.created_at as timestamp
            FROM cooking_sessions cs LEFT JOIN recipes r ON cs.recipe_id = r.id LEFT JOIN users u ON cs.host_id = u.id
            WHERE cs.host_id IN (" . implode(',', array_fill(0, count($following_ids), '?')) . ")
            UNION ALL
            SELECT 'follow' as activity_type, ur.id as target_id, u2.full_name as title, u.full_name as user_name, u.profile_picture,
                   'started following ' || u2.full_name as description, ur.created_at as timestamp
            FROM user_relationships ur LEFT JOIN users u ON ur.source_user_id = u.id LEFT JOIN users u2 ON ur.target_user_id = u2.id
            WHERE ur.source_user_id IN (" . implode(',', array_fill(0, count($following_ids), '?')) . ") AND ur.relationship_type = 'following'
        ) ORDER BY timestamp DESC LIMIT :limit OFFSET :offset";

        $all_params = array_merge($following_ids, $following_ids, $following_ids, $params);
        return Database::fetchAll($sql, $all_params);
    }

    // Voting & Chat Operations
    public static function handleSessionVote($session_id, $user_id, $vote_type, $vote_value)
    {
        $existing = Database::fetchOne(
            "SELECT id FROM cooking_session_votes WHERE cooking_session_id = :session_id AND user_id = :user_id AND vote_type = :vote_type",
            ['session_id' => $session_id, 'user_id' => $user_id, 'vote_type' => $vote_type]
        );

        if ($existing) {
            return Database::update('cooking_session_votes', ['vote_value' => $vote_value], "id = '{$existing['id']}'") > 0;
        } else {
            $vote_id = generateUniqueId('cooking_session_votes', 'id');
            $vote_data = [
                'id' => $vote_id,
                'cooking_session_id' => $session_id,
                'user_id' => $user_id,
                'vote_type' => $vote_type,
                'vote_value' => $vote_value
            ];
            return Database::insert('cooking_session_votes', $vote_data);
        }
    }

    public static function saveChatMessage($session_id, $user_id, $message, $message_type = 'text')
    {
        $message_id = generateUniqueId('session_chat_messages', 'id');
        $message_data = [
            'id' => $message_id,
            'cooking_session_id' => $session_id,
            'user_id' => $user_id,
            'message' => $message,
            'message_type' => $message_type
        ];
        return Database::insert('session_chat_messages', $message_data);
    }

    public static function getSessionChat($session_id, $limit = 100)
    {
        $sql = "SELECT scm.*, u.full_name, u.profile_picture FROM session_chat_messages scm 
                LEFT JOIN users u ON scm.user_id = u.id 
                WHERE scm.cooking_session_id = :session_id ORDER BY scm.created_at DESC LIMIT :limit";
        return Database::fetchAll($sql, ['session_id' => $session_id, 'limit' => $limit]);
    }
}
