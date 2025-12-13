<?php
/**
 * DatabaseHelper Class - Complete implementation matching index.md
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/uuidHelper.php';

class DatabaseHelper
{
    // User Operations
    public static function registerUser($user_data) {
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
            'id' => $stats_id, 'user_id' => $user_id, 'login_streak' => 0, 'level' => 1,
            'current_exp' => 0, 'current_level_ceiling' => 100, 'gold_count' => 0,
            'gem_count' => 0, 'recipes_created' => 0, 'recipes_cooked' => 0,
            'challenges_completed' => 0, 'recipes_sold' => 0, 'total_cooking_time' => 0,
            'max_exp_reward' => 100, 'max_gold_reward' => 50, 'max_gem_reward' => 5,
            'max_gold_price' => 100, 'max_gem_price' => 10,
            'last_limit_update' => date('Y-m-d H:i:s')
        ];
        
        if (!Database::insert('user_stats', $stats_data)) return $pdo->rollBack() && false;
        
        $pdo->commit();
        return $user_id;
    }
    
    public static function validateUserLogin($email, $password) {
        $sql = "SELECT u.*, us.* FROM users u LEFT JOIN user_stats us ON u.id = us.user_id WHERE u.email = :email";
        $user = Database::fetchOne($sql, ['email' => $email]);
        
        if (!$user || !password_verify($password, $user['password_hash'])) return false;
        
        unset($user['password_hash']);
        return $user;
    }
    
    public static function getUserById($user_id) {
        $sql = "SELECT u.*, us.* FROM users u LEFT JOIN user_stats us ON u.id = us.user_id WHERE u.id = :user_id";
        $user = Database::fetchOne($sql, ['user_id' => $user_id]);
        if ($user) unset($user['password_hash']);
        return $user;
    }
    
    public static function updateUserProfile($user_id, $data) {
        $allowed = ['full_name', 'age', 'gender', 'profile_picture'];
        $update_data = array_intersect_key($data, array_flip($allowed));
        return Database::update('users', $update_data, "id = '$user_id'") > 0;
    }
    
    public static function searchUsers($query, $limit = 20, $offset = 0) {
        $sql = "SELECT u.id, u.full_name, u.profile_picture, us.level FROM users u 
                LEFT JOIN user_stats us ON u.id = us.user_id 
                WHERE u.full_name LIKE :query LIMIT :limit OFFSET :offset";
        return Database::fetchAll($sql, ['query' => "%$query%", 'limit' => $limit, 'offset' => $offset]);
    }
    
    // User Stats Operations
    public static function getUserStats($user_id) {
        return Database::fetchOne("SELECT * FROM user_stats WHERE user_id = :user_id", ['user_id' => $user_id]);
    }
    
    public static function updateUserStats($user_id, $updates) {
        return Database::update('user_stats', $updates, "user_id = '$user_id'") > 0;
    }
    
    public static function incrementUserStat($user_id, $field, $amount) {
        $sql = "UPDATE user_stats SET $field = $field + :amount WHERE user_id = :user_id";
        return Database::query($sql, ['user_id' => $user_id, 'amount' => $amount]);
    }
    
    // Recipe Operations
    public static function createRecipe($recipe_data, $ingredients, $steps) {
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
            'id' => $metadata_id, 'recipe_id' => $recipe_id, 'tags' => $recipe_data['tags'] ?? null,
            'exp_reward' => $recipe_data['exp_reward'] ?? 0, 'gold_reward' => $recipe_data['gold_reward'] ?? 0,
            'gem_reward' => $recipe_data['gem_reward'] ?? 0, 'gold_price' => $recipe_data['gold_price'] ?? 0,
            'gem_price' => $recipe_data['gem_price'] ?? 0, 'purchase_count' => 0, 'like_count' => 0,
            'dislike_count' => 0, 'cook_count' => 0, 'total_calories' => $recipe_data['total_calories'] ?? 0,
            'total_protein' => $recipe_data['total_protein'] ?? 0, 'total_carbs' => $recipe_data['total_carbs'] ?? 0,
            'total_fat' => $recipe_data['total_fat'] ?? 0
        ];
        
        if (!Database::insert('recipe_metadata', $metadata)) return $pdo->rollBack() && false;
        
        $pdo->commit();
        return $recipe_id;
    }
    
    public static function getRecipe($recipe_id, $user_id = null) {
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
    
    public static function updateRecipe($recipe_id, $recipe_data, $ingredients = [], $steps = []) {
        return Database::update('recipes', $recipe_data, "id = '$recipe_id'") > 0;
    }
    
    public static function deleteRecipe($recipe_id) {
        return Database::delete('recipes', "id = '$recipe_id'") > 0;
    }
    
    public static function getRecipes($filters = [], $limit = 20, $offset = 0) {
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
    
    public static function purchaseRecipe($user_id, $recipe_id, $currency_type, $price) {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        
        $currency_field = $currency_type . '_count';
        $sql = "UPDATE user_stats SET $currency_field = $currency_field - :price WHERE user_id = :user_id AND $currency_field >= :price";
        if (!Database::query($sql, ['user_id' => $user_id, 'price' => $price])) return $pdo->rollBack() && false;
        
        $purchase_id = generateUniqueId('user_recipe_purchases', 'id');
        $purchase_data = [
            'id' => $purchase_id, 'user_id' => $user_id, 'recipe_id' => $recipe_id,
            'purchased_at' => date('Y-m-d H:i:s'), 'currency_used' => $currency_type, 'price_paid' => $price
        ];
        
        if (!Database::insert('user_recipe_purchases', $purchase_data)) return $pdo->rollBack() && false;
        
        Database::query("UPDATE recipe_metadata SET purchase_count = purchase_count + 1 WHERE recipe_id = :recipe_id", ['recipe_id' => $recipe_id]);
        
        $pdo->commit();
        return true;
    }
    
    public static function checkRecipeAccess($user_id, $recipe_id) {
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
    public static function handleRecipeInteraction($user_id, $recipe_id, $interaction_type, $metadata = []) {
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
                'id' => $interaction_id, 'user_id' => $user_id, 'recipe_id' => $recipe_id,
                'interaction_type' => $interaction_type, 'metadata' => json_encode($metadata)
            ];
            
            if (!Database::insert('recipe_interactions', $interaction_data)) return $pdo->rollBack() && false;
            
            $field = $interaction_type . '_count';
            Database::query("UPDATE recipe_metadata SET $field = $field + 1 WHERE recipe_id = :recipe_id", ['recipe_id' => $recipe_id]);
        }
        
        $pdo->commit();
        return true;
    }
    
    public static function getRecipeInteractions($recipe_id) {
        $sql = "SELECT interaction_type, COUNT(*) as count FROM recipe_interactions WHERE recipe_id = :recipe_id GROUP BY interaction_type";
        return Database::fetchAll($sql, ['recipe_id' => $recipe_id]);
    }
    
    // Cooking Session Operations
    public static function createCookingSession($session_data) {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        
        $session_id = generateUniqueId('cooking_sessions', 'id');
        $session_data['id'] = $session_id;
        
        if (!Database::insert('cooking_sessions', $session_data)) return $pdo->rollBack() && false;
        
        $details_id = generateUniqueId('cooking_session_details', 'id');
        $details_data = [
            'id' => $details_id, 'cooking_session_id' => $session_id,
            'current_step_index' => 0, 'total_steps' => $session_data['total_steps'] ?? 0, 'completed_steps' => 0
        ];
        
        if (!Database::insert('cooking_session_details', $details_data)) return $pdo->rollBack() && false;
        
        $participant_id = generateUniqueId('cooking_session_participants', 'id');
        $participant_data = [
            'id' => $participant_id, 'cooking_session_id' => $session_id,
            'user_id' => $session_data['host_id'], 'role' => 'host', 'status' => 'joined'
        ];
        
        if (!Database::insert('cooking_session_participants', $participant_data)) return $pdo->rollBack() && false;
        
        $pdo->commit();
        return $session_id;
    }
    
    public static function getCookingSession($session_id) {
        $sql = "SELECT cs.*, csd.*, r.title as recipe_title, u.full_name as host_name 
                FROM cooking_sessions cs LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id 
                LEFT JOIN recipes r ON cs.recipe_id = r.id LEFT JOIN users u ON cs.host_id = u.id 
                WHERE cs.id = :session_id";
        return Database::fetchOne($sql, ['session_id' => $session_id]);
    }
    
    public static function updateCookingSession($session_id, $updates) {
        return Database::update('cooking_sessions', $updates, "id = '$session_id'") > 0;
    }
    
    public static function joinCookingSession($session_id, $user_id) {
        if (Database::fetchOne("SELECT 1 FROM cooking_session_participants WHERE cooking_session_id = :session_id AND user_id = :user_id", 
            ['session_id' => $session_id, 'user_id' => $user_id])) return true;
        
        $participant_id = generateUniqueId('cooking_session_participants', 'id');
        $participant_data = [
            'id' => $participant_id, 'cooking_session_id' => $session_id,
            'user_id' => $user_id, 'role' => 'participant', 'status' => 'joined'
        ];
        
        return Database::insert('cooking_session_participants', $participant_data);
    }
    
    public static function completeCookingStep($session_id, $step_id, $user_id, $completion_data) {
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
    
    public static function getUserSessionHistory($user_id, $limit = 20, $offset = 0) {
        $sql = "SELECT cs.*, csd.*, r.title as recipe_title FROM cooking_sessions cs 
                LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id 
                LEFT JOIN recipes r ON cs.recipe_id = r.id 
                WHERE cs.host_id = :user_id OR cs.id IN (
                    SELECT cooking_session_id FROM cooking_session_participants WHERE user_id = :user_id2
                ) ORDER BY cs.created_at DESC LIMIT :limit OFFSET :offset";
        
        return Database::fetchAll($sql, ['user_id' => $user_id, 'user_id2' => $user_id, 'limit' => $limit, 'offset' => $offset]);
    }
    
    public static function getSessionStatistics($user_id) {
        $sql = "SELECT COUNT(*) as total_sessions, SUM(csd.cook_duration) as total_cooking_time,
                SUM(csd.exp_earned) as total_exp_earned, SUM(csd.gold_earned) as total_gold_earned,
                SUM(csd.gems_earned) as total_gems_earned
                FROM cooking_sessions cs LEFT JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id 
                WHERE cs.host_id = :user_id OR cs.id IN (
                    SELECT cooking_session_id FROM cooking_session_participants WHERE user_id = :user_id2
                )";
        
        return Database::fetchOne($sql, ['user_id' => $user_id, 'user_id2' => $user_id]);
    }
    
    // Relationship Operations
    public static function manageRelationship($source_user_id, $target_user_id, $action, $data = []) {
        $sql = "SELECT id FROM user_relationships WHERE source_user_id = :source_id AND target_user_id = :target_id AND relationship_type = :type";
        $existing = Database::fetchOne($sql, ['source_id' => $source_user_id, 'target_id' => $target_user_id, 'type' => $data['type'] ?? 'following']);
        
        if ($action === 'create') {
            if ($existing) {
                return Database::update('user_relationships', ['status' => $data['status'] ?? 'pending'], "id = '{$existing['id']}'") > 0;
            } else {
                $relationship_id = generateUniqueId('user_relationships', 'id');
                $relationship_data = [
                    'id' => $relationship_id, 'source_user_id' => $source_user_id, 'target_user_id' => $target_user_id,
                    'relationship_type' => $data['type'] ?? 'following', 'status' => $data['status'] ?? 'pending'
                ];
                return Database::insert('user_relationships', $relationship_data);
            }
        } elseif ($action === 'delete') {
            return $existing ? Database::delete('user_relationships', "id = '{$existing['id']}'") > 0 : true;
        }
        
        return false;
    }
    
    public static function getRelationships($user_id, $type = 'following', $limit = 50) {
        $sql = "SELECT ur.*, u.full_name, u.profile_picture, us.level FROM user_relationships ur 
                LEFT JOIN users u ON ur.target_user_id = u.id LEFT JOIN user_stats us ON u.id = us.user_id 
                WHERE ur.source_user_id = :user_id AND ur.relationship_type = :type LIMIT :limit";
        return Database::fetchAll($sql, ['user_id' => $user_id, 'type' => $type, 'limit' => $limit]);
    }
    
    public static function updateRelationshipStatus($relationship_id, $status) {
        return Database::update('user_relationships', ['status' => $status], "id = '$relationship_id'") > 0;
    }
    
// Cookbook Operations
public function createCookbook(array $cookbook_data) {
    try {
        $sql = "INSERT INTO cookbooks (id, user_id, name, description, is_public) 
                VALUES (:id, :user_id, :name, :description, :is_public)";
        
        $params = [
            ':id' => $cookbook_data['id'],
            ':user_id' => $cookbook_data['user_id'],
            ':name' => $cookbook_data['name'],
            ':description' => $cookbook_data['description'],
            ':is_public' => $cookbook_data['is_public'] ? 1 : 0
        ];
        
        $stmt = $this->query($sql, $params);
        return $cookbook_data['id'];
    } catch (Exception $e) {
        error_log("Create cookbook error: " . $e->getMessage());
        return false;
    }
}

public function getCookbook(string $cookbook_id, bool $include_recipes = true) {
    try {
        // Get basic cookbook info
        $sql = "SELECT c.*, 
                       u.full_name as owner_name,
                       u.profile_picture as owner_picture,
                       COUNT(cr.id) as recipe_count
                FROM cookbooks c
                LEFT JOIN users u ON c.user_id = u.id
                LEFT JOIN cookbook_recipes cr ON c.id = cr.cookbook_id
                WHERE c.id = :cookbook_id
                GROUP BY c.id";
        
        $cookbook = $this->fetchOne($sql, [':cookbook_id' => $cookbook_id]);
        
        if (!$cookbook) {
            return false;
        }
        
        if ($include_recipes) {
            $cookbook['recipes'] = $this->getCookbookRecipes($cookbook_id);
        }
        
        return $cookbook;
    } catch (Exception $e) {
        error_log("Get cookbook error: " . $e->getMessage());
        return false;
    }
}

public function getUserCookbooks(string $user_id, bool $include_public = false, int $limit = 20, int $offset = 0) {
    try {
        if ($include_public) {
            $sql = "SELECT c.*, 
                           COUNT(cr.id) as recipe_count,
                           u.full_name as owner_name
                    FROM cookbooks c
                    LEFT JOIN cookbook_recipes cr ON c.id = cr.cookbook_id
                    LEFT JOIN users u ON c.user_id = u.id
                    WHERE c.user_id = :user_id OR c.is_public = 1
                    GROUP BY c.id
                    ORDER BY c.updated_at DESC
                    LIMIT :limit OFFSET :offset";
            
            $params = [
                ':user_id' => $user_id,
                ':limit' => $limit,
                ':offset' => $offset
            ];
        } else {
            $sql = "SELECT c.*, 
                           COUNT(cr.id) as recipe_count
                    FROM cookbooks c
                    LEFT JOIN cookbook_recipes cr ON c.id = cr.cookbook_id
                    WHERE c.user_id = :user_id
                    GROUP BY c.id
                    ORDER BY c.updated_at DESC
                    LIMIT :limit OFFSET :offset";
            
            $params = [
                ':user_id' => $user_id,
                ':limit' => $limit,
                ':offset' => $offset
            ];
        }
        
        $stmt = $this->query($sql, $params);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Get user cookbooks error: " . $e->getMessage());
        return [];
    }
}

public function getCookbooks(array $filters = [], int $limit = 20, int $offset = 0) {
    try {
        $where = [];
        $params = [];
        
        if (isset($filters['is_public'])) {
            $where[] = "c.is_public = :is_public";
            $params[':is_public'] = $filters['is_public'] ? 1 : 0;
        }
        
        if (isset($filters['user_id'])) {
            $where[] = "c.user_id = :user_id";
            $params[':user_id'] = $filters['user_id'];
        }
        
        if (isset($filters['search'])) {
            $where[] = "(c.name LIKE :search OR c.description LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }
        
        $whereClause = $where ? "WHERE " . implode(' AND ', $where) : "";
        
        $sql = "SELECT c.*, 
                       COUNT(cr.id) as recipe_count,
                       u.full_name as owner_name,
                       u.profile_picture as owner_picture
                FROM cookbooks c
                LEFT JOIN cookbook_recipes cr ON c.id = cr.cookbook_id
                LEFT JOIN users u ON c.user_id = u.id
                $whereClause
                GROUP BY c.id
                ORDER BY c.updated_at DESC
                LIMIT :limit OFFSET :offset";
        
        $params[':limit'] = $limit;
        $params[':offset'] = $offset;
        
        $stmt = $this->query($sql, $params);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Get cookbooks error: " . $e->getMessage());
        return [];
    }
    }
    
    public function manageCookbookRecipe(string $cookbook_id, string $recipe_id, string $action, string $user_id) {
        try {
            if ($action === 'add') {
                $sql = "INSERT INTO cookbook_recipes (id, cookbook_id, recipe_id, added_by) 
                        VALUES (:id, :cookbook_id, :recipe_id, :added_by)";
                
                $params = [
                    ':id' => $this->generateUniqueId('cookbook_recipes', 'id'),
                    ':cookbook_id' => $cookbook_id,
                    ':recipe_id' => $recipe_id,
                    ':added_by' => $user_id
                ];
                
                $this->query($sql, $params);
                return true;
            } elseif ($action === 'remove') {
                $sql = "DELETE FROM cookbook_recipes 
                        WHERE cookbook_id = :cookbook_id 
                        AND recipe_id = :recipe_id";
                
                $params = [
                    ':cookbook_id' => $cookbook_id,
                    ':recipe_id' => $recipe_id
                ];
                
                $this->query($sql, $params);
                return true;
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Manage cookbook recipe error: " . $e->getMessage());
            return false;
        }
    }
    
    public function checkRecipeInCookbook(string $cookbook_id, string $recipe_id) {
        try {
            $sql = "SELECT id FROM cookbook_recipes 
                    WHERE cookbook_id = :cookbook_id 
                    AND recipe_id = :recipe_id";
            
            $result = $this->fetchOne($sql, [
                ':cookbook_id' => $cookbook_id,
                ':recipe_id' => $recipe_id
            ]);
            
            return $result !== false;
        } catch (Exception $e) {
            error_log("Check recipe in cookbook error: " . $e->getMessage());
            return false;
        }
    }
    
    public function getCookbookRecipes(string $cookbook_id) {
        try {
            $sql = "SELECT r.*, 
                           rm.*,
                           u.full_name as author_name,
                           u.profile_picture as author_picture,
                           cr.added_at,
                           cr.added_by,
                           u2.full_name as added_by_name
                    FROM cookbook_recipes cr
                    JOIN recipes r ON cr.recipe_id = r.id
                    LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id
                    LEFT JOIN users u ON r.user_id = u.id
                    LEFT JOIN users u2 ON cr.added_by = u2.id
                    WHERE cr.cookbook_id = :cookbook_id
                    ORDER BY cr.added_at DESC";
            
            $stmt = $this->query($sql, [':cookbook_id' => $cookbook_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Get cookbook recipes error: " . $e->getMessage());
            return [];
        }
    }
    
    // Shop & Inventory Operations
    public static function getShopItems($filters = [], $limit = 50) {
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
        
        $sql = "SELECT * FROM shop_items WHERE " . implode(' AND ', $where) . " LIMIT :limit";
        return Database::fetchAll($sql, $params);
    }
    
    public static function purchaseShopItem($user_id, $item_id, $currency_type, $price) {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        
        $item = Database::fetchOne("SELECT * FROM shop_items WHERE id = :item_id AND is_available = 1", ['item_id' => $item_id]);
        if (!$item) return $pdo->rollBack() && false;
        
        $currency_field = $currency_type . '_count';
        $user_currency = Database::fetchOne("SELECT $currency_field FROM user_stats WHERE user_id = :user_id", ['user_id' => $user_id]);
        if (!$user_currency || $user_currency[$currency_field] < $price) return $pdo->rollBack() && false;
        
        $sql = "UPDATE user_stats SET $currency_field = $currency_field - :price WHERE user_id = :user_id";
        if (!Database::query($sql, ['user_id' => $user_id, 'price' => $price])) return $pdo->rollBack() && false;
        
        $purchase_id = generateUniqueId('user_shop_purchases', 'id');
        $purchase_data = [
            'id' => $purchase_id, 'user_id' => $user_id, 'item_id' => $item_id,
            'currency_type' => $currency_type, 'price' => $price,
            'expires_at' => $item['duration_days'] ? date('Y-m-d H:i:s', strtotime("+{$item['duration_days']} days")) : null
        ];
        
        if (!Database::insert('user_shop_purchases', $purchase_data)) return $pdo->rollBack() && false;
        
        $inventory_id = generateUniqueId('user_inventory', 'id');
        $inventory_data = [
            'id' => $inventory_id, 'user_id' => $user_id, 'item_id' => $item_id,
            'quantity' => 1, 'expires_at' => $purchase_data['expires_at']
        ];
        
        if (!Database::insert('user_inventory', $inventory_data)) return $pdo->rollBack() && false;
        
        Database::query("UPDATE shop_items SET purchase_count = purchase_count + 1 WHERE id = :item_id", ['item_id' => $item_id]);
        
        $pdo->commit();
        return true;
    }
    
    public static function addToInventory($user_id, $item_id, $quantity = 1, $item_data = []) {
        $existing = Database::fetchOne("SELECT id, quantity FROM user_inventory WHERE user_id = :user_id AND item_id = :item_id", 
            ['user_id' => $user_id, 'item_id' => $item_id]);
        
        if ($existing) {
            return Database::query("UPDATE user_inventory SET quantity = quantity + :quantity WHERE id = :id", 
                ['id' => $existing['id'], 'quantity' => $quantity]);
        } else {
            $inventory_id = generateUniqueId('user_inventory', 'id');
            $inventory_data = ['id' => $inventory_id, 'user_id' => $user_id, 'item_id' => $item_id, 'quantity' => $quantity];
            return Database::insert('user_inventory', $inventory_data);
        }
    }
    
    public static function getUserInventory($user_id, $category = null) {
        $sql = "SELECT ui.*, si.* FROM user_inventory ui LEFT JOIN shop_items si ON ui.item_id = si.id WHERE ui.user_id = :user_id";
        $params = ['user_id' => $user_id];
        
        if ($category) {
            $sql .= " AND si.category = :category";
            $params['category'] = $category;
        }
        
        return Database::fetchAll($sql, $params);
    }
    
    public static function useInventoryItem($user_id, $inventory_id) {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        
        $sql = "SELECT ui.*, si.* FROM user_inventory ui LEFT JOIN shop_items si ON ui.item_id = si.id WHERE ui.id = :inventory_id AND ui.user_id = :user_id";
        $item = Database::fetchOne($sql, ['inventory_id' => $inventory_id, 'user_id' => $user_id]);
        
        if (!$item) return $pdo->rollBack() && false;
        
        if ($item['quantity'] > 1) {
            Database::query("UPDATE user_inventory SET quantity = quantity - 1 WHERE id = :id", ['id' => $inventory_id]);
        } else {
            Database::delete('user_inventory', "id = '$inventory_id'");
        }
        
        $pdo->commit();
        
        return [
            'effect_type' => $item['item_type'], 'effect_value' => $item['effect_value'],
            'duration' => $item['duration_days'], 'item_name' => $item['name'],
            'item_description' => $item['description']
        ];
    }
    
    public static function getEquippedItems($user_id) {
        $sql = "SELECT ui.*, si.* FROM user_inventory ui LEFT JOIN shop_items si ON ui.item_id = si.id WHERE ui.user_id = :user_id AND ui.is_equipped = 1";
        return Database::fetchAll($sql, ['user_id' => $user_id]);
    }
    
    // Activity Feed Operations
    public static function getActivityFeed($user_id = null, $limit = 20, $offset = 0) {
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
    public static function handleSessionVote($session_id, $user_id, $vote_type, $vote_value) {
        $existing = Database::fetchOne(
            "SELECT id FROM cooking_session_votes WHERE cooking_session_id = :session_id AND user_id = :user_id AND vote_type = :vote_type",
            ['session_id' => $session_id, 'user_id' => $user_id, 'vote_type' => $vote_type]
        );
        
        if ($existing) {
            return Database::update('cooking_session_votes', ['vote_value' => $vote_value], "id = '{$existing['id']}'") > 0;
        } else {
            $vote_id = generateUniqueId('cooking_session_votes', 'id');
            $vote_data = [
                'id' => $vote_id, 'cooking_session_id' => $session_id, 'user_id' => $user_id,
                'vote_type' => $vote_type, 'vote_value' => $vote_value
            ];
            return Database::insert('cooking_session_votes', $vote_data);
        }
    }
    
    public static function saveChatMessage($session_id, $user_id, $message, $message_type = 'text') {
        $message_id = generateUniqueId('session_chat_messages', 'id');
        $message_data = [
            'id' => $message_id, 'cooking_session_id' => $session_id, 'user_id' => $user_id,
            'message' => $message, 'message_type' => $message_type
        ];
        return Database::insert('session_chat_messages', $message_data);
    }
    
    public static function getSessionChat($session_id, $limit = 100) {
        $sql = "SELECT scm.*, u.full_name, u.profile_picture FROM session_chat_messages scm 
                LEFT JOIN users u ON scm.user_id = u.id 
                WHERE scm.cooking_session_id = :session_id ORDER BY scm.created_at DESC LIMIT :limit";
        return Database::fetchAll($sql, ['session_id' => $session_id, 'limit' => $limit]);
    }
}