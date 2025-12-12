<?php
/**
 * DatabaseHelper Class - Minimal implementation
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
        
        $user_id = UUIDHelper::generateUniqueId('users', 'id');
        $user_record = [
            'id' => $user_id,
            'full_name' => $user_data['full_name'],
            'email' => $user_data['email'],
            'password_hash' => $user_data['password_hash'],
            'age' => $user_data['age'] ?? null,
            'gender' => $user_data['gender'] ?? null,
            'profile_picture' => $user_data['profile_picture'] ?? null
        ];
        
        if (!Database::insert('users', $user_record)) {
            $pdo->rollBack();
            return false;
        }
        
        $stats_id = UUIDHelper::generateUniqueId('user_stats', 'id');
        $stats_data = [
            'id' => $stats_id,
            'user_id' => $user_id,
            'login_streak' => 1,
            'level' => 1,
            'gold_count' => 0,
            'gem_count' => 0
        ];
        
        if (!Database::insert('user_stats', $stats_data)) {
            $pdo->rollBack();
            return false;
        }
        
        $pdo->commit();
        return $user_id;
    }
    
    public static function validateUserLogin($email, $password)
    {
        $sql = "SELECT u.*, us.level, us.gold_count, us.gem_count 
                FROM users u 
                LEFT JOIN user_stats us ON u.id = us.user_id 
                WHERE u.email = :email";
        $user = Database::fetchOne($sql, ['email' => $email]);
        
        if (!$user || !password_verify($password, $user['password_hash'])) {
            return false;
        }
        
        unset($user['password_hash']);
        return $user;
    }
    
    public static function getUserById($user_id)
    {
        $sql = "SELECT u.*, us.level, us.gold_count, us.gem_count, us.login_streak
                FROM users u 
                LEFT JOIN user_stats us ON u.id = us.user_id 
                WHERE u.id = :user_id";
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
        $sql = "SELECT u.id, u.full_name, u.profile_picture, us.level 
                FROM users u 
                LEFT JOIN user_stats us ON u.id = us.user_id 
                WHERE u.full_name LIKE :query 
                LIMIT :limit OFFSET :offset";
        
        return Database::fetchAll($sql, [
            'query' => "%$query%",
            'limit' => $limit,
            'offset' => $offset
        ]);
    }
    
    // User Stats Operations
    public static function getUserStats($user_id)
    {
        $sql = "SELECT * FROM user_stats WHERE user_id = :user_id";
        return Database::fetchOne($sql, ['user_id' => $user_id]);
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
        
        $recipe_id = UUIDHelper::generateUniqueId('recipes', 'id');
        $recipe_data['id'] = $recipe_id;
        
        if (!Database::insert('recipes', $recipe_data)) {
            $pdo->rollBack();
            return false;
        }
        
        // Insert ingredients
        foreach ($ingredients as $index => $ingredient) {
            $ingredient['id'] = UUIDHelper::generateUniqueId('recipe_ingredients', 'id');
            $ingredient['recipe_id'] = $recipe_id;
            $ingredient['order_index'] = $index;
            
            if (!Database::insert('recipe_ingredients', $ingredient)) {
                $pdo->rollBack();
                return false;
            }
        }
        
        // Insert steps
        foreach ($steps as $index => $step) {
            $step['id'] = UUIDHelper::generateUniqueId('recipe_steps', 'id');
            $step['recipe_id'] = $recipe_id;
            $step['order_index'] = $index;
            
            if (!Database::insert('recipe_steps', $step)) {
                $pdo->rollBack();
                return false;
            }
        }
        
        // Create metadata
        $metadata_id = UUIDHelper::generateUniqueId('recipe_metadata', 'id');
        $metadata = [
            'id' => $metadata_id,
            'recipe_id' => $recipe_id,
            'exp_reward' => $recipe_data['exp_reward'] ?? 0,
            'gold_reward' => $recipe_data['gold_reward'] ?? 0,
            'gem_reward' => $recipe_data['gem_reward'] ?? 0
        ];
        
        if (!Database::insert('recipe_metadata', $metadata)) {
            $pdo->rollBack();
            return false;
        }
        
        $pdo->commit();
        return $recipe_id;
    }
    
    public static function getRecipe($recipe_id, $user_id = null)
    {
        $sql = "SELECT r.*, rm.*, u.full_name as creator_name 
                FROM recipes r 
                LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id 
                LEFT JOIN users u ON r.user_id = u.id 
                WHERE r.id = :recipe_id";
        
        $recipe = Database::fetchOne($sql, ['recipe_id' => $recipe_id]);
        
        if (!$recipe) return false;
        
        // Get ingredients
        $recipe['ingredients'] = Database::fetchAll(
            "SELECT * FROM recipe_ingredients WHERE recipe_id = :recipe_id ORDER BY order_index",
            ['recipe_id' => $recipe_id]
        );
        
        // Get steps
        $recipe['steps'] = Database::fetchAll(
            "SELECT * FROM recipe_steps WHERE recipe_id = :recipe_id ORDER BY order_index",
            ['recipe_id' => $recipe_id]
        );
        
        // Check access if user_id provided
        if ($user_id) {
            $recipe['has_access'] = self::checkRecipeAccess($user_id, $recipe_id);
        }
        
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
        
        $sql = "SELECT r.*, rm.*, u.full_name as creator_name 
                FROM recipes r 
                LEFT JOIN recipe_metadata rm ON r.id = rm.recipe_id 
                LEFT JOIN users u ON r.user_id = u.id 
                WHERE " . implode(' AND ', $where) . " 
                LIMIT :limit OFFSET :offset";
        
        return Database::fetchAll($sql, $params);
    }
    
    // Recipe Access & Purchase
    public static function checkRecipeAccess($user_id, $recipe_id)
    {
        // Check if user created the recipe
        $sql = "SELECT 1 FROM recipes WHERE id = :recipe_id AND user_id = :user_id";
        if (Database::fetchOne($sql, ['recipe_id' => $recipe_id, 'user_id' => $user_id])) {
            return ['has_access' => true, 'access_type' => 'creator'];
        }
        
        // Check if purchased
        $sql = "SELECT 1 FROM user_recipe_access WHERE recipe_id = :recipe_id AND user_id = :user_id";
        if (Database::fetchOne($sql, ['recipe_id' => $recipe_id, 'user_id' => $user_id])) {
            return ['has_access' => true, 'access_type' => 'purchased'];
        }
        
        // Check if recipe is free
        $sql = "SELECT 1 FROM recipes WHERE id = :recipe_id AND is_paid = 0";
        if (Database::fetchOne($sql, ['recipe_id' => $recipe_id])) {
            return ['has_access' => true, 'access_type' => 'free'];
        }
        
        return ['has_access' => false];
    }
    
    public static function purchaseRecipe($user_id, $recipe_id, $currency_type, $price)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        
        // Deduct currency
        $currency_field = $currency_type . '_count';
        $sql = "UPDATE user_stats SET $currency_field = $currency_field - :price WHERE user_id = :user_id AND $currency_field >= :price";
        
        if (!Database::query($sql, ['user_id' => $user_id, 'price' => $price])) {
            $pdo->rollBack();
            return false;
        }
        
        // Grant access
        if (!self::grantRecipeAccess($user_id, $recipe_id, 'purchased', ['currency_type' => $currency_type, 'price' => $price])) {
            $pdo->rollBack();
            return false;
        }
        
        $pdo->commit();
        return true;
    }
    
    public static function grantRecipeAccess($user_id, $recipe_id, $access_type, $purchase_data = null)
    {
        $access_id = UUIDHelper::generateUniqueId('user_recipe_access', 'id');
        $access_data = [
            'id' => $access_id,
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'access_type' => $access_type
        ];
        
        if ($purchase_data) {
            $access_data['currency_used'] = $purchase_data['currency_type'] ?? null;
            $access_data['price_paid'] = $purchase_data['price'] ?? null;
        }
        
        return Database::insert('user_recipe_access', $access_data);
    }
    
    // Recipe Interactions
    public static function handleRecipeInteraction($user_id, $recipe_id, $interaction_type, $metadata = [])
    {
        $interaction_id = UUIDHelper::generateUniqueId('recipe_interactions', 'id');
        $interaction_data = [
            'id' => $interaction_id,
            'user_id' => $user_id,
            'recipe_id' => $recipe_id,
            'interaction_type' => $interaction_type,
            'metadata' => json_encode($metadata)
        ];
        
        return Database::insert('recipe_interactions', $interaction_data);
    }
    
    public static function getRecipeInteractions($recipe_id)
    {
        $sql = "SELECT interaction_type, COUNT(*) as count 
                FROM recipe_interactions 
                WHERE recipe_id = :recipe_id 
                GROUP BY interaction_type";
        
        return Database::fetchAll($sql, ['recipe_id' => $recipe_id]);
    }
    
    // Cooking Session Operations
    public static function createCookingSession($session_data)
    {
        $session_id = UUIDHelper::generateUniqueId('cooking_sessions', 'id');
        $session_data['id'] = $session_id;
        
        if (Database::insert('cooking_sessions', $session_data)) {
            return $session_id;
        }
        
        return false;
    }
    
    public static function getCookingSession($session_id)
    {
        $sql = "SELECT cs.*, r.title as recipe_title, u.full_name as host_name 
                FROM cooking_sessions cs 
                LEFT JOIN recipes r ON cs.recipe_id = r.id 
                LEFT JOIN users u ON cs.host_id = u.id 
                WHERE cs.id = :session_id";
        
        return Database::fetchOne($sql, ['session_id' => $session_id]);
    }
    
    public static function updateCookingSession($session_id, $updates)
    {
        return Database::update('cooking_sessions', $updates, "id = '$session_id'") > 0;
    }
    
    public static function joinCookingSession($session_id, $user_id)
    {
        $participant_id = UUIDHelper::generateUniqueId('cooking_session_participants', 'id');
        $participant_data = [
            'id' => $participant_id,
            'cooking_session_id' => $session_id,
            'user_id' => $user_id
        ];
        
        return Database::insert('cooking_session_participants', $participant_data);
    }
    
    public static function completeCookingStep($session_id, $step_id, $user_id, $completion_data)
    {
        $completion_id = UUIDHelper::generateUniqueId('cooking_step_completions', 'id');
        $completion_data['id'] = $completion_id;
        $completion_data['cooking_session_id'] = $session_id;
        $completion_data['recipe_step_id'] = $step_id;
        
        return Database::insert('cooking_step_completions', $completion_data);
    }
    
    public static function getUserSessionHistory($user_id, $limit = 20, $offset = 0)
    {
        $sql = "SELECT cs.*, r.title as recipe_title 
                FROM cooking_sessions cs 
                LEFT JOIN recipes r ON cs.recipe_id = r.id 
                WHERE cs.host_id = :user_id 
                ORDER BY cs.created_at DESC 
                LIMIT :limit OFFSET :offset";
        
        return Database::fetchAll($sql, ['user_id' => $user_id, 'limit' => $limit, 'offset' => $offset]);
    }
    
    // Relationship Operations
    public static function manageRelationship($source_user_id, $target_user_id, $action, $data = [])
    {
        $relationship_id = UUIDHelper::generateUniqueId('user_relationships', 'id');
        $relationship_data = [
            'id' => $relationship_id,
            'source_user_id' => $source_user_id,
            'target_user_id' => $target_user_id,
            'relationship_type' => $data['type'] ?? 'following',
            'status' => $data['status'] ?? 'pending'
        ];
        
        return Database::insert('user_relationships', $relationship_data);
    }
    
    public static function getRelationships($user_id, $type = 'following', $limit = 50)
    {
        $sql = "SELECT ur.*, u.full_name, u.profile_picture 
                FROM user_relationships ur 
                LEFT JOIN users u ON ur.target_user_id = u.id 
                WHERE ur.source_user_id = :user_id AND ur.relationship_type = :type 
                LIMIT :limit";
        
        return Database::fetchAll($sql, ['user_id' => $user_id, 'type' => $type, 'limit' => $limit]);
    }
    
    public static function updateRelationshipStatus($relationship_id, $status)
    {
        return Database::update('user_relationships', ['status' => $status], "id = '$relationship_id'") > 0;
    }
    
    // Cookbook Operations
    public static function createCookbook($cookbook_data)
    {
        $cookbook_id = UUIDHelper::generateUniqueId('cookbooks', 'id');
        $cookbook_data['id'] = $cookbook_id;
        
        if (Database::insert('cookbooks', $cookbook_data)) {
            return $cookbook_id;
        }
        
        return false;
    }
    
    public static function getCookbook($cookbook_id, $include_recipes = true)
    {
        $sql = "SELECT c.*, u.full_name as owner_name 
                FROM cookbooks c 
                LEFT JOIN users u ON c.user_id = u.id 
                WHERE c.id = :cookbook_id";
        
        $cookbook = Database::fetchOne($sql, ['cookbook_id' => $cookbook_id]);
        
        if ($cookbook && $include_recipes) {
            $sql = "SELECT r.* FROM recipes r 
                    INNER JOIN cookbook_recipes cr ON r.id = cr.recipe_id 
                    WHERE cr.cookbook_id = :cookbook_id";
            
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
            $entry_id = UUIDHelper::generateUniqueId('cookbook_recipes', 'id');
            $entry_data = [
                'id' => $entry_id,
                'cookbook_id' => $cookbook_id,
                'recipe_id' => $recipe_id,
                'added_by' => $user_id
            ];
            
            return Database::insert('cookbook_recipes', $entry_data);
        } else {
            return Database::delete('cookbook_recipes', "cookbook_id = '$cookbook_id' AND recipe_id = '$recipe_id'") > 0;
        }
    }
    
    public static function getUserCookbooks($user_id, $include_public = false)
    {
        $where = "c.user_id = :user_id";
        if ($include_public) {
            $where .= " OR c.is_public = 1";
        }
        
        $sql = "SELECT c.* FROM cookbooks c WHERE $where ORDER BY c.created_at DESC";
        return Database::fetchAll($sql, ['user_id' => $user_id]);
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
        
        $sql = "SELECT * FROM shop_items WHERE " . implode(' AND ', $where) . " LIMIT :limit";
        return Database::fetchAll($sql, $params);
    }
    
    public static function purchaseShopItem($user_id, $item_id, $currency_type, $price)
    {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        
        // Deduct currency
        $currency_field = $currency_type . '_count';
        $sql = "UPDATE user_stats SET $currency_field = $currency_field - :price WHERE user_id = :user_id AND $currency_field >= :price";
        
        if (!Database::query($sql, ['user_id' => $user_id, 'price' => $price])) {
            $pdo->rollBack();
            return false;
        }
        
        // Add to purchases
        $purchase_id = UUIDHelper::generateUniqueId('user_purchases', 'id');
        $purchase_data = [
            'id' => $purchase_id,
            'user_id' => $user_id,
            'item_id' => $item_id,
            'currency_type' => $currency_type,
            'price' => $price
        ];
        
        if (!Database::insert('user_purchases', $purchase_data)) {
            $pdo->rollBack();
            return false;
        }
        
        // Add to inventory
        if (!self::addToInventory($user_id, $item_id)) {
            $pdo->rollBack();
            return false;
        }
        
        $pdo->commit();
        return true;
    }
    
    public static function addToInventory($user_id, $item_id, $quantity = 1, $item_data = [])
    {
        $inventory_id = UUIDHelper::generateUniqueId('user_inventory', 'id');
        $inventory_data = [
            'id' => $inventory_id,
            'user_id' => $user_id,
            'item_id' => $item_id,
            'quantity' => $quantity
        ];
        
        return Database::insert('user_inventory', $inventory_data);
    }
    
    public static function getUserInventory($user_id, $category = null)
    {
        $sql = "SELECT ui.*, si.* 
                FROM user_inventory ui 
                LEFT JOIN shop_items si ON ui.item_id = si.id 
                WHERE ui.user_id = :user_id";
        
        $params = ['user_id' => $user_id];
        
        if ($category) {
            $sql .= " AND si.category = :category";
            $params['category'] = $category;
        }
        
        return Database::fetchAll($sql, $params);
    }
    
    public static function useInventoryItem($user_id, $inventory_id)
    {
        $sql = "SELECT ui.*, si.* FROM user_inventory ui 
                LEFT JOIN shop_items si ON ui.item_id = si.id 
                WHERE ui.id = :inventory_id AND ui.user_id = :user_id";
        
        $item = Database::fetchOne($sql, ['inventory_id' => $inventory_id, 'user_id' => $user_id]);
        
        if (!$item) return false;
        
        // Reduce quantity or remove
        if ($item['quantity'] > 1) {
            Database::query("UPDATE user_inventory SET quantity = quantity - 1 WHERE id = :id", ['id' => $inventory_id]);
        } else {
            Database::delete('user_inventory', "id = '$inventory_id'");
        }
        
        // Return effect data
        return [
            'effect_type' => $item['item_type'],
            'effect_value' => $item['effect_value'],
            'duration' => $item['duration_days']
        ];
    }
    
    // Activity Feed Operations
    public static function logActivity($user_id, $activity_type, $activity_data)
    {
        $activity_id = UUIDHelper::generateUniqueId('activity_feed', 'id');
        $activity_record = [
            'id' => $activity_id,
            'user_id' => $user_id,
            'activity_type' => $activity_type,
            'title' => $activity_data['title'] ?? '',
            'description' => $activity_data['description'] ?? '',
            'icon' => $activity_data['icon'] ?? '🍳'
        ];
        
        return Database::insert('activity_feed', $activity_record);
    }
    
    public static function getActivityFeed($user_id = null, $limit = 20, $offset = 0)
    {
        $where = ['is_public = 1'];
        $params = ['limit' => $limit, 'offset' => $offset];
        
        if ($user_id) {
            $where[] = "user_id = :user_id";
            $params['user_id'] = $user_id;
        }
        
        $sql = "SELECT af.*, u.full_name, u.profile_picture 
                FROM activity_feed af 
                LEFT JOIN users u ON af.user_id = u.id 
                WHERE " . implode(' AND ', $where) . " 
                ORDER BY created_at DESC 
                LIMIT :limit OFFSET :offset";
        
        return Database::fetchAll($sql, $params);
    }
    
    // Voting & Chat Operations
    public static function handleSessionVote($session_id, $user_id, $vote_type, $vote_value)
    {
        $vote_id = UUIDHelper::generateUniqueId('cooking_session_votes', 'id');
        $vote_data = [
            'id' => $vote_id,
            'cooking_session_id' => $session_id,
            'user_id' => $user_id,
            'vote_type' => $vote_type,
            'vote_value' => $vote_value
        ];
        
        return Database::insert('cooking_session_votes', $vote_data);
    }
    
    public static function saveChatMessage($session_id, $user_id, $message, $message_type = 'text')
    {
        $message_id = UUIDHelper::generateUniqueId('session_chat_messages', 'id');
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
        $sql = "SELECT scm.*, u.full_name, u.profile_picture 
                FROM session_chat_messages scm 
                LEFT JOIN users u ON scm.user_id = u.id 
                WHERE scm.cooking_session_id = :session_id 
                ORDER BY scm.created_at DESC 
                LIMIT :limit";
        
        return Database::fetchAll($sql, ['session_id' => $session_id, 'limit' => $limit]);
    }
}