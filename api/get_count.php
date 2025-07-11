<?php
// c:\Users\sjcex\Documents\GitHub\cuando-sale-cristina\api\get_count.php
header('Content-Type: application/json');
require_once 'config.php';
 
$likeId = 1; // Usamos una variable para el ID
 
// 1. Preparar la consulta
$stmt = $conn->prepare("SELECT count FROM likes WHERE id = ?");
// 2. Vincular parámetros (el 'i' significa que es un entero)
$stmt->bind_param("i", $likeId);
// 3. Ejecutar
$stmt->execute();
$result = $stmt->get_result();
 
if ($result && $result->num_rows > 0) {
     $row = $result->fetch_assoc();
     echo json_encode(['success' => true, 'count' => (int)$row['count']]);
} else {
     // Si la fila no existe, la creamos con 0.
     $conn->query("INSERT INTO likes (id, count) VALUES (1, 0) ON DUPLICATE KEY UPDATE count=count"); // Query robusta
     echo json_encode(['success' => true, 'count' => 0]);
}
 
$conn->close();
?>
