<?php
// Fouten tonen voor debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuratie
$host = "localhost";
$username = "root";
$password = "";
$database = "apothecare_webshop";

// Database verbinding maken
$conn = new mysqli($host, $username, $password, $database);

// Verbinding controleren
if ($conn->connect_error) {
    // Stuur foutmelding terug als JSON
    header('Content-Type: application/json');
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

try {
    // Alle producten ophalen
    $sql = "SELECT * FROM products";
    $result = $conn->query($sql);
    
    $products = [];
    
    if ($result && $result->num_rows > 0) {
        // Producten toevoegen aan array
        while($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
    }
    
    // Producten als JSON teruggeven
    header('Content-Type: application/json');
    echo json_encode($products);
} catch (Exception $e) {
    // Stuur foutmelding terug als JSON
    header('Content-Type: application/json');
    echo json_encode(["error" => "Error: " . $e->getMessage()]);
}

// Verbinding sluiten
$conn->close();
?>