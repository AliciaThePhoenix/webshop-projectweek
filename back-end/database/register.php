<?php
session_start();
include 'db_connect.php';

// Variabelen initialiseren
$username = $password = $confirm_password = "";
$username_err = $password_err = $confirm_password_err = "";

// Formuliergegevens verwerken wanneer het formulier wordt ingediend
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Gebruikersnaam valideren
    if (empty(trim($_POST["username"]))) {
        $username_err = "Voer een gebruikersnaam in.";
    } else {
        // Controleer of de gebruikersnaam al bestaat
        $sql = "SELECT id FROM users WHERE username = ?";
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $param_username);
            $param_username = trim($_POST["username"]);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows == 1) {
                $username_err = "Deze gebruikersnaam is al in gebruik.";
            } else {
                $username = trim($_POST["username"]);
            }
            $stmt->close();
        }
    }

    // Wachtwoord valideren
    if (empty(trim($_POST["password"]))) {
        $password_err = "Voer een wachtwoord in.";
    } elseif (strlen(trim($_POST["password"])) < 6) {
        $password_err = "Het wachtwoord moet minimaal 6 tekens bevatten.";
    } else {
        $password = trim($_POST["password"]);
    }

    // Bevestig wachtwoord valideren
    if (empty(trim($_POST["confirm_password"]))) {
        $confirm_password_err = "Bevestig het wachtwoord.";
    } else {
        $confirm_password = trim($_POST["confirm_password"]);
        if (empty($password_err) && ($password != $confirm_password)) {
            $confirm_password_err = "Wachtwoorden komen niet overeen.";
        }
    }

    // Controleer invoerfouten voordat gegevens worden ingevoerd
    if (empty($username_err) && empty($password_err) && empty($confirm_password_err)) {
        // Bereid een insert statement voor
        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("ss", $param_username, $param_password);

            // Parameters instellen
            $param_username = $username;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Wachtwoord hashen

            if ($stmt->execute()) {
                // Registratie succesvol, doorverwijzen naar loginpagina
                header("location: login.php");
                exit();
            } else {
                echo "Oeps! Er is iets misgegaan. Probeer het later opnieuw.";
            }
            $stmt->close();
        }
    }

    // Verbinding sluiten
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registreren</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .wrapper {
            width: 400px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <h2>Registreren</h2>
        <p>Vul dit formulier in om een account aan te maken.</p>
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
            <div class="form-group">
                <label>Gebruikersnaam</label>
                <input type="text" name="username" class="form-control <?php echo (!empty($username_err)) ? 'is-invalid' : ''; ?>" value="<?php echo $username; ?>">
                <span class="invalid-feedback"><?php echo $username_err; ?></span>
            </div>
            <div class="form-group">
                <label>Wachtwoord</label>
                <input type="password" name="password" class="form-control <?php echo (!empty($password_err)) ? 'is-invalid' : ''; ?>" value="<?php echo $password; ?>">
                <span class="invalid-feedback"><?php echo $password_err; ?></span>
            </div>
            <div class="form-group">
                <label>Bevestig Wachtwoord</label>
                <input type="password" name="confirm_password" class="form-control <?php echo (!empty($confirm_password_err)) ? 'is-invalid' : ''; ?>" value="<?php echo $confirm_password; ?>">
                <span class="invalid-feedback"><?php echo $confirm_password_err; ?></span>
            </div>
            <div class="form-group">
                <input type="submit" class="btn btn-primary" value="Registreren">
                <a href="login.php" class="btn btn-secondary ml-2">Annuleren</a>
            </div>
        </form>
    </div>
</body>
</html>