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
- [x] **6.4 Blindaje de Supabase**: Índices Trigram (`pg_trgm`) y auditoría de políticas.

---

## 💼 FASE 7: MÓDULO DE SOCIOS (Próxima Fase 🚀)
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

## 🌍 FASE 8: MÓDULO EXPLORADOR (En progreso 🏗️)
- [x] **8.1 Mapa de Descubrimiento**: Vista global de negocios geolocalizados (Leaflet + RT).
- [ ] **8.2 Menú Digital Premium**: Interfaz de pedidos optimizada para móvil.
- [ ] **8.3 Checkout WhatsApp**: Generación de mensaje estructurado y registro en DB.

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

## 🔔 FASE 11: FLUJOS DE NOTIFICACIÓN DE NEGOCIO (Próximamente)
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

## 🔗 FASE 12: VINCULACIÓN Y ACCESO DE SOCIOS (ADMIN ↔ SOCIO)
*Objetivo: Permitir que el Admin asigne dueños a los negocios y que estos accedan a su panel privado.*

- [x] **12.1 Refactorización de Creación (Admin)**:
    - [x] 12.1.1 Modificar `AddBusinessModal.tsx` para añadir el campo "Email del Dueño" (Input con estilo Glassmorphism y validación).
    - [x] 12.1.2 Implementar búsqueda/validación de usuario en Supabase antes de la creación.
    - [x] 12.1.3 Actualizar el orquestador `useAdminBusinessManager.ts` para persistir el `owner_id` en la tabla `businesses`.
- [ ] **12.2 Gobernanza de Roles y Permisos**:
    - [ ] 12.2.1 Crear lógica (Trigger o Edge Function) para elevar el rol del usuario de `explorer` a `business_owner` al ser vinculado.
    - [ ] 12.2.2 Auditar políticas RLS en la tabla `businesses` para permitir lectura/escritura al `owner_id` correspondiente.
- [ ] **12.3 UI/UX Menú de Perfil (Explorer Layout)**:
    - [ ] 12.3.1 Modificar `src/app/(explorer)/layout.tsx` para detectar si el usuario logueado posee negocios.
    - [ ] 12.3.2 Inyectar opción "Mi Negocio" en el menú desplegable (Icono: `Store`, Estilo: `Secondary Flow` de `diseño.md`).
    - [ ] 12.3.3 Implementar redirección inteligente al Dashboard de Socio (`/business/dashboard`).

---
*Documento consolidado - FOWY 2026*
