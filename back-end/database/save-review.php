<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $content = mysqli_real_escape_string($conn, $_POST['content']);
    $rating = intval($_POST['rating']);

    $sql = "INSERT INTO reviews (name, content, rating) VALUES ('$name', '$content', $rating)";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
}

mysqli_close($conn);
?>
