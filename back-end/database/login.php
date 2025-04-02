<?php
session_start();
include 'db_connect.php';

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

// Functie om in te loggen
function login($username, $password, $conn) {
    $stmt = $conn->prepare("SELECT id, password, role FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            // Redirect naar index2.php
            header('Location: index2.php');
            exit;
        } else {
            echo "Onjuist wachtwoord.";
        }
    } else {
        echo "Gebruiker niet gevonden.";
    }

    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    login($username, $password, $conn);
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