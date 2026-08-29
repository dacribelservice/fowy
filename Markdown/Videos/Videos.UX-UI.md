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
* **Puerta 2 (Descubrimiento Visual):** El cliente entra al explorador (`/explorar`), toca el botón flotante de videos, abre el feed de experiencias, ve los platos reales por cercanía, se le despierta el antojo y desde el video salta con un clic a la Puerta 1 (`/[slug]`).

---

## 📱 2. Wireframe y Flujo del Explorador Móvil (`(explorer)`)

### 1. Botón Flotante en el Explorador (`ReelsFeedButton.tsx`)
* **Ubicación & Integración Limpia:** Se integra directamente en el contenedor vertical de botones flotantes existente en [`src/app/(explorer)/explorar/page.tsx:L128`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/explorar/page.tsx#L128) (`className="absolute right-4 bottom-[180px] z-[25] flex flex-col gap-3"`), situándose estratégicamente justo arriba del botón de centrado GPS (`handleCenterUser`).
* **Diseño:** Círculo blanco/glassmorphism (56x56px) con borde naranja sutil, sombra premium y el icono de **Claqueta / Play de Video** (`Clapperboard` de Lucide).
* **Animación:** Pulso sutil (*ping*) en el perímetro si hay videos nuevos de negocios a menos de 1 km.
* **Ergonomía:** 100% accesible con una sola mano en cualquier teléfono móvil (incluyendo pantallas compactas como iPhone SE) sin tapar la barra de categorías ni los controles del mapa.

---

### 2. Modal Principal del Feed (`ReelsFeedModal.tsx`)
* **Apertura:** Animación suave *Slide-Up* (de abajo hacia arriba) ocupando la pantalla móvil (Mobile-First Shell).
* **Capa Visual Blindada (`z-index`):** Configurado con `z-[1001]` para garantizar que quede 100% por encima de los mosaicos, marcadores y controles de Leaflet (que operan entre `z-[400]` y `z-[1000]`), así como de las hojas de detalle (`z-30`/`z-40`).
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
* **Reutilización de Componente:** Se importa y consume directamente el componente existente [`src/components/explorer/ExplorerCategoryBar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerCategoryBar.tsx) (72 líneas, 0 código duplicado). Se le añade el prop opcional `hideHandle?: boolean` para ocultar el tirador gris superior de arrastre cuando se monte dentro del modal.
* **Reutilización de Datos (0 ms / 0 peticiones SQL):** Recibe vía prop `categories={categories}` el arreglo que ya fue descargado por [`useExplorerManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useExplorerManager.ts#L93-L102), evitando cualquier consulta de red redundante.
* **Primera Burbuja:** **`[ 🍽️ Todo ]`** (resetea el filtro de categoría a `null`).
* **Chips Circulares:** Muestra los iconos oficiales de *Arepas, Asados, Comida Mexicana, Chuzos, Hamburguesas, etc.*
* **Filtrado Híbrido:** Al tocar una categoría, filtra la cuadrícula instantáneamente en memoria RAM a 60 FPS (`useMemo`) comparando `reel.businessCategoryId === selectedCategoryId`. Si se activa la paginación profunda o búsqueda aislada, `useReelsFeed` pasa el `filter_category_id` al RPC en PostgreSQL.

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
* **Apertura & Capa Visual:** Al tocar cualquier miniatura del grid 9:16, se abre en pantalla completa con capa `z-[1050]`.
* **Registro Atómico de Vista Protegido (Pestillo `useRef`):** Al abrirse el modal, dispara en segundo plano de forma no bloqueante:
  ```typescript
  // Ejecución única por apertura con protección contra re-renders:
  const hasIncrementedViewRef = useRef(false);
  useEffect(() => {
    if (!hasIncrementedViewRef.current && reel?.reelId) {
      hasIncrementedViewRef.current = true;
      void supabase.rpc('increment_reel_view', { target_reel_id: reel.reelId });
    }
  }, [reel?.reelId]);
  ```
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
  * **Resiliencia de Contenido:** Si una publicación de Instagram es eliminada o marcada como privada, la tarjeta flotante inferior de FOWY permanece 100% activa permitiendo la conversión inmediata al menú del negocio.
* **Tarjeta Flotante Inferior (*Glassmorphism*):**
  * Contenedor translúcido fijado en la parte inferior del video (`bg-black/60 backdrop-blur-md z-30`).
  * **Fila 1:** Logo redondo del negocio + Nombre en negrita + Distancia calculada o ciudad (ej. *"El Rincón Paisa • a 650m de ti"*).
  * **Fila 2 (Botones de Acción):**
    * **Botón Principal (Naranja FOWY) `[ 🛒 Ver Menú & Pedir ]`:**
      * Dispara la llamada asíncrona no bloqueante:
        `supabase.rpc('increment_reel_menu_click', { target_reel_id: reel.reelId })`.
      * Ejecuta la navegación instantánea en cliente con Next.js: `router.push('/' + reel.businessSlug)`.
    * **Botón de Ubicación (Gris/Translúcido) `[ 📍 Ver en Mapa ]`:**
      * Cierra el modal `ReelsFeedModal.tsx`.
      * Invoca el callback `onSelectBusiness(reel.businessId)` que conecta con [`ExplorerMap.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerMap.tsx), ejecutando `map.flyTo([lat, lng], 16)` y abriendo automáticamente [`BusinessDetailSheet.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/BusinessDetailSheet.tsx).
    * **Botón de Compartir (Viral) `[ ↗️ Compartir ]` (con ícono `Share2`):**
      * Genera el Deep-Link único del video: `${window.location.origin}/explorar?reel=${reel.reelId}`.
      * Invoca `navigator.share` en móviles con el texto:
        `"¡Mira este plato de ${reel.businessName} en FOWY! 🤤🔥 Míralo aquí: ${url}"`.
      * Fallback en desktop: Copia al portapapeles y notifica vía `SuccessToast("¡Enlace del video copiado!")`.

* **Manejo de Deep-Linking Automático (`?reel=ID` con `<Suspense>` en Next.js 15):**
  * En Next.js 15 App Router, la lectura de `useSearchParams().get('reel')` se encapsula dentro de un subcomponente aislado envuelto en `<Suspense fallback={null}>` para garantizar la compatibilidad con el renderizado del framework.
  * Al ingresar a la ruta con el parámetro `?reel=...`, se abre automáticamente `ReelPlayerModal.tsx` en pantalla completa con ese video específico (0 clics para el receptor). Al cerrar, el usuario queda en el explorador interactivo.

---

## 🖥️ 3. Wireframe y Flujo del Panel Administrador (`admin`)

### 1. Navegación en el Sidebar & Acceso Cruzado
* **Menú Lateral ([`Sidebar.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/Sidebar.tsx)):** Nuevo ítem **"🎬 Fowy Reels"** (`/admin/reels`), agregando `{ name: "Fowy Reels", href: "/admin/reels", icon: Clapperboard }` al arreglo `menuItems`.
* **Acceso Cruzado en Negocios ([`negocios/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/admin/negocios/page.tsx)):** En la tabla general de negocios (columna *Acciones*), además del icono de catálogo y configuración, se añade el botón con icono de claqueta `[ 🎬 ]` para saltar directamente a la galería de videos de ese restaurante (`/admin/reels/[businessId]`).

---

### 2. Central Principal de Fowy Reels (`/admin/reels`)
### 2. Central Principal de Fowy Reels (`/admin/reels`)
* **Página Contenedora:** `src/app/admin/reels/page.tsx`.
* **Jerarquía de la Pantalla en 3 Bloques:**

#### Bloque A: Cabecera de KPIs Globales (`ReelsGlobalKPIs.tsx`)
Cuatro tarjetas resumen con estilo de cristal (*glassmorphism*) y acentos de color FOWY, acompañadas de un ranking rápido:

```text
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ 🎬 Videos Activos│  │ 👁️ Vistas Totales│  │ 🛒 Clics al Menú │  │ 📈 Tasa Conversión│
│ 48               │  │ 128,450          │  │ 14,230           │  │ 11.1%            │
│ En 33 negocios   │  │ Global plataforma│  │ Enviados a pedir │  │ Vistas vs Clics  │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
```

#### Bloque B: Gráfica Global Reutilizada (`ReelsTrafficChart.tsx` heredando [`BusinessTrafficSvg.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessTrafficSvg.tsx))
Se reutiliza directamente el motor gráfico vectorial SVG de FOWY para visualizar el comportamiento acumulado de toda la red:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  🔴 Curva Naranja: Reproducciones Globales de Video                                    │
│  🟢 Barras Verdes: Clics Globales en "Ver Menú & Pedir"                                │
│                                                              [ DÍA ]  [ SEMANA ] [ MES ]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│     850 ┬                                                                              │
│         │     ╭──╮                                                                     │
│     425 ┼────╯    ╰───────────╮                                                        │
│         │     █               ╰───────╮          ╭──╮                                  │
│       0 ┴─────█───────────────────────╰──█───────╯──╰──█──                             │
│              Dom     Lun     Mar     Mié     Jue     Vie     Sáb                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  📅 Resumen del Período:         👁️ 154,200 Reproducciones     🛒 14,350 Clics Menú     │
│  🏆 Top 5 Negocios con Más Reproducciones (Ranking con copa dorada)                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Bloque C: Tabla de Negocios para Reels (`ReelsBusinessesTable.tsx`)
Lista completa de comercios afiliados con buscador predictivo y filtros rápidos:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [ 🔍 Buscar negocio por nombre o ID... ]               [ Todos los Planes ▾ ] [ Estado ▾ ]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ESTABLECIMIENTO        UBICACIÓN        VIDEOS    VISTAS TOTALES   CLICS MENÚ  ACCIONES│
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🍔 COMIDAS RÁPIDAS ALEJO Cali, Valle    3 videos  👁️ 4,250         🛒 890         [ 🎬 ]│
│     ID: 2D10E5A0                                                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🍕 MERYS PIZZA 🍕       Cali, Valle    1 video   👁️ 1,820         🛒 310         [ 🎬 ]│
│     ID: 97E246E5                                                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🥩 SANTO GRILL 🔥       Cali, Valle    0 videos  —                —             [ 🎬 ]│
│     ID: 2995D43E                                                                       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
* **Columnas:**
  1. **Establecimiento:** Logo circular, Nombre comercial e ID corto.
  2. **Ubicación:** Ciudad y departamento.
  3. **Videos:** Contador de reels activos registrados (`totalReels`).
  4. **Vistas Totales:** Total acumulado de visualizaciones del negocio.
  5. **Clics al Menú:** Total de compras iniciadas desde los videos del restaurante.
  6. **Acciones (Único Botón):** Botón directo con ícono de claqueta `[ 🎬 ]` (*"Gestionar Reels"*) que abre la galería de videos exclusiva de ese restaurante (`/admin/reels/[businessId]`). La edición general del comercio se mantiene 100% en el módulo de "Negocios".
* **Paginación:** Reutiliza [`src/components/admin/shared/Pagination.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/shared/Pagination.tsx).

---

### 3. Pantalla de Gestión de Videos por Negocio (`/admin/reels/[businessId]`)
* **Página Contenedora:** `src/app/admin/reels/[businessId]/page.tsx`.
* **Estructura Visual Completa con Gráfica Individual:**

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  ← VOLVER AL LISTADO DE REELS                                      [ + NUEVO REEL ]   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🍔 COMIDAS RÁPIDAS ALEJO                                                             │
│  Plan Standard • Cali, Valle del Cauca • 3 videos activos                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  MÉTRICAS DEL RESTAURANTE:                                                             │
│  👁️ 4,250 Vistas Totales  •  🛒 890 Clics al Menú  •  📈 20.9% Tasa de Conversión      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  GRÁFICA DE RENDIMIENTO DE REELS (REUTILIZADA PARA ESTE NEGOCIO):                      │
│  🔴 Curva: Reproducciones del Negocio  |  🟢 Barras: Clics en "Ver Menú"              │
│  [ DÍA ] [ SEMANA ] [ MES ]  •  Resumen: 👁️ 4,250 Vistas  🛒 890 Clics                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  GALERÍA DE REELS:                                                                     │
│                                                                                        │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐                   │
│  │ ┌─────────────┐ │     │ ┌─────────────┐ │     │ ┌─────────────┐ │                   │
│  │ │             │ │     │ │             │ │     │ │             │ │                   │
│  │ │ Portada 9:16│ │     │ │ Portada 9:16│ │     │ │ Portada 9:16│ │                   │
│  │ │             │ │     │ │             │ │     │ │             │ │                   │
│  │ └─────────────┘ │     │ └─────────────┘ │     │ └─────────────┘ │                   │
│  │ "Hamburguesa X" │     │ "Arepa Especial"│     │ "Chuzo Desgran" │                   │
│  │ 👁️ 1.8k  🛒 420 │     │ 👁️ 1.4k  🛒 290 │     │ 👁️ 1.0k  🛒 180 │                   │
│  │ Estado:  [ ON ] │     │ Estado:  [ ON ] │     │ Estado:  [ OFF] │                   │
│  │ [👁️ Ver] [✏️ Edit]│     │ [👁️ Ver] [✏️ Edit]│     │ [👁️ Ver] [✏️ Edit]│                   │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Gráfica de Negocio Reutilizada (`ReelsTrafficChart businessId={businessId}`):**
  * Renderiza la misma gráfica SVG alimentada por el hook `useReelsTrafficData({ businessId, filter })`.
  * La **curva naranja** traza las reproducciones exclusivas de este restaurante y las **barras verdes** representan los clientes derivados al menú en cada día/semana/mes.
* **Galería Interactiva 9:16 (`ReelsBusinessGallery.tsx` & `AdminReelCard.tsx`):**
  * Cada tarjeta vertical presenta la portada WebP, título del plato, métricas en vivo (Vistas / Clics), interruptor Switch rápido ON/OFF y botones de acción (Ver `Eye`, Editar `Edit2`, Eliminar `Trash2`).
* **Estado Vacío Amigable (*Empty State*):** Si el comercio no tiene videos registrados aún, se presenta un contenedor centrado con ilustración y el botón destacado **`[ 🚀 + Publicar Primer Reel ]`**.

---

### 4. Modal Unificado de Creación y Edición (`ReelFormModal.tsx`)
* **Ubicación:** `src/components/admin/reels/ReelFormModal.tsx`.
* **Inyección Inteligente de Negocio:** Al abrirse desde `/admin/reels/[businessId]`, el `business_id` se pre-asigna automáticamente sin requerir selección manual. Si se abre desde la central general, permite seleccionar mediante `Autocomplete.tsx` con desambiguación (`name + city`).
* **Pasos del Formulario:**
  1. **Enlace de Instagram:** Input con limpieza automática de parámetros de rastreo (`sanitizeInstagramUrl`).
  2. **Portada WebP:** Subida drag & drop con compresión en cliente a través de `storageService.uploadFile` en el bucket `'reels-thumbnails'`.
  3. **Título y Publicación:** Input de texto breve y guardado optimista.

---

### 5. Conexión con Métricas del Negocio (`BusinessMetricsList.tsx`)
En el componente existente [`src/components/admin/businesses/BusinessMetricsList.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessMetricsList.tsx) (y en el dashboard de socio [`/business`](file:///c:/Users/cange/Documents/fowy/src/app/(partners)/business/page.tsx)), se agrega la lectura de la **Métrica de Oro**:

```typescript
// En el useEffect de BusinessMetricsList.tsx:
const { data: reelsData } = await supabase
  .from('business_reels')
  .select('clicks_to_menu_count')
  .eq('business_id', businessId);

const totalReelMenuClicks = (reelsData || []).reduce((acc, r) => acc + (r.clicks_to_menu_count || 0), 0);
```

---

## 📁 6. Mapa de Nuevos Archivos, Desglose Atómico y Presupuesto de Líneas

> 🛑 **REGLA DE TECHO DURO (PRESUPUESTO MÁXIMO 180 LÍNEAS / LÍMITE INQUEBRANTABLE 250L)**:
> 1. **Cero Archivos Monolíticos:** Ningún archivo nuevo puede superar las 180 líneas. Todo componente complejo se descompone preventivamente en sub-archivos atómicos de responsabilidad única.
> 2. **Separación de Lógica y Vista:** Si un formulario o vista maneja más de 3 estados o lógica asíncrona, es **OBLIGATORIO** aislar su lógica en un hook dedicado (`use...Logic.ts`) para mantener el componente visual puramente declarativo (< 80L).

### Desglose Anatómico de Archivos a Construir:

| Archivo a Crear | Responsabilidad Única | Techo de Líneas |
| :--- | :--- | :---: |
| **`src/types/reels.ts`** | Contratos de interfaces (`BusinessReel`, `ReelFeedItem`, `BusinessReelsSummary`, `AdminReelsGlobalStats`). | ~60 L |
| **`src/utils/instagram.ts`** | Regex, extractor de shortcode y sanitizador de URLs de Instagram. | ~45 L |
| **`src/hooks/useReelsFeed.ts`** | Hook del explorador móvil (consume RPC `get_reels_feed` con SWR y mapeo camelCase). | ~85 L |
| **`src/hooks/useReelsManager.ts`** | Hook de administración (CRUD de reels, optimismo y storage cleanup). | ~120 L |
| **`src/hooks/useAdminReelsSummary.ts`** | Hook para cargar métricas globales y listado de negocios con conteo de reels. | ~95 L |
| **`src/components/explorer/reels/ReelsFeedButton.tsx`** | Botón flotante [🎬] sobre el explorador en `explorar/page.tsx`. | ~50 L |
| **`src/components/explorer/reels/ReelsFeedModal.tsx`** | Cascarón del modal orquestador con animación slide-up y capa `z-[1001]`. | ~80 L |
| **`src/components/explorer/reels/ReelsProximityBar.tsx`** | Carrusel horizontal de negocios con botón "🌟 Todos". | ~75 L |
| **`src/components/explorer/reels/ReelsSearchBar.tsx`** | Barra compacta de búsqueda predictiva con reseteo rápido. | ~45 L |
| **`src/components/explorer/reels/ReelsGrid.tsx`** | Contenedor de cuadrícula 3 columnas con scroll infinito y empty state. | ~70 L |
| **`src/components/explorer/reels/ReelCard.tsx`** | Tarjeta individual de video 9:16 con miniatura WebP y overlay de vistas. | ~60 L |
| **`src/components/explorer/reels/ReelPlayerModal.tsx`** | Reproductor inmersivo full-screen con capa `z-[1050]`, iframe sandbox y pestillo `hasIncrementedViewRef`. | ~95 L |
| **`src/components/explorer/reels/ReelActionCard.tsx`** | Tarjeta flotante inferior (*Glassmorphism*) con botón `[ 🛒 Ver Menú ]`. | ~65 L |
| **`src/app/admin/reels/page.tsx`** | Página principal de la Central de Fowy Reels (KPIs + Tabla de Negocios). | ~60 L |
| **`src/components/admin/reels/ReelsGlobalKPIs.tsx`** | Tarjetas de métricas globales (Videos, Vistas, Clics, Conversión, Top 5). | ~85 L |
| **`src/components/admin/reels/ReelsTrafficChart.tsx`** | Gráfica de reproducciones y clics al menú heredando `BusinessTrafficSvg`. | ~90 L |
| **`src/components/admin/reels/useReelsTrafficData.ts`** | Hook para calcular puntos temporales D/S/M globales o por negocio. | ~80 L |
| **`src/components/admin/reels/ReelsBusinessesTable.tsx`** | Tabla de comercios con buscador, métricas agregadas y botón `[ 🎬 ]`. | ~110 L |
| **`src/app/admin/reels/[businessId]/page.tsx`** | Página de gestión de videos por negocio específico. | ~70 L |
| **`src/components/admin/reels/ReelsBusinessGallery.tsx`** | Galería de tarjetas 9:16 con switch ON/OFF y empty state amigable. | ~80 L |
| **`src/components/admin/reels/AdminReelCard.tsx`** | Tarjeta visual 9:16 individual para administración de reel. | ~75 L |
| **`src/components/admin/reels/ReelFormModal.tsx`** | Cascarón del modal crear/editar, header, footer y botones. | ~75 L |
| **`src/components/admin/reels/ReelFormFields.tsx`** | Inputs de texto, selector Autocomplete (opcional) y validación de URL. | ~85 L |
| **`src/components/admin/reels/ReelThumbnailUploader.tsx`** | Zona drag & drop de portada, compresión WebP y preview. | ~70 L |
| **`src/components/admin/reels/useReelFormLogic.ts`** | Hook de estado, guardado y pre-asignación automática de `businessId`. | ~85 L |

---
*Documento consolidado, 100% atómico, escalable y blindado contra sobrecrecimiento de líneas.*
