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
 
// Verificamos si el usuario actual ya ha dado like
$user_ip = $_SERVER['REMOTE_ADDR']; // Obtenemos la IP real
$hashed_ip = hash('sha256', $user_ip . IP_HASH_SALT); // Creamos el hash seguro
$user_has_liked = false;

$stmt_check = $conn->prepare("SELECT ip_address FROM user_likes WHERE ip_address = ?");
$stmt_check->bind_param("s", $hashed_ip); // Buscamos por el hash, no por la IP
$stmt_check->execute();
$result_check = $stmt_check->get_result();
if ($result_check->num_rows > 0) {
    $user_has_liked = true;
}

if ($result && $result->num_rows > 0) {
     $row = $result->fetch_assoc();
     // Devolvemos el contador Y si el usuario ya ha votado
     echo json_encode(['success' => true, 'count' => (int)$row['count'], 'userHasLiked' => $user_has_liked]);
} else {
     // Si la fila no existe, la creamos con 0.
     $conn->query("INSERT INTO likes (id, count) VALUES (1, 0) ON DUPLICATE KEY UPDATE count=count"); // Query robusta
     echo json_encode(['success' => true, 'count' => 0, 'userHasLiked' => $user_has_liked]);
}
 
$conn->close();
?>
