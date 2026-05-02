# 📑 ÍNDICE DE DOCUMENTACIÓN — FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Instrucción para IA**: Lee SOLO este archivo al inicio de cada sesión. Luego abre únicamente los archivos que necesites según la tarea del usuario. No cargues todo el contexto.

---

## 📁 Archivos Raíz (`Markdown/`)

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **BITACORA.md** | Registro cronológico de TODOS los cambios del proyecto: fases completadas, hitos, bugs resueltos y decisiones técnicas. Incluye stack, arquitectura y progreso por fases. | Al retomar sesión o verificar qué se ha hecho antes. |
| **HOJA_DE_RUTA.md** | Checklist maestra consolidada de TODAS las fases (1-11). Cada fase tiene subtareas con `[x]` o `[ ]`. Es la fuente de verdad del progreso global. | Al planificar qué fase seguir o verificar estado de completitud. |
| **proyecto.md** | Blueprint arquitectónico: pilares de diseño, stack estándar, mapa de carpetas, estrategia de seguridad (RLS, Middleware) y guía para replicar la app. **Contiene alerta de RLS temporal.** | Al crear nuevos módulos, entender la arquitectura base o revisar alertas de seguridad. |
| **conceptos.md** | Reglas de código obligatorias: límite de 250 líneas por archivo, desacoplamiento, imports dinámicos, paginación obligatoria, compresión de imágenes, prohibición de `alert()` nativos. | Al escribir o refactorizar cualquier código. SIEMPRE relevante. |
| **diseño.md** | Tokens de diseño visual: paleta de colores (gradientes Energy/Flow), tipografía (Inter/Poppins), componentes (cards, sidebar, buttons), micro-animaciones y responsividad. | Al modificar UI, estilos o crear componentes visuales nuevos. |
| **nucleo.md** | Checklist de construcción del núcleo (Fases 1-4): infraestructura, cerebro DB, cascarón UI. Todas completadas. | Solo como referencia histórica. Rara vez necesario. |
| **login.md** | Hoja de ruta del módulo de autenticación: backend Supabase (Google Auth, email templates), UI (login, registro, recuperación) y lógica (callbacks, middleware). **COMPLETADO ✅** | Al implementar o ajustar el sistema de login/registro. |
| **notificaciones.md** | Arquitectura completa de notificaciones: FCM + Supabase Realtime, tabla de eventos por rol, UI (campana, toasts, historial), Edge Function `send-push`. Todo completado. | Al modificar o debuggear notificaciones push/realtime. |
| **solucion.md** | Documentación del bug de sincronización Explorador↔Panel de negocio: 5 pasos de diagnóstico, causa raíz (RLS + `.sort()` mutation + stale closures), arquitectura final con `useRef` + singleton. | Solo si hay bugs en el explorador o en la sincronización realtime. |

---

## 📁 Subcarpeta `menu admin/`

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **app.md** | Esquema de la app completa: enlaces de desarrollo (localhost), estructura de carpetas detallada, estrategia de seguridad (RLS + Middleware + Failsafe), jerarquía de dashboards por rol, y guía de escalabilidad modular. | Al agregar nuevas rutas, entender la navegación global o configurar seguridad. |
| **negocios.md** | Módulo de gestión de negocios (Admin): flujo de creación, categorías, planes, diseño de tabla/tarjetas, y checklist detallada de 8 fases de implementación con bitácora de refactorización. Todo completado. | Al modificar el panel admin de negocios o su lógica CRUD. |

---

## 📁 Subcarpeta `rol/`

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **rol-negocio.md** | Definición del rol Business Owner: módulos del panel (Dashboard, Pedidos, Menú Digital, Finanzas, Plan, Branding), plan técnico con tablas y sonidos. | Al trabajar en el panel de negocios (`/business/*`). |
| **rol-experto.md** | Módulo de Marketplace B2B: funcionalidades (Escrow, Portafolio, Verificación), y checklist de refactorización completada (desacoplamiento a componentes atómicos). | Al modificar el marketplace de expertos (`/business/expertos`). |
| **rol-usuario.md** | Rol Explorador (usuario final): arquitectura Mobile-First Shell (frame de celular en desktop), flujo UX completo (mapa → categorías → menú → carrito → checkout WhatsApp), y checklist de 5 fases de implementación completadas. | Al trabajar en la experiencia del explorador (`/explorar`). |

---

## ⚡ Guía Rápida por Tarea

| Si la tarea es sobre... | Lee estos archivos |
|------------------------|-------------------|
| 🐛 Bug o error | `solucion.md` + archivo del módulo afectado |
| 🎨 Cambio de UI/estilos | `diseño.md` + `conceptos.md` |
| 🏗️ Nuevo módulo o ruta | `proyecto.md` + `menu admin/app.md` |
| 📊 Panel Admin | `menu admin/negocios.md` |
| 🍔 Panel Negocio | `rol/rol-negocio.md` |
| 🌍 Explorador/Mapa | `rol/rol-usuario.md` |
| 🔔 Notificaciones | `notificaciones.md` |
| 🔐 Login/Auth | `login.md` |
| 🤝 Expertos/Marketplace | `rol/rol-experto.md` |
| 📋 ¿Qué falta por hacer? | `HOJA_DE_RUTA.md` |
| 📓 ¿Qué se hizo antes? | `BITACORA.md` |

---

## ⚠️ Alertas Activas

1. **RLS Temporal**: La política `"DEV: Allow all updates (temporary)"` en la tabla `businesses` de Supabase **debe reemplazarse** cuando se implemente el login de partners. Ver `proyecto.md` y `solucion.md`.
2. **Registro Simplificado**: El flujo de registro ha sido optimizado para ser directo (Auth -> Perfil -> Éxito), asignando el rol `explorer` por defecto. La creación de negocios ahora es una tarea exclusiva del administrador.

---
*Índice generado el 30 de Abril de 2026 — Actualizar al agregar nuevos archivos .md*
