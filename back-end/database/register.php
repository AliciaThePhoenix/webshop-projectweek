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
if (empty($_POST["username"]) || empty($_POST["email"]) || empty($_POST["password"]) || empty($_POST["confirm_password"])) {
    echo json_encode(["success" => false, "message" => "Alle verplichte velden moeten worden ingevuld"]);
    exit;
}

// Valideer e-mail
if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Ongeldig e-mailadres"]);
    exit;
}

// Controleer of wachtwoorden overeenkomen
if ($_POST["password"] !== $_POST["confirm_password"]) {
    echo json_encode(["success" => false, "message" => "Wachtwoorden komen niet overeen"]);
    exit;
}

// Controleer wachtwoordlengte
if (strlen($_POST["password"]) < 6) {
    echo json_encode(["success" => false, "message" => "Wachtwoord moet minimaal 6 tekens bevatten"]);
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
    
    // Controleer of de gebruikersnaam al bestaat
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute(["username" => $_POST["username"]]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Gebruikersnaam is al in gebruik"]);
        exit;
    }
    
    // Controleer of het e-mailadres al bestaat
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(["email" => $_POST["email"]]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "E-mailadres is al in gebruik"]);
        exit;
    }
    
    // Voeg de gebruiker toe aan de database
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, first_name, last_name, address, city, postal_code, phone) 
                          VALUES (:username, :email, :password, :first_name, :last_name, :address, :city, :postal_code, :phone)");
    
    // Maak een gehashed wachtwoord
    $hashed_password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    
    // Bind parameters
    $stmt->bindParam(":username", $_POST["username"]);
    $stmt->bindParam(":email", $_POST["email"]);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":first_name", $_POST["first_name"]);
    $stmt->bindParam(":last_name", $_POST["last_name"]);
    $stmt->bindParam(":address", $_POST["address"]);
    $stmt->bindParam(":city", $_POST["city"]);
    $stmt->bindParam(":postal_code", $_POST["postal_code"]);
    $stmt->bindParam(":phone", $_POST["phone"]);
    
    // Voer query uit
    $stmt->execute();
    
    // Automatisch inloggen na registratie
    $_SESSION["loggedin"] = true;
    $_SESSION["id"] = $pdo->lastInsertId();
    $_SESSION["username"] = $_POST["username"];
    
    echo json_encode(["success" => true, "message" => "Registratie succesvol"]);
    
} catch (PDOException $e) {
    // Database fout
    echo json_encode(["success" => false, "message" => "Database fout: " . $e->getMessage()]);
}
?>
