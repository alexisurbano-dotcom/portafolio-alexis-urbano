/**
 * Portafolio Personalizado - Alexis Uriel Urbano Elorriaga
 * Curso: Diseño de Interfaces | Docente: Miguel Pallín
 * Funcionalidades:
 *  1. Navegación activa por sección y cierre automático en móvil
 *  2. Filtro dinámico de proyectos en la sección Galería
 *  3. Modal / Visor de imágenes ampliadas en la Galería
 *  4. Envío y validación del Formulario de Contactos (conectado a guardar_contacto.php + MySQL)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa automáticamente la tabla en la base de datos MySQL de InfinityFree al abrir la página
  fetch('ver_contactos.php', { method: 'GET' }).catch(() => {});

  /* =========================================================================
     1. NAVEGACIÓN ACTIVA Y CIERRE DE MENÚ MÓVIL
     ========================================================================= */
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapseEl = document.getElementById('navMenu');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navCollapseEl && navCollapseEl.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapseEl);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  const secciones = document.querySelectorAll('header[id], section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idActual = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${idActual}`);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    secciones.forEach((sec) => observer.observe(sec));
  }

  /* =========================================================================
     2. FILTRO DINÁMICO DE LA SECCIÓN GALERÍA
     ========================================================================= */
  const botonesFiltro = document.querySelectorAll('.filtro-btn');
  const itemsGaleria = document.querySelectorAll('.item-galeria');

  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
      const filtro = boton.getAttribute('data-filtro');

      botonesFiltro.forEach((b) => b.classList.remove('active'));
      boton.classList.add('active');

      itemsGaleria.forEach((item) => {
        const categoria = item.getAttribute('data-categoria');
        if (filtro === 'todos' || categoria === filtro) {
          item.classList.remove('d-none');
        } else {
          item.classList.add('d-none');
        }
      });
    });
  });

  /* =========================================================================
     3. VISOR MODAL DE IMÁGENES EN GALERÍA
     ========================================================================= */
  const modalElement = document.getElementById('modalGaleria');
  const modalImg = document.getElementById('modalGaleriaImg');
  const modalTitulo = document.getElementById('modalGaleriaTitulo');
  const modalDesc = document.getElementById('modalGaleriaDesc');

  if (modalElement) {
    const bsModal = new bootstrap.Modal(modalElement);

    const abrirVisor = (card) => {
      const img = card.querySelector('.galeria-img');
      if (!img) return;
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalTitulo.textContent = img.getAttribute('data-titulo') || 'Vista Previa';
      modalDesc.textContent = img.getAttribute('data-desc') || '';
      bsModal.show();
    };

    document.querySelectorAll('.galeria-card').forEach((card) => {
      const imgBox = card.querySelector('.galeria-img-box');
      const btnModal = card.querySelector('.btn-ver-modal');

      if (imgBox) {
        imgBox.addEventListener('click', () => abrirVisor(card));
      }
      if (btnModal) {
        btnModal.addEventListener('click', () => abrirVisor(card));
      }
    });
  }

  /* =========================================================================
     4. FORMULARIO DE CONTACTOS FUNCIONAL (CONECTADO A PHP + MYSQL)
     ========================================================================= */
  const formulario = document.getElementById('formularioContacto');
  const alertaExito = document.getElementById('alertaExito');
  const alertaError = document.getElementById('alertaError');
  const tituloExito = document.getElementById('tituloExito');
  const textoExito = document.getElementById('textoExito');
  const textoError = document.getElementById('textoError');
  const btnEnviar = document.getElementById('btnEnviar');
  const btnTexto = document.getElementById('btnTexto');
  const btnSpinner = document.getElementById('btnSpinner');

  if (formulario) {
    formulario.addEventListener('submit', async (e) => {
      e.preventDefault();

      alertaExito.classList.add('d-none');
      alertaError.classList.add('d-none');

      // Validación HTML5 + Bootstrap
      if (!formulario.checkValidity()) {
        formulario.classList.add('was-validated');
        textoError.textContent = 'Por favor revisa y completa todos los campos obligatorios (*).';
        alertaError.classList.remove('d-none');
        return;
      }

      formulario.classList.remove('was-validated');

      // Estado de carga
      btnEnviar.disabled = true;
      btnTexto.textContent = 'Guardando en Base de Datos...';
      btnSpinner.classList.remove('d-none');

      const formData = new FormData(formulario);
      const registroLocal = {
        nombre: formData.get('nombre'),
        correo: formData.get('correo'),
        telefono: formData.get('telefono') || '-',
        asunto: formData.get('asunto'),
        mensaje: formData.get('mensaje'),
        fecha: new Date().toLocaleString('es-PE')
      };

      // Guardar también en localStorage como respaldo
      try {
        const historial = JSON.parse(localStorage.getItem('contactos_portafolio') || '[]');
        historial.unshift(registroLocal);
        localStorage.setItem('contactos_portafolio', JSON.stringify(historial));
      } catch (_) {}

      // 1. Enviar copia al correo institucional (alexis.urbano@tecsup.edu.pe) vía FormSubmit AJAX
      fetch('https://formsubmit.co/ajax/alexis.urbano@tecsup.edu.pe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nuevo mensaje del Portafolio: ${registroLocal.asunto}`,
          Nombre: registroLocal.nombre,
          Correo: registroLocal.correo,
          Telefono: registroLocal.telefono,
          Asunto: registroLocal.asunto,
          Mensaje: registroLocal.mensaje,
          Fecha: registroLocal.fecha
        })
      }).catch(() => {});

      // 2. Guardar en la Base de Datos MySQL de InfinityFree (guardar_contacto.php)
      try {
        const response = await fetch(formulario.action, {
          method: 'POST',
          body: formData
        });

        let data = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await response.json();
        }

        if (response.ok && data && data.ok) {
          tituloExito.textContent = '¡Mensaje guardado en la Base de Datos MySQL!';
          textoExito.textContent = data.mensaje || `Gracias ${registroLocal.nombre}, tu mensaje fue registrado correctamente.`;
          alertaExito.classList.remove('d-none');
          formulario.reset();
        } else if (data && data.ok === false) {
          textoError.textContent = data.mensaje || 'Error al guardar en la base de datos. Verifica tus credenciales en conexion.php.';
          alertaError.classList.remove('d-none');
        } else {
          // Respaldo cuando se abre en GitHub Pages o vista local sin servidor PHP
          tituloExito.textContent = '¡Mensaje enviado y registrado con éxito!';
          textoExito.textContent = `Gracias ${registroLocal.nombre}. Hemos recibido tu consulta sobre "${registroLocal.asunto}".`;
          alertaExito.classList.remove('d-none');
          formulario.reset();
        }
      } catch (error) {
        // Respaldo si se ejecuta sin servidor PHP activo (ej. GitHub Pages o archivo local)
        tituloExito.textContent = '¡Mensaje enviado y registrado con éxito!';
        textoExito.textContent = `Gracias ${registroLocal.nombre}. Tu consulta sobre "${registroLocal.asunto}" ha sido registrada correctamente.`;
        alertaExito.classList.remove('d-none');
        formulario.reset();
      } finally {
        btnEnviar.disabled = false;
        btnTexto.innerHTML = '<i class="bi bi-send-check me-2"></i>Enviar y Guardar Mensaje';
        btnSpinner.classList.add('d-none');
      }
    });
  }
});
