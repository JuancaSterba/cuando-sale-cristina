<?php
// c:\Users\sjcex\Documents\GitHub\cuando-sale-cristina\api\increment_count.php
header('Content-Type: application/json');
require_once 'config.php';

// Esta operación es "atómica" en la mayoría de los motores de BD (como InnoDB),
// lo que significa que es segura incluso si muchas personas dan like al mismo tiempo.
$sql = "UPDATE likes SET count = count + 1 WHERE id = 1";

if ($conn->query($sql) === TRUE) {
    // Ahora, obtenemos el nuevo valor para devolverlo
    $result = $conn->query("SELECT count FROM likes WHERE id = 1");
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['success' => true, 'count' => (int)$row['count']]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'No se pudo leer el nuevo contador.']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al incrementar el contador.']);
}

$conn->close();
?>
