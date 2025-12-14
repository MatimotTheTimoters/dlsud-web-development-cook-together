<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database
{
    private $host = "localhost";
    private $username = "root";
    private $password = "";
    private $database = "cooktogether";
    private $conn;

    public function __construct()
    {
        try {
            $this->conn = new mysqli(
                $this->host,
                $this->username,
                $this->password,
                $this->database
            );

            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
        } catch (Exception $e) {
            $this->sendError($e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->conn;
    }

    public function closeConnection()
    {
        if ($this->conn) {
            $this->conn->close();
        }
    }

    private function sendError($message)
    {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $message
        ]);
        exit();
    }
}
