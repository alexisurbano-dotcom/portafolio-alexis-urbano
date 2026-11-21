<?php
/**
 * LISTADO DE CONTACTOS REGISTRADOS EN MYSQL
 * Autor: Alexis Uriel Urbano Elorriaga
 * Curso: Diseño de Interfaces - Docente: Miguel Pallín
 */
require_once __DIR__ . '/conexion.php';

$registros = [];
$errorBd = '';

if ($conexion->connect_error) {
    $errorBd = 'No se pudo conectar a la base de datos: ' . $conexion->connect_error;
} else {
    $resultado = $conexion->query("SELECT id, nombre, correo, telefono, asunto, mensaje, fecha FROM contactos ORDER BY id DESC");
    if ($resultado) {
        while ($fila = $resultado->fetch_assoc()) {
            $registros[] = $fila;
        }
        $resultado->free();
    } else {
        $errorBd = 'Error al consultar la tabla contactos: ' . $conexion->error;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registros de Contacto | Alexis Urbano</title>
  <link rel="stylesheet" href="style.css?v=4">
  <style>
    .tabla-contenedor {
      overflow-x: auto;
      background: var(--fondo-blanco);
      border: 1px solid var(--borde);
      border-radius: 6px;
      margin-top: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.92rem;
    }
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid var(--borde);
      vertical-align: top;
    }
    th {
      background-color: var(--fondo-alterno);
      font-weight: 700;
      font-size: 0.82rem;
      text-transform: uppercase;
      color: var(--texto-secundario);
    }
    tr:last-child td {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <header class="cabecera">
    <div class="contenedor barra-nav">
      <a class="marca" href="index.html">Alexis Urbano<span>.</span></a>
      <nav class="navegacion">
        <a href="index.html#inicio" class="nav-enlace">Volver al portafolio</a>
        <a href="index.html#contactos" class="nav-enlace nav-contacto">Nuevo mensaje</a>
      </nav>
    </div>
  </header>

  <main class="seccion">
    <div class="contenedor">
      <div class="encabezado-seccion">
        <span class="numero-seccion">Base de datos MySQL</span>
        <h1>Mensajes registrados en la tabla contactos</h1>
        <p class="subtitulo-seccion">
          Vista de comprobación de los datos enviados desde el formulario de contacto.
        </p>
      </div>

      <?php if ($errorBd !== ''): ?>
        <div class="mensaje-estado estado-error">
          <strong>Error de conexión</strong>
          <p><?php echo htmlspecialchars($errorBd, ENT_QUOTES, 'UTF-8'); ?></p>
        </div>
      <?php elseif (empty($registros)): ?>
        <div class="mensaje-estado estado-exito">
          <strong>Sin registros todavía</strong>
          <p>La conexión con MySQL está activa, pero aún no se han enviado mensajes desde el formulario.</p>
        </div>
      <?php else: ?>
        <div class="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($registros as $item): ?>
                <tr>
                  <td><?php echo (int)$item['id']; ?></td>
                  <td><strong><?php echo htmlspecialchars($item['nombre'], ENT_QUOTES, 'UTF-8'); ?></strong></td>
                  <td><?php echo htmlspecialchars($item['correo'], ENT_QUOTES, 'UTF-8'); ?></td>
                  <td><?php echo htmlspecialchars($item['telefono'] ?: '-', ENT_QUOTES, 'UTF-8'); ?></td>
                  <td><?php echo htmlspecialchars($item['asunto'], ENT_QUOTES, 'UTF-8'); ?></td>
                  <td><?php echo nl2br(htmlspecialchars($item['mensaje'], ENT_QUOTES, 'UTF-8')); ?></td>
                  <td><?php echo htmlspecialchars($item['fecha'], ENT_QUOTES, 'UTF-8'); ?></td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>
  </main>
</body>
</html>
