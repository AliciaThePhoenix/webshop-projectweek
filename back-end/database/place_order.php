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
    echo json_encode(["success" => false, "message" => "U moet ingelogd zijn om een bestelling te plaatsen"]);
    exit;
}

// Controleer of het verzoek een POST-verzoek is
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["success" => false, "message" => "Alleen POST-verzoeken worden geaccepteerd"]);
    exit;
}

// Verkrijg en decodeer JSON-data uit het verzoek
$json_data = file_get_contents('php://input');
$cart_data = json_decode($json_data, true);

// Controleer of er items zijn om te bestellen
if (empty($cart_data) || !isset($cart_data['items']) || empty($cart_data['items'])) {
    echo json_encode(["success" => false, "message" => "Geen producten in de winkelwagen"]);
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
    
    // Begin een transactie
    $pdo->beginTransaction();
    
    // Verkrijg gebruiker-ID uit de sessie
    $user_id = $_SESSION["id"];
    $total_amount = $cart_data['total'];
    
    // Maak een nieuwe bestelling aan
    $stmt = $pdo->prepare("
        INSERT INTO orders (user_id, total_amount, status, shipping_address, shipping_city, shipping_postal_code, payment_method)
        VALUES (:user_id, :total_amount, 'Pending', :shipping_address, :shipping_city, :shipping_postal_code, :payment_method)
    ");
    
    // Haal verzendgegevens op uit de gebruikersgegevens
    $user_stmt = $pdo->prepare("SELECT address, city, postal_code FROM users WHERE id = :user_id");
    $user_stmt->execute(["user_id" => $user_id]);
    $user_data = $user_stmt->fetch();
    
    $stmt->execute([
        "user_id" => $user_id,
        "total_amount" => $total_amount,
        "shipping_address" => $user_data['address'] ?? '',
        "shipping_city" => $user_data['city'] ?? '',
        "shipping_postal_code" => $user_data['postal_code'] ?? '',
        "payment_method" => $cart_data['payment_method'] ?? 'Unknown'
    ]);
    
    // Verkrijg het nieuwe bestelling-ID
    $order_id = $pdo->lastInsertId();
    
    // Voeg de producten toe aan de bestelling
    $item_stmt = $pdo->prepare("
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (:order_id, :product_id, :quantity, :price)
    ");
    
    foreach ($cart_data['items'] as $item) {
        $item_stmt->execute([
            "order_id" => $order_id,
            "product_id" => $item['id'],
            "quantity" => $item['quantity'],
            "price" => $item['price']
        ]);
    }
    
    // Commit de transactie
    $pdo->commit();
    
    echo json_encode([
        "success" => true, 
        "message" => "Bestelling succesvol geplaatst",
        "order_id" => $order_id
    ]);
    
} catch (PDOException $e) {
    // Rollback bij een fout
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    echo json_encode([
        "success" => false, 
        "message" => "Database fout: " . $e->getMessage()
    ]);
}
?>
