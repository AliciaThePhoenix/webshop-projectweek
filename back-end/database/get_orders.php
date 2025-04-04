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
    // PDO voor veiligere database-interactie
    $dsn = "mysql:host=$host;dbname=$database;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // Controleer of orders tabel bestaat, zo niet dan aanmaken
    $stmt = $pdo->query("SHOW TABLES LIKE 'orders'");
    $ordersTableExists = $stmt->rowCount() > 0;
    
    if (!$ordersTableExists) {
        // Maak orders tabel aan
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `orders` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `user_id` int(11) NOT NULL,
              `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
              `status` varchar(50) NOT NULL DEFAULT 'Pending',
              `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
              `shipping_address` text DEFAULT NULL,
              `shipping_city` varchar(100) DEFAULT NULL,
              `shipping_postal_code` varchar(20) DEFAULT NULL,
              `payment_method` varchar(50) DEFAULT NULL,
              `notes` text DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `user_id` (`user_id`),
              CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        ");
        
        // Maak order_items tabel aan
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `order_items` (
              `id` int(11) NOT NULL AUTO_INCREMENT,
              `order_id` int(11) NOT NULL,
              `product_id` int(11) NOT NULL,
              `quantity` int(11) NOT NULL DEFAULT 1,
              `price` decimal(10,2) NOT NULL,
              PRIMARY KEY (`id`),
              KEY `order_id` (`order_id`),
              CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        ");
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
