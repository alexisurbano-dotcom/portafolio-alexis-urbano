<?php
/**
 * PANEL PARA VISUALIZAR LOS MENSAJES GUARDADOS EN LA BASE DE DATOS MYSQL
 * Autor: Alexis Uriel Urbano Elorriaga
 * Carrera: Diseño y Desarrollo de Sistemas (Tecsup)
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
  <title>Registros MySQL — Alexis Uriel Urbano Elorriaga</title>
  <link rel="stylesheet" href="style.css?v=3">
  <style>
    .contenedor-tabla {
      overflow-x: auto;
      background-color: var(--fondo-blanco);
      border: 1px solid var(--borde);
      border-radius: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.92rem;
    }
    th, td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--borde);
      vertical-align: top;
    }
    th {
      background-color: var(--fondo-alterno);
      font-family: var(--fuente-mono);
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--texto-secundario);
    }
    tr:last-child td {
      border-bottom: none;
    }
    .cabecera-vista {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 32px;
    }
  </style>
</head>
<body>

  <header class="cabecera">
    <div class="contenedor barra-nav">
      <a class="marca" href="index.html">Alexis Urbano<span>.</span></a>
      <a href="index.html#contactos" class="boton boton-secundario">← Volver al portafolio</a>
    </div>
  </header>

  <main class="seccion">
    <div class="contenedor">
      <div class="cabecera-vista">
        <div>
          <span class="numero-seccion">BASE DE DATOS MYSQL · INFINITYFREE</span>
          <h2>Registros de la tabla <code>contactos</code></h2>
          <p class="subtitulo-seccion">
            Base de datos: <code>if0_43500630_portafolio</code> · Total: <strong><?= count($registros) ?></strong> mensaje(s)
          </p>
        </div>
        <a href="index.html#contactos" class="boton boton-primario">Registrar nuevo mensaje</a>
      </div>

      <?php if ($errorConexion): ?>
        <div class="mensaje-estado estado-error">
          <strong>Error de conexión con MySQL</strong>
          <p>Detalle: <code><?= htmlspecialchars($errorConexion) ?></code>. Verifica las credenciales en <code>conexion.php</code>.</p>
        </div>
      <?php else: ?>
        <div class="contenedor-tabla">
          <table>
            <thead>
              <tr>
                <th>#ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Motivo</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <?php if (empty($registros)): ?>
                <tr>
                  <td colspan="7" style="text-align: center; padding: 32px; color: var(--texto-secundario);">
                    Aún no hay mensajes registrados en la tabla. Envía una prueba desde el formulario de contacto.
                  </td>
                </tr>
              <?php else: ?>
                <?php foreach ($registros as $fila): ?>
                  <tr>
                    <td><strong><?= (int)$fila['id'] ?></strong></td>
                    <td><?= htmlspecialchars($fila['nombre']) ?></td>
                    <td><a href="mailto:<?= htmlspecialchars($fila['correo']) ?>" style="text-decoration: underline; color: var(--acento);"><?= htmlspecialchars($fila['correo']) ?></a></td>
                    <td><?= htmlspecialchars($fila['telefono'] ?: '-') ?></td>
                    <td><code><?= htmlspecialchars($fila['asunto']) ?></code></td>
                    <td><?= nl2br(htmlspecialchars($fila['mensaje'])) ?></td>
                    <td style="font-family: var(--fuente-mono); font-size: 0.8rem; color: var(--texto-suave); white-space: nowrap;"><?= htmlspecialchars($fila['fecha']) ?></td>
                  </tr>
                <?php endforeach; ?>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>
  </main>

</body>
</html>
