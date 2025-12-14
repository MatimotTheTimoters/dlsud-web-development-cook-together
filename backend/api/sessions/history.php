<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

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
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $status = isset($_GET['status']) ? trim($_GET['status']) : null;
    $recipe_id = isset($_GET['recipe_id']) ? trim($_GET['recipe_id']) : null;
    $mode = isset($_GET['mode']) ? trim($_GET['mode']) : null; // solo or multiplayer
    $date_from = isset($_GET['date_from']) ? trim($_GET['date_from']) : null;
    $date_to = isset($_GET['date_to']) ? trim($_GET['date_to']) : null;
    
    // Validate parameters
    if ($limit < 1 || $limit > 100) {
        $limit = 20; // Default to 20 if out of bounds
    }
    
    if ($offset < 0) {
        $offset = 0;
    }
    
    // Get user's session history
    $sessions = getUserSessionHistory($user_id, $limit, $offset, $status, $recipe_id, $mode, $date_from, $date_to);
    
    // Get session statistics
    $statistics = getSessionStatistics($user_id, $date_from, $date_to);
    
    // Format sessions for display
    $formattedSessions = [];
    foreach ($sessions as $session) {
        $formattedSessions[] = formatSessionForDisplay($session);
    }
    
    // Return success response
    ResponseFormatter::success([
        'sessions' => $formattedSessions,
        'statistics' => $statistics,
        'pagination' => [
            'limit' => $limit,
            'offset' => $offset,
            'total' => count($formattedSessions),
            'has_more' => count($formattedSessions) >= $limit
        ]
    ], 'Session history retrieved successfully', 200);
    
} catch (PDOException $e) {
    error_log("Database error in sessions/history.php: " . $e->getMessage());
    ResponseFormatter::error('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log("Error in sessions/history.php: " . $e->getMessage());
    ResponseFormatter::error('An error occurred: ' . $e->getMessage(), 500);
}

/**
 * Gets user's cooking session history with filtering
 * 
 * @param string $user_id User ID
 * @param int $limit Number of sessions to return
 * @param int $offset Offset for pagination
 * @param string|null $status Filter by session status
 * @param string|null $recipe_id Filter by recipe
 * @param string|null $mode Filter by session mode (solo/multiplayer)
 * @param string|null $date_from Filter by start date
 * @param string|null $date_to Filter by end date
 * @return array Array of sessions
 */
function getUserSessionHistory($user_id, $limit = 20, $offset = 0, $status = null, $recipe_id = null, $mode = null, $date_from = null, $date_to = null) {
    $db = Database::getConnection();
    
    // Base query to get sessions where user was a participant
    $query = "
        SELECT 
            cs.*,
            r.title as recipe_title,
            r.cover_image as recipe_image,
            r.difficulty as recipe_difficulty,
            r.preparation_time,
            r.cooking_time,
            csd.completed_steps,
            csd.total_steps,
            csd.exp_earned,
            csd.gold_earned,
            csd.gems_earned,
            csd.cook_duration,
            u_host.full_name as host_name,
            u_host.profile_picture as host_picture,
            csp.role as user_role,
            csp.status as user_status,
            COUNT(DISTINCT csp2.user_id) as participant_count
        FROM cooking_sessions cs
        JOIN recipes r ON cs.recipe_id = r.id
        JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id
        JOIN users u_host ON cs.host_id = u_host.id
        JOIN cooking_session_participants csp ON cs.id = csp.cooking_session_id AND csp.user_id = :user_id
        LEFT JOIN cooking_session_participants csp2 ON cs.id = csp2.cooking_session_id
        WHERE 1=1
    ";
    
    $params = ['user_id' => $user_id];
    
    // Apply filters
    if ($status) {
        $query .= " AND cs.status = :status";
        $params['status'] = $status;
    }
    
    if ($recipe_id) {
        $query .= " AND cs.recipe_id = :recipe_id";
        $params['recipe_id'] = $recipe_id;
    }
    
    if ($mode) {
        $query .= " AND cs.mode = :mode";
        $params['mode'] = $mode;
    }
    
    if ($date_from) {
        $query .= " AND DATE(cs.created_at) >= :date_from";
        $params['date_from'] = $date_from;
    }
    
    if ($date_to) {
        $query .= " AND DATE(cs.created_at) <= :date_to";
        $params['date_to'] = $date_to;
    }
    
    // Group by session ID and order by creation date (most recent first)
    $query .= "
        GROUP BY cs.id
        ORDER BY cs.created_at DESC
        LIMIT :limit OFFSET :offset
    ";
    
    $params['limit'] = $limit;
    $params['offset'] = $offset;
    
    $stmt = $db->prepare($query);
    
    // Bind parameters
    foreach ($params as $key => $value) {
        if ($key === 'limit' || $key === 'offset') {
            $stmt->bindValue(':' . $key, $value, PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':' . $key, $value);
        }
    }
    
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Gets user's cooking session statistics
 * 
 * @param string $user_id User ID
 * @param string|null $date_from Filter by start date
 * @param string|null $date_to Filter by end date
 * @return array Session statistics
 */
function getSessionStatistics($user_id, $date_from = null, $date_to = null) {
    $db = Database::getConnection();
    
    // Base query for statistics
    $query = "
        SELECT 
            COUNT(DISTINCT cs.id) as total_sessions,
            SUM(CASE WHEN cs.mode = 'solo' THEN 1 ELSE 0 END) as solo_sessions,
            SUM(CASE WHEN cs.mode = 'multiplayer' THEN 1 ELSE 0 END) as multiplayer_sessions,
            SUM(CASE WHEN cs.status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
            SUM(CASE WHEN cs.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_sessions,
            SUM(CASE WHEN cs.status = 'abandoned' THEN 1 ELSE 0 END) as abandoned_sessions,
            AVG(CASE WHEN csd.cook_duration IS NOT NULL THEN csd.cook_duration END) as avg_cook_time_minutes,
            SUM(CASE WHEN csd.cook_duration IS NOT NULL THEN csd.cook_duration END) as total_cook_time_minutes,
            SUM(csd.exp_earned) as total_exp_earned,
            SUM(csd.gold_earned) as total_gold_earned,
            SUM(csd.gems_earned) as total_gems_earned,
            COUNT(DISTINCT cs.recipe_id) as unique_recipes_cooked,
            COUNT(DISTINCT csp2.user_id) as total_people_cooked_with,
            MAX(cs.completed_at) as last_session_date,
            MIN(cs.completed_at) as first_session_date
        FROM cooking_sessions cs
        JOIN cooking_session_details csd ON cs.id = csd.cooking_session_id
        JOIN cooking_session_participants csp ON cs.id = csp.cooking_session_id AND csp.user_id = :user_id
        LEFT JOIN cooking_session_participants csp2 ON cs.id = csp2.cooking_session_id
        WHERE 1=1
    ";
    
    $params = ['user_id' => $user_id];
    
    // Apply date filters if provided
    if ($date_from) {
        $query .= " AND DATE(cs.created_at) >= :date_from";
        $params['date_from'] = $date_from;
    }
    
    if ($date_to) {
        $query .= " AND DATE(cs.created_at) <= :date_to";
        $params['date_to'] = $date_to;
    }
    
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue(':' . $key, $value);
    }
    
    $stmt->execute();
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If no stats found, return default values
    if (!$stats) {
        return [
            'total_sessions' => 0,
            'solo_sessions' => 0,
            'multiplayer_sessions' => 0,
            'completed_sessions' => 0,
            'cancelled_sessions' => 0,
            'abandoned_sessions' => 0,
            'avg_cook_time_minutes' => 0,
            'total_cook_time_minutes' => 0,
            'total_exp_earned' => 0,
            'total_gold_earned' => 0,
            'total_gems_earned' => 0,
            'unique_recipes_cooked' => 0,
            'total_people_cooked_with' => 0,
            'last_session_date' => null,
            'first_session_date' => null
        ];
    }
    
    // Format the statistics
    $formattedStats = [
        'total_sessions' => (int)$stats['total_sessions'],
        'solo_sessions' => (int)$stats['solo_sessions'],
        'multiplayer_sessions' => (int)$stats['multiplayer_sessions'],
        'completed_sessions' => (int)$stats['completed_sessions'],
        'cancelled_sessions' => (int)$stats['cancelled_sessions'],
        'abandoned_sessions' => (int)$stats['abandoned_sessions'],
        'completion_rate' => $stats['total_sessions'] > 0 ? 
            round(($stats['completed_sessions'] / $stats['total_sessions']) * 100, 1) : 0,
        'avg_cook_time_minutes' => (int)$stats['avg_cook_time_minutes'],
        'total_cook_time_minutes' => (int)$stats['total_cook_time_minutes'],
        'total_cook_time_hours' => round($stats['total_cook_time_minutes'] / 60, 1),
        'total_exp_earned' => (int)$stats['total_exp_earned'],
        'total_gold_earned' => (int)$stats['total_gold_earned'],
        'total_gems_earned' => (int)$stats['total_gems_earned'],
        'unique_recipes_cooked' => (int)$stats['unique_recipes_cooked'],
        'total_people_cooked_with' => (int)$stats['total_people_cooked_with'],
        'last_session_date' => $stats['last_session_date'],
        'first_session_date' => $stats['first_session_date'],
        'streaks' => calculateSessionStreaks($user_id)
    ];
    
    return $formattedStats;
}

/**
 * Calculates cooking session streaks
 * 
 * @param string $user_id User ID
 * @return array Streak information
 */
function calculateSessionStreaks($user_id) {
    $db = Database::getConnection();
    
    // Get all completed session dates
    $query = "
        SELECT DISTINCT DATE(cs.completed_at) as session_date
        FROM cooking_sessions cs
        JOIN cooking_session_participants csp ON cs.id = csp.cooking_session_id
        WHERE csp.user_id = :user_id
        AND cs.status = 'completed'
        AND cs.completed_at IS NOT NULL
        ORDER BY session_date DESC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute(['user_id' => $user_id]);
    $dates = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (empty($dates)) {
        return [
            'current_streak' => 0,
            'longest_streak' => 0,
            'total_sessions' => 0
        ];
    }
    
    // Calculate streaks
    $current_streak = 0;
    $longest_streak = 0;
    $temp_streak = 0;
    $prev_date = null;
    
    foreach ($dates as $date) {
        $current_date = new DateTime($date);
        
        if ($prev_date === null) {
            // First date
            $temp_streak = 1;
        } else {
            $diff = $prev_date->diff($current_date)->days;
            
            if ($diff === 1) {
                // Consecutive day
                $temp_streak++;
            } else {
                // Streak broken
                if ($temp_streak > $longest_streak) {
                    $longest_streak = $temp_streak;
                }
                $temp_streak = 1;
            }
        }
        
        $prev_date = $current_date;
    }
    
    // Check for longest streak at the end
    if ($temp_streak > $longest_streak) {
        $longest_streak = $temp_streak;
    }
    
    // Check current streak (most recent consecutive days)
    $current_streak = 0;
    $today = new DateTime();
    $current_date = new DateTime($dates[0]);
    
    for ($i = 0; $i < count($dates); $i++) {
        $expected_date = clone $today;
        $expected_date->modify("-$i days");
        
        $session_date = new DateTime($dates[$i]);
        
        if ($session_date->format('Y-m-d') === $expected_date->format('Y-m-d')) {
            $current_streak++;
        } else {
            break;
        }
    }
    
    return [
        'current_streak' => $current_streak,
        'longest_streak' => $longest_streak,
        'total_sessions' => count($dates)
    ];
}

/**
 * Formats session data for frontend display
 * 
 * @param array $session Raw session data
 * @return array Formatted session
 */
function formatSessionForDisplay($session) {
    // Calculate progress percentage
    $progress = 0;
    if ($session['total_steps'] > 0) {
        $progress = round(($session['completed_steps'] / $session['total_steps']) * 100, 1);
    }
    
    // Calculate duration string
    $duration = '';
    if ($session['cook_duration']) {
        $hours = floor($session['cook_duration'] / 60);
        $minutes = $session['cook_duration'] % 60;
        
        if ($hours > 0) {
            $duration = $hours . 'h ' . $minutes . 'm';
        } else {
            $duration = $minutes . 'm';
        }
    }
    
    // Format rewards
    $rewards = [];
    if ($session['exp_earned'] > 0) {
        $rewards[] = $session['exp_earned'] . ' EXP';
    }
    if ($session['gold_earned'] > 0) {
        $rewards[] = $session['gold_earned'] . ' Gold';
    }
    if ($session['gems_earned'] > 0) {
        $rewards[] = $session['gems_earned'] . ' Gems';
    }
    
    // Get status display information
    $status_info = getSessionStatusInfo($session['status']);
    
    return [
        'id' => $session['id'],
        'recipe' => [
            'id' => $session['recipe_id'],
            'title' => $session['recipe_title'],
            'image' => $session['recipe_image'],
            'difficulty' => $session['recipe_difficulty'],
            'total_time' => ($session['preparation_time'] + $session['cooking_time']) . ' min'
        ],
        'host' => [
            'id' => $session['host_id'],
            'name' => $session['host_name'],
            'profile_picture' => $session['host_picture']
        ],
        'user_role' => $session['user_role'],
        'user_status' => $session['user_status'],
        'mode' => $session['mode'],
        'visibility' => $session['visibility'],
        'status' => $session['status'],
        'status_display' => $status_info['display'],
        'status_color' => $status_info['color'],
        'progress' => $progress,
        'completed_steps' => (int)$session['completed_steps'],
        'total_steps' => (int)$session['total_steps'],
        'participant_count' => (int)$session['participant_count'],
        'duration' => $duration,
        'cook_duration_minutes' => (int)$session['cook_duration'],
        'rewards' => $rewards,
        'exp_earned' => (int)$session['exp_earned'],
        'gold_earned' => (int)$session['gold_earned'],
        'gems_earned' => (int)$session['gems_earned'],
        'created_at' => $session['created_at'],
        'started_at' => $session['started_at'],
        'completed_at' => $session['completed_at'],
        'notes' => $session['notes'],
        'is_host' => ($session['host_id'] === $session['user_id']),
        'time_ago' => getTimeAgo($session['created_at'])
    ];
}

/**
 * Gets session status display information
 * 
 * @param string $status Session status
 * @return array Status display info
 */
function getSessionStatusInfo($status) {
    $status_map = [
        'planned' => ['display' => 'Planned', 'color' => '#3498db'],
        'preparing' => ['display' => 'Preparing', 'color' => '#9b59b6'],
        'cooking' => ['display' => 'Cooking', 'color' => '#e74c3c'],
        'paused' => ['display' => 'Paused', 'color' => '#f39c12'],
        'completed' => ['display' => 'Completed', 'color' => '#2ecc71'],
        'cancelled' => ['display' => 'Cancelled', 'color' => '#95a5a6'],
        'abandoned' => ['display' => 'Abandoned', 'color' => '#7f8c8d']
    ];
    
    return $status_map[$status] ?? ['display' => ucfirst($status), 'color' => '#95a5a6'];
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