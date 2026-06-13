# 📓 BITÁCORA DEL PROYECTO: FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Esta bitácora es el registro maestro del proyecto. Sirve para que cualquier sesión futura (o cualquier desarrollador/IA) comprenda exactamente el estado, la arquitectura y las decisiones tomadas.
- **Guía de Arquitectura**: [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)

---

## 🚩 HISTORIAL DE HITOS Y AVANCES (MAYO 2026)

### 📌 Hito: Optimización de Escalabilidad Fase 1 (Filtrado Geográfico con PostGIS)
- **Fecha**: 23 de Mayo de 2026
- **Resumen**: Implementación de arquitectura geoespacial empresarial para soportar +10,000 negocios sin colapsos.
- **Detalles Técnicos**:
  - **Carga Inteligente (Bounding Box)**: La app pasó de descargar toda la base de datos a solicitar únicamente un límite máximo de 250 negocios que se encuentren dentro de las coordenadas del área visible en la pantalla del usuario.
  - **PostGIS y GIST**: Activación de la extensión PostGIS en Supabase, agregando columna espacial `geom` con índice `GIST` y un Trigger de sincronización en caliente, reduciendo los tiempos de consulta de segundos a milisegundos.
  - **Eficiencia en Cliente**: Se delegó el cálculo de proximidad (distancias pesadas) al motor de PostgreSQL en la nube, ahorrando batería y consumo de datos móviles (megas).
  - **Corrección de Bugs**: Se resolvieron bucles infinitos en el mapa (`autoPan`) y bloqueos de interfaz relacionados con restricciones de geolocalización en iOS (iPhone).

### 📌 Hito 5.9, 5.10 & 5.11: Automatización de Categorías y Menú Digital en Tiempo Real
- **Fecha**: 13 de Mayo de 2026
- **Resumen**: Implementación de la automatización inteligente del Catálogo Centralizado ("Crave Catalog") y su renderizado inmediato en la experiencia de cliente.
- **Detalles Técnicos**:
  - **Paso 5.9 (Activación Automatizada)**: Cuando el comercio activa un producto global, el sistema detecta si la categoría equivalente existe localmente; de lo contrario, la crea en caliente e inyecta el producto mapeando su categoría. Soporta edición de precio local e inline.
  - **Paso 5.10 & 5.11 (Visualización en Explorer)**: Las categorías autogeneradas se pintan dinámicamente como píldoras táctiles interactivas en la barra horizontal de `/explorer/[slug]`, mostrando bajo demanda los productos activos con fallbacks y precios configurados.
- **Control de Calidad**: Compilación verificada con `npx tsc --noEmit` (**0 errores**).

### 📌 Hito: Optimización de Escalabilidad Fase 2 (Consolidación de Menú por RPC)
- **Fecha**: 28 de Mayo de 2026
- **Resumen**: Eliminación del "efecto cascada" (waterfall) en la carga del menú de los negocios, aplicando la "Ley del Remolque".
- **Detalles Técnicos**:
  - **Desnormalización de Ratings**: Se agregaron las columnas `rating_average` y `rating_count` directamente a `businesses` para evitar consultas pesadas al cargar el perfil.
  - **Triggers de Base de Datos**: Se implementó un trigger inteligente en `business_ratings` para auto-calcular y sincronizar el promedio de calificaciones en caliente.
  - **Función Consolidada (RPC)**: Creación del procedimiento almacenado `get_business_menu_payload` que en un solo viaje ensambla y retorna el perfil, calificaciones, categorías y banners.
  - **Ley del Remolque**: Se programó un hook totalmente nuevo (`useV2BusinessMenuData.ts`) y se conectó a la interfaz. Tras verificar su éxito y velocidad, el viejo hook ineficiente fue eliminado por completo, eliminando código muerto.

### 📌 Hito: Modernización y Estandarización de Desarrollo (Paso 3.1)
- **Fecha**: 28 de Mayo de 2026
- **Resumen**: Blindaje del código fuente para asegurar que futuros módulos nazcan robustos.
- **Detalles Técnicos**:
  - **Autogeneración de Tipos Estrictos**: Extracción del esquema oficial de la base de datos de producción mediante Supabase CLI, creando `src/types/supabase.ts`.
  - **Impacto**: Actúa como un "diccionario" de validación estricta que impide que programadores o IAs usen columnas inexistentes o cometan errores tipográficos, bloqueando posibles "crashes" de producción desde el editor de código.

### 📌 Hito: Compatibilidad Absoluta y Prevención de Crashes en iPhone (iOS)
- **Fecha**: 29 de Mayo de 2026
- **Resumen**: Diagnóstico profundo y resolución de colapsos fatales de pantalla blanca ("This page couldn't load") al abrir la aplicación en iOS Safari y navegadores integrados (WebViews).
- **Detalles Técnicos**:
  - **Blindaje Push API**: Se envolvió la inicialización de Firebase Cloud Messaging (`getMessaging()`) en un `try/catch` para evitar que la falta de soporte síncrona bloquee el hilo de React.
  - **Manejo Seguro de Permisos**: Se validó `'Notification' in window` antes de invocar los permisos globales en `NotificationProvider.tsx`.
  - **Erradicación de Componente Fantasma**: Se descubrió y eliminó `BusinessNotificationListener.tsx`, un componente oculto que intentaba cargar `new Audio()` sin interacción del usuario. En iOS, esta agresión a la *Autoplay Policy* generaba un bloqueo de seguridad crítico que mataba la aplicación.
  - **Arquitectura de Sonido Unificada**: La reproducción de notificaciones de pedidos se centralizó en `useOrderManager.ts` (desbloqueando el sonido de forma legítima tras hacer clic en "Sonido Activo") y se configuró al proveedor global para que respete estrictamente esta preferencia almacenada localmente.

### 📌 Hito: Estabilidad en Autenticación y Realtime (Singleton de Supabase)
- **Fecha**: 30 de Mayo de 2026
- **Resumen**: Resolución de conflictos concurrentes en el cliente Supabase del navegador (`AbortError: Lock broken by another request with the 'steal' option`) y optimización de suscripciones en tiempo real.
- **Detalles Técnicos**:
  - **Paso 7.1 (Singleton de Supabase)**: Implementación del patrón Singleton en `src/utils/supabase/client.ts` para compartir una única instancia del cliente del navegador, alineado con la **Regla 6.1 (Estabilidad Realtime)** de `conceptos.md`.
  - **Eliminación de Conflictos de Bloqueo (Web Locks)**: Evita que múltiples inicializaciones del cliente luchen y "roben" la cerradura del token (`sb-...-auth-token`) en `localStorage`, lo que provocaba cierres inesperados de sesión y errores intermitentes en la consola.
  - **Optimización de Conectividad**: Consolidación y reutilización de la conexión de websockets en tiempo real para todos los proveedores globales (favoritos, pedidos y notificaciones en `NotificationProvider.tsx`), reduciendo la sobrecarga de conexiones concurrentes.

### 📌 Hito: Superación del Compilador Estricto de Vercel (Ley del Remolque)
- **Fecha**: 3 de Junio de 2026
- **Resumen**: Resolución de bloqueos de despliegue en Vercel causados por la validación estricta de tipos (`implicit any`) sin alterar el comportamiento del código legado.
- **Detalles Técnicos**:
  - **Fallo Rápido de Vercel**: El motor estricto de compilación de TypeScript bloqueaba sistemáticamente los despliegues al detectar parámetros en callbacks sin tipos explícitos (`Parameter implicitly has an 'any' type`).
  - **Aplicación de la Ley del Remolque**: En lugar de tipar estrictamente el cliente global de Supabase (lo cual hubiera causado 32 errores colaterales en toda la app), se optó por una intervención quirúrgica de bajísimo riesgo.
  - **Curitas Locales (`: any`)**: Se rastrearon y aplicaron más de 20 "curitas" (forzando tipos locales explícitos `: any`) en 8 archivos, logrando que la aplicación satisfaga la compilación estricta mientras se preserva intacta la funcionalidad.

### 📌 Hito: Implementación del Sistema de Impresión Híbrido (Web & Android RawBT)
- **Fecha**: 9 de Junio de 2026
- **Resumen**: Integración exitosa de impresión de comandas térmicas (58mm/80mm) para el panel de negocios, respetando estrictamente la arquitectura existente mediante la "Ley del Remolque".
- **Detalles Técnicos**:
  - **Componente Aislado (`OrderTicket.tsx`)**: Se diseñó una plantilla CSS oculta con dimensiones precisas (`print:w-[80mm]`) para la impresión en rollo térmico, extrayendo dinámicamente datos cruzados entre el pedido y el negocio.
  - **Hook Modular (`useOrderPrinter.ts`)**: Se construyó un orquestador dual. Soporta impresión nativa en PC y también exportación de texto plano codificado hacia Intent URIs de Android para integración nativa con la app RawBT (`intent://...scheme=rawbt`).
  - **Aislamiento CSS Quirúrgico**: Para evitar la impresión global de la interfaz web ("Problema de las 16 hojas"), se implementó una clonación temporal en el DOM y anulación global con `display: none !important`, logrando una impresión perfecta de 1 sola página sin tocar los estados de React ni refactorizar.
  - **Ley del Remolque Respetada**: Toda la inyección de botones, micro-animaciones (Framer Motion) y manejo de datos se encapsuló en `OrderActionButtons.tsx` empleando casting explícito de TypeScript (`as unknown as OrderTicketData`), manteniendo el flujo legado de Supabase 100% intacto.

### 📌 Hito: Eliminación de Cascada y Code Splitting (Fase 9 - Bloques 1 y 2)
- **Fecha**: 13 de Junio de 2026
- **Resumen**: Aceleración drástica de la carga inicial del menú público mediante Code Splitting y erradicación del "Efecto Cascada" (Waterfall).
- **Detalles Técnicos**:
  - **Code Splitting (Modales)**: Se implementó carga diferida (`next/dynamic` con `ssr: false`) y montaje condicional en el DOM para todos los modales legales en el `Footer.tsx`.
  - **Supresión del Efecto Cascada**: Se sobrescribió la función RPC `get_business_menu_payload` en Supabase inyectando la matriz de `products` (con `global_products` anidados), logrando que perfil, categorías, banners y productos bajen en un único y definitivo viaje de red.
  - **Ley del Remolque**: En `useV2BusinessMenuData.ts`, se inyectó el parseo de la carga consolidada y se aplicó un candado con `useRef` para bloquear la segunda petición duplicada de React, sin reescribir ni romper el motor de búsqueda actual.

### 📌 Hito: Optimización de Imágenes CDN en Modo By-Pass (Fase 9.6)
- **Fecha**: 13 de Junio de 2026
- **Resumen**: Implementación de la lógica de compresión de imágenes WebP para Supabase, la cual fue configurada en "modo by-pass" (apagada provisionalmente) debido a las restricciones del plan Free.
- **Detalles Técnicos**:
  - **Lógica Inyectada**: Se creó la función utilitaria `getOptimizedImageUrl` en `CraveProductCard.tsx` diseñada para reescribir URLs de `object/public/` a `/render/image/public/` solicitando compresión de hardware (`width=300&quality=75`).
  - **Adaptación al Plan Free**: Dado que Supabase bloquea el endpoint de transformación sin un plan Pro activo (Image Transformations) generando un error 400, la función fue revertida internamente para devolver la URL original y evitar imágenes rotas.
  - **Preparación a Futuro**: El código no se borró, quedó estructurado en el frontend. Si a futuro se habilita Supabase Pro, solo bastará con borrar un comentario interno para que la compresión y redimensionamiento de WebP comience a funcionar automáticamente en toda la app sin refactorizaciones.
