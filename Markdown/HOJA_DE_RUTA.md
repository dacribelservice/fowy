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

## 🧠 FASE 6: OPTIMIZACIÓN Y ESCALABILIDAD (Completada ✅)
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
    - [x] 10.4.1 Panel de Experto (`/business/expert`) para que el profesional ggestione pedidos y suba entregas.
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
- [x] **15.3.2 Filtrado Server-Side**: Implementar búsqueda reactiva consultando directamente a la DB (Supabase) para optimizar memoria en móvil (Concepto 3.2).

---

### 🏷️ 15.4 Pills de Categorías con Branding Dinámico
- [x] **15.4.1 Componente `<CraveCategoryBar />`**: Carrusel horizontal de categorías locales.
- [x] **15.4.2 Color Dinámico**: La categoría activa usa el `accent_color` del negocio como fondo.

---

### 🃏 15.5 Grid de Productos Premium (2 Columnas)
- [x] **15.5.1 Refactorizar `<CraveProductCard />`**: Rediseño completo con imagen `aspect-square`.
- [x] **15.5.2 Insignia PROMO**: Reemplazada por el texto/insignia "PROMO" (diseño definitivo aprobado).
- [x] **15.5.3 Botón Favorito ❤️**: Corazón interactivo. Si no hay login -> Al darle clic lo envía a loguearse.
- [x] **15.5.4 Botón `+` (Add to Cart)**: Botón circular con el `accent_color` del negocio.
- [x] **15.5.5 Vista de Detalle (Product Modal)**: Al hacer clic en la foto del producto, abrir un popup/modal con imagen ampliada, descripción completa y detalles.

---

### ❤️ 15.6 Sistema de Favoritos (Con Gate de Login)
- [x] **15.6.1 DB — Tabla `user_favorites`**: Crear tabla con RLS por `user_id`.
- [x] **15.6.2 Hook `useFavorites.ts`**: Lógica de toggle y persistencia en Supabase.
- [x] **15.6.3 Flujo Gate de Login**: Si el usuario no está logueado, al dar clic en el corazón lo envía a loguearse.
- [x] **15.6.4 Componente `<UserFavoritesSheet />`**: SideSheet/Bottom Sheet premium con estilo de vidrio (Glassmorphism) para visualizar los productos favoritos del usuario al dar clic en "Favoritos" en el menú de perfil.
- [x] **15.6.5 Identificación de Comercio**: Cada producto favorito debe mostrar claramente a qué negocio pertenece (nombre/logo) dentro de la lista de favoritos de diferentes comercios.

---

### 🎨 15.7 Sistema de Branding Dinámico Global
- [x] **15.7.1 Inyección de Variable CSS `--brand-color`**: Inyectar `accent_color` en el contenedor principal de `page.tsx`.
- [x] **15.7.2 Tokens Aplicados**: Aplicar color a categorías, botón `+` y elementos de acción.
- [x] **15.7.3 Checkout WhatsApp — Verde Fijo**: El botón final de envío siempre es verde (`#25D366`).

---

### ✅ 15.8 Calidad y Optimización
- [x] **15.8.1 Modularización**: Separar cada sección en componentes pequeños.
- [x] **15.8.2 `PremiumImage`**: Carga con esqueletos y manejo de errores.
- [x] **15.8.3 Performance**: Carga perezosa del grid para optimizar memoria en móvil.

---

### 📊 15.9 Historial de Pedidos & Sistema de Rating (Explorer)
*Objetivo: Permitir que el cliente funcione sus compras y califique negocios una vez completado el pedido.*
- [x] **15.9.1 UI — Acceso en Menú de Perfil**: Inyectar la opción "Mis Pedidos" (Icono: `ShoppingBag`) en el layout del explorador.
- [x] **15.9.2 Componente `<UserOrdersSheet />`**: SideSheet premium para visualizar el historial (con estilo de vidrio/Glassmorphism idéntico al carrito).
- [x] **15.9.3 Lógica de Estados**: Visualizar y filtrar pedidos por estados: `completado`, `pendiente` y `cancelado`.
- [x] **15.9.4 Paginación de Historial**: Implementar carga por bloques o scroll infinito.
- [x] **15.9.5 Sistema de Calificación (Rating)**:
    - [x] **Habilitación Condicional**: El cliente podrá calificar el negocio con estrellas (1-5) únicamente cuando el negocio cambie el estado del pedido a `completado`.
    - [x] **Seguridad**: Validar en Supabase que el usuario no duplique votos por negocio.
    - [x] **Sincronización**: Actualización automática del promedio del negocio en `BusinessIdentityBar`.

---

### ✂️ 15.10 Refactor de Calidad: Poda y Modularización de [page.tsx](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/[slug]/page.tsx)
*Objetivo: Dividir el orquestador principal (actualmente de 433 líneas) para cumplir con el límite de <250 líneas establecido en los conceptos del proyecto, extrayendo lógica compleja y vistas secundarias de estado.*

- [x] **15.10.1 Extracción de Hooks Personalizados (Lógica de Datos)**:
    - [x] **Hook `useBusinessMenuData(slug)`**:
        - **Qué hace**: Agrupa toda la obtención de datos de Supabase, estados de `business`, `categories`, `products`, `banners`, `loading`, estados reactivos de búsqueda debounzada, y el filtrado en el servidor.
        - **Impacto**: Elimina la complejidad de base de datos y búsqueda de la vista principal.
    - [x] **Hook `useBusinessAnalytics(businessId)`**:
        - **Qué hace**: Maneja el registro de visitas del cliente en `analytics_visits` de forma pasiva y segura.
        - **Impacto**: Elimina el callback `recordVisit` y su respectivo `useEffect`.
- [x] **15.10.2 Extracción de Componentes de UI Secundarios (Vistas de Estado)**:
    - [x] **Componente `<BusinessMenuSkeleton />`**:
        - **Qué hace**: Contiene el enorme bloque de carga inicial con esqueletos animados de banner, barra de identidad, categorías y tarjetas de producto (líneas 168 a 228).
        - **Impacto**: Libera alrededor de 60 líneas de HTML esqueleto de la página principal.
    - [x] **Componente `<BusinessMenuNotFound />`**:
        - **Qué hace**: El diseño de pantalla de error visual y amigable cuando no se encuentra el negocio (líneas 119 a 165).
        - **Impacto**: Libera alrededor de 45 líneas de la página principal.

---

### 🌟 15.11 Ajustes de Calificaciones y Votos Reales (0 Estrellas)
*Objetivo: Ajustar el sistema de ranking para mostrar 0 estrellas y (0) votos cuando el negocio no tenga calificaciones reales.*

- [x] **15.11.1 DB — Valor por Defecto**: Cambiar el valor por defecto de la columna `rating` de `5.0` a `0.0` en la tabla `businesses`.
- [x] **15.11.2 DB — Trigger de Promedio**: Actualizar la función del trigger para que, si no hay votos/calificaciones en `business_ratings`, el cálculo promedio devuelva `0.0` en lugar de `5.0`.
- [x] **15.11.3 Hook — Conteo de Votos**: En el hook de datos `useBusinessMenuData.ts`, realizar una consulta rápida para contar la cantidad exacta de calificaciones del negocio en la tabla `business_ratings` (`votesCount`).
- [x] **15.11.4 UI — Encabezados de Crave**: Actualizar `<CraveBusinessHeader />` and `<CraveHeaderCompact />` para recibir e integrar este conteo de votos. Si es 0, mostrar `(0)` votos y pintar las estrellas vacías (gris suave) en lugar de doradas.
- [x] **15.11.5 Panel Socio — Vista de Ranking**: Modificar `/business/orders/page.tsx` para que, si el conteo de votos del negocio es 0, muestre la calificación del socio en `0.0` y pinte las estrellas vacías, reflejando fielmente el promedio.

---

## 📱 FASE 16: REDISEÑO DE PORTAL SOCIO (DASHBOARD) ✅
- [x] **16.1 Reorganización en Capas Verticales (Layout Mobile-First)**:
    - [x] **16.1.1 Capa 1 (Plan Píldora)**: Reemplazar la tarjeta de "Plan Contratado" actual por un elemento cilíndrico ultra-compacto (`rounded-full`) al inicio de la página con estilo premium oscuro o borde degradado, indicando de forma sutil: `Plan Standard • Próximo pago: 02/Junio/2026`.
    - [x] **16.1.2 Capa 2 (Lista de Métricas)**: Implementar la lista minimalista de las 4 métricas clave de rendimiento agrupadas verticalmente (sin tarjetas masivas).
    - [x] **16.1.3 Capa 2.5 (Tendencia de Ventas)**: Insertar la gráfica lineal interactiva justo debajo de la lista de métricas y antes de los datos generales del negocio.
    - [x] **16.1.4 Capa 3 (Tarjeta de Negocio Compacta)**: Rediseñar la tarjeta de información general (logo, badge `NEGOCIO ACTIVO`, datos) haciéndola más pequeña, compacta y alineada verticalmente.
    - [x] **16.1.5 Capa 4 (Módulos & Configuración)**: Rediseñar las tarjetas de módulos activos reduciendo su padding interior y tamaño de íconos, ordenándolas de forma vertical compacta sin elementos horizontales complejos.
- [x] **16.2 Lista de Métricas de Rendimiento**:
    - [x] **16.2.1 Métricas a Mostrar**: Incluir únicamente las 4 métricas principales: *Visitas Totales*, *Pedidos Recibidos*, *Tasa de Conversión* y *Ticket Promedio*.
    - [x] **16.2.2 Visualización de Alta Densidad**: Diseñar filas finas con iconos pequeños de color sutil, títulos delgados (`text-slate-400 text-xs`) y valores claros a la derecha separados por líneas divisorias casi invisibles (`border-b border-slate-50`).
- [x] **16.3 Gráfico de Ventas Interactivo ("FowySalesChart")**:
    - [x] **16.3.1 Estructura y Procesamiento de Datos (Backend Supabase)**:
        - [x] **16.3.1.1 Consulta**: Obtener órdenes válidas (`orders`) filtrando por el `business_id` del negocio actual.
        - [x] **16.3.1.2 Procesamiento Inteligente**: Agrupar los montos de venta (`total_amount`) acumulados por el filtro de tiempo.
        - [x] **16.3.1.3 Filtro de Tiempo**: Permitir selección dinámica por **Días** (últimos 7 días), **Semanas** (últimas 4 o 6 semanas) o **Meses** (últimos 6 o 12 meses).
        - [x] **16.3.1.4 Detalle de Calidad**: Rellenar vacíos con `$0` si un intervalo no tiene ventas para garantizar la continuidad del trazado.
    - [x] **16.3.2 Estructura de la Interfaz (UI/UX)**:
        - [x] **16.3.2.1 Cabecera & Controles**: Colocar el título del gráfico a la izquierda (`text-[10px] font-bold uppercase text-slate-400`) y un selector cilíndrico micro a la derecha para alternar filtros (`D`, `S`, `M`), con un indicador de fondo naranja Fowy (`bg-fowy-orange text-white`) con micro-animaciones de transición.
        - [x] **16.3.2.2 SVG Dinámico y Brillo Premium**: Trazar el gráfico con código `<svg viewBox="0 0 500 200">` ultra-responsive con una curva suave (`strokeLinecap="round"`), usando un degradado de naranja Fowy `#FF5A5F` a coral dorado.
        - [x] **16.3.2.3 Efecto Glow**: Añadir un trazado idéntico duplicado con efecto `blur` sutil debajo de la línea principal para simular brillo neumórfico.
        - [x] **16.3.2.4 Relleno del Área**: Agregar un área sombreada suave debajo de la curva que se desvanezca a transparente en la base.
        - [x] **16.3.2.5 Tooltips Interactivos (Mobile-First)**: Permitir que al tocar cualquier nodo de la gráfica aparezca un cuadro flotante sutil indicando el valor de venta (ej: `Vie: $120.000` o `Mes de Mayo: $1.480.000`).
        - [x] **16.3.2.6 Animación Elástica**: Configurar Framer Motion (`animate={{ pathLength: 1 }}`) para dbiujar la línea elegantemente al cargar o cambiar el filtro.
- [x] **16.4 Acoplamiento Modular (Filosofía de Arquitectura - conceptos.md)**:
    - [x] **16.4.1 No Monolitos**: Prohibido agregar este código directamente dentro del orquestador `/app/admin/negocios/[id]/page.tsx` para evitar superar el límite de 200-250 líneas.
    - [x] **16.4.2 Componentes Especializados**: Crear componentes independientes en `src/components/admin/businesses/` (ej: `BusinessMetricsList.tsx`, `FowySalesChart.tsx`) para albergar toda la lógica visual de manera desacoplada.

---

## 💎 FASE 17: INTEGRACIÓN FINANCIERA DE MEMBRESÍAS (En Progreso ⏳)
*Objetivo: Integrar el registro, cobro manual y aprobación de comprobantes de pago de negocios con el módulo de Finanzas global del Super Admin.*

- [ ] **17.1 Modal de Confirmación y Ajuste Manual (BusinessPaymentViewer)**:
    - [x] **17.1.1** Crear modal de confirmación emergente (Popup/Dialog) con estilo premium glassmorphism (`backdrop-blur-md bg-white/80`).
    - [x] **17.1.2** Integrar campo numérico (Input) pre-llenado con el valor personalizado `membership_price` del negocio (o fallback estándar si es nulo) para permitir edición manual del monto verificado.
    - [x] **17.1.3** Limpieza de Interfaz: Al aprobar el pago, el modulo de imagen de comprobante pendiente debe limpiarse inmediatamente esperando el próximo comprobante (Sincronización en tiempo real).
    - [x] **17.1.4** Actualizar base de datos (`payment_proofs`) modificando tanto el estado a `'approved'` como el `amount` con el valor exacto verificado/ingresado.
- [ ] **17.2 Integración en Backend Financiero (useFinanceManager)**:
    - [x] **17.2.1** Extender el hook de finanzas para consultar en paralelo la tabla `payment_proofs` para todos los registros con estado `'approved'`.
    - [x] **17.2.2** Combinar las colecciones de `service_orders` y `payment_proofs` aprobados en un solo flujo ordenado temporalmente.
- [ ] **17.3 Cálculos y Métricas Consolidadas (financeUtils)**:
    - [x] **17.3.1** Modificar `calculateFinanceStats` para sumar el 100% de los cobros de membresías de negocios a la métrica **"Ingresos FOWY"**.
    - [x] **17.3.2** Sumar los montos de membresía aprobados a la métrica de **"Volumen Total (GMV)"**.
- [ ] **17.4 Interfaz del Panel de Finanzas (AdminFinancePage)**:
    - [x] **17.4.1** Actualizar la tabla de transacciones recientes para inyectar transacciones del tipo `Membresía` mostrando el nombre del negocio con un icono y estilo distintivos.
    - [x] **17.4.2** Asegurar la actualización del gráfico de tendencias para incluir el volumen de membresías confirmadas.

---

## 💰 FASE 18: AJUSTES DE MEMBRESÍA DINÁMICA (COP & FECHAS) (Pendiente ⏳)
*Objetivo: Permitir al Súper Admin configurar el precio de membresía en COP y la fecha de próximo pago de cada negocio, y reflejar estos datos dinámicamente en el panel del socio.*

- [x] **18.1 Estructura de Base de Datos (Completada ✅)**:
    - [x] **18.1.1** Verificar existencia de la columna `membership_price` (NUMERIC) en la tabla `businesses` de Supabase (Confirmada su existencia vía query SQL).
- [ ] **18.2 Panel Súper Admin (Configuración del Negocio)**:
    - [x] **18.2.1** Integrar un campo numérico (Input) para el "Precio de Membresía (COP)" en la pestaña *Configuración General* (`BusinessBasicSettings`).
    - [x] **18.2.2** **Blindaje de Fecha**: Agregar control de errores (Optional Chaining / Fallback) al formatear `payment_date` en el panel del Admin (`payment_date?.split('T')[0] || ''`) para evitar JS crashes si la fecha es nula en DB.
    - [x] **18.2.3** Asegurar la persistencia de `membership_price` al guardar los cambios del negocio en `src/app/admin/negocios/[id]/page.tsx`.
    - [x] **18.2.4** **Progresión Automática de Fecha**: Al aprobar un pago en `BusinessPaymentViewer`, sumarle automáticamente **30 días** a la fecha de pago actual (o a la fecha actual si es nula) y guardarlo en la tabla `businesses`.
- [ ] **18.3 Panel de Socio (Finanzas, Membresía y Formatos Premium)**:
    - [x] **18.3.1** **Formateador Unificado de COP**: Implementar utilidad global `formatCOP(value)` para desplegar montos con espacio y puntos como separadores de miles (ej. `$ 115.000 COP` o `$ 115.000`) de forma unificada.
    - [x] **18.3.2** Modificar la consulta en `/business/finanzas` para seleccionar `payment_date` y `membership_price` de la tabla `businesses`.
    - [x] **18.3.3** Reemplazar los valores estáticos/hardcodeados (la fecha fija de mayo y los `$29.99` USD) por los valores dinámicos recuperados de la base de datos (con el nuevo formato COP premium).
    - [x] **18.3.4** Sincronizar el "Membership Alert" del `PartnerTopBar.tsx` para usar de forma consistente los datos dinámicos.
    - [x] **18.3.5** **Identidad Dinámica en PartnerTopBar**: Extender la consulta de `PartnerTopBar.tsx` para recuperar dinámicamente el `name` y `plan` del negocio del socio y mostrarlos en el perfil de la esquina superior, reemplazando las cadenas fijas por datos dinámicos y actualizados en tiempo real.
    - [x] **18.3.6** Modificar la inserción de nuevos comprobantes de pago (`payment_proofs`) para inyectar dinámicamente el valor del `membership_price` asignado al negocio del socio en lugar de un monto fijo.

---
---
 *Documento consolidado - FOWY 2026*
