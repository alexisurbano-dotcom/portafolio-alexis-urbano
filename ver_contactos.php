<?php
/**
 * PANEL PARA VISUALIZAR LOS MENSAJES GUARDADOS EN LA BASE DE DATOS MYSQL
 * Autor: Alexis Uriel Urbano Elorriaga
 * Curso: Diseño de Interfaces | Docente: Miguel Pallín
 */
require_once __DIR__ . '/conexion.php';

$registros = [];
$errorConexion = null;

if ($conexion->connect_error) {
    $errorConexion = $conexion->connect_error;
} else {
    $resultado = $conexion->query("SELECT id, nombre, correo, telefono, asunto, mensaje, fecha FROM contactos ORDER BY id DESC");
    if ($resultado) {
        while ($fila = $resultado->fetch_assoc()) {
            $registros[] = $fila;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registros de Contactos (MySQL) | Alexis Uriel Urbano Elorriaga</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body class="bg-light">
  <div class="container py-5">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <h2 class="fw-bold mb-1"><i class="bi bi-database-check me-2"></i>Mensajes Guardados en Base de Datos</h2>
        <p class="text-secondary mb-0">Portafolio de <strong>Alexis Uriel Urbano Elorriaga</strong> · Curso: Diseño de Interfaces</p>
      </div>
      <a href="index.html#contactos" class="btn btn-dark rounded-pill px-4">
        <i class="bi bi-arrow-left me-1"></i> Volver al Portafolio
      </a>
    </div>

    <?php if ($errorConexion): ?>
      <div class="alert alert-warning rounded-4 p-4 shadow-sm">
        <h5 class="fw-bold"><i class="bi bi-exclamation-triangle-fill me-2"></i>Pendiente configurar credenciales MySQL en <code>conexion.php</code></h5>
        <p class="mb-2">Aún no se ha conectado con la base de datos de InfinityFree (Detalle: <code><?= htmlspecialchars($errorConexion) ?></code>).</p>
        <p class="mb-0 small">Abre el archivo <strong><code>conexion.php</code></strong> y coloca tu <em>Hostname</em>, <em>Username</em>, <em>Password</em> y <em>Database Name</em> del panel de InfinityFree.</p>
      </div>
    <?php else: ?>
      <div class="card border rounded-4 shadow-sm overflow-hidden">
        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <span class="fw-bold">Tabla: <code>contactos</code></span>
          <span class="badge bg-dark rounded-pill"><?= count($registros) ?> registro(s)</span>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>#ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <?php if (empty($registros)): ?>
                <tr>
                  <td colspan="7" class="text-center py-4 text-secondary">
                    Aún no hay mensajes registrados. Envía una prueba desde el formulario de Contactos.
                  </td>
                </tr>
              <?php else: ?>
                <?php foreach ($registros as $fila): ?>
                  <tr>
                    <td class="fw-bold"><?= (int)$fila['id'] ?></td>
                    <td><?= htmlspecialchars($fila['nombre']) ?></td>
                    <td><a href="mailto:<?= htmlspecialchars($fila['correo']) ?>"><?= htmlspecialchars($fila['correo']) ?></a></td>
                    <td><?= htmlspecialchars($fila['telefono'] ?: '-') ?></td>
                    <td><span class="badge bg-secondary-subtle text-dark"><?= htmlspecialchars($fila['asunto']) ?></span></td>
                    <td><?= nl2br(htmlspecialchars($fila['mensaje'])) ?></td>
                    <td class="small text-muted"><?= htmlspecialchars($fila['fecha']) ?></td>
                  </tr>
                <?php endforeach; ?>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>
