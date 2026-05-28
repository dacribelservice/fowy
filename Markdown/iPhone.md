# 📱 DIAGNÓSTICO Y COMPATIBILIDAD CON IPHONE (iOS - WEBKIT)

Este documento detalla los problemas de compatibilidad comunes que experimentan las aplicaciones web modernas (Next.js, React, Leaflet, Supabase) en dispositivos **iPhone (iOS)**, explicando la causa raíz técnica y cómo solucionarlos definitivamente en el código de **FOWY**.

---

## 🏛️ LA REGLA DE ORO DE iOS: TODO ES SAFARI
Debido a las políticas obligatorias de la App Store de Apple, **todos los navegadores que corren en un iPhone o iPad están obligados a utilizar el motor de renderizado de Safari (WebKit)**. 
* Si un usuario accede a la web desde **Chrome para iOS, Firefox para iOS, la app de Google, o el navegador interno de WhatsApp/Instagram**, el motor que procesa el código sigue siendo el de Safari.
* Por lo tanto, cualquier error de compatibilidad presente en Safari afectará a todos los navegadores del iPhone por igual.

---

## 🔍 PROBLEMAS DETALLADOS Y CÓMO SOLUCIONARLOS

### 1. Incompatibilidad de Formatos de Fecha (`Invalid Date`)
* **El Problema:** El motor WebKit de iOS es sumamente estricto con el análisis de fechas en JavaScript. Si en alguna parte del código (estadísticas, historial, etc.) se procesan fechas usando guiones o espacios como separador sin el delimitador estándar:
  ```javascript
  new Date("2026-05-10 21:00:00") // ❌ Rompe en iPhone arrojando "Invalid Date"
  ```
  Esto detiene la ejecución completa de React en el iPhone, provocando una **pantalla en blanco**.
* **La Solución:** Asegurarse de formatear la cadena reemplazando los espacios por `"T"` (estándar ISO 8601) antes de procesarla:
  ```typescript
  // Solución segura para todos los navegadores
  const safeDateStr = rawDate.trim().replace(/\s+/, "T");
  const date = new Date(safeDateStr);
  ```

---

### 2. Error de Hidratación de Next.js (`Hydration Mismatch`)
* **El Problema:** Next.js pre-renderiza la página en el servidor (SSR) usando una hora por defecto. Cuando llega al iPhone, React intenta renderizar el contenido con la hora local de ese dispositivo. Si hay discrepancia entre lo que generó el servidor y lo que calcula el cliente, Next.js arroja un error de hidratación.
  * *En computadoras de escritorio, esto es solo una advertencia, pero en iOS puede llegar a colapsar la renderización total de la página.*
* **La Solución:** Envolver el renderizado de elementos que dependan de horas/fechas o del estado del dispositivo dentro de un `useEffect` para asegurar que solo se ejecuten en el cliente, o cargar el componente mediante importación dinámica desactivando SSR:
  ```typescript
  // 1. Solución mediante estado de montaje
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <Loader />;

  // 2. O mediante importación dinámica en Next.js:
  import dynamic from 'next/dynamic';
  const MapComponent = dynamic(() => import('./Map'), { ssr: false });
  ```

---

### 3. Bloqueo de Sonido Automático (`Autoplay Policy`)
* **El Problema:** Para evitar el spam de audio, iOS bloquea por completo la reproducción de sonidos a menos que se originen directamente de una interacción física del usuario (como un clic o tap).
  * Si la web de FOWY intenta reproducir el tono de alerta de un nuevo pedido de forma automática en segundo plano, Safari arrojará una excepción de seguridad `NotAllowedError` que suspende la ejecución de JavaScript.
* **La Solución:** Capturar el error para evitar el colapso del script y requerir una interacción inicial (como un botón de "Activar sonido" o "Aceptar"):
  ```typescript
  const playAlert = async () => {
    try {
      const audio = new Audio('/sounds/alert.mp3');
      await audio.play();
    } catch (error) {
      console.warn("Autoplay bloqueado por iOS Safari hasta interacción del usuario.");
    }
  };
  ```

---

### 4. Geolocalización e HTTPS Obligatorio
* **El Problema:** El explorador de FOWY (`/explorar`) depende de los mapas y la geolocalización. iOS bloquea de forma absoluta el acceso a la ubicación del usuario (`navigator.geolocation`) si la conexión no se realiza mediante un enlace **HTTPS seguro y con certificado válido**. En desarrollo local o HTTP estándar, simplemente fallará de manera silenciosa.
* **La Solución:** Diseñar la aplicación con un modal explicativo (fallback) si se deniegan los permisos o si no se cuenta con HTTPS, evitando que la lógica del mapa se quede congelada:
  ```typescript
  if (!navigator.geolocation) {
    // Proveer una ubicación por defecto (ej. Centro de Bogotá) para que el mapa renderice de todos modos
    setDefaultLocation();
  }
  ```

---

### 5. Restricción de `localStorage` (Modo Incógnito / Privacidad)
* **El Problema:** Si el usuario entra en modo de navegación privada en su iPhone, o tiene el bloqueo de cookies de terceros activado de forma estricta, Safari bloquea la escritura o lectura en `localStorage`. Si el código (ej. carrito de compras o Auth de Supabase) intenta escribir directamente en `localStorage` sin validación, la app se detiene.
* **La Solución:** Envolver todas las lecturas/escrituras en bloques `try/catch` o usar cookies persistentes como alternativa:
  ```typescript
  export const setLocalData = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("No se pudo escribir en localStorage (Modo privado/iOS):", e);
    }
  };
  ```

---

### 6. Colapso Fatal por Inicialización de Firebase Cloud Messaging (FCM)
* **El Problema:** Al cargar la aplicación en navegadores integrados de iOS (como los WebViews de Instagram, WhatsApp o Facebook) o en navegadores de iOS donde Push API no está habilitado o soportado, llamar directamente a [getMessaging](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/firebase.ts#L20) de Firebase lanza una excepción síncrona `messaging/unsupported-browser`.
  * Como este error ocurre a nivel de importación de módulo en [firebase.ts](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/firebase.ts), rompe el hilo de ejecución principal de JavaScript. Esto provoca que Next.js falle inmediatamente y muestre la pantalla genérica de error "This page couldn't load. Reload to try again" a nivel de la raíz del sitio, antes de que cualquier componente o límite de error (`ErrorBoundary`) pueda actuar.
* **La Solución:** Envolver la llamada a [getMessaging](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/firebase.ts#L20) dentro de un bloque `try/catch`. Si el navegador no soporta mensajería push, el error es capturado de manera segura, se imprime una advertencia en la consola y el símbolo [messaging](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/firebase.ts#L17) se exporta como `undefined`. El proveedor de notificaciones [NotificationProvider](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/NotificationProvider.tsx) ya cuenta con validaciones defensivas (`if (!messaging) return;`), por lo que la aplicación seguirá funcionando con total normalidad para el usuario sin crashear.

---

## 🚫 ¿POR QUÉ ENTRAR DESDE LA APP DE GOOGLE EMPEORA LAS COSAS?
Muchos usuarios de iPhone intentan resolver los problemas abriendo la web desde la app oficial de Google o Chrome. Esto empeora el rendimiento por las siguientes razones:
1. **Pérdida de Cookies y Sesión:** Los navegadores dentro de aplicaciones (WebViews) limpian la memoria en cuanto el usuario sale de la app de Google. El usuario tendrá que iniciar sesión constantemente y su carrito de compras se perderá al minimizar.
2. **Sin Permisos de Ubicación:** La app de Google o WhatsApp a menudo no tiene el permiso de geolocalización concedido a nivel del sistema operativo iOS, bloqueando la función del mapa de raíz.
3. **Notificaciones Push Web Bloqueadas:** iOS restringe las notificaciones Push web al navegador Safari oficial del sistema y exige que la web esté agregada a la pantalla de inicio como PWA ("Compartir" -> "Añadir a pantalla de inicio").

---

## 📋 CHECKLIST COMPLETO DE IMPLEMENTACIÓN (iOS COMPATIBILITY)

Sigue esta lista paso a paso para auditar e implementar cada corrección en la base de código de FOWY. Puedes marcar cada tarea como completada `[x]` a medida que se resuelvan.

### 📅 1. Compatibilidad de Fechas (`Invalid Date` en WebKit)
- [x] **1.1. Auditoría de constructores de fechas:** Buscar de manera global todas las ocurrencias de `new Date(` y `Date.parse(` en la base de código.
- [x] **1.2. Sanitización en Utilidades de Bogotá:** Modificar [bogotaTimeUtils.ts](file:///c:/Users/cange/Documents/fowy/src/utils/bogotaTimeUtils.ts) para asegurar que cualquier cadena de fecha recibida reemplace espacios en blanco por el carácter `"T"` (ej. `rawDate.replace(" ", "T")`).
- [x] **1.3. Sanitización de Estadísticas:** Revisar archivos de procesamiento de analíticas del negocio (ej. `src/utils/businessStats.ts`) y normalizar la entrada de fechas antes de realizar comparaciones de tiempo.
- [x] **1.4. Validaciones en Pedidos:** Asegurar que la lógica de tiempo transcurrido en el gestor de pedidos (ej. `src/hooks/useOrderManager.ts` u homólogos) maneje de manera segura las diferencias de timestamp sin arrojar `NaN`.

### 💧 2. Prevención de Errores de Hidratación (`Hydration Mismatch`)
- [x] **2.1. Retraso de Renderizado en Fechas Clientes:** Envolver los componentes de visualización de horas o fechas dinámicas (por ejemplo, el reloj, horas de entrega estimadas, etc.) en un hook que espere a que el componente esté montado (`useEffect` -> `mounted = true`).
- [x] **2.2. Importación Dinámica (Dynamic Imports):** Cargar componentes pesados del lado del cliente o que accedan al objeto `window` (como el mapa de Leaflet de `/explorar`) usando `next/dynamic` con la opción `{ ssr: false }` desactivada.
- [x] **2.3. Supresión Selectiva de Advertencias:** Agregar el atributo `suppressHydrationWarning` únicamente en los elementos HTML específicos que muestren marcas de tiempo relativas (como "hace 5 minutos") para evitar advertencias molestas en la consola del iPhone.

### 🔊 3. Control de Bloqueos de Audio (`Autoplay / AudioContext`)
- [x] **3.1. Protección de Promesas de Reproducción:** Modificar todas las invocaciones de `.play()` en archivos de alerta de audio para asegurar que manejen la promesa de forma asíncrona dentro de un bloque `try-catch` (capturando `NotAllowedError` o `AbortError`).
- [x] **3.2. Botón de Activación de Sonido:** Diseñar e incorporar un botón o switch discreto de "Sonido Activo" en el panel del negocio que requiera una interacción física del usuario, inicializando el objeto `AudioContext` en el tap para desbloquear Safari.
- [x] **3.3. Estado de Audio en UI:** Reflejar visualmente al usuario o socio de negocio si el sonido está bloqueado o desbloqueado mediante iconos (ej. 🔊 / 🔇) para una excelente experiencia de usuario.

### 📍 4. Geolocalización y Mapas Robustos
- [x] **4.1. Verificación previa de API:** Asegurar que antes de llamar a `navigator.geolocation.getCurrentPosition` se valide la existencia del API y se capturen todos los códigos de error (permiso denegado, posición no disponible, timeout).
- [x] **4.2. Coordenadas de Respaldo (Fallback Coords):** Configurar coordenadas estáticas predeterminadas (ej. coordenadas del centro de Bogotá) si falla la localización automática, garantizando que el mapa se cargue de todos modos.
- [x] **4.3. Banner explicativo de HTTPS / GPS:** Implementar un aviso en la interfaz del mapa que guíe amigablemente al usuario en iPhone sobre cómo otorgar permisos de ubicación o le indique que se requiere una conexión HTTPS segura.

### 💾 5. Blindaje del `localStorage` en Modo Privado
- [x] **5.1. Encapsulamiento del Storage:** Crear o utilizar una función envolvente para `localStorage` (`getItem`, `setItem`, `removeItem`) protegida con `try-catch` para evitar fallos catastróficos en modo incógnito de Safari.
- [x] **5.2. Memoria en Caché Temporal (Memory Fallback):** Implementar un almacenamiento de respaldo en memoria volátil (objeto plano de JavaScript) dentro de la utilidad de almacenamiento, para que si `localStorage` falla, la app siga operando con datos temporales durante la sesión.
- [x] **5.3. Cliente Supabase en Privado:** Asegurar que la configuración del cliente de autenticación de Supabase utilice un adaptador resistente o ignore de manera elegante la imposibilidad de persistir sesión si localStorage está deshabilitado por completo.

### 💬 6. Blindaje de Firebase Cloud Messaging (FCM)
- [ ] **6.1. Diagnóstico de soporte:** Identificar el fallo síncrono al instanciar [getMessaging](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/firebase.ts#L20) en WebViews/navegadores sin soporte de Push API.
- [ ] **6.2. Envoltura try-catch en inicialización:** Modificar [firebase.ts](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/firebase.ts) para envolver la invocación de [getMessaging](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/firebase.ts#L20) en un bloque `try/catch` y evitar el colapso a nivel de importación.
- [ ] **6.3. Verificación de uso defensivo en UI/Providers:** Asegurar que [NotificationProvider.tsx](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/NotificationProvider.tsx) maneje de manera segura el valor `undefined` de [messaging](file:///c:/Users/cange/Documents/fowy/src/modules/notifications/firebase.ts#L17) en todos sus efectos y funciones.
- [ ] **6.4. Pruebas de regresión:** Validar la carga de la aplicación en WebViews simulados o navegadores con Push API deshabilitado para confirmar la correcta carga de la página raíz.

