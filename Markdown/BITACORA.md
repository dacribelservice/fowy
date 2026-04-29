# 📓 BITÁCORA DEL PROYECTO: FOWY

> ⚠️ **REGLA DE ORO**: Solo Cristian (CEO de FOWY) tiene autoridad para ordenar copias de seguridad (Backups) en GitHub.

Esta bitácora es el registro maestro del proyecto. Sirve para que cualquier sesión futura (o cualquier desarrollador/IA) comprenda exactamente el estado, la arquitectura y las decisiones tomadas.
- **Guía de Arquitectura**: [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)

---

## 🚀 VISIÓN GENERAL
**FOWY** es una plataforma modular diseñada bajo el concepto de **"Centro Comercial Digital"**. 
- **Objetivo**: Permitir que múltiples negocios convivan en una sola infraestructura compartiendo una interfaz premium, pero manteniendo su identidad visual (colores, logos) de forma dinámica.
- **Roles**: `super_admin`, `professional`, `seller`, `business_owner`, `explorer`.

---

## 🛠️ STACK TECNOLÓGICO (Corte 27-Abr-2026)
- **Frontend**: Next.js 15 (App Router) con TypeScript.
- **Estilos**: Tailwind CSS v4 (Configuración vía CSS-first en `globals.css`).
- **Backend/DB**: Supabase (PostgreSQL).
- **Animaciones**: Framer Motion.
- **Iconos**: Lucide React.

---

## 🏛️ ARQUITECTURA "CENTRO COMERCIAL"
La app está organizada en grupos de rutas para aislamiento total:
- `/admin`: Dashboard para Super Administradores y Profesionales.
- `/partners`: Gestión para Vendedores y Dueños de Negocio.
- `/core`: Interfaz para el usuario final (Explorador).
- `(extensions)`: Módulos específicos (Inventario, Menú, etc.) que actúan como "locales" dentro del mall.

---

## 🧠 ESTADO DE LA BASE DE DATOS (Supabase)
Se ha implementado el "Cerebro" del sistema:
1.  **Enum `user_role`**: Define los niveles de acceso.
2.  **Tabla `profiles`**: Extendida desde `auth.users`.
3.  **Trigger PL/pgSQL**: Función automática que crea un perfil en la tabla `profiles` cada vez que un usuario se registra en la autenticación de Supabase.
4.  **Multi-tenancy**: Se decidió que todos los negocios compartirán las mismas tablas, diferenciándose por un ID de negocio, para facilitar el mantenimiento global.

---

## 🎨 SISTEMA DE DISEÑO (Ethereal Premium)
- **Estética**: Minimalista, limpia, sin uso de negro puro.
- **Bordes**: `border-radius: 20px` (clase `rounded-fowy`).
- **Efecto**: Glassmorphism (clase `glass-morphism` con `backdrop-blur`).
- **Colores**: 
    - Degradado 1: Rojo (#FF4D4D) a Naranja (#FFA500).
    - Degradado 2: Morado (#8A2BE2) a Azul (#007BFF).
- **Sombras**: `shadow-glass` y `shadow-premium`.

---

## ✅ PROGRESO ACTUAL
- **Fase 1 (Infraestructura)**: COMPLETADA.
- **Fase 2 (Cerebro)**: COMPLETADA.
- **Fase 3 (Autenticación)**: POSPUESTA.
- **Fase 4 (Cascarón UI)**: COMPLETADA.
- **Fase 5 (Módulo Negocios)**: COMPLETADA.
- **Fase 6 (Notificaciones y Feedback)**: COMPLETADA.
- **Fase 7 (Refactorización de Dashboard)**: COMPLETADA (Desacoplamiento total de componentes).
- **Fase 8 (Optimización y Escalabilidad)**: COMPLETADA (Paginación, Imágenes y Blindaje).

---

## 🚀 HITOS RECIENTES (27 de Abril de 2026 - Sesión Nocturna)
1.  **Refactorización Arquitectónica (Componentización)**: 
    - Desacoplamiento total de la página de edición de negocios (`[id]/page.tsx`) en componentes especializados: `BusinessProfileHeader`, `BusinessLocationManager`, `BusinessModuleManager` y `BusinessPaymentViewer`.
    - Refactorización del Dashboard Admin en piezas modales reutilizables (`StatsGrid`, `GrowthChart`, `DistributionChart`).
2.  **Paginación y Búsqueda Server-side**: 
    - Implementación de carga por bloques (offset/limit) en la tabla de negocios para manejar miles de registros.
    - Migración de toda la lógica de filtrado (Plan, Estatus, Buscador) al servidor, reduciendo el consumo de memoria en el cliente.
3.  **Gestión Maestra de Imágenes**: 
    - **Compresión en Cliente**: Integración de API Canvas para comprimir logos y categorías antes de la subida, ahorrando hasta un 80% de espacio en Storage.
    - **PremiumImage**: Creación de un componente inteligente para gestionar estados de carga, esqueletos (skeletons) y fallbacks visuales.
    - **Storage Cleanup**: Lógica automatizada que elimina archivos huérfanos del Storage al borrar un negocio o categoría.
4.  **Blindaje y Rendimiento de Supabase**: 
    - **Índices Trigram**: Activación de `pg_trgm` para búsquedas textuales instantáneas.
    - **Seguridad RLS Auditada**: Eliminación de políticas de desarrollo abiertas; ahora solo el `super_admin` tiene permisos de escritura (CRUD) en tablas críticas y buckets de storage.

---

## 🗺️ MAPA E INTERACCIÓN GEOGRÁFICA (En Desarrollo)
- **Lo que se preparó (Administración)**: Se está estructurando la lógica de ubicación para que los dueños/administradores puedan asignar coordenadas, ciudad y país exactos a cada negocio.
- **Lo que se quiere lograr (Vista de Usuario/Explorador)**: El objetivo principal para el usuario final es ofrecer una experiencia de descubrimiento espacial. Los usuarios ("exploradores") accederán a un mapa interactivo general donde verán todos los negocios representados como puntos geolocalizados. Podrán navegar por el mapa, descubrir comercios cercanos y hacer clic en los marcadores para ver la información de cada local (estilo "Centro Comercial Virtual").

---

## 📌 DECISIONES CRÍTICAS
1.  **Ocultar Dev Indicators**: Deshabilitado el botón "N" de Next.js.
2.  **Cero Datos Genéricos**: Estructuras visuales listas para datos reales.
3.  **Personalización Dinámica**: Identidad visual variable sobre menú único.
4.  **Activación Modular**: El sistema permitirá habilitar/deshabilitar módulos individualmente.
5.  **Compresión Forzada**: Toda imagen subida al sistema debe pasar por el proceso de optimización en el cliente para garantizar escalabilidad.

## 🔔 MÓDULO DE NOTIFICACIONES (28-Abr-2026)
- **Infraestructura**: Integración de Firebase Cloud Messaging (FCM) con Supabase Edge Functions.
- **Seguridad**: Los secretos de Firebase Admin se gestionan en Supabase Vault (`FIREBASE_SERVICE_ACCOUNT`).
- **Push & Realtime**: Sistema híbrido que combina Supabase Realtime (para UI activa) y FCM (para notificaciones en segundo plano).
- **UX Premium**: 
    - Campana de notificaciones con Glassmorphism y animaciones Framer Motion.
    - Banner de permisos personalizado para mejorar la tasa de aceptación.
    - Sistema de alertas sonoras diferenciadas para pedidos y mensajes.
- **Edge Function**: Desplegada exitosamente la función `send-push` usando Deno y npm interoperability.
- **Componentes Avanzados (UI/UX)**: 
    - `NotificationDropdown`: Panel premium con filtros (Todas/Sin leer), blur y animaciones spring.
    - `NotificationHistory`: Página completa `/admin/notifications` con buscador, estadísticas y lista de historial.
- **Testing Final**: Infraestructura validada y lista para producción.
- **Sincronización**: Código respaldado en GitHub (`main`) incluyendo los nuevos archivos de audio y actualización de documentación.

---

*Última actualización: 28 de Abril de 2026 - 11:30 PM*

