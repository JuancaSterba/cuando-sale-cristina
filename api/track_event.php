<?php
// c:\Users\sjcex\Documents\GitHub\cuando-sale-cristina\api\track_event.php

header('Content-Type: application/json');
require_once 'config.php';

// Obtenemos los datos enviados desde el frontend
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!$data || !isset($data['event_name'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Falta el nombre del evento.']);
    exit;
}

$eventName = $data['event_name'];

// Validamos el nombre del evento para seguridad (letras, números, guion bajo, guion)
if (!preg_match('/^[a-zA-Z0-9_-]+$/', $eventName)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nombre de evento no válido.']);
    exit;
}

// Usamos INSERT ... ON DUPLICATE KEY UPDATE.
// Si el evento no existe, lo crea con valor 1.
// Si ya existe, simplemente incrementa su contador. Es una operación atómica y eficiente.
$sql = "INSERT INTO event_counts (event_name, count) VALUES (?, 1) ON DUPLICATE KEY UPDATE count = count + 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $eventName);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Evento registrado.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al registrar el evento.']);
}

$stmt->close();
$conn->close();