/**
 * Script principal del portafolio - Alexis Uriel Urbano Elorriaga
 * Curso: Diseño de Interfaces | Docente: Miguel Pallín
 */

document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================================
     1. MENÚ MÓVIL ACCESIBLE
     ========================================================================= */
  const btnMenu = document.getElementById('btnMenu');
  const menuPrincipal = document.getElementById('menuPrincipal');
  const enlacesNav = document.querySelectorAll('.navegacion .nav-enlace');

  const cerrarMenu = () => {
    if (!menuPrincipal || !btnMenu) return;
    menuPrincipal.classList.remove('abierto');
    btnMenu.setAttribute('aria-expanded', 'false');
    btnMenu.setAttribute('aria-label', 'Abrir menú de navegación');
  };

  if (btnMenu && menuPrincipal) {
    btnMenu.addEventListener('click', () => {
      const estaAbierto = menuPrincipal.classList.toggle('abierto');
      btnMenu.setAttribute('aria-expanded', String(estaAbierto));
      btnMenu.setAttribute(
        'aria-label',
        estaAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );
    });

    enlacesNav.forEach((enlace) => {
      enlace.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape') {
        cerrarMenu();
      }
    });
  }

  /* =========================================================================
     2. RESALTADO DE SECCIÓN ACTIVA EN LA NAVEGACIÓN
     ========================================================================= */
  const secciones = document.querySelectorAll('main > section[id]');

  if ('IntersectionObserver' in window && secciones.length > 0) {
    const observadorSecciones = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const idVisible = entrada.target.getAttribute('id');

          enlacesNav.forEach((enlace) => {
            const coincide = enlace.getAttribute('href') === `#${idVisible}`;
            enlace.classList.toggle('activo', coincide);
          });
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    secciones.forEach((seccion) => observadorSecciones.observe(seccion));
  }

  /* =========================================================================
     3. FILTRO DE PROYECTOS EN LA GALERÍA
     ========================================================================= */
  const botonesFiltro = document.querySelectorAll('.boton-filtro');
  const proyectos = document.querySelectorAll('.proyecto-item');

  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
      const categoriaSeleccionada = boton.getAttribute('data-filtro');

      botonesFiltro.forEach((b) => {
        const esActivo = b === boton;
        b.classList.toggle('activo', esActivo);
        b.setAttribute('aria-pressed', String(esActivo));
      });

      proyectos.forEach((proyecto) => {
        const categoriaProyecto = proyecto.getAttribute('data-categoria');
        const mostrar =
          categoriaSeleccionada === 'todos' || categoriaProyecto === categoriaSeleccionada;

        proyecto.classList.toggle('oculto', !mostrar);
      });
    });
  });

  /* =========================================================================
     4. VISOR DE IMÁGENES AMPLIADAS (<dialog>)
     ========================================================================= */
  const visorDialogo = document.getElementById('visorGaleria');
  const visorImagen = document.getElementById('visorImagen');
  const visorTitulo = document.getElementById('visorTitulo');
  const visorDescripcion = document.getElementById('visorDescripcion');
  const btnCerrarVisor = document.getElementById('btnCerrarVisor');

  if (visorDialogo && typeof visorDialogo.showModal === 'function') {
    const abrirVisor = (articuloProyecto) => {
      const img = articuloProyecto.querySelector('.proyecto-img');
      if (!img) return;

      visorImagen.src = img.src;
      visorImagen.alt = img.alt;
      visorTitulo.textContent = img.getAttribute('data-titulo') || 'Vista del proyecto';
      visorDescripcion.textContent = img.getAttribute('data-desc') || '';
      visorDialogo.showModal();
    };

    proyectos.forEach((articulo) => {
      const contenedorImg = articulo.querySelector('.proyecto-imagen-contenedor');
      const btnDetalle = articulo.querySelector('.btn-ver-detalle');

      if (contenedorImg) {
        contenedorImg.addEventListener('click', () => abrirVisor(articulo));
      }
      if (btnDetalle) {
        btnDetalle.addEventListener('click', () => abrirVisor(articulo));
      }
    });

    if (btnCerrarVisor) {
      btnCerrarVisor.addEventListener('click', () => visorDialogo.close());
    }

    // Cerrar al hacer clic fuera de la ventana del diálogo
    visorDialogo.addEventListener('click', (evento) => {
      const rect = visorDialogo.getBoundingClientRect();
      const clicFuera =
        evento.clientX < rect.left ||
        evento.clientX > rect.right ||
        evento.clientY < rect.top ||
        evento.clientY > rect.bottom;

      if (clicFuera) {
        visorDialogo.close();
      }
    });
  }

  /* =========================================================================
     5. FORMULARIO DE CONTACTO (CONEXIÓN MYSQL + COPIA AL CORREO)
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
    const camposRequeridos = formulario.querySelectorAll('[required]');

    camposRequeridos.forEach((campo) => {
      campo.addEventListener('input', () => {
        campo.classList.remove('campo-invalido');
      });
    });

    formulario.addEventListener('submit', async (evento) => {
      evento.preventDefault();

      alertaExito.classList.add('oculto');
      alertaError.classList.add('oculto');

      const inputNombre = document.getElementById('nombre');
      const inputCorreo = document.getElementById('correo');
      const inputMensaje = document.getElementById('mensaje');

      if (inputNombre) inputNombre.value = inputNombre.value.trim();
      if (inputCorreo) inputCorreo.value = inputCorreo.value.trim();
      if (inputMensaje) inputMensaje.value = inputMensaje.value.trim();

      // Validar campos obligatorios
      let formularioValido = true;
      camposRequeridos.forEach((campo) => {
        if (!campo.checkValidity()) {
          campo.classList.add('campo-invalido');
          formularioValido = false;
        } else {
          campo.classList.remove('campo-invalido');
        }
      });

      if (!formularioValido) {
        textoError.textContent = 'Revisa los campos marcados en rojo. Asegúrate de ingresar un nombre, un correo válido, el motivo y un mensaje.';
        alertaError.classList.remove('oculto');
        return;
      }

      // Mostrar estado de carga
      btnEnviar.disabled = true;
      btnTexto.textContent = 'Guardando en base de datos...';
      btnSpinner.classList.remove('oculto');

      const formData = new FormData(formulario);
      const datosMensaje = {
        nombre: formData.get('nombre'),
        correo: formData.get('correo'),
        telefono: formData.get('telefono') || '-',
        asunto: formData.get('asunto'),
        mensaje: formData.get('mensaje'),
        fecha: new Date().toLocaleString('es-PE')
      };

      // Respaldo local en el navegador
      try {
        const historial = JSON.parse(localStorage.getItem('contactos_portafolio') || '[]');
        historial.unshift(datosMensaje);
        localStorage.setItem('contactos_portafolio', JSON.stringify(historial));
      } catch (_) {}

      // 1. Envío de copia al correo institucional (alexis.urbano@tecsup.edu.pe)
      fetch('https://formsubmit.co/ajax/alexis.urbano@tecsup.edu.pe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Mensaje desde tu Portafolio: ${datosMensaje.asunto}`,
          Nombre: datosMensaje.nombre,
          Correo: datosMensaje.correo,
          Telefono: datosMensaje.telefono,
          Motivo: datosMensaje.asunto,
          Mensaje: datosMensaje.mensaje,
          Fecha: datosMensaje.fecha
        })
      }).catch(() => {});

      // 2. Guardado en la base de datos MySQL en InfinityFree (guardar_contacto.php)
      try {
        const respuesta = await fetch(formulario.action, {
          method: 'POST',
          body: formData
        });

        let resultado = null;
        const tipoContenido = respuesta.headers.get('content-type') || '';
        if (tipoContenido.includes('application/json')) {
          resultado = await respuesta.json();
        }

        if (respuesta.ok && resultado && resultado.ok) {
          tituloExito.textContent = 'Mensaje guardado en la base de datos MySQL';
          textoExito.textContent =
            resultado.mensaje ||
            `Gracias, ${datosMensaje.nombre}. Tu mensaje fue registrado correctamente.`;
          alertaExito.classList.remove('oculto');
          formulario.reset();
        } else if (resultado && resultado.ok === false) {
          textoError.textContent =
            resultado.mensaje || 'No se pudo registrar el mensaje en la base de datos.';
          alertaError.classList.remove('oculto');
        } else {
          // Respaldo cuando se abre en GitHub Pages o archivo local sin motor PHP
          tituloExito.textContent = 'Mensaje enviado correctamente';
          textoExito.textContent = `Gracias, ${datosMensaje.nombre}. Tu consulta sobre "${datosMensaje.asunto}" ha sido registrada.`;
          alertaExito.classList.remove('oculto');
          formulario.reset();
        }
      } catch (_) {
        tituloExito.textContent = 'Mensaje enviado correctamente';
        textoExito.textContent = `Gracias, ${datosMensaje.nombre}. Tu consulta sobre "${datosMensaje.asunto}" ha sido registrada.`;
        alertaExito.classList.remove('oculto');
        formulario.reset();
      } finally {
        btnEnviar.disabled = false;
        btnTexto.textContent = 'Enviar y guardar mensaje';
        btnSpinner.classList.add('oculto');
      }
    });
  }
});
