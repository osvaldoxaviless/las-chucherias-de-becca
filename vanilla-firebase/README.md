# Las chucherías de Becca (Versión Vanilla JS + Firebase)

Implementación limpia, sin dependencias de compilación (Zero-Build), diseñada con HTML5 semántico, Tailwind CSS (CDN), Firebase Firestore v10 y reglas de seguridad RBAC.

## 📁 Archivos incluidos
* `index.html`: Estructura semántica, paleta pastel unicornio accesible (WCAG AA), tipografía Poppins + Inter, Hero, Galería interactiva con Lazy Loading, Formulario con Honeypot anti-spam y Ubicación en El Oro 112, Toluca.
* `app.js`: Inicialización modular de Firebase v10, sanitización estricta XSS, Rate Limiter (cooldown de 60s y límite horario), catálogo dinámico/fallback y generación de enlace directo a WhatsApp.
* `firestore.rules`: Reglas de seguridad de Firestore con control de acceso basado en roles (RBAC) y validación de esquema.
* `firebase.json`: Configuración lista para Firebase Hosting.

## 🚀 Cómo probarlo localmente
Puedes abrir `index.html` directamente en tu navegador con un servidor web local (ej. Live Server de VS Code, o con npx):
```bash
npx serve .
```

## ⚙️ Conexión con tu proyecto de Firebase
En `app.js`, reemplaza el objeto `firebaseConfig` con las credenciales que obtienes en tu consola de Firebase (`https://console.firebase.google.com`):
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```
*Si aún no configuras Firebase, el sistema funciona automáticamente en modo demostración local y enruta las cotizaciones directamente al WhatsApp de Rebecca (+52 722 562 8061).*
