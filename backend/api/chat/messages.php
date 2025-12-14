<?php

// Set CORS headers
require_once __DIR__ . '/../../config/cors.php';
CORS::setCorsHeaders();
CORS::handlePreflight();

require_once '../../config/database.php';
require_once '../../classes/AuthHelper.php';
require_once '../../classes/DatabaseHelper.php';
require_once '../../classes/ResponseFormatter.php';
require_once '../../utils/uuidHelper.php';

header('Content-Type: application/json');

$response = new ResponseFormatter();

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Get authorization header
    $token = AuthHelper::getBearerToken();
    if (!$token) {
        $response->unauthorized('Authentication required');
        exit;
    }

    // Validate token
    $userData = AuthHelper::validateToken($token);
    if (!$userData) {
        $response->unauthorized('Invalid or expired token');
        exit;
    }

    $user_id = $userData['user_id'];
    $dbHelper = new DatabaseHelper();

    // Handle different HTTP methods
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            handleGetMessages($user_id, $dbHelper, $response);
            break;
        case 'POST':
            handlePostMessage($user_id, $dbHelper, $response);
            break;
        case 'DELETE':
            handleDeleteMessage($user_id, $dbHelper, $response);
            break;
        default:
            $response->error('Method not allowed', 405);
            break;
    }
} catch (Exception $e) {
    error_log("Chat API error: " . $e->getMessage());
    $response->error('Server error: ' . $e->getMessage(), 500);
}

// GET: Retrieve chat messages for a session
function handleGetMessages($user_id, $dbHelper, $response) {
    // Get session ID from query parameters
    if (!isset($_GET['session_id'])) {
        $response->badRequest('Session ID is required');
        exit;
    }

    $session_id = $_GET['session_id'];
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $before_id = isset($_GET['before_id']) ? $_GET['before_id'] : null;

    // Check if user is a participant in the session
    if (!$dbHelper->isSessionParticipant($session_id, $user_id)) {
        $response->forbidden('You are not a participant in this session');
        exit;
    }

    // Get messages
    $messages = $dbHelper->getSessionChat($session_id, $limit, $offset, $before_id);
    
    // Mark messages as read for this user
    $dbHelper->markMessagesAsRead($session_id, $user_id);

    $responseData = [
        'messages' => $messages,
        'count' => count($messages),
        'session_id' => $session_id,
        'limit' => $limit,
        'offset' => $offset
    ];

    $response->success($responseData, 'Messages retrieved successfully');
}

// POST: Send a new chat message
function handlePostMessage($user_id, $dbHelper, $response) {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        $response->badRequest('Invalid JSON input');
        exit;
    }

    // Validate required fields
    if (empty($input['session_id'])) {
        $response->validationError(['session_id' => 'Session ID is required']);
        exit;
    }

    if (empty($input['message'])) {
        $response->validationError(['message' => 'Message content is required']);
        exit;
    }

    $session_id = $input['session_id'];
    $message_content = trim($input['message']);
    $message_type = isset($input['message_type']) ? $input['message_type'] : 'text';

    // Validate message type
    $allowed_types = ['text', 'system', 'vote'];
    if (!in_array($message_type, $allowed_types)) {
        $response->validationError(['message_type' => 'Invalid message type']);
        exit;
    }

    // Check if user is a participant in the session
    if (!$dbHelper->isSessionParticipant($session_id, $user_id)) {
        $response->forbidden('You are not a participant in this session');
        exit;
    }

    // Check if session is active
    $session = $dbHelper->getCookingSession($session_id);
    if (!$session) {
        $response->notFound('Cooking session not found');
        exit;
    }

    $inactive_statuses = ['completed', 'cancelled', 'abandoned'];
    if (in_array($session['status'], $inactive_statuses)) {
        $response->badRequest('Cannot send messages in a completed or cancelled session');
        exit;
    }

    // Save chat message
    $messageData = [
        'session_id' => $session_id,
        'user_id' => $user_id,
        'message' => $message_content,
        'message_type' => $message_type
    ];

    $messageId = $dbHelper->saveChatMessage($messageData);
    
    if (!$messageId) {
        $response->error('Failed to save message', 500);
        exit;
    }

    // Get the saved message with user details
    $savedMessage = $dbHelper->getChatMessage($messageId);
    
    // Log activity
    $dbHelper->logActivity($user_id, 'chat_message_sent', [
        'session_id' => $session_id,
        'message_id' => $messageId,
        'message_type' => $message_type
    ]);

    // If it's a system message (like user joined), don't require response with user data
    if ($message_type === 'system') {
        $response->success([
            'message_id' => $messageId,
            'session_id' => $session_id,
            'timestamp' => date('Y-m-d H:i:s')
        ], 'Message sent successfully');
    } else {
        $response->success($savedMessage, 'Message sent successfully');
    }
}

// DELETE: Delete a message (only allowed for sender or session host)
function handleDeleteMessage($user_id, $dbHelper, $response) {
    // Get message ID from query parameters
    if (!isset($_GET['message_id'])) {
        $response->badRequest('Message ID is required');
        exit;
    }

    $message_id = $_GET['message_id'];
    
    // Get message details
    $message = $dbHelper->getChatMessage($message_id);
    if (!$message) {
        $response->notFound('Message not found');
        exit;
    }

    // Check permissions
    $is_sender = ($message['user_id'] === $user_id);
    $session = $dbHelper->getCookingSession($message['cooking_session_id']);
    $is_host = ($session && $session['host_id'] === $user_id);
    
    if (!$is_sender && !$is_host) {
        $response->forbidden('You do not have permission to delete this message');
        exit;
    }

    // Delete message (soft delete or hard delete)
    $success = $dbHelper->deleteChatMessage($message_id);
    
    if (!$success) {
        $response->error('Failed to delete message', 500);
        exit;
    }

    $response->success([
        'message_id' => $message_id,
        'deleted_at' => date('Y-m-d H:i:s')
    ], 'Message deleted successfully');
}

?>