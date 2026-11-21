-- ============================================================================
-- SCRIPT SQL PARA BASE DE DATOS DEL PORTAFOLIO EN INFINITYFREE (phpMyAdmin)
-- Autor: Alexis Uriel Urbano Elorriaga
-- Carrera: Diseño y Desarrollo de Sistemas | Curso: Diseño de Interfaces
-- Docente: Miguel Pallín
-- ============================================================================

CREATE TABLE IF NOT EXISTS `contactos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(30) DEFAULT NULL,
  `asunto` VARCHAR(120) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Registro de prueba inicial para verificar en phpMyAdmin
INSERT INTO `contactos` (`nombre`, `correo`, `telefono`, `asunto`, `mensaje`)
VALUES (
  'Miguel Pallín',
  'contacto@miguelpallin.com',
  '999888777',
  'Consulta sobre un proyecto',
  'Prueba de verificación del formulario de contactos conectado a la base de datos MySQL en InfinityFree.'
);
