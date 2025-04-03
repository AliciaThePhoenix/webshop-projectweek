<?php
// Start de sessie
session_start();

// Headers voor JSON response
header('Content-Type: application/json');

// Controleer of de gebruiker is ingelogd
if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    echo json_encode([
        "loggedin" => true, 
        "username" => $_SESSION["username"],
        "is_admin" => isset($_SESSION["is_admin"]) ? $_SESSION["is_admin"] : false
    ]);
} else {
    echo json_encode(["loggedin" => false]);
}
?>
