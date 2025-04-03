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
    echo json_encode(["success" => false, "message" => "Gebruiker is niet ingelogd"]);
    exit;
}

// Verkrijg user_id uit de sessie
$user_id = $_SESSION["id"];

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
    
    // Controleer of orders tabel bestaat
    $stmt = $pdo->query("SHOW TABLES LIKE 'orders'");
    $ordersTableExists = $stmt->rowCount() > 0;
    
    if (!$ordersTableExists) {
        // Als de tabel niet bestaat, stuur een lege array terug met een hint
        echo json_encode([
            "success" => true,
            "message" => "Orders tabel bestaat nog niet in de database",
            "orders" => [],
            "stats" => [
                "total_orders" => 0,
                "total_products" => 0
            ]
        ]);
        exit;
    }
    
    // Haal bestellingen op
    $stmt = $pdo->prepare("
        SELECT 
            o.id as order_id, 
            o.order_date as date, 
            o.status, 
            o.total_amount as total,
            COUNT(oi.id) as product_count
        FROM 
            orders o
        LEFT JOIN 
            order_items oi ON o.id = oi.order_id
        WHERE 
            o.user_id = :user_id
        GROUP BY 
            o.id
        ORDER BY 
            o.order_date DESC
    ");
    $stmt->execute(["user_id" => $user_id]);
    
    $orders = $stmt->fetchAll();
    
    // Bereken statistieken
    $totalOrders = count($orders);
    $totalProducts = 0;
    
    foreach ($orders as $order) {
        $totalProducts += $order['product_count'];
    }
    
    echo json_encode([
        "success" => true,
        "orders" => $orders,
        "stats" => [
            "total_orders" => $totalOrders,
            "total_products" => $totalProducts
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database fout: " . $e->getMessage()
    ]);
}
?>
