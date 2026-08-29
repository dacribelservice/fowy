# 🛠️ AUDITORÍA DE CÓDIGO EN VIVO & EVALUACIÓN DE RIESGO — FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Objetivo:** Auditar los puntos de contacto del código fuente en vivo contra los planos [`Markdown/Videos/Videos.Backend.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.Backend.md) y [`Markdown/Videos/Videos.UX-UI.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.UX-UI.md).  
> **Regla de Oro:** Solo auditoría y diagnóstico, sin modificaciones de código.

---

## 🎯 Calificación Global de Riesgo de Implementación

# **2.0 / 10 — (Riesgo Muy Bajo / Seguro)**

> **¿Por qué la calificación es tan baja (2/10)?**  
> Porque el 95% del desarrollo se construirá en **archivos 100% nuevos en carpetas aisladas**. La arquitectura modular de FOWY y la **Ley del Remolque** garantizan que el código existente en producción (pedidos, catálogo, auth y 50 negocios activos) permanezca intocado y blindado contra regresiones.

---

## 🔬 Radiografía Punto por Punto en el Código en Vivo

He auditado cada uno de los archivos existentes donde habrá puntos de contacto:

### 1. En la Base de Datos & Supabase
* **Qué se tocará:** Creación de la tabla `business_reels`, el RPC `get_reels_feed` con PostGIS funcional (`ST_SetSRID(ST_MakePoint(b.longitude, b.latitude), 4326)`), las funciones atómicas `increment_reel_menu_click` e `increment_reel_view`, permisos `GRANT EXECUTE` y políticas RLS.
* **Diagnóstico de Riesgo (1.5 / 10):**
  * La nueva tabla tiene `REFERENCES businesses(id) ON DELETE CASCADE`, por lo que no altera columnas de la tabla `businesses` ni de `orders`.
  * Filtra por `b.status = true` (tipo booleano nativo de FOWY) y valida coordenadas no nulas.
  * Si la tabla de reels o el procedimiento RPC fallaran, la base de datos principal de FOWY sigue operando con normalidad (*Failsafe*).

---

### 2. En el Explorador (`src/app/(explorer)/explorar/page.tsx`, `ExplorerCategoryBar.tsx` y `mapa/page.tsx`)
* **Estado actual del código:**
  * [`explorar/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/explorar/page.tsx) es el orquestador principal interactivo de la experiencia móvil con mapa, categorías y sheets de detalle.
  * [`ExplorerCategoryBar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerCategoryBar.tsx) maneja el carrusel de categorías.
* **Cómo se integrará:**
  * No se modifica la lógica interna de Leaflet ni el hook `useExplorerManager.ts`.
  * El nuevo componente `ReelsFeedButton.tsx` se coloca como un elemento flotante con `z-30` en `explorar/page.tsx` (a 16px sobre la navegación).
  * `ExplorerCategoryBar.tsx` recibe el prop opcional `hideHandle?: boolean` para ocultar limpiamente el tirador superior de arrastre cuando se monte dentro del modal de Reels.
  * La captura del parámetro `?reel=ID` para deep-linking se encapsula en un subcomponente envuelto en `<Suspense fallback={null}>` (estándar Next.js 15).
* **Diagnóstico de Riesgo (2.0 / 10):**
  * Si el feed de reels o su modal llegaran a arrojar un error, el mapa, los pines y el menú siguen funcionando sin interrupción (*Failsafe*).

---

### 3. En el Sidebar del Administrador (`src/components/admin/Sidebar.tsx`)
* **Estado actual del código:**
  * [`Sidebar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/Sidebar.tsx) define el arreglo `menuItems` (Dashboard, Negocios, Catálogo, etc.).
* **Cómo se integrará:**
  * Solo se añade 1 línea al arreglo: `{ name: "Fowy Reels", href: "/admin/reels", icon: Clapperboard }`.
  * Todo el panel administrativo nuevo vivirá en una ruta aislada: `src/app/admin/reels/page.tsx`.
* **Diagnóstico de Riesgo (1.0 / 10):**
  * Modificación quirúrgica de 1 línea sin impacto en el resto de dashboards.

---

### 4. En el Almacenamiento & Formularios Admin (`storageService.ts` y `Autocomplete.tsx`)
* **Estado actual del código:**
  * [`src/services/storageService.ts`](file:///c:/Users/cange/Documents/fowy/src/services/storageService.ts) define los nombres de buckets permitidos. Se extiende `BucketName` para incluir `'reels-thumbnails'`.
  * [`src/components/admin/shared/Autocomplete.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/Autocomplete.tsx) maneja búsqueda y selección por nombre (`string`).
* **Cómo se integrará:**
  * El hook `useReelFormLogic.ts` mantiene la lista de negocios en memoria y resuelve el `business_id` (UUID) haciendo coincidir el nombre seleccionado.
  * Al eliminar un reel, se invoca `storageService.deleteFileByUrl` para limpiar la imagen del bucket.
* **Diagnóstico de Riesgo (1.0 / 10):**
  * Cumplimiento estricto de tipos TypeScript y prevención de acumulación de archivos huérfanos.

---

### 5. En las Métricas de Rendimiento (`BusinessMetricsList.tsx`)
* **Estado actual del código:**
  * [`BusinessMetricsList.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessMetricsList.tsx) es un componente desacoplado de 163 líneas que ya consulta `analytics_visits`, `businesses.cross_traffic_clicks` y `orders`.
* **Cómo se integrará:**
  * Solo se suma la lectura del conteo agregado de `clicks_to_menu_count` de la tabla `business_reels` para ese `business_id` y se añade como un nuevo item visual con icono de claqueta.
* **Diagnóstico de Riesgo (1.5 / 10):**
  * Consulta aislada que no bloquea la carga de las demás estadísticas.

---

## ⚠️ Los Únicos 2 Detalles Técnicos a Cuidar en la Construcción

Para garantizar que el riesgo se mantenga en 2/10 y no suba durante la implementación:

1. **Control de Capas Visuales (`z-index`):**
   * Los mapas de Leaflet internamente usan capas de `z-index: 400` a `1000`.
   * **Prevención:** El modal `ReelsFeedModal` y el `ReelPlayerModal` deben usar `z-[1001]` o montarse a través de un Portal React para garantizar que queden siempre 100% por encima de los controles del mapa en móviles.

2. **Regex de Validación de URLs de Instagram (Zod):**
   * Los enlaces de Instagram pueden venir en formato `/reel/ID/`, `/p/ID/` o con parámetros de seguimiento `?igsh=...`.
   * **Prevención:** El esquema Zod en el Admin debe limpiar los query params antes de guardar para que el iframe cargue limpio y sin errores.

---

## 🏆 Conclusión de la Auditoría & Blindaje Técnico

El plan está **extraordinariamente bien concebido**. Es una intervención quirúrgica, limpia y de **riesgo mínimo (1.5 / 10)** que no compromete la estabilidad ni el rendimiento del sistema en producción.

---

## ✅ Decisiones y Refinamientos Técnicos Consolidados

Todos los puntos estratégicos han sido resueltos e incorporados a la especificación oficial:

1. **Esquema de Base de Datos & SQL Corregido (Resuelto ✅):**
   * Compatibilidad con `b.status = true` (tipo boolean nativo).
   * Uso de PostGIS funcional GiST sobre `latitude` y `longitude` (`ST_SetSRID(ST_MakePoint(b.longitude, b.latitude), 4326)`).
   * Funciones RPC `increment_reel_menu_click` e `increment_reel_view` con permisos explícitos `GRANT EXECUTE ... TO anon, authenticated, service_role;`.
2. **Mapeo de Tipos TypeScript (Resuelto ✅):**
   * Mapeo en `useReelsFeed.ts` de `snake_case` retornado por PostgreSQL a `camelCase` esperado por los componentes (`ReelFeedItem`).
   * Extensión de `BucketName` en `storageService.ts` para aceptar `'reels-thumbnails'`.
3. **Autoplay & Audio en Móvil (Resuelto ✅):**
   * Respeta la política *User Gesture Required* en iOS Safari y Android Chrome.
   * Abre con miniatura WebP blur inmediata (0 ms pantalla negra) y el usuario activa el audio con 1 toque en el reproductor.
4. **Geolocalización Desactivada / Fallback (Resuelto ✅):**
   * El RPC `get_reels_feed` conmuta automáticamente a ordenar por `views_count DESC, created_at DESC` entregando `distance_meters = NULL`.
   * La UI muestra *"Cali • Recomendado"* y ofrece la píldora para reactivar ubicación.
5. **Sanitización de URLs de Instagram (Resuelto ✅):**
   * Módulo `src/utils/instagram.ts` con regex que extrae el shortcode único, limpia parámetros de tracking (`?igsh=...`) y soporta `/reel/`, `/reels/` y `/p/`.
6. **Matriz de Componentes Existentes Reutilizados (0 Deuda Técnica ✅):**
   * **Categorías:** Reutiliza [`src/components/explorer/ExplorerCategoryBar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerCategoryBar.tsx) con prop `hideHandle?: boolean` y el arreglo `categories` de [`useExplorerManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useExplorerManager.ts).
   * **Buscador de Negocios Admin:** Reutiliza [`src/components/admin/shared/Autocomplete.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/Autocomplete.tsx) con resolución por nombre en `useReelFormLogic.ts`.
   * **Modal de Confirmación de Borrado:** Reutiliza [`src/components/admin/shared/DeleteConfirmModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/DeleteConfirmModal.tsx).
   * **Notificaciones Toast:** Reutiliza [`src/components/admin/shared/SuccessToast.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/SuccessToast.tsx).
   * **Paginación de Tablas:** Reutiliza [`src/components/admin/shared/Pagination.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/Pagination.tsx).
   * **Compresión y Storage:** Reutiliza [`src/services/storageService.ts`](file:///c:/Users/cange/Documents/fowy/src/services/storageService.ts) y [`src/utils/imageCompression.ts`](file:///c:/Users/cange/Documents/fowy/src/utils/imageCompression.ts).
7. **Regla de Techo Duro de 180 Líneas (Inquebrantable ✅):**
   * Ningún archivo superará las 180 líneas (límite absoluto 250L).
   * Todo modal o vista compleja se descompone preventivamente en subcomponentes atómicos de menos de 90 líneas y hooks dedicados (`useReelFormLogic.ts`).
8. **Acción de Compartir & Deep-Linking con Suspense (Resuelto ✅):**
   * Botón `[ ↗️ Compartir ]` en la tarjeta del video que genera el enlace `https://fowy.com/explorar?reel=ID`.
   * Integración con `navigator.share` en móviles con mensaje preformateado para WhatsApp y fallback a portapapeles.
   * La ruta `/explorar` detecta automáticamente el parámetro `?reel=ID` (envuelto en `<Suspense>`) y abre de inmediato el video en pantalla completa (0 clics para el receptor).
