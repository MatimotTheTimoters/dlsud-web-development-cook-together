<?php
// backend/api/relationships/friends.php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ResponseFormatter::handlePreflight();
    exit;
}

// Set CORS headers for actual request
ResponseFormatter::setCorsHeaders();

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ResponseFormatter::error('Method not allowed', 405);
}

// Include required classes
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../classes/AuthHelper.php';
require_once __DIR__ . '/../../classes/DatabaseHelper.php';
require_once __DIR__ . '/../../classes/ResponseFormatter.php';

try {
    // Get token from Authorization header
    $token = AuthHelper::getBearerToken();
    
    if (!$token) {
        ResponseFormatter::unauthorized('No authentication token provided');
    }
    
    // Validate token
    $payload = AuthHelper::validateToken($token);
    
    if (!$payload) {
        ResponseFormatter::unauthorized('Invalid or expired token');
    }
    
    $current_user_id = $payload['user_id'];
    
    // Get and decode JSON input
    $json_input = file_get_contents('php://input');
    $input = json_decode($json_input, true);
    
    if (!$input) {
        ResponseFormatter::error('Invalid JSON input', 400);
    }
    
    // Validate required fields
    if (empty($input['target_user_id'])) {
        ResponseFormatter::validationError([
            'target_user_id' => 'Target user ID is required'
        ]);
    }
    
    if (empty($input['action'])) {
        ResponseFormatter::validationError([
            'action' => 'Action is required (follow, unfollow, or specific friend actions)'
        ]);
    }
    
    $target_user_id = $input['target_user_id'];
    $action = $input['action'];
    $message = $input['message'] ?? null;
    
    // Check if user is trying to interact with themselves
    if ($current_user_id === $target_user_id) {
        ResponseFormatter::error('Cannot perform friend action on yourself', 400);
    }
    
    // Check if target user exists
    $target_user = DatabaseHelper::getUserById($target_user_id);
    
    if (!$target_user) {
        ResponseFormatter::notFound('Target user not found');
    }
    
    // Prepare relationship data
    $relationship_data = [
        'type' => 'following', // Default type
        'status' => 'pending'  // Default status
    ];
    
    // Handle different actions
    switch ($action) {
        case 'follow':
            $relationship_data['type'] = 'following';
            $relationship_data['status'] = 'accepted';
            $success_action = 'create';
            break;
            
        case 'unfollow':
            $success_action = 'delete';
            $relationship_data['type'] = 'following';
            break;
            
        case 'send_request':
            $relationship_data['type'] = 'friend';
            $relationship_data['status'] = 'pending';
            $success_action = 'create';
            break;
            
        case 'accept_request':
            $relationship_data['type'] = 'friend';
            $relationship_data['status'] = 'accepted';
            $success_action = 'create';
            break;
            
        case 'reject_request':
        case 'cancel_request':
        case 'remove_friend':
            $success_action = 'delete';
            $relationship_data['type'] = 'friend';
            break;
            
        default:
            ResponseFormatter::error('Invalid action', 400);
    }
    
    // Manage relationship using DatabaseHelper
    $success = DatabaseHelper::manageRelationship($current_user_id, $target_user_id, $success_action, $relationship_data);
    
    if (!$success) {
        ResponseFormatter::error('Failed to process friend action', 500);
    }
    
    // Check if users are now friends by querying the database
    $sql = "SELECT 1 FROM user_relationships 
            WHERE ((source_user_id = :user1 AND target_user_id = :user2) 
                   OR (source_user_id = :user2 AND target_user_id = :user1))
            AND relationship_type = 'friend' AND status = 'accepted'";
    
    $are_friends = Database::fetchOne($sql, ['user1' => $current_user_id, 'user2' => $target_user_id]) ? true : false;
    
    // Prepare response data
    $response_data = [
        'friendship_status' => [
            'are_friends' => $are_friends,
            'action' => $action,
            'current_user_id' => $current_user_id,
            'target_user_id' => $target_user_id
        ],
        'target_user' => [
            'id' => $target_user['id'],
            'full_name' => $target_user['full_name'],
            'profile_picture' => $target_user['profile_picture'] ?? null
        ]
    ];
    
    // Set appropriate success message
    $messages = [
        'follow' => 'Successfully followed user',
        'unfollow' => 'Successfully unfollowed user',
        'send_request' => 'Friend request sent successfully',
        'accept_request' => 'Friend request accepted successfully',
        'reject_request' => 'Friend request rejected successfully',
        'cancel_request' => 'Friend request cancelled successfully',
        'remove_friend' => 'Friend removed successfully'
    ];
    
    $message = $messages[$action] ?? 'Action completed successfully';
    
    // Return success response
    ResponseFormatter::success($response_data, $message);
    
} catch (Exception $e) {
    error_log('Friends error: ' . $e->getMessage() . ' | Trace: ' . $e->getTraceAsString());
    ResponseFormatter::error('An error occurred while processing friend request', 500);
}
?>