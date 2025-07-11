<?php
// c:\Users\sjcex\Documents\GitHub\cuando-sale-cristina\api\get_count.php
header('Content-Type: application/json');
require_once 'config.php';

$sql = "SELECT count FROM likes WHERE id = 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['success' => true, 'count' => (int)$row['count']]);
} else {
    // Si por alguna razón la fila no existe, la creamos con 0.
    $conn->query("INSERT INTO likes (id, count) VALUES (1, 0) ON DUPLICATE KEY UPDATE id=1");
    echo json_encode(['success' => true, 'count' => 0]);
}

$conn->close();
?>
