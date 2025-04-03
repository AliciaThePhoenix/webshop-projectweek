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
        $sql = "SELECT id FROM users WHERE username = :username";
        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":username", $param_username, PDO::PARAM_STR);
            $param_username = trim($_POST["username"]);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $username_err = "Deze gebruikersnaam is al in gebruik.";
            } else {
                $username = trim($_POST["username"]);
            }
            unset($stmt);
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
        $sql = "INSERT INTO users (username, password) VALUES (:username, :password)";

        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":username", $param_username, PDO::PARAM_STR);
            $stmt->bindParam(":password", $param_password, PDO::PARAM_STR);

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
            unset($stmt);
        }
    }

    // Verbinding sluiten
    unset($pdo);
}

// Verwijderbewerking verwerken na bevestiging
if (isset($_POST["id"]) && !empty($_POST["id"])) {
    // Configuratiebestand opnemen
    require_once "config.php";

    // Bereid een delete statement voor
    $sql = "DELETE FROM employees WHERE id = :id";

    if($stmt = $pdo->prepare($sql)){
        // Variabelen binden aan de voorbereide statement als parameters
        $stmt->bindParam(":id", $param_id, PDO::PARAM_INT);

        // Parameters instellen
        $param_id = trim($_POST["id"]);

        // Poging om de voorbereide statement uit te voeren
        if ($stmt->execute()) {
            // Records succesvol verwijderd. Doorverwijzen naar de startpagina
            header("location: index.php");
            exit();
        } else {
            echo "Oeps! Er is iets misgegaan. Probeer het later opnieuw.";
        }
    }

    // Statement sluiten
    unset($stmt);

    // Verbinding sluiten
    unset($pdo);
} else {
    // Controleer of het id-parameter bestaat
    if (empty(trim($_GET["id"]))) {
        // URL bevat geen id-parameter. Doorverwijzen naar foutpagina
        header("location: error.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Account Verwijderen</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .wrapper {
            width: 600px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <h2 class="mt-5 mb-3">Account Verwijderen</h2>
                    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                        <div class="alert alert-danger">
                            <input type="hidden" name="id" value="<?php echo trim($_GET["id"]); ?>"/>
                            <p>Weet u zeker dat u dit account wilt verwijderen?</p>
                            <p>
                                <input type="submit" value="Ja" class="btn btn-danger">
                                <a href="index.php" class="btn btn-secondary ml-2">Nee</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>        
        </div>
    </div>
</body>
</html>