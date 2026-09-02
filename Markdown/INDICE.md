# 📑 ÍNDICE DE DOCUMENTACIÓN — FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Instrucción para IA**: Lee SOLO este archivo al inicio de cada sesión. Luego abre únicamente los archivos que necesites según la tarea del usuario. No cargues todo el contexto innecesariamente.

---

## 📁 1. Archivos Raíz (`Markdown/`)

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **[Bitacora-3-junio.md](file:///c:/Users/cange/Documents/fowy/Markdown/Bitacora-3-junio.md)** | Registro cronológico activo y detallado de las sesiones de desarrollo recientes de FOWY. Es el diario de trabajo en vigor. | Al retomar una sesión para verificar qué se ha implementado recientemente. |
| **[H-ruta-3-junio.md](file:///c:/Users/cange/Documents/fowy/Markdown/H-ruta-3-junio.md)** | Checklist maestra activa de fases del proyecto, avances de ingeniería y tareas en curso. | Al planificar, verificar o ejecutar las fases de desarrollo actuales. |
| **[auditoria-tecnica.md](file:///c:/Users/cange/Documents/fowy/Markdown/auditoria-tecnica.md)** | Auditoría técnica oficial, informe de arquitectura, diagnóstico de deuda técnica, seguridad, análisis de escalabilidad (10k a 1M usuarios) y roadmap. | Al planificar mejoras estructurales, evaluar seguridad o revisar decisiones de arquitectura congeladas. |
| **[mapa.md](file:///c:/Users/cange/Documents/fowy/Markdown/mapa.md)** | Diagnóstico y plan de optimización del mapa (`/explorar`): PostGIS GiST (`<->`), erradicación de *Refetch Storms* en RAM, reducción del 95% de payload y escalabilidad a 10,000+ usuarios en vivo. | Al trabajar en el mapa interactivo, geolocalización o rendimiento en `/explorar`. |
| **[conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)** | Reglas de código obligatorias: límite de 250 líneas por archivo, Ley del Remolque, desacoplamiento, estabilidad Realtime, prohibición de `alert()` nativos. | Al escribir o refactorizar cualquier componente o hook. **SIEMPRE RELEVANTE**. |
| **[diseño.md](file:///c:/Users/cange/Documents/fowy/Markdown/diseño.md)** | Tokens de diseño visual: paleta de colores (gradientes Energy/Flow), tipografía (Inter/Poppins), componentes UI, micro-animaciones y responsividad. | Al modificar UI, estilos o crear nuevos componentes visuales. |
| **[LLM.md](file:///c:/Users/cange/Documents/fowy/Markdown/LLM.md)** | Plan de acción GEO (Generative Engine Optimization): inyección invisible en el HTML para motores de búsqueda de IA (ChatGPT, Perplexity, Gemini, Claude). | Al optimizar el posicionamiento y la indexación agéntica de los negocios. |
| **[SEO.md](file:///c:/Users/cange/Documents/fowy/Markdown/SEO.md)** | Plan y checklists para posicionamiento SEO tradicional y GEO con JSON-LD estructurado y metadatos dinámicos. | Al optimizar la indexación pública de menús y tableros de tráfico. |
| **[MOTO-FOWY.md](file:///c:/Users/cange/Documents/fowy/Markdown/MOTO-FOWY.md)** | Plan de ingeniería del sistema de repartidores: modelado DB, geolocalización GPS activa y flujos de eventos realtime. | Al comenzar la integración de logística o envíos de última milla. |
| **[iPhone.md](file:///c:/Users/cange/Documents/fowy/Markdown/iPhone.md)** | Diagnóstico y blindaje de compatibilidad para dispositivos móviles iOS (Safari/WebKit): fechas, audio en segundo plano, storage seguro. | Al optimizar UX móvil o depurar problemas exclusivos de iPhones / Safari. |
| **[login.md](file:///c:/Users/cange/Documents/fowy/Markdown/login.md)** | Hoja de ruta del módulo de autenticación: backend Supabase (Google Auth, email templates), UI (login, registro, recuperación) y middleware. | Al implementar o ajustar el sistema de login/registro y roles. |
| **[notificaciones.md](file:///c:/Users/cange/Documents/fowy/Markdown/notificaciones.md)** | Arquitectura completa de notificaciones: FCM + Supabase Realtime, tabla de eventos por rol, UI (campana, toasts, historial), Edge Function `send-push`. | Al modificar o depurar notificaciones push o eventos realtime. |
| **[horarios.md](file:///c:/Users/cange/Documents/fowy/Markdown/horarios.md)** | Diagnóstico y solución técnica al conflicto de estados operativos diarios (Abierto/Cerrado) vs estatus administrativo en la tabla `businesses`. | Al trabajar en la lógica de horarios o disponibilidad de locales. |
| **[impresora.md](file:///c:/Users/cange/Documents/fowy/Markdown/impresora.md)** | Especificación técnica para impresión térmica de comandas y recibos de pedidos (Web Print y protocolo RawBT para Android). | Al modificar la funcionalidad de impresión de tickets en el panel de órdenes. |
| **[metricas.md](file:///c:/Users/cange/Documents/fowy/Markdown/metricas.md)** | Módulo de métricas y rankings en el Dashboard Admin con función RPC consolidada (`get_admin_rankings`). | Al trabajar en analítica, rankings de visitas o clics en el panel admin. |
| **[ventas.md](file:///c:/Users/cange/Documents/fowy/Markdown/ventas.md)** | Planteamiento técnico y gráfica SVG de tráfico de visitas combinada con clics de WhatsApp por rangos temporales (Día/Semana/Mes). | Al trabajar en visualizaciones de datos y métricas comerciales de negocios. |
| **[velocidad.md](file:///c:/Users/cange/Documents/fowy/Markdown/velocidad.md)** | Diagnóstico de rendimiento Web Vitals (LCP, INP, FCP) y plan de optimización de carga diferida de scripts pesados y recursos multimedia. | Al auditar tiempos de respuesta y optimizar el rendimiento del menú `/[slug]`. |
| **[proyecto.md](file:///c:/Users/cange/Documents/fowy/Markdown/proyecto.md)** | Estructura general del proyecto, mapa de rutas y estándares de desarrollo. | Al iniciar nuevos desarrollos o entender la arquitectura global. |
| **[nucleo.md](file:///c:/Users/cange/Documents/fowy/Markdown/nucleo.md)** | Checklist histórica de construcción del núcleo (Fases 1-4): infraestructura, cerebro DB y cascarón UI. | Solo como referencia histórica. Rara vez necesario. |
| **[errores-github.md](file:///c:/Users/cange/Documents/fowy/Markdown/errores-github.md)** | Historial de errores críticos de tipado TypeScript, dependencias y renderizado durante despliegues de Vercel/GitHub con sus resoluciones. | Al depurar fallos en CI/CD, TypeScript o errores de compilación en `npm run build`. |

---

## 🎬 2. Subcarpeta `Videos/` (FOWY Reels — Videos Cortos de Comida)

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **[Videos.Backend.md](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.Backend.md)** | Especificación técnica del backend para FOWY Reels: tabla `business_reels`, RPC `get_reels_feed` (PostGIS GiST + Fallback sin GPS), métricas atómicas (`increment_reel_view`, `increment_reel_menu_click`), seguridad RLS y bucket WebP. | Al modificar base de datos, procedimientos RPC o lógica de servidor de Reels. |
| **[Videos.UX-UI.md](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.UX-UI.md)** | Especificación visual de UX/UI para FOWY Reels: embudos de conversión (Puerta 1 vs Puerta 2), botón flotante, carrusel de proximidad, reproductor inmersivo full-screen y central `/admin/reels`. | Al trabajar en la interfaz, diseño o componentes visuales de Reels. |
| **[Videos.Work.md](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.Work.md)** | Auditoría de código en vivo, evaluación de riesgos (2.0/10) y checklist maestra de implementación paso a paso (Fases 1 a 9 completamente ejecutadas). | Para auditar el proceso de construcción, verificar pruebas o consultar detalles de implementación de Reels. |
| **[videos.up.md](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/videos.up.md)** | Especificación técnica del upgrade avanzado: Lazy loading real con `next/dynamic`, paginación y scroll infinito (`useSWRInfinite`), navegación gestual vertical (*Swipe Up/Down* estilo TikTok) y contador optimista en RAM. | Al consultar o mantener las optimizaciones de alto rendimiento y gestos del reproductor de Reels. |

---

## 💼 3. Subcarpeta `PLAN.md/` (Estrategia y Visión de Negocio)

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **[VISION-DE-FOWY.md](file:///c:/Users/cange/Documents/fowy/Markdown/PLAN.md/VISION-DE-FOWY.md)** | Visión de negocio e ingeniería a largo plazo: Fowy como Super-App de Economía Circular Local, modelo de monetización modular y mapa de flujos de valor. | Al buscar alineación comercial, presentar el proyecto o diseñar nuevas verticales. |
| **[Marketing.md](file:///c:/Users/cange/Documents/fowy/Markdown/PLAN.md/Marketing.md)** | Estrategia de monetización, espacios promocionales, paquetes comerciales y banners patrocinados. | Al diseñar campañas publicitarias o monetizar espacios en la app. |
| **[banners.md](file:///c:/Users/cange/Documents/fowy/Markdown/PLAN.md/banners.md)** | Especificación técnica y de diseño para el sistema de banners publicitarios y espacios destacados. | Al implementar o ajustar banners publicitarios en el explorador o menú. |
| **[PLAN.md](file:///c:/Users/cange/Documents/fowy/Markdown/PLAN.md/PLAN.md)** | Plan maestro global y lineamientos estratégicos de crecimiento de FOWY. | Para consultar prioridades estratégicas y dirección general del producto. |
| **[optimizacion.md](file:///c:/Users/cange/Documents/fowy/Markdown/PLAN.md/optimizacion.md)** | Directrices y plan complementario de optimización técnica de la plataforma. | Al revisar estrategias de rendimiento y buenas prácticas. |

---

## 🛠️ 4. Subcarpeta `Refactory/` (Registros de Refactorización Atómica)

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **[Refactory-1.md](file:///c:/Users/cange/Documents/fowy/Markdown/Refactory/Refactory-1.md)** | Plan y registro de refactorizaciones atómicas: desacoplamiento de componentes monolíticos y división por responsabilidades únicas. | Al consultar antecedentes de refactorizaciones estructurales previas. |
| **[Refactory-2.md](file:///c:/Users/cange/Documents/fowy/Markdown/Refactory/Refactory-2.md)** | Segunda etapa de refactorizaciones, reducción de líneas de código y modularización. | Al verificar optimizaciones de componentes y hooks. |

---

## 📁 5. Subcarpeta `menu admin/`

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **[app.md](file:///c:/Users/cange/Documents/fowy/Markdown/menu%20admin/app.md)** | Esquema de la app completa: estructura de carpetas, estrategia de seguridad (RLS + Middleware + Failsafe), jerarquía de dashboards por rol y guía de escalabilidad modular. | Al agregar nuevas rutas, entender la navegación global o configurar seguridad. |
| **[negocios.md](file:///c:/Users/cange/Documents/fowy/Markdown/menu%20admin/negocios.md)** | Módulo de gestión de negocios (Admin): flujo de creación, categorías, planes, diseño de tabla/tarjetas y checklist de implementación. | Al modificar el panel admin de negocios o su lógica CRUD. |

---

## 👥 6. Subcarpeta `rol/`

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **[rol-negocio.md](file:///c:/Users/cange/Documents/fowy/Markdown/rol/rol-negocio.md)** | Definición del rol Business Owner: módulos del panel (Dashboard, Pedidos, Menú Digital, Finanzas, Plan, Branding), plan técnico con tablas y sonidos. | Al trabajar en el panel de negocios (`/business/*`). |
| **[rol-experto.md](file:///c:/Users/cange/Documents/fowy/Markdown/rol/rol-experto.md)** | Módulo de Marketplace B2B: funcionalidades (Escrow, Portafolio, Verificación) y componentes atómicos. | Al modificar el marketplace de expertos (`/business/expertos`). |
| **[rol-usuario.md](file:///c:/Users/cange/Documents/fowy/Markdown/rol/rol-usuario.md)** | Rol Explorador (usuario final): arquitectura Mobile-First Shell (frame de celular en desktop), flujo UX completo (mapa → categorías → menú → carrito → checkout WhatsApp). | Al trabajar en la experiencia del explorador (`/explorar`). |

---

## 📦 7. Subcarpeta `historial/` (Archivado Histórico de Contexto)

| Archivo | Descripción | Cuándo leer |
|---------|-------------|-------------|
| **[Bitacora-2-mayo.md](file:///c:/Users/cange/Documents/fowy/Markdown/historial/Bitacora-2-mayo.md)** | Registro cronológico de las sesiones de desarrollo de mayo de 2026. | Para consultar el diario de trabajo de la etapa intermedia del proyecto. |
| **[Bitacora-1-mayo.md](file:///c:/Users/cange/Documents/fowy/Markdown/historial/Bitacora-1-mayo.md)** | Registro cronológico original de las primeras 21 sesiones de desarrollo. | Solo si necesitas investigar detalles técnicos específicos del inicio de FOWY. |
| **[H-ruta-2-mayo.md](file:///c:/Users/cange/Documents/fowy/Markdown/historial/H-ruta-2-mayo.md)** | Checklist maestra de fases intermedias del proyecto. | Para verificar el alcance de las fases ejecutadas en mayo de 2026. |
| **[H-ruta-1-mayo.md](file:///c:/Users/cange/Documents/fowy/Markdown/historial/H-ruta-1-mayo.md)** | Checklist maestra histórica con las Fases 1 a 23 completadas al 100%. | Para verificar requisitos originales de las fases iniciales. |

---

## ⚡ Guía Rápida por Tarea

| Si la tarea es sobre... | Lee estos archivos |
|------------------------|-------------------|
| 🎬 FOWY Reels / Videos | `Videos/Videos.UX-UI.md` + `Videos/Videos.Backend.md` + `Videos/videos.up.md` |
| 🗺️ Mapa / Explorador / PostGIS | `mapa.md` + `rol/rol-usuario.md` |
| 📑 Auditoría Técnica / Arquitectura | `auditoria-tecnica.md` + `conceptos.md` |
| 🧠 Posicionamiento GEO / Bots de IA | `LLM.md` + `SEO.md` |
| 🔍 SEO tradicional / Metadatos | `SEO.md` |
| ⏰ Horarios / Estado de Negocios | `horarios.md` |
| 🖨️ Impresión Térmica de Recibos | `impresora.md` |
| ⚡ Velocidad de Carga / Web Vitals | `velocidad.md` |
| 📊 Métricas & Rankings (Admin) | `metricas.md` + `ventas.md` |
| 🐛 Bug o error de compilación | `errores-github.md` + archivo del módulo afectado |
| 📱 Compatibilidad Móvil / iOS | `iPhone.md` |
| 🏍️ Repartidores (Moto-Fowy) | `MOTO-FOWY.md` |
| 📣 Monetización / Banners | `PLAN.md/Marketing.md` + `PLAN.md/banners.md` |
| 🌟 Visión Maestra de Negocio | `PLAN.md/VISION-DE-FOWY.md` + `PLAN.md/PLAN.md` |
| 🎨 Cambio de UI / Estilos | `diseño.md` + `conceptos.md` |
| 🏗️ Nuevo módulo o ruta | `proyecto.md` + `menu admin/app.md` |
| 📊 Panel Admin Negocios | `menu admin/negocios.md` |
| 🍔 Panel Negocio (Socio) | `rol/rol-negocio.md` |
| 🌍 Explorador / Cliente Final | `rol/rol-usuario.md` |
| 🔔 Notificaciones Push / Realtime | `notificaciones.md` |
| 🔐 Login / Auth / Supabase | `login.md` |
| 🤝 Expertos / Marketplace B2B | `rol/rol-experto.md` |
| 📋 ¿Qué falta por hacer? | `H-ruta-3-junio.md` (activo) |
| 📓 ¿Qué se hizo recientemente? | `Bitacora-3-junio.md` (activo) |

---

## ⚠️ Estado y Alertas Activas del Sistema

1. **Producción Activa en Vivo**: La plataforma opera en producción con 50 negocios registrados en vivo (Supabase Pro + Vercel).
2. **FOWY Reels Desplegado y Optimizado**: Módulo de videos cortos 100% implementado con PostGIS GiST, lazy loading dinámico, paginación infinita y navegación gestual vertical (*Swipe Up/Down*).
3. **Mapa Inmunizado contra Refetch Storms**: Navegación en `/explorar` optimizada a 60 FPS con proyección estricta de columnas y actualización reactiva en memoria RAM.
4. **Registro Directo**: Flujo de registro simplificado (`Auth -> Perfil -> Éxito`) asignando el rol `explorer` por defecto.

---
*Última actualización de la biblioteca: 31 de Agosto de 2026 — Reflejando la integración completa de FOWY Reels, optimización del mapa, auditoría técnica oficial y catalogación exhaustiva de carpetas.*


