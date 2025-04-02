<?php


session_start();
include 'db_connection.php';
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

// Functie om in te loggen
function login($username, $password, $conn) {
    // Bereid een SQL-statement voor om SQL-injecties te voorkomen
    $stmt = $conn->prepare("SELECT id, password, role FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // Controleer of de gebruiker bestaat
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Controleer of het wachtwoord klopt
        if (password_verify($password, $user['password'])) {
            // Sla de gebruikers-ID en rol op in de sessie
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];

            // Redirect op basis van de rol
            if ($user['role'] === 'admin') {
                header('Location: admin_dashboard.php');
            } else {
                header('Location: dashboard.php');
            }
            exit;
        } else {
            echo "Onjuist wachtwoord.";
        }
    } else {
        echo "Gebruiker niet gevonden.";
    }

    $stmt->close();
}

// Controleer of het formulier is ingediend
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Haal de ingevoerde gegevens op
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Roep de login-functie aan
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
    <form action="/login" method="POST">
        <label for="username">Gebruikersnaam:</label><br>
        <input type="text" id="username" name="username" required><br><br>
        <label for="password">Wachtwoord:</label><br>
        <input type="password" id="password" name="password" required><br><br>
        <input type="submit" value="Inloggen">
    </form>

    <p>Geen account? <a href="/register">Registreer hier</a></p>
    <p><a href="/forgot-password">Wachtwoord vergeten?</a></p>
    <p><a href="/">Terug naar de homepage</a></p>
</body>
</html>