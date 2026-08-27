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
* **Qué se tocará:** Creación de la tabla `business_reels`, el RPC `get_reels_feed`, la función `increment_reel_menu_click` y políticas RLS.
* **Diagnóstico de Riesgo (1.5 / 10):**
  * La nueva tabla tiene `REFERENCES businesses(id) ON DELETE CASCADE`, por lo que no altera columnas de la tabla `businesses` ni de `orders`.
  * Si la tabla de reels o el procedimiento RPC fallaran, la base de datos principal de FOWY sigue operando con normalidad.

---

### 2. En el Mapa del Explorador (`src/app/(explorer)/explorar/mapa/page.tsx` y `ExplorerMap.tsx`)
* **Estado actual del código:**
  * [`mapa/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/explorar/mapa/page.tsx) es un orquestador limpio de 97 líneas que carga `ExplorerMap` de forma dinámica con `{ ssr: false }`.
  * [`ExplorerMap.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerMap.tsx) maneja el contenedor Leaflet con `z-0`.
* **Cómo se integrará:**
  * No se modifica la lógica interna de Leaflet ni el hook `useExplorerManager.ts`.
  * El nuevo componente `ReelsFeedButton.tsx` se coloca como un elemento flotante hermano de `ExplorerMap` con `z-30`.
* **Diagnóstico de Riesgo (2.0 / 10):**
  * Si el feed de reels o su modal llegaran a arrojar un error, el mapa de Leaflet, los pines y el menú siguen funcionando sin interrupción (*Failsafe*).

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

### 4. En las Métricas de Rendimiento (`BusinessMetricsList.tsx`)
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

1. **Autoplay & Audio en Móvil (Resuelto ✅):**
   * Respeta la política *User Gesture Required* en iOS Safari y Android Chrome.
   * Abre con miniatura WebP blur inmediata (0 ms pantalla negra) y el usuario activa el audio con 1 toque en el reproductor.

2. **Geolocalización Desactivada / Fallback (Resuelto ✅):**
   * El RPC `get_reels_feed` conmuta automáticamente a ordenar por `views_count DESC, created_at DESC` entregando `distance_meters = NULL`.
   * La UI muestra *"Cali • Recomendado"* y ofrece la píldora para reactivar ubicación.

3. **Sanitización de URLs de Instagram (Resuelto ✅):**
   * Módulo `src/utils/instagram.ts` con regex que extrae el shortcode único, limpia parámetros de tracking (`?igsh=...`) y soporta `/reel/`, `/reels/` y `/p/`.

4. **Matriz de Componentes Existentes Reutilizados (0 Deuda Técnica ✅):**
   * **Categorías:** Reutiliza [`src/components/explorer/ExplorerCategoryBar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerCategoryBar.tsx) y el arreglo `categories` de [`useExplorerManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useExplorerManager.ts).
   * **Buscador de Negocios Admin:** Reutiliza [`src/components/admin/shared/Autocomplete.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/Autocomplete.tsx).
   * **Modal de Confirmación de Borrado:** Reutiliza [`src/components/admin/shared/DeleteConfirmModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/DeleteConfirmModal.tsx).
   * **Notificaciones Toast:** Reutiliza [`src/components/admin/shared/SuccessToast.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/SuccessToast.tsx).
   * **Paginación de Tablas:** Reutiliza [`src/components/admin/shared/Pagination.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/Pagination.tsx).
   * **Compresión y Storage:** Reutiliza [`src/services/storageService.ts`](file:///c:/Users/cange/Documents/fowy/src/services/storageService.ts) y [`src/utils/imageCompression.ts`](file:///c:/Users/cange/Documents/fowy/src/utils/imageCompression.ts).

5. **Regla de Techo Duro de 180 Líneas (Inquebrantable ✅):**
   * Ningún archivo superará las 180 líneas (límite absoluto 250L).
   * Todo modal o vista compleja se descompone preventivamente en subcomponentes atómicos de menos de 90 líneas y hooks dedicados (`useReelFormLogic.ts`).
   * Si un archivo alcanza 180L durante el desarrollo, se detiene y se extrae su lógica antes de continuar.
