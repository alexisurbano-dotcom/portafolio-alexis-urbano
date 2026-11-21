<?php
/**
 * PROCESADOR DEL FORMULARIO DE CONTACTOS -> GUARDA EN MYSQL
 * Autor: Alexis Uriel Urbano Elorriaga
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Método no permitido. Usa el formulario de contacto.'
    ]);
    exit;
}

$nombre   = trim($_POST['nombre'] ?? '');
$correo   = trim($_POST['correo'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$asunto   = trim($_POST['asunto'] ?? '');
$mensaje  = trim($_POST['mensaje'] ?? '');

if ($nombre === '' || $correo === '' || $asunto === '' || $mensaje === '') {
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Por favor completa todos los campos obligatorios.'
    ]);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'ok' => false,
        'mensaje' => 'El formato del correo electrónico no es válido.'
    ]);
    exit;
}

require_once __DIR__ . '/conexion.php';

if ($conexion->connect_error) {
    echo json_encode([
        'ok' => false,
        'mensaje' => 'No se pudo conectar a MySQL. Verifica los 4 datos en conexion.php (' . $conexion->connect_error . ').'
    ]);
    exit;
}

$stmt = $conexion->prepare(
    "INSERT INTO contactos (nombre, correo, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)"
);

if (!$stmt) {
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Error al preparar la consulta SQL: ' . $conexion->error
    ]);
    exit;
}

$stmt->bind_param("sssss", $nombre, $correo, $telefono, $asunto, $mensaje);

if ($stmt->execute()) {
    echo json_encode([
        'ok' => true,
        'id' => $stmt->insert_id,
        'mensaje' => "¡Gracias, $nombre! Tu mensaje ha sido guardado correctamente en la base de datos MySQL (Registro #" . $stmt->insert_id . ")."
    ]);
} else {
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Error al guardar el registro: ' . $stmt->error
    ]);
}

$stmt->close();
$conexion->close();
?>
