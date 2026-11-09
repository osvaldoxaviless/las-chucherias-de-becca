/**
 * Las chucherías de Becca - Vanilla JS + Firebase Firestore
 * Full-Stack Client Script con Sanitización XSS y Prevención de Spam
 */

// -----------------------------------------------------------------------------
// 1. IMPORTACIONES DE FIREBASE V10 (CDN Modular ESM)
// -----------------------------------------------------------------------------
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// -----------------------------------------------------------------------------
// 2. CONFIGURACIÓN DE FIREBASE
// Reemplaza estos valores con los de la consola de Firebase (Proyecto -> Configuración)
// -----------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "TU_API_KEY_DE_FIREBASE",
  authDomain: "las-chucherias-de-becca.firebaseapp.com",
  projectId: "las-chucherias-de-becca",
  storageBucket: "las-chucherias-de-becca.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Inicialización segura de Firebase
let app, db;
let isFirebaseReady = false;

try {
  // Solo inicializa si no tiene el placeholder de ejemplo
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "TU_API_KEY_DE_FIREBASE") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseReady = true;
    console.info("🔥 Firebase Firestore inicializado con éxito.");
  } else {
    console.warn("⚠️ Firebase no configurado: Operando en modo demostración local. Los pedidos generarán enlace a WhatsApp y la galería usará catálogo artesanal.");
  }
} catch (err) {
  console.error("Error al inicializar Firebase:", err);
}

// -----------------------------------------------------------------------------
// 3. MÓDULO DE CIBERSEGURIDAD: SANITIZACIÓN ESTRICTA (Defensa contra XSS)
// -----------------------------------------------------------------------------

/**
 * Escapa entidades HTML peligrosas para prevenir Inyección de Código / XSS
 * @param {string} input - Cadena sin sanitizar
 * @returns {string} - Cadena segura
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  const htmlEntityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;'
  };
  return input
    .replace(/[&<>"'`/]/g, (match) => htmlEntityMap[match])
    .trim();
}

/**
 * Valida que una fecha sea válida y al menos 24 horas en el futuro
 * @param {string} dateString - Formato YYYY-MM-DD
 * @returns {boolean}
 */
function isValidFutureDate(dateString) {
  if (!dateString) return false;
  const eventDate = new Date(`${dateString}T00:00:00`);
  const now = new Date();
  // Al menos 24 horas a partir de hoy
  const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return eventDate >= minDate;
}

/**
 * Valida un número telefónico de 10 dígitos (México)
 * @param {string} phone 
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return /^[0-9]{10}$/.test(cleanPhone);
}

// -----------------------------------------------------------------------------
// 4. RATE LIMITING Y PREVENCIÓN DE SPAM (Client-side Security)
// -----------------------------------------------------------------------------
const RATE_LIMIT_CONFIG = {
  COOLDOWN_MS: 60 * 1000,       // 60 segundos entre envíos
  MAX_HOURLY: 4,                // Máximo 4 pedidos por hora por navegador
  STORAGE_KEY_TIMESTAMP: 'becca_last_submission_ts',
  STORAGE_KEY_COUNT: 'becca_hourly_count',
  STORAGE_KEY_WINDOW: 'becca_hourly_window'
};

/**
 * Verifica si el usuario actual ha excedido el límite de envíos
 * @returns {{ allowed: boolean, reason?: string }}
 */
function checkRateLimit() {
  const now = Date.now();
  const lastSubmission = parseInt(localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY_TIMESTAMP) || '0', 10);

  // 1. Chequeo de Cooldown básico (60 segundos)
  if (now - lastSubmission < RATE_LIMIT_CONFIG.COOLDOWN_MS) {
    const waitSeconds = Math.ceil((RATE_LIMIT_CONFIG.COOLDOWN_MS - (now - lastSubmission)) / 1000);
    return {
      allowed: false,
      reason: `Por favor espera ${waitSeconds} segundos antes de enviar otra solicitud.`
    };
  }

  // 2. Chequeo de límite horario
  const windowStart = parseInt(localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY_WINDOW) || '0', 10);
  let count = parseInt(localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY_COUNT) || '0', 10);

  if (now - windowStart > 3600 * 1000) {
    // Nueva ventana de 1 hora
    localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY_WINDOW, now.toString());
    localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY_COUNT, '0');
    count = 0;
  }

  if (count >= RATE_LIMIT_CONFIG.MAX_HOURLY) {
    return {
      allowed: false,
      reason: 'Has alcanzado el límite de solicitudes por hoy. Si te urge, contáctanos directamente a WhatsApp (+52 722 562 8061).'
    };
  }

  return { allowed: true };
}

/**
 * Registra un envío exitoso para el rate limiter
 */
function recordSubmission() {
  const now = Date.now();
  localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY_TIMESTAMP, now.toString());
  const count = parseInt(localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY_COUNT) || '0', 10);
  localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY_COUNT, (count + 1).toString());
}

// -----------------------------------------------------------------------------
// 5. CATÁLOGO / GALERÍA DE PASTEL INTEGRADA (Lazy Loading + Fallback)
// -----------------------------------------------------------------------------
const SAMPLE_GALLERY = [
  {
    id: 'dino-1',
    titulo: 'Pastel Temático Dinosaurio Rex',
    categoria: 'dinosaurios',
    imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80',
    descripcion: 'Diseño en fondant modelado a mano con textura de selva y figuras de dinosaurio.',
    etiqueta: 'Temático Infantil'
  },
  {
    id: 'infantil-1',
    titulo: 'Pastel Unicornio Pastel & Glitter',
    categoria: 'infantiles',
    imagen: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80',
    descripcion: 'Cuerno dorado artesanal, merengue suizo en tonos lila, rosa y menta.',
    etiqueta: 'Más Vendido'
  },
  {
    id: 'cumple-1',
    titulo: 'Pastel Vintage Bento Cake',
    categoria: 'cumpleanos',
    imagen: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80',
    descripcion: 'Estilo coreano vintage con frase personalizada y piping delicado.',
    etiqueta: 'Tendencia'
  },
  {
    id: 'chuch-1',
    titulo: 'Cheesecake Artesanal de Frutos Rojos',
    categoria: 'chucherias',
    imagen: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80',
    descripcion: 'Base de galleta crujiente, compota de frambuesa y zarzamora natural.',
    etiqueta: 'Favorito'
  },
  {
    id: 'dino-2',
    titulo: 'Pastel Parque Jurásico Volcán',
    categoria: 'dinosaurios',
    imagen: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=700&q=80',
    descripcion: 'Bizcocho húmedo de doble chocolate decorado con rocas de chocolate y palmeras.',
    etiqueta: 'Especial'
  },
  {
    id: 'cumple-2',
    titulo: 'Pastel Elegante con Flores Naturales',
    categoria: 'cumpleanos',
    imagen: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=700&q=80',
    descripcion: 'Cobertura lisa semi-naked con flores orgánicas y hoja de oro comestible.',
    etiqueta: 'Elegante'
  }
];

let activeGalleryItems = [...SAMPLE_GALLERY];

/**
 * Carga los elementos de la galería desde Firestore (o usa fallback local)
 */
async function loadGallery() {
  const container = document.getElementById('galeria-grid');
  if (!container) return;

  if (isFirebaseReady && db) {
    try {
      const q = query(collection(db, 'galeria'), orderBy('creadoEn', 'desc'));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        activeGalleryItems = [];
        querySnapshot.forEach((doc) => {
          activeGalleryItems.push({ id: doc.id, ...doc.data() });
        });
      }
    } catch (err) {
      console.warn('Usando catálogo local de galería debido a:', err.message);
    }
  }

  renderGallery('todos');
}

/**
 * Renderiza la galería con Lazy Loading y tags accesibles
 * @param {string} category 
 */
function renderGallery(category = 'todos') {
  const container = document.getElementById('galeria-grid');
  if (!container) return;

  const filtered = category === 'todos' 
    ? activeGalleryItems 
    : activeGalleryItems.filter(item => item.categoria === category);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-500">
        <p class="text-sm">No hay pasteles en esta categoría por el momento.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="group bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col">
      <div class="relative overflow-hidden aspect-[4/3] bg-purple-50">
        <img 
          src="${sanitizeInput(item.imagen)}" 
          alt="${sanitizeInput(item.titulo)}" 
          loading="lazy" 
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-purple-800 shadow-sm">
          ${sanitizeInput(item.etiqueta || 'Artesanal')}
        </div>
      </div>
      <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 class="font-heading font-bold text-base text-unicorn-dark group-hover:text-purple-600 transition-colors">
            ${sanitizeInput(item.titulo)}
          </h3>
          <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            ${sanitizeInput(item.descripcion)}
          </p>
        </div>
        <div class="pt-2 border-t border-purple-50 flex items-center justify-between">
          <span class="text-xs font-semibold text-purple-700">Cotización a medida</span>
          <button 
            type="button" 
            onclick="window.seleccionarTematica('${sanitizeInput(item.titulo)}')" 
            class="text-xs font-bold text-pink-600 hover:text-pink-700 transition-colors underline"
          >
            Quiero uno así &rarr;
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// -----------------------------------------------------------------------------
// 6. GESTIÓN DEL FORMULARIO Y ENVÍO A FIRESTORE + WHATSAPP
// -----------------------------------------------------------------------------
function setupOrderForm() {
  const form = document.getElementById('order-form');
  const alertBox = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('btn-spinner');
  const eventDateInput = document.getElementById('event_date');

  // Restricción visual en datepicker: al menos mañana
  if (eventDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minStr = tomorrow.toISOString().split('T')[0];
    eventDateInput.min = minStr;
  }

  // Helper para mostrar alertas con accesibilidad
  function showAlert(message, type = 'error') {
    alertBox.className = type === 'success'
      ? 'p-4 rounded-2xl text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 block transition-all'
      : 'p-4 rounded-2xl text-sm font-semibold bg-rose-50 text-rose-800 border border-rose-200 block transition-all';
    alertBox.innerHTML = message;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideAlert() {
    alertBox.className = 'hidden';
    alertBox.innerHTML = '';
  }

  // Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    // 1. CHEQUEO HONEYPOT (Anti-bots automáticos)
    const honeypot = document.getElementById('honeypot_check');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn('Bot detectado mediante honeypot. Solicitud descartada.');
      // Simulamos éxito para no alertar al bot
      showAlert('¡Tu cotización ha sido recibida con éxito!', 'success');
      form.reset();
      return;
    }

    // 2. CHEQUEO DE RATE LIMITING
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      showAlert(rateCheck.reason, 'error');
      return;
    }

    // 3. CAPTURA Y SANITIZACIÓN ESTRICTA DE ENTRADAS
    const rawNombre = document.getElementById('client_name').value;
    const rawTelefono = document.getElementById('client_phone').value;
    const rawFecha = document.getElementById('event_date').value;
    const rawPorciones = document.getElementById('portions').value;
    const rawTematica = document.getElementById('cake_theme').value;
    const rawNotas = document.getElementById('cake_notes').value;

    const nombreLimpio = sanitizeInput(rawNombre);
    const telefonoLimpio = sanitizeInput(rawTelefono).replace(/\s+/g, '');
    const fechaLimpia = sanitizeInput(rawFecha);
    const porcionesLimpias = sanitizeInput(rawPorciones);
    const tematicaLimpia = sanitizeInput(rawTematica);
    const notasLimpias = sanitizeInput(rawNotas);

    // 4. VALIDACIÓN DE CAMPOS OBLIGATORIOS
    if (!nombreLimpio || nombreLimpio.length < 3) {
      showAlert('Por favor ingresa tu nombre completo válido (mínimo 3 caracteres).', 'error');
      return;
    }

    if (!isValidPhone(telefonoLimpio)) {
      showAlert('Ingresa un número de WhatsApp válido de 10 dígitos (ej. 7221234567).', 'error');
      return;
    }

    if (!isValidFutureDate(fechaLimpia)) {
      showAlert('La fecha del evento debe ser al menos con 24 a 48 horas de anticipación.', 'error');
      return;
    }

    if (!tematicaLimpia || tematicaLimpia.length < 3) {
      showAlert('Por favor dinos la temática deseada para tu pastel.', 'error');
      return;
    }

    // 5. PROCESAMIENTO Y ENVÍO A FIRESTORE
    submitBtn.disabled = true;
    btnSpinner.classList.remove('hidden');

    const pedidoPayload = {
      clienteNombre: nombreLimpio,
      telefono: telefonoLimpio,
      fechaEvento: fechaLimpia,
      porciones: porcionesLimpias,
      tematica: tematicaLimpia,
      detalles: notasLimpias || 'Sin notas adicionales',
      estado: 'nuevo',
      origen: 'web-landing',
      creadoEn: isFirebaseReady ? serverTimestamp() : new Date().toISOString()
    };

    let docId = 'demo-' + Date.now();

    try {
      if (isFirebaseReady && db) {
        // Enviar a la colección 'pedidos' de Firestore
        const docRef = await addDoc(collection(db, 'pedidos'), pedidoPayload);
        docId = docRef.id;
        console.log('Documento creado en Firestore con ID:', docId);
      }

      // Registro de Rate Limit
      recordSubmission();

      // Construcción del mensaje de WhatsApp para notificación inmediata a Rebecca (+52 722 562 8061)
      const waText = encodeURIComponent(
        `🧁 *¡NUEVA COTIZACIÓN WEB!* 🧁\n\n` +
        `👤 *Cliente:* ${nombreLimpio}\n` +
        `📱 *Teléfono:* ${telefonoLimpio}\n` +
        `📅 *Fecha del evento:* ${fechaLimpia}\n` +
        `🎂 *Porciones:* ${porcionesLimpias}\n` +
        `🎨 *Temática:* ${tematicaLimpia}\n` +
        `📝 *Notas:* ${notasLimpias || 'Ninguna'}\n\n` +
        `📍 *Ref:* Pedido #${docId.slice(-6).toUpperCase()}`
      );
      const waUrl = `https://wa.me/527225628061?text=${waText}`;

      // Éxito en UI con botón para redirigir a WhatsApp
      showAlert(`
        <div class="space-y-3">
          <p class="font-bold text-base">🎉 ¡Solicitud registrada con éxito!</p>
          <p class="font-normal text-xs leading-relaxed">
            Tu cotización ha sido guardada en nuestro sistema. Para una atención más rápida, puedes enviarle una copia directa a Becca por WhatsApp ahora mismo:
          </p>
          <div class="pt-2">
            <a 
              href="${waUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              💬 Abrir WhatsApp con mi cotización &rarr;
            </a>
          </div>
        </div>
      `, 'success');

      form.reset();

    } catch (err) {
      console.error('Error al guardar el pedido en Firestore:', err);
      showAlert(`Hubo un inconveniente al conectar con el servidor: ${err.message}. Puedes escribirnos directo a WhatsApp: +52 722 562 8061`, 'error');
    } finally {
      submitBtn.disabled = false;
      btnSpinner.classList.add('hidden');
    }
  });
}

// -----------------------------------------------------------------------------
// 7. INTERACTIVIDAD DE FILTROS & ATAJOS
// -----------------------------------------------------------------------------
function setupGalleryFilters() {
  const buttons = document.querySelectorAll('.galeria-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actualizar estilos activos
      buttons.forEach(b => {
        b.className = 'galeria-filter-btn px-4 py-2 rounded-full font-semibold transition-all bg-purple-50 text-slate-700 hover:bg-purple-100';
      });
      btn.className = 'galeria-filter-btn px-4 py-2 rounded-full font-semibold transition-all bg-purple-600 text-white shadow-sm';

      const cat = btn.getAttribute('data-cat') || 'todos';
      renderGallery(cat);
    });
  });
}

// Función global para cuando el usuario hace clic en "Quiero uno así" desde la galería
window.seleccionarTematica = function(titulo) {
  const themeInput = document.getElementById('cake_theme');
  const formSection = document.getElementById('pedidos');
  if (themeInput) {
    themeInput.value = `Inspirado en: ${titulo}`;
    themeInput.focus();
  }
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// -----------------------------------------------------------------------------
// 8. INICIALIZACIÓN AL CARGAR EL DOM
// -----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Inicializar componentes
  loadGallery();
  setupGalleryFilters();
  setupOrderForm();
});
