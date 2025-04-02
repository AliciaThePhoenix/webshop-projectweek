<?php
session_start();
include 'db_connect.php'; // Zorg ervoor dat $pdo correct wordt geïnitialiseerd

// Functie om in te loggen
function login($username, $password, $pdo) {
    $stmt = $pdo->prepare("SELECT id, password, role FROM users WHERE username = :username");
    $stmt->bindParam(":username", $username, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            // Redirect to index2.php
            header('Location: index2.php');
            exit;
        } else {
            echo "Onjuist wachtwoord.";
        }
    } else {
        echo "Gebruiker niet gevonden.";
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    login($username, $password, $pdo); // Gebruik $pdo in plaats van $conn
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h1>Inloggen</h1>
    <form action="login.php" method="POST">
        <label for="username">Gebruikersnaam:</label><br>
        <input type="text" id="username" name="username" required><br><br>
        <label for="password">Wachtwoord:</label><br>
        <input type="password" id="password" name="password" required><br><br>
        <input type="submit" value="Inloggen">
    </form>

    <p>Geen account? <a href="register.php">Registreer hier</a></p>
    <p><a href="/forgot-password">Wachtwoord vergeten?</a></p>
    <p><a href="/">Terug naar de homepage</a></p>
</body>
</html>