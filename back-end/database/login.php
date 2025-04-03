<?php
// Start de sessie
session_start();

// Schakel foutmeldingen in voor ontwikkeling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers voor JSON response
header('Content-Type: application/json');

// Controleer of het verzoek een POST-verzoek is
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["success" => false, "message" => "Alleen POST-verzoeken worden geaccepteerd"]);
    exit;
}

// Controleer of de benodigde velden zijn ingevuld
if (empty($_POST["username"]) || empty($_POST["password"])) {
    echo json_encode(["success" => false, "message" => "Gebruikersnaam en wachtwoord zijn vereist"]);
    exit;
}

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
    
    // Haal gebruikersgegevens op aan de hand van de gebruikersnaam of e-mail
    $stmt = $pdo->prepare("SELECT id, username, password, is_admin FROM users WHERE username = :username OR email = :email");
    $stmt->execute([
        "username" => $_POST["username"],
        "email" => $_POST["username"]
    ]);
    $user = $stmt->fetch();
    
    // Controleer of de gebruiker bestaat en het wachtwoord klopt
    if ($user && password_verify($_POST["password"], $user["password"])) {
        // Inloggen gelukt, sla gebruikersgegevens op in sessie
        $_SESSION["loggedin"] = true;
        $_SESSION["id"] = $user["id"];
        $_SESSION["username"] = $user["username"];
        $_SESSION["is_admin"] = $user["is_admin"];
        
        echo json_encode(["success" => true, "message" => "Inloggen succesvol"]);
    } else {
        // Inloggen mislukt
        echo json_encode(["success" => false, "message" => "Ongeldige gebruikersnaam of wachtwoord"]);
    }
} catch (PDOException $e) {
    // Database fout
    echo json_encode(["success" => false, "message" => "Database fout: " . $e->getMessage()]);
}
?>
