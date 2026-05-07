# 🗺️ HOJA DE RUTA MAESTRA: PROYECTO FOWY (CONSOLIDADA)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.


Este es el registro único de verdad. Combina todos los checklists de `nucleo.md`, `notificaciones.md`, `negocios.md` y `rol-negocio.md`.

---

## 🏗️ FASE 1: INFRAESTRUCTURA (Completada ✅)
- [x] **1.1 Init Project**: Next.js 15, Tailwind, TypeScript.
- [x] **1.2 Supabase Client**: Instalación de `@supabase/ssr` y `@supabase/supabase-js`.
- [x] **1.3 Environment**: Configuración de variables de entorno (URL/Anon Key).
- [x] **1.4 UI Foundation**: Instalación de `lucide-react`, `framer-motion` y `clsx`.

---

## 🧠 FASE 2: EL CEREBRO Y SEGURIDAD (Completada ✅)
- [x] **2.1 Role Types**: Enum `user_role` (super_admin, professional, seller, business_owner, explorer).
- [x] **2.2 Profiles Table**: Estructura id, email, full_name, role, avatar_url.
- [x] **2.3 Auto-Profile Trigger**: Función PL/pgSQL para registros automáticos.
- [x] **2.4 RLS Mastery**: Políticas de aislamiento de datos activas.

---

## 🎨 FASE 3: EL CASCARÓN (Base UI & Layout) (Completada ✅)
- [x] **3.1 Theme Tokens**: Configuración de `tailwind.config.ts` (Degradados y `rounded-fowy`).
- [x] **3.2 Master Shell**: Sidebar Glassmorphism y fondo degradado.
- [x] **3.3 Motion Presets**: Animaciones de entrada configuradas.

---

## 🏪 FASE 4: GESTIÓN DE NEGOCIOS (ADMIN) (Completada ✅)
- [x] **4.1 Infraestructura de Datos**: Tablas `categories`, `businesses` y Buckets de Storage.
- [x] **4.2 Interfaz de Listado**: Fila de categorías (círculos), buscador inteligente y tabla master/mobile.
- [x] **4.3 Geolocalización**: 
    - [x] Columnas lat/lng en DB.
    - [x] Integración de Leaflet (`ssr: false`).
    - [x] `LocationPicker` con Reverse Geocoding.
- [x] **4.4 Refactorización (Desacoplamiento `[id]/page.tsx`)**:
    - [x] `<BusinessProfileHeader />`
    - [x] `<BusinessLocationManager />`
    - [x] `<BusinessModuleManager />`
    - [x] `<BusinessPaymentViewer />`
- [x] **4.5 Dashboard Admin (Refactorizado)**:
    - [x] `<DashboardHeader />`
    - [x] `<DashboardStatsGrid />`
    - [x] `<DashboardGrowthChart />`
    - [x] `<DashboardDistributionChart />`

---

## 🔔 FASE 5: SISTEMA DE NOTIFICACIONES UNIFICADO (Completada ✅)
- [x] **5.1 Backend & DB**: Tabla `notifications`, RLS y Realtime habilitado.
- [x] **5.2 Firebase (FCM)**:
    - [x] Configuración de llaves VAPID y par de llaves.
    - [x] `public/firebase-messaging-sw.js` (Escucha en segundo plano).
    - [x] Edge Function `send-push` desplegada.
- [x] **5.3 Frontend & UX**:
    - [x] `NotificationProvider.tsx` y hook `useNotifications.ts`.
    - [x] Activos de audio: `cash-register.mp3` y `alert.mp3`.
    - [x] UI Premium: Campana animada, Dropdown y página de historial.

---

## 🎭 FASE 6: OPTIMIZACIÓN Y ESCALABILIDAD (Completada ✅)
- [x] **6.1 Paginación en Tiempo Real**: Carga por bloques (offset/limit).
- [x] **6.2 Búsqueda Server-side**: Filtros directos en Supabase.
- [x] **6.3 Gestión Maestra de Imágenes**: Compresión con API Canvas y limpieza de Storage.
- [x] **6.4 Blindaje de Supabase**: RLS avanzado para buckets de Storage.

---

## 💼 FASE 7: MÓDULO DE SOCIOS (Completada ✅)
- [x] **7.1 Analíticas de Tráfico**:
    - [x] 7.1.1 Crear tabla `analytics_visits` para tracking de visitas al menú.
    - [x] 7.1.2 Dashboard de KPIs: Visitas vs Ventas, Ticket Promedio.
- [x] **7.2 Gestión de Pedidos en Vivo**:
    - [x] 7.2.1 Crear tablero de control de órdenes.
    - [x] 7.2.2 Integrar sonido `cash-register.mp3` en eventos de tabla `orders`.
    - [x] 7.2.3 Lógica de estados: Pendiente -> Realizado.
- [x] **7.3 Editor de Menú Pro**:
    - [x] 7.3.1 CRUD de productos con stock-switch.
    - [x] 7.3.2 Lógica de Horarios: Ocultar botón "Pedir" fuera de servicio.
- [x] **7.4 Branding Dinámico**:
    - [x] 7.4.1 Integrar **Color Picker** para el color de identidad del menú.
    - [x] 7.4.2 Inyección dinámica de estilos CSS según el color elegido en tiempo real.
- [x] **7.5 Pagos y Membresía**:
    - [x] 7.5.1 Sección de subida de comprobantes de pago.
    - [x] 7.5.2 Flujo de aprobación Admin -> Socio.

---

## 🌍 FASE 8: MÓDULO EXPLORADOR (Completada ✅)
- [x] **8.1 Mapa de Descubrimiento**: Vista global de negocios geolocalizados (Leaflet + RT).
- [x] **8.2 Menú Digital Premium**: Interfaz de pedidos optimizada para móvil.
- [x] **8.3 Checkout WhatsApp**: Generación de mensaje estructurado y registro en DB.

---

## 🏁 FASE 9: LANZAMIENTO Y MANTENIMIENTO
- [ ] **9.1 Auditoría de Seguridad Final**.
- [ ] **9.2 SEO & Performance Optimization**.
- [ ] **9.3 Beta Testing**.

---

## 🚀 FASE 10: ECOSISTEMA DE EXPERTOS (MARKETPLACE B2B) ✅
*Modelo de Agencia Centralizada: FOWY como garante y recaudador (Comisión 20%)*

- [x] **10.1 Perfiles de Expertos (Rol Professional)**:
    - [x] 10.1.1 Ampliar tabla `profiles` con campos: biografía, especialidad y rating.
    - [x] 10.1.2 Crear tabla `professional_portfolio` para imágenes/videos de trabajos previos.
    - [x] 10.1.3 Crear tabla `professional_plans` para planes y precios estándar por experto.
- [x] **10.2 Marketplace en Portal de Socios (Item: Expertos FOWY)**:
    - [x] 10.2.1 Implementar vista de exploración usando el **diseño de tarjetas premium** (Consistencia visual).
    - [x] 10.2.2 Añadir item "Expertos FOWY" en la sidebar bajo la sección "Ajustes de Perfil".
    - [x] 10.2.3 Modal de perfil detallado con estrellas, portafolio, biografía y selección de planes.
    - [x] 10.2.4 CTA: "Contratar con Garantía FOWY" (Inicia flujo de pago/escrow).
- [x] **10.3 Lógica de Transacciones (Escrow)**:
    - [x] 10.3.1 Tabla `service_orders` para rastrear la contratación, pago y entrega.
    - [x] 10.3.2 Sistema de estados: `pending_payment` -> `in_escrow` -> `completed` -> `funds_released`.
    - [x] 10.3.3 Algoritmo de comisión: Cálculo automático del 20% de FOWY y 80% para el experto.
- [x] **10.4 Gestión de Entregas y Garantía**:
    - [x] 10.4.1 Panel de Experto (`/business/expert`) para que el profesional gestione pedidos y suba entregas.
    - [x] 10.4.2 Flujo de aprobación del Socio: Al dar "Liberar Pago", el dinero se marca para acreditación.
    - [x] 10.4.3 Auditoría de seguridad y protección de fondos en custodia por FOWY.

---

## 🔔 FASE 11: FLUJOS DE NOTIFICACIÓN DE NEGOCIO (Completada ✅)
*Garantizar que el socio y el experto estén siempre informados en tiempo real.*

- [x] **11.1 Alertas de Pedidos en Vivo**:
    - [x] 11.1.1 Configurar trigger en tabla `orders` para disparar `send-push` al Business Owner.
    - [x] 11.1.2 Integrar sonido de caja registradora (`cash-register.mp3`) en el Dashboard del socio al recibir pedido.
- [x] **11.2 Notificaciones de Expertos (B2B)**:
    - [x] 11.2.1 Notificar al Negocio cuando un Experto: Acepta el trabajo, Sube una entrega o Cambia el estatus del proyecto.
    - [x] 11.2.2 Notificar al Experto cuando: El Negocio libera fondos (Escrow) o Se solicita una revisión.
- [x] **11.3 UI de Notificaciones Contextuales**:
    - [x] 11.3.1 Añadir indicador de alertas visuales directamente en el "Perfil de Negocio" y "Panel de Experto" (PartnerTopBar).
    - [x] 11.3.2 Implementar avisos visuales para acciones críticas (ej. "Membresía por Vencer").

---

## 🔗 FASE 12: VINCULACIÓN Y ACCESO DE SOCIOS (Completada ✅)
*Objetivo: Permitir que el Admin asigne dueños a los negocios y que estos accedan a su panel privado.*

- [x] **12.1 Refactorización de Creación (Admin)**:
    - [x] 12.1.1 Modificar `AddBusinessModal.tsx` para añadir el campo "Email del Dueño" (Input con estilo Glassmorphism y validación).
    - [x] 12.1.2 Implementar búsqueda/validación de usuario en Supabase antes de la creación.
    - [x] 12.1.3 Actualizar el orquestador `useAdminBusinessManager.ts` para persistir el `owner_id` en la tabla `businesses`.
- [x] **12.2 Gobernanza de Roles y Permisos**:
    - [x] 12.2.1 Crear lógica (Trigger o Edge Function) para elevar el rol del usuario de `explorer` a `business_owner` al ser vinculado.
    - [x] 12.2.2 Auditar políticas RLS en la tabla `businesses` para permitir lectura/escritura al `owner_id` correspondiente.
- [x] **12.3 UI/UX Menú de Perfil (Explorer Layout)**:
    - [x] 12.3.1 Modificar `src/app/(explorer)/layout.tsx` para detectar si el usuario logueado posee negocios.
    - [x] 12.3.2 Inyectar opción "Mi Negocio" en el menú desplegable (Icono: `Store`, Estilo: `Secondary Flow` de `diseño.md`).
    - [x] 12.3.3 Implementar redirección inteligente al Dashboard de Socio (`/business/dashboard`).

---

## 🚀 FASE 13: ESTABILIZACIÓN DE PEDIDOS REALTIME (Completada ✅)
*Objetivo: Corregir el error de colisión de canales y asegurar la persistencia sonora en el panel del negocio.*

- [x] **13.1 Refactorización de Estabilidad (Singleton)**:
    - [x] 13.1.1 Extraer `createClient()` de `useOrderManager.ts` y `OrdersPage.tsx` para convertirlos en Singletons estables.
    - [x] 13.1.2 Implementar patrón `useRef` en el Hook de órdenes para evitar *stale closures* en las suscripciones.
    - [x] 13.1.3 Ajustar dependencias del `useEffect` e implementar **IDs de canal únicos** (vía `Math.random()`) para evitar colisiones en React 19.
- [x] **13.2 Verificación Operativa**:
    - [x] 13.2.1 Validar que el sonido `cash-register.mp3` se dispare sin errores al recibir un pedido.
    - [x] 13.2.2 Confirmar que no hay fugas de canales en el DevTools de Chrome al navegar entre secciones.

---

## 🥗 FASE 14: GESTIÓN DE CATEGORÍAS Y PRODUCTOS (BUSINESS)
*Objetivo: Resolver botones huérfanos y permitir que cada negocio organice su menú con categorías propias e independientes.*

- [x] **14.1 Diagnóstico e Infraestructura de Datos**:
    - [x] 14.1.1 **Corrección de Eventos**: Vincular manejadores `onClick` a los botones "+ Nuevo Producto" y "Agregar Producto".
    - [x] 14.1.2 **Base de Datos**: Crear tabla `product_menu_categories` (id, business_id, name, order_index).
    - [x] 14.1.3 **Seguridad RLS**: Configurar políticas para que el `business_owner` solo gestione sus categorías locales.
- [x] **14.2 Gestor de Categorías del Negocio (DNA Modular)**:
    - [x] 14.2.1 Crear componente `<MenuCategoryManager />` con diseño Glassmorphism (blanco traslúcido + `backdrop-blur`).
    - [x] 14.2.2 Implementar CRUD de categorías locales usando chips animados con `framer-motion`.
- [x] **14.3 Modal de Producto Premium (The Engine)**:
    - [x] 14.3.1 Desarrollar `<ProductFormModal />` independiente (Estilo SideSheet lateral).
    - [x] 14.3.2 **Multimedia Pro**: Integrar `compressImage` (ahorro 80%) y visualización con `PremiumImage`.
    - [x] 14.3.3 **Selector Inteligente**: Inyectar dinámicamente solo las categorías creadas por el socio en el paso 14.2.
    - [x] 14.3.4 **Atributos de Venta**: Toggles para "Nuevo", "Oferta", "Recomendado" y switch de `in_stock`.
- [x] **14.4 Integración y Feedback**:
    - [x] 14.4.1 Conectar formulario con `useProductManager.addProduct` asegurando la inyección automática del `business_id`.
    - [x] 14.4.2 Implementar `SuccessToast` (No alerts nativos) y refresco animado del grid de productos.
- [x] **14.5 Sincronización con Explorador**:
    - [x] 14.5.1 Actualizar vista `/explorar` para agrupar productos bajo sus categorías locales.
    - [x] 14.5.2 Validar desaparición del mensaje "NO HAY PRODUCTOS" tras la primera creación exitosa.

---

## 🍔 FASE 15: REDISEÑO MENÚ DIGITAL "CRAVE EXPRESS" (Explorador)
*Objetivo: Transformar la vista `[slug]/page.tsx` en la experiencia premium del mockup, con branding dinámico por negocio, slider de banners, grid de productos con favoritos, íconos de promo y geolocalización real.*

---

### 🖼️ 15.1 Hero Slider de Banners & Perfil
- [x] **15.1.1 DB — Tabla `business_banners`**: Crear tabla `(id, business_id, image_url, order_index, created_at)` con RLS para escritura exclusiva del `owner_id`.
- [x] **15.1.2 Panel Negocio — Uploader de Banners**: Añadir sección "Banners del Menú" en el panel del socio (`/business/branding`) con carga múltiple usando `compressImage`.
- [x] **15.1.3 Gestión de Storage**: Implementar lógica de eliminación automática en el Storage al borrar o reemplazar banners (Concepto 3.4).
- [x] **15.1.4 Componente `<MenuHeroSlider />`**: Carrusel auto-play con transición suave. Muestra banners del negocio o imagen de portada como fallback.
- [x] **15.1.4 Dots de Paginación**: Indicador de posición activa en la parte inferior del slider.
- [x] **15.1.5 Avatar del Usuario (Header Overlay)**: Botón circular en la esquina superior derecha del slider que muestra avatar del usuario logueado o ícono genérico. Abre perfil/sesión.

---

### 🏪 15.2 Barra de Identidad del Negocio
- [x] **15.2.1 Componente `<BusinessIdentityBar />`**: Logo circular (`PremiumImage`), nombre del negocio (`font-bold`), y calificación.
- [x] **15.2.2 Estado ABIERTO/CERRADO**: Punto verde (●) o rojo con texto basado en lógica de horarios.
- [x] **15.2.3 Rating & Distancia**: Mostrar "⭐ 4.9" y "📍 Distancia X.X km" usando geolocalización del navegador.

---

### 🔍 15.3 Buscador de Productos
- [x] **15.3.1 Componente `<CraveSearchBar />`**: Input con ícono de lupa, estilo Glassmorphism.
- [ ] **15.3.2 Filtrado Server-Side**: Implementar búsqueda reactiva consultando directamente a la DB (Supabase) para optimizar memoria en móvil (Concepto 3.2).

---

### 🏷️ 15.4 Pills de Categorías con Branding Dinámico
- [x] **15.4.1 Componente `<CraveCategoryBar />`**: Carrusel horizontal de categorías locales.
- [x] **15.4.2 Color Dinámico**: La categoría activa usa el `accent_color` del negocio como fondo.

---

### 🃏 15.5 Grid de Productos Premium (2 Columnas)
- [x] **15.5.1 Refactorizar `<CraveProductCard />`**: Rediseño completo con imagen `aspect-square`.
- [x] **15.5.2 Insignia PROMO**: Reemplazada por el texto/insignia "PROMO" (diseño definitivo aprobado).
- [ ] **15.5.3 Botón Favorito ❤️**: Corazón interactivo. Si no hay login -> Al darle clic lo envía a loguearse.
- [x] **15.5.4 Botón `+` (Add to Cart)**: Botón circular con el `accent_color` del negocio.
- [x] **15.5.5 Vista de Detalle (Product Modal)**: Al hacer clic en la foto del producto, abrir un popup/modal con imagen ampliada, descripción completa y detalles.

---

### ❤️ 15.6 Sistema de Favoritos (Con Gate de Login)
- [x] **15.6.1 DB — Tabla `user_favorites`**: Crear tabla con RLS por `user_id`.
- [ ] **15.6.2 Hook `useFavorites.ts`**: Lógica de toggle y persistencia en Supabase.
- [ ] **15.6.3 Flujo Gate de Login**: Si el usuario no está logueado, al dar clic en el corazón lo envía a loguearse.

---

### 🎨 15.7 Sistema de Branding Dinámico Global
- [x] **15.7.1 Inyección de Variable CSS `--brand-color`**: Inyectar `accent_color` en el contenedor principal de `page.tsx`.
- [x] **15.7.2 Tokens Aplicados**: Aplicar color a categorías, botón `+` y elementos de acción.
- [x] **15.7.3 Checkout WhatsApp — Verde Fijo**: El botón final de envío siempre es verde (`#25D366`).

---

### ✅ 15.8 Calidad y Optimización
- [x] **15.8.1 Modularización**: Separar cada sección en componentes pequeños.
- [x] **15.8.2 `PremiumImage`**: Carga con esqueletos y manejo de errores.
- [ ] **15.8.3 Performance**: Carga perezosa del grid para optimizar memoria en móvil.

---
 
### 📊 15.9 Historial de Pedidos & Sistema de Rating (Explorer)
*Objetivo: Permitir que el cliente gestione sus compras y califique negocios una vez completado el pedido.*
- [ ] **15.9.1 UI — Acceso en Menú de Perfil**: Inyectar la opción "Mis Pedidos" (Icono: `ShoppingBag`) en el layout del explorador.
- [ ] **15.9.2 Componente `<UserOrdersSheet />`**: SideSheet premium para visualizar el historial.
- [ ] **15.9.3 Lógica de Estados**: Visualizar y filtrar pedidos por estados: `completado`, `pendiente` y `cancelado`.
- [ ] **15.9.4 Paginación de Historial**: Implementar carga por bloques o scroll infinito.
- [ ] **15.9.5 Sistema de Calificación (Rating)**:
    - [ ] **Habilitación Condicional**: El cliente podrá calificar el negocio con estrellas (1-5) únicamente cuando el negocio cambie el estado del pedido a `completado`.
    - [ ] **Seguridad**: Validar en Supabase que el usuario no duplique votos por negocio.
    - [ ] **Sincronización**: Actualización automática del promedio del negocio en `BusinessIdentityBar`.

---
---
 *Documento consolidado - FOWY 2026*
