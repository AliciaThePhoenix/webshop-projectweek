<?php
// Start de sessie
session_start();

// Schakel foutmeldingen in voor ontwikkeling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers voor JSON response
header('Content-Type: application/json');

// Controleer of de gebruiker is ingelogd
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    echo json_encode(["success" => false, "message" => "Gebruiker is niet ingelogd"]);
    exit;
}

// Verkrijg user_id uit de sessie
$user_id = $_SESSION["id"];

// Verbinding maken met de database
require_once "config.php";

try {
    // Gebruik PDO voor veiligere database-interactie
    $dsn = "mysql:host=$host;dbname=$database;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // Haal gebruikersgegevens op
    $stmt = $pdo->prepare("SELECT id, username, email, first_name, last_name, address, city, postal_code, phone, created_at FROM users WHERE id = :user_id");
    $stmt->execute(["user_id" => $user_id]);
    
    $user = $stmt->fetch();
    
    if ($user) {
        // Verwijder gevoelige gegevens
        unset($user["password"]);
        
        echo json_encode([
            "success" => true, 
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Gebruiker niet gevonden"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Database fout: " . $e->getMessage()
    ]);
}
?>
