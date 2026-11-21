<?php
/**
 * ARCHIVO DE CONEXIÓN A LA BASE DE DATOS MYSQL (INFINITYFREE)
 * Autor: Alexis Uriel Urbano Elorriaga
 * Curso: Diseño de Interfaces | Docente: Miguel Pallín
 *
 * INSTRUCCIONES PARA INFINITYFREE:
 * 1. Entra a tu panel de InfinityFree -> menú "MySQL Databases".
 * 2. Crea una base de datos (ej. "portafolio").
 * 3. Reemplaza los 4 datos de abajo con los que te muestra InfinityFree:
 */

$host       = "sql103.infinityfree.com";       // 1. MySQL Hostname (ya configurado)
$usuario    = "if0_43500630";                  // 2. MySQL Username (ya configurado)
$password   = "PF6yC0EG1KKc";                  // 3. MySQL Password (ya configurado)
$base_datos = "if0_43500630_portafolio";       // 4. MySQL Database Name (ya configurado)

// Si lo pruebas en XAMPP / WAMP local, descomenta estas 4 líneas de abajo:
// $host       = "localhost";
// $usuario    = "root";
// $password   = "";
// $base_datos = "portafolio_alexis";

mysqli_report(MYSQLI_REPORT_OFF);
$conexion = @new mysqli($host, $usuario, $password, $base_datos);

if (!$conexion->connect_error) {
    $conexion->set_charset("utf8mb4");

    // Crea la tabla 'contactos' automáticamente si aún no existe en tu base de datos
    $sqlCrearTabla = "CREATE TABLE IF NOT EXISTS contactos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(150) NOT NULL,
        telefono VARCHAR(30) DEFAULT NULL,
        asunto VARCHAR(120) NOT NULL,
        mensaje TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

    $conexion->query($sqlCrearTabla);
}
?>
