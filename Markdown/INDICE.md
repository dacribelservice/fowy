# 📑 ÍNDICE DE DOCUMENTACIÓN — FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Instrucción para IA**: Lee SOLO este archivo al inicio de cada sesión. Luego abre únicamente los archivos que necesites según la tarea del usuario. No cargues todo el contexto.

---

## 📁 Archivos Raíz (`Markdown/`)

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **Bitacora-2-mayo.md** | Registro cronológico activo de los cambios del proyecto (a partir de mayo de 2026). Es el diario limpio donde se documentan nuevas sesiones. | Al retomar una sesión para verificar qué se ha hecho recientemente. |
| **H-ruta-2-mayo.md** | Checklist maestra activa y limpia de las nuevas fases del proyecto para mantener el contexto rápido y sin sobrecarga de datos. | Al planificar o ejecutar las fases de desarrollo actuales. |
| **VISION-DE-FOWY.md** | Visión de negocio e ingeniería a largo plazo: Fowy como Super-App de Economía Circular Local, modelo de monetización modular y mapa de flujos de valor. | Al buscar alineación comercial, presentar el proyecto o diseñar nuevas verticales. |
| **MOTO-FOWY.md** | Plan de ingeniería del sistema de repartidores: modelado DB, geolocalización GPS activa y flujos de eventos realtime. | Al comenzar la integración de logística o envíos de última milla. |
| **iPhone.md** | Diagnóstico y plan de blindaje de compatibilidad para dispositivos móviles iOS (Safari/WebKit), cubriendo problemas de fechas, audio en segundo plano y local storage seguro. | Al optimizar UX móvil o depurar problemas exclusivos de iPhones. |
| **SEO.md** | Plan y checklists para posicionamiento SEO tradicional y GEO (buscadores basados en IA como Perplexity, ChatGPT Search, Gemini y Claude) con JSON-LD estructurado. | Al optimizar la indexación pública de menús y el tablero de tráfico en el panel. |
| **conceptos.md** | Reglas de código obligatorias: límite de 250 líneas por archivo, desacoplamiento, imports dinámicos, paginación obligatoria, compresión de imágenes, prohibición de `alert()` nativos. | Al escribir o refactorizar cualquier código. SIEMPRE relevante. |
| **diseño.md** | Tokens de diseño visual: paleta de colores (gradientes Energy/Flow), tipografía (Inter/Poppins), componentes (cards, sidebar, buttons), micro-animaciones y responsividad. | Al modificar UI, estilos o crear componentes visuales nuevos. |
| **login.md** | Hoja de ruta del módulo de autenticación: backend Supabase (Google Auth, email templates), UI (login, registro, recuperación) y lógica (callbacks, middleware). **COMPLETADO ✅** | Al implementar o ajustar el sistema de login/registro. |
| **notificaciones.md** | Arquitectura completa de notificaciones: FCM + Supabase Realtime, tabla de eventos por rol, UI (campana, toasts, historial), Edge Function `send-push`. Todo completado. | Al modificar o debuggear notificaciones push/realtime. |
| **solucion.md** | Documentación del bug de sincronización Explorador↔Panel de negocio: 5 pasos de diagnóstico, causa raíz (RLS + `.sort()` mutation + stale closures), arquitectura final con `useRef` + singleton. | Solo si hay bugs en el explorador o en la sincronización realtime. |
| **errores-github.md** | Historial de errores críticos de tipado TypeScript, dependencias y renderizado durante despliegues de Vercel/GitHub con sus resoluciones. | Al depurar fallos en la canalización CI/CD o errores en la construcción del sitio. |
| **nucleo.md** | Checklist de construcción del núcleo (Fases 1-4): infraestructura, cerebro DB, cascarón UI. Todas completadas. | Solo como referencia histórica. Rara vez necesario. |

---

## 📁 Subcarpeta `historial/` (Archivado Histórico de Contexto)

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **Bitacora-1-mayo.md** | Registro cronológico original y completo de todas las sesiones de desarrollo previas (Sesión I a XXI). Contiene las lecciones aprendidas del inicio de Fowy. | Solo si necesitas investigar detalles técnicos específicos de las primeras 21 sesiones. |
| **H-ruta-1-mayo.md** | Checklist maestra histórica con todas las fases (Fases 1 a 23) ya completadas y marcadas al 100%. | Para verificar los requisitos originales y el alcance de las fases 1 a 23 ya completadas. |

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
| 🐛 Bug o error | `solucion.md` + `errores-github.md` + archivo del módulo afectado |
| 📱 Compatibilidad Móvil / iOS | `iPhone.md` |
| 🔍 SEO / GEO e IA Search | `SEO.md` |
| 🏍️ Repartidores (Moto-Fowy) | `MOTO-FOWY.md` |
| 📣 Monetización o Banners | `Marketing.md` |
| 🌟 Visión Maestra | `VISION-DE-FOWY.md` |
| 🎨 Cambio de UI/estilos | `diseño.md` + `conceptos.md` |
| 🏗️ Nuevo módulo o ruta | `proyecto.md` + `menu admin/app.md` |
| 📊 Panel Admin | `menu admin/negocios.md` |
| 🍔 Panel Negocio | `rol/rol-negocio.md` |
| 🌍 Explorador/Mapa | `rol/rol-usuario.md` |
| 🔔 Notificaciones | `notificaciones.md` |
| 🔐 Login/Auth | `login.md` |
| 🤝 Expertos/Marketplace | `rol/rol-experto.md` |
| 📋 ¿Qué falta por hacer? | `H-ruta-2-mayo.md` (activo) o `historial/H-ruta-1-mayo.md` (historial) |
| 📓 ¿Qué se hizo antes? | `Bitacora-2-mayo.md` (activo) o `historial/Bitacora-1-mayo.md` (historial) |

---

## ⚠️ Alertas Activas

1. **Firebase API Key**: Se ha detectado un error en la configuración de la API Key de Firebase que afecta las notificaciones push. Requiere validación en la consola de Firebase.
2. **Registro Simplificado**: El flujo de registro ha sido optimizado para ser directo (Auth -> Perfil -> Éxito), asignando el rol `explorer` por defecto.

---
*Última actualización de la biblioteca: 12 de Mayo de 2026 — Reflejando la optimización y archivado histórico de Bitácora y Hoja de Ruta (V2)*


