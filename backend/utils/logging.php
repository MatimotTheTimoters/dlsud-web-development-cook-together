<?php

/**
 * logging.php - Logging system for errors, user activities, and API requests
 * @see index.md: Logging system for errors, user activities, and API requests
 */

function logError($message, $context = []) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'level' => 'ERROR',
        'message' => $message,
        'context' => $context,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown'
    ];
    
    return writeLog('errors', $logEntry);
}

function logActivity($user_id, $action, $details = []) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'level' => 'INFO',
        'user_id' => $user_id,
        'action' => $action,
        'details' => $details,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    return writeLog('activities', $logEntry);
}

function logApiRequest($method, $endpoint, $status) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'level' => 'INFO',
        'method' => $method,
        'endpoint' => $endpoint,
        'status' => $status,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'query_string' => $_SERVER['QUERY_STRING'] ?? ''
    ];
    
    return writeLog('api_requests', $logEntry);
}

/**
 * Write log entry to file
 * 
 * @param string $type Type of log (errors, activities, api_requests)
 * @param array $data Log data
 * @return bool True on success, false on failure
 */
function writeLog($type, $data) {
    // Ensure logs directory exists
    $logsDir = __DIR__ . '/../logs/';
    if (!file_exists($logsDir)) {
        mkdir($logsDir, 0755, true);
    }
    
    // Create daily log files
    $date = date('Y-m-d');
    $logFile = $logsDir . $type . '_' . $date . '.log';
    
    // Format log entry
    $logLine = json_encode($data) . PHP_EOL;
    
    // Write to file
    if (file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX) !== false) {
        return true;
    }
    
    return false;
}

/**
 * Get recent log entries
 * 
 * @param string $type Type of log
 * @param int $limit Number of entries to retrieve
 * @return array Array of log entries
 */
function getLogs($type, $limit = 100) {
    $logsDir = __DIR__ . '/../logs/';
    $date = date('Y-m-d');
    $logFile = $logsDir . $type . '_' . $date . '.log';
    
    $logs = [];
    
    if (file_exists($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines) {
            $lines = array_slice($lines, -$limit); // Get last $limit entries
            foreach ($lines as $line) {
                $logData = json_decode($line, true);
                if ($logData) {
                    $logs[] = $logData;
                }
            }
        }
    }
    
    return array_reverse($logs); // Return most recent first
}

/**
 * Clear old log files (older than 30 days)
 * 
 * @return int Number of files deleted
 */
function cleanupOldLogs() {
    $logsDir = __DIR__ . '/../logs/';
    $deletedCount = 0;
    
    if (file_exists($logsDir)) {
        $files = glob($logsDir . '*.log');
        $thirtyDaysAgo = strtotime('-30 days');
        
        foreach ($files as $file) {
            if (filemtime($file) < $thirtyDaysAgo) {
                if (unlink($file)) {
                    $deletedCount++;
                }
            }
        }
    }
    
    return $deletedCount;
}