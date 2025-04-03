<?php
// Start de sessie
session_start();

// Verwijder alle sessievariabelen
$_SESSION = [];

// Vernietig de sessie
session_destroy();

// Stuur de gebruiker terug naar de homepage
header("Location: ../../front-end/pages/homepage/index.html");
exit;
?>
