# 🎨 FOWY REELS — ESPECIFICACIÓN DE EXPERIENCIA VISUAL (UX/UI)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Documento Maestro de Diseño de Interfaz, Wireframes, Flujos y Micro-Interacciones**  
> **Autor:** Cristian (CEO de FOWY)  
> **Alineación:** [`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md), [`Markdown/diseño.md`](file:///c:/Users/cange/Documents/fowy/Markdown/diseño.md) y [`Markdown/Videos/Videos.Backend.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.Backend.md)  
> **Fecha:** 27 de Agosto de 2026  
> **Estado:** Listo para Implementación  

---

## 🚪 1. Los 2 Embudos de Entrada del Usuario (Filosofía de Conversión)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ PUERTA 1: TRÁFICO CALIENTE (Intención Directa / WhatsApp)                 │
│                                                                          │
│ WhatsApp Negocio ──► Link directo ──► Menú /[slug] (4 clics) ──► Pedido  │
│                      (0 distracciones, sin mapa, sin videos)             │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ PUERTA 2: TRÁFICO FRÍO (Descubrimiento / Ads, Volantes, Exploración)     │
│                                                                          │
│ Publicidad / QR ──► Mapa FOWY ──► Botón Videos ──► Feed Reels ──► Menú   │
│                     (Cercanía)     (Flotante)       (Antojo)     (Pedido)│
└──────────────────────────────────────────────────────────────────────────┘
```

* **Puerta 1 (Menú Directo - 0 Distracciones):** El cliente que entra por WhatsApp busca inmediatez. Entra a `/[slug]`, navega el menú y compra en 4 clics. **No ve videos ni mapas**.
* **Puerta 2 (Descubrimiento Visual):** El cliente entra al mapa (`/explorar/mapa`), toca el botón flotante de videos, abre el feed de experiencias, ve los platos reales por cercanía, se le despierta el antojo y desde el video salta con un clic a la Puerta 1 (`/[slug]`).

---

## 📱 2. Wireframe y Flujo del Explorador Móvil (`(explorer)`)

### 1. Botón Flotante en el Mapa (`ReelsFeedButton.tsx`)
* **Ubicación:** Lateral derecho inferior de [`/explorar/mapa`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/explorar/mapa/page.tsx), ubicado a 16px arriba del botón de geolocalización.
* **Diseño:** Círculo blanco/glassmorphism (48x48px) con borde naranja sutil y el icono de **Claqueta / Play de Video** (`Film` o `Clapperboard` de Lucide).
* **Animación:** Pulso sutil (*ping*) en el perímetro si hay videos nuevos de negocios a menos de 1 km.

---

### 2. Modal Principal del Feed (`ReelsFeedModal.tsx`)
* **Apertura:** Animación suave *Slide-Up* (de abajo hacia arriba) ocupando la pantalla móvil (Mobile-First Shell).
* **Jerarquía Visual Vertical de 4 Niveles:**

```text
┌─────────────────────────────────────────────────────────────┐
│ 📍 Descubre en Cali                                    [ X ] │
├─────────────────────────────────────────────────────────────┤
│ 1️⃣ BURBUJAS DE NEGOCIOS (Círculos con logos + distancia)     │
│    [🌟 Todos] (🍔 La Arepa 450m) (🍕 Bella Italia 800m)... │
├─────────────────────────────────────────────────────────────┤
│ 2️⃣ TIRA DE CATEGORÍAS (Chips circulares de comida)          │
│    (🍽️ Todo) (🫓 Arepas) (🥩 Asados) (🌮 C. Mexicana)...    │
├─────────────────────────────────────────────────────────────┤
│ 3️⃣ BUSCADOR DE ANTOJOS (Barra compacta 40px)               │
│    [ 🔍 Buscar por plato, antojo o restaurante...       ]   │
├─────────────────────────────────────────────────────────────┤
│ 4️⃣ CUADRÍCULA 9:16 (Scroll infinito de cerca a lejos)       │
│    ┌─────────┐   ┌─────────┐   ┌─────────┐                  │
│    │ Reel 1  │   │ Reel 2  │   │ Reel 3  │                  │
│    │ ▶ 1.2k  │   │ ▶ 850   │   │ ▶ 2.4k  │                  │
│    └─────────┘   └─────────┘   └─────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

#### Nivel 0: Cabecera (Header)
* Título a la izquierda: **"Descubre en Cali"**.
* Botón a la derecha: Botón circular de cierre con icono `X` o barra deslizable hacia abajo.
* **Píldora de Reconexión GPS (Modo Fallback):** Si el usuario navega sin GPS (`distanceMeters === null`), se muestra una píldora translúcida con ícono `MapPin`: *"📍 Activar ubicación para ver videos cerca de ti"*, que al tocar invoca `navigator.geolocation.getCurrentPosition`.

#### Nivel 1: Carrusel de Negocios (`ReelsProximityBar.tsx`)
* Barra horizontal deslizante de logos circulares compactos (50x50px) con anillo gradiente FOWY.
* **Primera Burbuja:** **`[ 🌟 Todos ]`** (resetea el filtro de negocio con 1 toque).
* **Etiqueta Dinámica:** Nombre del local + Distancia (ej. *"La Arepa • 450m"* o *"La Arepa • Recomendado"* si no hay GPS).
* **Interacción:** Al tocar un negocio, se resalta su anillo en naranja intenso y filtra la cuadrícula para mostrar exclusivamente los videos de ese restaurante.

#### Nivel 2: Tira de Categorías (Reutilización de [`ExplorerCategoryBar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerCategoryBar.tsx))
* **Reutilización de Componente:** Se importa y consume directamente el componente existente [`src/components/explorer/ExplorerCategoryBar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerCategoryBar.tsx) (72 líneas, 0 código duplicado).
* **Reutilización de Datos (0 ms / 0 peticiones SQL):** Recibe vía prop `categories={categories}` el arreglo que ya fue descargado por [`useExplorerManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useExplorerManager.ts#L93-L102), evitando cualquier consulta de red redundante.
* **Primera Burbuja:** **`[ 🍽️ Todo ]`** (resetea el filtro de categoría a `null`).
* **Chips Circulares:** Muestra los iconos oficiales de *Arepas, Asados, Comida Mexicana, Chuzos, Hamburguesas, etc.*
* **Interacción:** Al tocar una categoría, filtra la cuadrícula en memoria RAM (`useMemo`) comparando `reel.businessCategoryId === selectedCategoryId`.

#### Nivel 3: Buscador de Antojos (`ReelsSearchBar.tsx`)
* Barra de búsqueda delgada y ergonómica (40px de altura) con icono `Search`.
* **Placeholder:** *"Buscar por plato, antojo o restaurante..."*.
* **Botón de Limpieza:** Icono `X` circular a la derecha para borrar el texto con 1 toque.
* **Filtrado en RAM:** Filtra en tiempo real a 60 FPS (`useMemo`) sobre los títulos de los videos y nombres de locales sin recargar la red.

#### Nivel 4: Cuadrícula 9:16 de Reels (`ReelsGrid.tsx` & `ReelCard.tsx`)
* Grid responsivo idéntico al perfil de Instagram (3 columnas verticales relación 9:16).
* **Orden Inicial por Defecto:** De más cerca a más lejos geográficamente (o más vistos si no hay GPS).
* **Filtro Combinado Cruzado en Memoria RAM (`useMemo`):**
  * `Negocio Seleccionado` ✖️ `Categoría Seleccionada` ✖️ `Texto Buscado`.
* **Overlay de la Miniatura:** Badge translúcido con icono de Play + Vistas (`views_count`) y título truncado a 1 línea.
* **Estado Vacío Elegante (*Empty State*):** Si la búsqueda no arroja resultados, muestra un icono amigable con el mensaje *"No encontramos videos con ese filtro"* y un botón rápido **`[ 🔄 Ver todos los videos ]`**.

---

### 3. Reproductor Inmersivo Full-Screen (`ReelPlayerModal.tsx`)
* **Apertura:** Al tocar cualquier miniatura del grid 9:16.
* **Estrategia "Zero Pantalla Negra" (Skeleton Blur):** Mientras el iframe de Instagram carga en conexiones 4G lentas, la pantalla muestra de inmediato la miniatura WebP en alta definición con filtro `blur-sm` y un spinner fino de FOWY (0 ms de espera visual).
* **Blindaje Móvil (iOS Safari & Android Chrome):**
  * Configuración del `iframe` con sandboxing y permisos multimedia explícitos:
    ```html
    <iframe
      src={getInstagramEmbedUrl(reel.instagramUrl)}
      className="w-full h-full border-0 rounded-2xl"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
    ```
  * **Audio Móvil:** Respeta la política *User Gesture Required* de WebKit y Chrome Móvil. El usuario activa el sonido con 1 toque en el control nativo del reproductor de Instagram sin interrumpir el flujo.
* **Tarjeta Flotante Inferior (*Glassmorphism*):**
  * Contenedor translúcido fijado en la parte inferior del video (`bg-black/60 backdrop-blur-md z-30`).
  * **Fila 1:** Logo redondo del negocio + Nombre en negrita + Distancia calculada o ciudad (ej. *"El Rincón Paisa • a 650m de ti"*).
  * **Fila 2 (Botones de Acción):**
    * **Botón Principal (Naranja FOWY) `[ 🛒 Ver Menú & Pedir ]`:**
      * Dispara la llamada asíncrona no bloqueante:
        `supabase.rpc('increment_reel_menu_click', { target_reel_id: reel.reelId })`.
      * Ejecuta la navegación instantánea en cliente con Next.js: `router.push('/' + reel.businessSlug)`.
    * **Botón Secundario (Gris/Translúcido) `[ 📍 Ver en Mapa ]`:**
      * Cierra el modal `ReelsFeedModal.tsx`.
      * Invoca el callback `onSelectBusiness(reel.businessId)` que conecta con [`ExplorerMap.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerMap.tsx), ejecutando `map.flyTo([lat, lng], 16)` y abriendo automáticamente [`BusinessDetailSheet.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/BusinessDetailSheet.tsx).

---

## 🖥️ 3. Wireframe y Flujo del Panel Administrador (`admin`)

### 1. Navegación en el Sidebar
* Nuevo ítem en el menú lateral [`Sidebar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/Sidebar.tsx): **"🎬 Fowy Reels"** (`/admin/reels`), agregando `{ name: "Fowy Reels", href: "/admin/reels", icon: Clapperboard }` al arreglo `menuItems`.

---

### 2. Tabla Principal de Gestión (`ReelsAdminTable.tsx`)
* **Ubicación:** `src/components/admin/reels/ReelsAdminTable.tsx` consumido por la página `src/app/admin/reels/page.tsx`.
* **Barra Superior:** Buscador por nombre de restaurante + Filtro por estado (Todos / Activos / Pausados) + Botón **`[ + Nuevo Reel ]`**.
* **Columnas de la Tabla:**
  1. **Portada:** Preview vertical 9:16 pequeña (40x60px) con [`PremiumImage.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/PremiumImage.tsx).
  2. **Negocio & Título:** Logo del negocio + Nombre + Título del video.
  3. **Métricas en Vivo:** Badge de Vistas (`views_count`) y Badge de Clics al Menú (`clicks_to_menu_count`).
  4. **Interruptor Rápido (Switch):** Switch interactivo para activar/pausar el video en 1 solo clic (`onToggleActive`).
  5. **Acciones:**
     * Botón de **Preview** (`Eye`): Abre el modal `ReelPlayerModal` para validar el video en vivo.
     * Botón de **Editar** (`Edit2`): Abre el modal `ReelFormModal` precargando los datos del reel.
     * Botón de **Eliminar** (`Trash2`): Abre el modal de confirmación reutilizable [`src/components/admin/shared/DeleteConfirmModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/DeleteConfirmModal.tsx), borra el registro en DB, elimina la imagen en Storage y notifica con [`src/components/admin/shared/SuccessToast.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/SuccessToast.tsx).
* **Paginación:** Reutiliza el componente [`src/components/admin/shared/Pagination.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/Pagination.tsx) para listados extensos.

---

### 3. Modal Unificado de Creación y Edición (`ReelFormModal.tsx`)
* **Ubicación:** `src/components/admin/reels/ReelFormModal.tsx`.
* **Patrón de Arquitectura:** Sigue el diseño probado de [`CategoryFormModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/catalogo/CategoryFormModal.tsx), recibiendo `isOpen: boolean`, `reelToEdit: BusinessReel | null`, `onClose: () => void` y `onSuccess: () => void`.

#### Modo Creación:
1. **Paso 1 (Seleccionar Negocio):** Reutiliza el componente compartido [`src/components/admin/shared/Autocomplete.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/Autocomplete.tsx) alimentado por `supabase.from('businesses').select('id, name, logo_url, slug')`.
2. **Paso 2 (Enlace de Instagram con Sanitización en Vivo):** 
   * Input de texto para pegar la URL.
   * Limpieza automática de parámetros de rastreo mediante `extractInstagramShortcode` y `sanitizeInstagramUrl` (definidos en [`src/utils/instagram.ts`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.Backend.md#L220)).
   * Validación reactiva en tiempo real: Muestra `✓ Enlace válido (Shortcode: C8xYz...)` o alerta de formato.
3. **Paso 3 (Miniatura de Portada WebP):** 
   * Área *Drag & Drop* para subir la imagen.
   * Compresión y subida mediante [`src/services/storageService.ts`](file:///c:/Users/cange/Documents/fowy/src/services/storageService.ts#L15):
     ```typescript
     storageService.uploadFile(file, 'reels-thumbnails', {
       shouldCompress: true,
       maxWidth: 720,
       quality: 0.8
     });
     ```
4. **Paso 4 (Título & Publicación):** Input de texto breve + Botón **`[ 🚀 Publicar Reel ]`** con spinner animado `RefreshCw`.

#### Modo Edición:
1. **Pre-llenado de Datos:** Carga automática del negocio asociado, URL limpia del Reel, título y estado activo/inactivo. Las métricas (`views_count`, `clicks_to_menu_count`) son de solo lectura y se preservan.
2. **Gestión Inteligente de Miniatura:**
   * Muestra la miniatura actual como vista previa (`imagePreview = reelToEdit.thumbnail_url`).
   * **Si NO se sube un nuevo archivo:** Conserva `thumbnail_url` original (0 llamadas a Storage).
   * **Si se SUBE una nueva imagen:** Sube la nueva imagen comprimida y elimina la anterior con `storageService.deleteFileByUrl(oldUrl, 'reels-thumbnails')` para evitar basura en la nube.
3. **Guardado & Feedback:** Actualización optimista en RAM, mutación `UPDATE` en PostgreSQL y notificación vía [`SuccessToast.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/SuccessToast.tsx).

---

## 📊 4. Conexión con Métricas del Negocio (`BusinessMetricsList.tsx`)

En el componente existente [`src/components/admin/businesses/BusinessMetricsList.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessMetricsList.tsx) (y en el dashboard de socio [`/business`](file:///c:/Users/cange/Documents/fowy/src/app/(partners)/business/page.tsx)), se agrega la lectura de la **Métrica de Oro**:

```typescript
// En el useEffect de BusinessMetricsList.tsx:
const { data: reelsData } = await supabase
  .from('business_reels')
  .select('clicks_to_menu_count')
  .eq('business_id', businessId);

const totalReelMenuClicks = (reelsData || []).reduce((acc, r) => acc + (r.clicks_to_menu_count || 0), 0);
```

Se renderiza una tarjeta adicional con el icono `Clapperboard` de Lucide:

| Métrica | Icono | Descripción |
| :--- | :---: | :--- |
| **Visitas Totales** | `Eye` | Tráfico total a la página del menú. |
| **Pedidos Recibidos** | `ShoppingBag` | Cantidad de pedidos cerrados por WhatsApp. |
| **Tasa de Conversión** | `Percent` | Porcentaje de visitas que se convierten en pedido. |
| **Ticket Promedio** | `Receipt` | Promedio en dinero por pedido. |
| **Clics de Tráfico Cruzado** | `Share2` | Clientes derivados de otros comercios. |
| **🔥 Clics desde Reels & Videos** | `Clapperboard` | **Personas enviadas directamente al menú desde los videos de FOWY.** |

---

## 📁 5. Mapa de Nuevos Archivos, Desglose Atómico y Presupuesto de Líneas

> 🛑 **REGLA DE TECHO DURO (PRESUPUESTO MÁXIMO 180 LÍNEAS / LÍMITE INQUEBRANTABLE 250L)**:
> 1. **Cero Archivos Monolíticos:** Ningún archivo nuevo puede superar las 180 líneas. Todo componente complejo se descompone preventivamente en sub-archivos atómicos de responsabilidad única.
> 2. **Separación de Lógica y Vista:** Si un formulario o vista maneja más de 3 estados o lógica asíncrona, es **OBLIGATORIO** aislar su lógica en un hook dedicado (`use...Logic.ts`) para mantener el componente visual puramente declarativo (< 80L).
> 3. **Protocolo de Parada Inmediata:** Si durante la implementación un archivo alcanza las 180 líneas, se detiene la edición y se extrae la sección a un subcomponente antes de continuar.

### Desglose Anatómico de Archivos a Construir:

| Archivo a Crear | Responsabilidad Única | Techo de Líneas |
| :--- | :--- | :---: |
| **`src/types/reels.ts`** | Contrato estricto de interfaces (`BusinessReel`, `ReelFeedItem`). | ~40 L |
| **`src/utils/instagram.ts`** | Regex, extractor de shortcode y sanitizador de URLs de Instagram. | ~45 L |
| **`src/hooks/useReelsFeed.ts`** | Hook del explorador móvil (consume RPC `get_reels_feed` con SWR). | ~85 L |
| **`src/hooks/useReelsManager.ts`** | Hook de administración (CRUD de reels, optimismo y storage cleanup). | ~120 L |
| **`src/components/explorer/reels/ReelsFeedButton.tsx`** | Botón flotante [🎬] sobre el mapa en `mapa/page.tsx`. | ~50 L |
| **`src/components/explorer/reels/ReelsFeedModal.tsx`** | Cascarón del modal orquestador con animación slide-up. | ~80 L |
| **`src/components/explorer/reels/ReelsProximityBar.tsx`** | Carrusel horizontal de negocios con botón "🌟 Todos". | ~75 L |
| **`src/components/explorer/reels/ReelsSearchBar.tsx`** | Barra compacta de búsqueda predictiva con reseteo rápido. | ~45 L |
| **`src/components/explorer/reels/ReelsGrid.tsx`** | Contenedor de cuadrícula 3 columnas con scroll infinito y empty state. | ~70 L |
| **`src/components/explorer/reels/ReelCard.tsx`** | Tarjeta individual de video 9:16 con miniatura WebP y overlay de vistas. | ~60 L |
| **`src/components/explorer/reels/ReelPlayerModal.tsx`** | Cascarón del reproductor inmersivo, iframe sandbox y skeleton blur. | ~95 L |
| **`src/components/explorer/reels/ReelActionCard.tsx`** | Tarjeta flotante inferior (*Glassmorphism*) con botón `[ 🛒 Ver Menú ]`. | ~65 L |
| **`src/app/admin/reels/page.tsx`** | Página contenedora de la ruta administrativa de Reels. | ~50 L |
| **`src/components/admin/reels/ReelsAdminTable.tsx`** | Tabla de gestión con buscador, switches, previews y acciones. | ~130 L |
| **`src/components/admin/reels/ReelFormModal.tsx`** | Cascarón del modal crear/editar, header, footer y botones. | ~75 L |
| **`src/components/admin/reels/ReelFormFields.tsx`** | Inputs de texto, selector Autocomplete y validación de URL. | ~85 L |
| **`src/components/admin/reels/ReelThumbnailUploader.tsx`** | Zona drag & drop de portada, compresión WebP y preview. | ~70 L |
| **`src/components/admin/reels/useReelFormLogic.ts`** | Hook de estado, validación Zod y llamadas de guardado a Supabase. | ~80 L |

---
*Documento consolidado, 100% atómico y blindado contra sobrecrecimiento de líneas.*
