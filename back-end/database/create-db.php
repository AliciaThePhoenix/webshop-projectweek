<?php
// Database configuratie
$host = "localhost";
$username = "root";
$password = "";
$database = "apothecare_webshop";

// Verbinding maken met MySQL server
$conn = new mysqli($host, $username, $password);

// Verbinding controleren
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Database aanmaken als deze nog niet bestaat
$sql = "CREATE DATABASE IF NOT EXISTS apothecare_webshop";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully or already exists<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Database selecteren
$conn->select_db("apothecare_webshop");

// Producten tabel aanmaken
$sql = "CREATE TABLE IF NOT EXISTS products (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_status VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Products table created successfully or already exists<br>";
} else {
    echo "Error creating products table: " . $conn->error . "<br>";
}

// Voorbeeld producten invoegen
$products = [
    [
        'name' => 'Paracetamol 500mg',
        'description' => 'Pijnstillend en koortsverlagend medicijn voor milde tot matige pijn.',
        'price' => 3.99,
        'stock_status' => 'Op voorraad',
        'image_url' => '../../IMG/paracetamol.png'
    ],
    [
        'name' => 'Ibuprofen 400mg',
        'description' => 'Ontstekingsremmende pijnstiller voor gewrichtspijn en ontstekingen.',
        'price' => 4.50,
        'stock_status' => 'Op voorraad',
        'image_url' => '../images/ibuprofen.jpg'
    ],
    [
        'name' => 'Vitamine C 1000mg',
        'description' => 'Ondersteunt het immuunsysteem en helpt bij vermoeidheid.',
        'price' => 8.95,
        'stock_status' => 'Op voorraad',
        'image_url' => '../images/vitaminec.jpg'
    ],
    [
        'name' => 'Multivitamine Complex',
        'description' => 'Dagelijkse aanvulling van essentiële vitamines en mineralen.',
        'price' => 12.99,
        'stock_status' => 'Beperkte voorraad',
        'image_url' => '../images/multivitamine.jpg'
    ],
    [
        'name' => 'Probiotica 50 miljard CFU',
        'description' => 'Ondersteunt een gezonde darmflora en spijsvertering.',
        'price' => 15.75,
        'stock_status' => 'Op voorraad',
        'image_url' => '../images/probiotica.jpg'
    ],
    [
        'name' => 'Pracetamol 150mg',
        'description' => 'Helpt met allerlei hooftpijn, buikpijn.',
        'price' => 8.55,
        'stock_status' => 'Op voorraad',
        'image_url' => '../images/probiotica.jpg'
    ]
];

// Controleren of er al producten bestaan
$result = $conn->query("SELECT COUNT(*) as count FROM products");
$row = $result->fetch_assoc();

if ($row['count'] == 0) {
    // Voorbeeld producten invoegen
    foreach ($products as $product) {
        $sql = "INSERT INTO products (name, description, price, stock_status, image_url) 
                VALUES ('{$product['name']}', '{$product['description']}', {$product['price']}, 
                '{$product['stock_status']}', '{$product['image_url']}')";
        
        if ($conn->query($sql) === TRUE) {
            echo "Product '{$product['name']}' inserted successfully<br>";
        } else {
            echo "Error inserting product: " . $conn->error . "<br>";
        }
    }
} else {
    echo "Products are already in the database. Skipping insertion.<br>";
}

$conn->close();
echo "Database setup completed!";
?>