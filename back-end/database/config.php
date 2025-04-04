<?php
// Database configuratie
$host = "localhost";
$username = "root"; 
$password = ""; 
$database = "apothecare_webshop";

// Database verbinding maken
$conn = new mysqli($host, $username, $password, $database);

// Verbinding controleren
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>