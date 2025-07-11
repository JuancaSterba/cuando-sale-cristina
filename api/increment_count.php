<?php
// c:\Users\sjcex\Documents\GitHub\cuando-sale-cristina\api\increment_count.php
header('Content-Type: application/json');
require_once 'config.php';

// Esta operación es "atómica" en la mayoría de los motores de BD (como InnoDB),
// lo que significa que es segura incluso si muchas personas dan like al mismo tiempo.
$likeId = 1;

// Usamos una transacción para asegurar que ambas operaciones (actualizar y leer) se completen exitosamente.
$conn->begin_transaction();

try {
    // 1. Preparar, vincular y ejecutar la actualización
    $stmt_update = $conn->prepare("UPDATE likes SET count = count + 1 WHERE id = ?");
    $stmt_update->bind_param("i", $likeId);
    $stmt_update->execute();

    // 2. Preparar, vincular y ejecutar la lectura del nuevo valor
    $stmt_select = $conn->prepare("SELECT count FROM likes WHERE id = ?");
    $stmt_select->bind_param("i", $likeId);
    $stmt_select->execute();
    $result = $stmt_select->get_result();
    $row = $result->fetch_assoc();

    // Si todo fue bien, confirmamos los cambios
    $conn->commit();
    echo json_encode(['success' => true, 'count' => (int)$row['count']]);
} catch (Throwable $e) { // Se usa "catch" para capturar cualquier error o excepción
    $conn->rollback(); // Si algo falla, revertimos los cambios
    http_response_code(500);
    // Es una buena práctica registrar el error real para poder depurarlo,
    // pero sin mostrarlo al usuario final.
    // error_log('Error en increment_count.php: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al incrementar el contador.']);
}

$conn->close();
?>
