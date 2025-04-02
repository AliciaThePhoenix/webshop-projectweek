<?php
$host = 'localhost';
$username = 'root';
$password = ''; // Zorg ervoor dat dit overeenkomt met je MySQL-wachtwoord
$database = 'projectweek_db';

$conn = new mysqli($host, $username, $password, $database);

// Controleer de verbinding
if ($conn->connect_error) {
    die("Verbinding mislukt: " . $conn->connect_error);
}
?>