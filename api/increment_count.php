<?php
// c:\Users\sjcex\Documents\GitHub\cuando-sale-cristina\api\increment_count.php
header('Content-Type: application/json');
require_once 'config.php';

// Esta operación es "atómica" en la mayoría de los motores de BD (como InnoDB),
// lo que significa que es segura incluso si muchas personas dan like al mismo tiempo.
$likeId = 1;
$user_ip = $_SERVER['REMOTE_ADDR'];

// Usamos una transacción para asegurar que ambas operaciones (actualizar y leer) se completen exitosamente.
$conn->begin_transaction();

try {
    // 1. VERIFICAR si la IP ya existe
    $stmt_check = $conn->prepare("SELECT ip_address FROM user_likes WHERE ip_address = ?");
    $stmt_check->bind_param("s", $user_ip);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        // La IP ya existe, no hacemos nada. Simplemente devolvemos el contador actual.
        $stmt_select = $conn->prepare("SELECT count FROM likes WHERE id = ?");
        $stmt_select->bind_param("i", $likeId);
        $stmt_select->execute();
        $row = $stmt_select->get_result()->fetch_assoc();
        $conn->commit(); // Cerramos la transacción
        echo json_encode(['success' => true, 'count' => (int)$row['count'], 'message' => 'already_liked']);
    } else {
        // La IP no existe, procedemos a dar el like.
        // 2. INCREMENTAR el contador de likes
        $stmt_update = $conn->prepare("UPDATE likes SET count = count + 1 WHERE id = ?");
        $stmt_update->bind_param("i", $likeId);
        $stmt_update->execute();

        // 3. INSERTAR la IP del usuario para que no pueda volver a votar
        $stmt_insert_ip = $conn->prepare("INSERT INTO user_likes (ip_address) VALUES (?)");
        $stmt_insert_ip->bind_param("s", $user_ip);
        $stmt_insert_ip->execute();

        // 4. OBTENER el nuevo valor del contador
        $stmt_select = $conn->prepare("SELECT count FROM likes WHERE id = ?");
        $stmt_select->bind_param("i", $likeId);
        $stmt_select->execute();
        $row = $stmt_select->get_result()->fetch_assoc();

        // Si todo fue bien, confirmamos los cambios
        $conn->commit();
        echo json_encode(['success' => true, 'count' => (int)$row['count']]);
    }
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
