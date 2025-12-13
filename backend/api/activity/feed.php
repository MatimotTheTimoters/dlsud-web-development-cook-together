<?php
// backend/api/activity/feed.php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Enable CORS for frontend requests
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ResponseFormatter::error('Method not allowed', 405);
    exit();
}

// Get Authorization header
$token = AuthHelper::getBearerToken();

if (!$token) {
    ResponseFormatter::unauthorized('No authentication token provided');
    exit();
}

// Validate token
$userData = AuthHelper::validateToken($token);

if (!$userData) {
    ResponseFormatter::unauthorized('Invalid or expired token');
    exit();
}

$user_id = $userData['user_id'];

try {
    // Get query parameters
    $type = isset($_GET['type']) ? trim($_GET['type']) : 'user'; // 'user' or 'global'
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $activity_type = isset($_GET['activity_type']) ? trim($_GET['activity_type']) : null;
    
    // Validate parameters
    if (!in_array($type, ['user', 'global'])) {
        ResponseFormatter::error('Invalid type. Must be "user" or "global"', 400);
        exit();
    }
    
    if ($limit < 1 || $limit > 100) {
        $limit = 20; // Default to 20 if out of bounds
    }
    
    if ($offset < 0) {
        $offset = 0;
    }
    
    // Get activities based on type
    if ($type === 'user') {
        $activities = getUserActivityFeed($user_id, $limit, $offset);
    } else {
        $activities = getGlobalActivityFeed($limit, $offset);
    }
    
    // Filter by activity type if specified
    if ($activity_type) {
        $activities = filterActivitiesByType($activities, $activity_type);
    }
    
    // Format activities for display
    $formattedActivities = [];
    foreach ($activities as $activity) {
        $formattedActivities[] = formatActivityForDisplay($activity, $user_id);
    }
    
    // Return success response
    ResponseFormatter::paginated(
        $formattedActivities,
        count($formattedActivities),
        floor($offset / $limit) + 1,
        $limit,
        'Activity feed retrieved successfully'
    );
    
} catch (PDOException $e) {
    error_log("Database error in activity/feed.php: " . $e->getMessage());
    ResponseFormatter::error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Error in activity/feed.php: " . $e->getMessage());
    ResponseFormatter::error('An error occurred: ' . $e->getMessage(), 500);
}

/**
 * Gets paginated activity feed for a specific user
 * 
 * @param string $user_id User ID
 * @param int $limit Number of activities to return
 * @param int $offset Offset for pagination
 * @return array Array of activities
 */
function getUserActivityFeed($user_id, $limit = 20, $offset = 0) {
    $db = Database::getConnection();
    
    // Get users that the current user is following
    $followingQuery = "
        SELECT target_user_id 
        FROM user_relationships 
        WHERE source_user_id = :user_id 
        AND relationship_type = 'following' 
        AND status = 'accepted'
    ";
    
    $followingStmt = $db->prepare($followingQuery);
    $followingStmt->execute(['user_id' => $user_id]);
    $following = $followingStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Include the user's own activities
    $following[] = $user_id;
    
    if (empty($following)) {
        return [];
    }
    
    // Create placeholders for IN clause
    $placeholders = implode(',', array_fill(0, count($following), '?'));
    
    // Query activities from multiple sources
    $query = "
        (
            -- Recipe interactions (likes, saves)
            SELECT 
                ri.id,
                ri.created_at,
                ri.user_id,
                ri.recipe_id,
                NULL as cooking_session_id,
                NULL as target_user_id,
                CONCAT('recipe_', ri.interaction_type) as activity_type,
                r.title as recipe_title,
                u.full_name as user_name,
                u.profile_picture as user_picture,
                NULL as session_title,
                NULL as target_user_name
            FROM recipe_interactions ri
            JOIN users u ON ri.user_id = u.id
            JOIN recipes r ON ri.recipe_id = r.id
            WHERE ri.user_id IN ($placeholders)
            AND ri.interaction_type IN ('like', 'save')
            
            UNION ALL
            
            -- New recipes created
            SELECT 
                r.id,
                r.created_at,
                r.user_id,
                r.id as recipe_id,
                NULL as cooking_session_id,
                NULL as target_user_id,
                'recipe_created' as activity_type,
                r.title as recipe_title,
                u.full_name as user_name,
                u.profile_picture as user_picture,
                NULL as session_title,
                NULL as target_user_name
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE r.user_id IN ($placeholders)
            AND r.is_public = 1
            
            UNION ALL
            
            -- Cooking sessions created
            SELECT 
                cs.id,
                cs.created_at,
                cs.host_id as user_id,
                cs.recipe_id,
                cs.id as cooking_session_id,
                NULL as target_user_id,
                'session_created' as activity_type,
                r.title as recipe_title,
                u.full_name as user_name,
                u.profile_picture as user_picture,
                CONCAT('Cooking ', r.title) as session_title,
                NULL as target_user_name
            FROM cooking_sessions cs
            JOIN users u ON cs.host_id = u.id
            JOIN recipes r ON cs.recipe_id = r.id
            WHERE cs.host_id IN ($placeholders)
            AND cs.visibility IN ('friends_only', 'public')
            
            UNION ALL
            
            -- User relationships (following)
            SELECT 
                ur.id,
                ur.created_at,
                ur.source_user_id as user_id,
                NULL as recipe_id,
                NULL as cooking_session_id,
                ur.target_user_id,
                'user_followed' as activity_type,
                NULL as recipe_title,
                u1.full_name as user_name,
                u1.profile_picture as user_picture,
                NULL as session_title,
                u2.full_name as target_user_name
            FROM user_relationships ur
            JOIN users u1 ON ur.source_user_id = u1.id
            JOIN users u2 ON ur.target_user_id = u2.id
            WHERE ur.source_user_id IN ($placeholders)
            AND ur.relationship_type = 'following'
            AND ur.status = 'accepted'
            
            UNION ALL
            
            -- Level ups (from user_stats updates)
            SELECT 
                us.id,
                us.updated_at as created_at,
                us.user_id,
                NULL as recipe_id,
                NULL as cooking_session_id,
                NULL as target_user_id,
                'level_up' as activity_type,
                NULL as recipe_title,
                u.full_name as user_name,
                u.profile_picture as user_picture,
                NULL as session_title,
                NULL as target_user_name
            FROM user_stats us
            JOIN users u ON us.user_id = u.id
            WHERE us.user_id IN ($placeholders)
            AND us.level > 1
        )
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
    ";
    
    $stmt = $db->prepare($query);
    
    // Bind parameters
    $paramIndex = 1;
    foreach ($following as $userId) {
        $stmt->bindValue($paramIndex++, $userId);
    }
    // Repeat for each UNION part
    foreach ($following as $userId) {
        $stmt->bindValue($paramIndex++, $userId);
    }
    foreach ($following as $userId) {
        $stmt->bindValue($paramIndex++, $userId);
    }
    foreach ($following as $userId) {
        $stmt->bindValue($paramIndex++, $userId);
    }
    foreach ($following as $userId) {
        $stmt->bindValue($paramIndex++, $userId);
    }
    
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Gets global activity feed (public activities)
 * 
 * @param int $limit Number of activities to return
 * @param int $offset Offset for pagination
 * @return array Array of activities
 */
function getGlobalActivityFeed($limit = 20, $offset = 0) {
    $db = Database::getConnection();
    
    $query = "
        (
            -- Public recipe creations
            SELECT 
                r.id,
                r.created_at,
                r.user_id,
                r.id as recipe_id,
                NULL as cooking_session_id,
                NULL as target_user_id,
                'recipe_created' as activity_type,
                r.title as recipe_title,
                u.full_name as user_name,
                u.profile_picture as user_picture,
                NULL as session_title,
                NULL as target_user_name
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE r.is_public = 1
            
            UNION ALL
            
            -- Public cooking sessions
            SELECT 
                cs.id,
                cs.created_at,
                cs.host_id as user_id,
                cs.recipe_id,
                cs.id as cooking_session_id,
                NULL as target_user_id,
                'session_created' as activity_type,
                r.title as recipe_title,
                u.full_name as user_name,
                u.profile_picture as user_picture,
                CONCAT('Cooking ', r.title) as session_title,
                NULL as target_user_name
            FROM cooking_sessions cs
            JOIN users u ON cs.host_id = u.id
            JOIN recipes r ON cs.recipe_id = r.id
            WHERE cs.visibility = 'public'
            
            UNION ALL
            
            -- Popular recipe interactions (with thresholds)
            SELECT 
                ri.id,
                ri.created_at,
                ri.user_id,
                ri.recipe_id,
                NULL as cooking_session_id,
                NULL as target_user_id,
                CONCAT('recipe_', ri.interaction_type) as activity_type,
                r.title as recipe_title,
                u.full_name as user_name,
                u.profile_picture as user_picture,
                NULL as session_title,
                NULL as target_user_name
            FROM recipe_interactions ri
            JOIN users u ON ri.user_id = u.id
            JOIN recipes r ON ri.recipe_id = r.id
            JOIN recipe_metadata rm ON r.id = rm.recipe_id
            WHERE r.is_public = 1
            AND rm.like_count > 10
            
            UNION ALL
            
            -- High level users
            SELECT 
                us.id,
                us.updated_at as created_at,
                us.user_id,
                NULL as recipe_id,
                NULL as cooking_session_id,
                NULL as target_user_id,
                'level_up' as activity_type,
                NULL as recipe_title,
                u.full_name as user_name,
                u.profile_picture as user_picture,
                NULL as session_title,
                NULL as target_user_name
            FROM user_stats us
            JOIN users u ON us.user_id = u.id
            WHERE us.level >= 10
        )
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
    ";
    
    $stmt = $db->prepare($query);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Filters activities by type
 * 
 * @param array $activities Array of activities
 * @param string $type Activity type to filter by
 * @return array Filtered activities
 */
function filterActivitiesByType($activities, $type) {
    return array_filter($activities, function($activity) use ($type) {
        return $activity['activity_type'] === $type;
    });
}

/**
 * Formats activity for frontend display
 * 
 * @param array $activity Raw activity data
 * @param string $current_user_id Current user ID for personalization
 * @return array Formatted activity
 */
function formatActivityForDisplay($activity, $current_user_id) {
    $formatted = [
        'id' => $activity['id'],
        'created_at' => $activity['created_at'],
        'timestamp' => strtotime($activity['created_at']),
        'time_ago' => getTimeAgo($activity['created_at']),
        'activity_type' => $activity['activity_type'],
        'user' => [
            'id' => $activity['user_id'],
            'name' => $activity['user_name'],
            'profile_picture' => $activity['user_picture']
        ],
        'is_current_user' => ($activity['user_id'] === $current_user_id)
    ];
    
    // Add type-specific data
    switch ($activity['activity_type']) {
        case 'recipe_like':
        case 'recipe_save':
            $formatted['recipe'] = [
                'id' => $activity['recipe_id'],
                'title' => $activity['recipe_title']
            ];
            $formatted['message'] = generateActivityMessage($activity);
            $formatted['icon'] = $activity['activity_type'] === 'recipe_like' ? 'heart' : 'bookmark';
            break;
            
        case 'recipe_created':
            $formatted['recipe'] = [
                'id' => $activity['recipe_id'],
                'title' => $activity['recipe_title']
            ];
            $formatted['message'] = "created a new recipe";
            $formatted['icon'] = 'plus-circle';
            break;
            
        case 'session_created':
            $formatted['recipe'] = [
                'id' => $activity['recipe_id'],
                'title' => $activity['recipe_title']
            ];
            $formatted['session'] = [
                'id' => $activity['cooking_session_id'],
                'title' => $activity['session_title']
            ];
            $formatted['message'] = "started cooking";
            $formatted['icon'] = 'fire';
            break;
            
        case 'user_followed':
            $formatted['target_user'] = [
                'id' => $activity['target_user_id'],
                'name' => $activity['target_user_name']
            ];
            $formatted['message'] = "started following";
            $formatted['icon'] = 'user-plus';
            break;
            
        case 'level_up':
            // We need to get the level from user_stats
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT level FROM user_stats WHERE user_id = ?");
            $stmt->execute([$activity['user_id']]);
            $userStats = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $formatted['level'] = $userStats ? $userStats['level'] : 1;
            $formatted['message'] = "reached level " . $formatted['level'];
            $formatted['icon'] = 'trophy';
            break;
            
        default:
            $formatted['message'] = "performed an action";
            $formatted['icon'] = 'activity';
    }
    
    return $formatted;
}

/**
 * Generates a human-readable activity message
 * 
 * @param array $activity Activity data
 * @return string Human-readable message
 */
function generateActivityMessage($activity) {
    $userName = $activity['user_name'];
    $targetUserName = $activity['target_user_name'] ?? null;
    $recipeTitle = $activity['recipe_title'] ?? null;
    
    switch ($activity['activity_type']) {
        case 'recipe_like':
            return "$userName liked the recipe \"$recipeTitle\"";
            
        case 'recipe_save':
            return "$userName saved the recipe \"$recipeTitle\"";
            
        case 'recipe_created':
            return "$userName created the recipe \"$recipeTitle\"";
            
        case 'session_created':
            return "$userName started cooking \"$recipeTitle\"";
            
        case 'user_followed':
            return "$userName started following $targetUserName";
            
        case 'level_up':
            return "$userName reached a new level!";
            
        default:
            return "$userName performed an action";
    }
}

/**
 * Gets time ago string from timestamp
 * 
 * @param string $datetime MySQL datetime string
 * @return string Human-readable time ago
 */
function getTimeAgo($datetime) {
    $time = strtotime($datetime);
    $time_difference = time() - $time;
    
    if ($time_difference < 1) {
        return 'just now';
    }
    
    $condition = [
        12 * 30 * 24 * 60 * 60 => 'year',
        30 * 24 * 60 * 60 => 'month',
        24 * 60 * 60 => 'day',
        60 * 60 => 'hour',
        60 => 'minute',
        1 => 'second'
    ];
    
    foreach ($condition as $secs => $str) {
        $d = $time_difference / $secs;
        if ($d >= 1) {
            $r = round($d);
            return $r . ' ' . $str . ($r > 1 ? 's' : '') . ' ago';
        }
    }
    
    return 'just now';
}