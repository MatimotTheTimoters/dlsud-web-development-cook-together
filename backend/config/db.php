<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "cooktogether";

$conn = new mysqli($host, $user, $pass, $dbname);

if($conn->connect_error){
    die(json_encode(["status" => "error", "message" => $conn->connect_error]));
}

header("Content-Type: application/json");
?>