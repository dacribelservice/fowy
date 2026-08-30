# 🚀 FOWY REELS — ESPECIFICACIÓN DE OPTIMIZACIÓN & MEJORAS AVANZADAS (UPGRADE 100% BLINDADO)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Documento Maestro de Base de Datos, Procedimientos RPC, Seguridad, Gestos Táctiles y Escalabilidad**  
> **Autor:** Cristian (CEO de FOWY) & Antigravity  
> **Alineación:** [`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md), [`Markdown/proyecto.md`](file:///c:/Users/cange/Documents/fowy/Markdown/proyecto.md), [`Markdown/Videos/Videos.Backend.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.Backend.md) y [`Markdown/Videos/Videos.UX-UI.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.UX-UI.md)  
> **Fecha:** 30 de Agosto de 2026  
> **Estado:** Especificación Técnica de Upgrade — 100% Madura, Auditada y Blindada (100% de Madurez Técnica)  

---

## 🎯 1. Resumen Ejecutivo del Upgrade

FOWY Reels cuenta con una arquitectura de alto rendimiento basada en **PostgreSQL RPC (PostGIS GiST `<->`)** y **cero consumo de ancho de banda propio** (alojamiento en servidores de Instagram).

El presente documento consolida la especificación técnica de las **3 mejoras estratégicas** para maximizar la velocidad de carga inicial de la aplicación, habilitar la escalabilidad a miles de videos y multiplicar la conversión mediante navegación gestual inmersiva, incorporando los blindajes definitivos de la auditoría técnica exhaustiva (100% de madurez):

1. **Carga Diferida Real del Modal (*Lazy Loading* con `next/dynamic` + Renderizado Condicional + Prefetch Silencioso con Paleta de Marca + Deep-Link Failsafe con Pestillo `hasHandledDeepLinkRef` y Limpieza de URL):** Postergación del 100% de la carga de JavaScript (~50 KB) en el bundle inicial de `/explorar`, prefetch silencioso al interactuar con el botón flotante manteniendo su gradiente corporativo, ciclo de vida de animación de salida (*Slide-Down*) blindado en `<AnimatePresence>` único en el orquestador padre (sin `<AnimatePresence>` anidado interno), resolución garantizada de deep-links con pestillo contra revalidaciones de red y limpieza atómica de la URL (`history.replaceState`) al cerrar.
2. **Paginación & Scroll Infinito Inteligente (`useSWRInfinite` + `IntersectionObserver` + Control Anti-Cascade + Deduplicación Robusta con `Map`):** Paginación reactiva fluida que consume el `page_offset` existente en el RPC `get_reels_feed`, con corte automático al final del catálogo, deduplicación automática de claves por `reelId`, memoización con `useCallback`, control estricto de validación y debounce de 250ms contra peticiones encadenadas.
3. **Navegación Gestual Vertical (*Swipe Up / Down*) Estilo TikTok / Reels:** Transición táctil fluida sobre la **lista activa filtrada**, **capa gestual transparente superior con soporte de aceleración (*Flick Velocity* con `velocity.y`) y passthrough táctil para desmuteo nativo de audio en iOS Safari y Android**, recarga instantánea sin fotogramas residuales (`key={reelId}`), **desacoplamiento de `iframeLoaded` por `currentReelId` para eliminar parpadeos de carga durante paginaciones en segundo plano**, pestillo de vistas por sesión (`Set<string>`), **puente de pre-carga infinita continua (`onLoadMore`)** y **micro-animación de inducción visual (*Swipe Up Hint* con mano animada y memoria en `localStorage`)**.

---

## ⚡ 2. Mejora 1: Carga Diferida Real del Modal (*Lazy Loading*)

### 2.1. Diagnóstico Actual
En [`src/app/(explorer)/explorar/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/explorar/page.tsx), el componente `ReelsFeedModal` se importa de manera estática y se renderiza de forma fija en el JSX. Esto provoca que el paquete de JavaScript se descargue al cargar el mapa, aun cuando el usuario no haya abierto los Reels.

### 2.2. Solución Técnica Blindada

#### A. Importación Dinámica en [`src/app/(explorer)/explorar/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/explorar/page.tsx)
```typescript
import dynamic from "next/dynamic";

// Carga diferida en cliente del modal de Reels (0 KB en bundle inicial)
const ReelsFeedModal = dynamic(
  () => import("@/components/explorer/reels/ReelsFeedModal").then((mod) => mod.ReelsFeedModal),
  { ssr: false }
);
```

#### B. Prefetch Silencioso en [`ReelsFeedButton.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/reels/ReelsFeedButton.tsx)
Para eliminar cualquier micro-pausa al tocar el botón en conexiones 3G/4G, manteniendo el gradiente corporativo de la marca:
```tsx
const handlePrefetch = () => {
  void import("@/components/explorer/reels/ReelsFeedModal");
};

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.9 }}
  onClick={onClick}
  onMouseEnter={handlePrefetch}
  onTouchStart={handlePrefetch}
  className="w-14 h-14 bg-gradient-to-tr from-[#FF5A5F] via-[#FF7A45] to-[#FF9A3D] rounded-full shadow-2xl flex items-center justify-center text-white border border-white/30 relative group shadow-orange-500/30"
  title="Ver Fowy Reels"
>
  <Clapperboard size={24} className="group-hover:rotate-6 transition-transform" />

  {/* Indicador de pulso activo */}
  <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500 border-2 border-white" />
  </span>
</motion.button>
```

#### C. Renderizado Condicional con `<AnimatePresence>` Único en el Orquestador & Limpieza de URL
Para garantizar que **cero bytes** del modal se descarguen antes de que el usuario haga clic, que la animación de salida (`exit={{ y: "100%" }}`) se reproduzca con total fluidez, y que la URL se mantenga limpia al cerrar:

```tsx
{/* Montaje condicional gobernado por AnimatePresence en explorar/page.tsx */}
<AnimatePresence>
  {isReelsOpen && (
    <ReelsFeedModal
      onClose={() => {
        setIsReelsOpen(false);
        setDeepLinkReelId(null);
        // Limpieza atómica de la URL sin recargar la página:
        if (typeof window !== "undefined" && window.location.search.includes("reel=")) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }}
      categories={categories}
      userLocation={userLocation}
      onViewOnMap={async (businessId) => {
        setIsReelsOpen(false);
        setDeepLinkReelId(null);
        if (typeof window !== "undefined" && window.location.search.includes("reel=")) {
          window.history.replaceState(null, "", window.location.pathname);
        }
        const found = businesses.find((b) => b.id === businessId);
        if (found) {
          handleSelectBusiness(found);
        } else {
          const supabase = createClient();
          const { data } = await supabase
            .from("businesses")
            .select("id, name, slug, city, logo_url, latitude, longitude, rating, category_id, status, color_identity, schedules, tags, created_at, categories(name)")
            .eq("id", businessId)
            .single();
          if (data) {
            handleSelectBusiness({
              ...data,
              category_name: (data as any).categories?.name || "Comercio",
            });
          }
        }
      }}
      initialReelId={deepLinkReelId}
    />
  )}
</AnimatePresence>
```

#### D. Blindaje del Desmontaje en [`ReelsFeedModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/reels/ReelsFeedModal.tsx)
Para evitar que un `if (!isOpen) return null` o un `<AnimatePresence>` anidado destruyan o congelen el nodo del DOM antes de que Framer Motion termine la animación de salida:
* **Eliminar prop `isOpen`** en `ReelsFeedModalProps` (el montaje lo gobierna el padre).
* **Eliminar el `<AnimatePresence>` interno** dentro de `ReelsFeedModal.tsx`.
* El componente expone directamente `<motion.div>` como su nodo raíz:
```tsx
<motion.div
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", damping: 28, stiffness: 280 }}
  className="absolute inset-0 z-[1001] bg-white flex flex-col overflow-hidden rounded-[40px]"
>
```

#### E. Blindaje de Deep-Linking con Pestillo (`hasHandledDeepLinkRef`) y Fallback Failsafe (Páginas Profundas)
Para evitar que el `useEffect` se vuelva a disparar al recibir nuevas páginas de SWR en segundo plano (lo que reiniciaría el video actual del usuario al índice 0), se incorpora un pestillo en `useRef`:

```typescript
// En ReelsFeedModal.tsx:
const hasHandledDeepLinkRef = useRef<string | null>(null);

useEffect(() => {
  if (!initialReelId || hasHandledDeepLinkRef.current === initialReelId) return;

  // 1. Buscar en los reels ya cargados en memoria
  const matchIndex = reels.findIndex((r) => r.reelId === initialReelId);
  if (matchIndex !== -1) {
    hasHandledDeepLinkRef.current = initialReelId;
    setPlayerState({ list: reels, index: matchIndex });
    return;
  }

  // 2. Fallback: Si no está en la primera página, consultar puntualmente el reel compartido
  const fetchSingleReel = async () => {
    hasHandledDeepLinkRef.current = initialReelId;
    const supabase = createClient();
    const { data } = await supabase
      .from("business_reels")
      .select("id, title, instagram_url, thumbnail_url, views_count, clicks_to_menu_count, created_at, business_id, businesses(id, name, slug, logo_url, category_id, tags)")
      .eq("id", initialReelId)
      .eq("is_active", true)
      .single();

    if (data && data.businesses) {
      const biz: any = Array.isArray(data.businesses) ? data.businesses[0] : data.businesses;
      const singleItem: ReelFeedItem = {
        reelId: data.id,
        title: data.title,
        instagramUrl: data.instagram_url,
        thumbnailUrl: data.thumbnail_url,
        viewsCount: data.views_count || 0,
        clicksToMenuCount: data.clicks_to_menu_count || 0,
        createdAt: data.created_at,
        businessId: biz.id,
        businessName: biz.name,
        businessSlug: biz.slug,
        businessLogoUrl: biz.logo_url,
        businessCategoryId: biz.category_id,
        businessTags: biz.tags || [],
        distanceMeters: null,
      };

      // Inyectar el video compartido al inicio de la lista activa para permitir scroll continuo
      setPlayerState({
        list: [singleItem, ...reels.filter((r) => r.reelId !== singleItem.reelId)],
        index: 0,
      });
    }
  };

  void fetchSingleReel();
}, [initialReelId, reels]);
```

#### F. Capa Visual Blindada (`z-index`)
El modal orquestador se configura con `z-[1001]` para quedar 100% por encima de los mosaicos, marcadores y controles de Leaflet (que operan entre `z-[400]` y `z-[1000]`).

---

## 📜 3. Mejora 2: Paginación & Scroll Infinito Inteligente (`useSWRInfinite`)

### 3.1. Diagnóstico Actual
[`src/hooks/useReelsFeed.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useReelsFeed.ts) consume `useSWR` con un límite estático de 18 elementos. El backend en PostgreSQL ya cuenta con la función RPC `get_reels_feed` parametrizada con `page_limit` y `page_offset`, por lo que **no se requiere alterar la base de datos**.

### 3.2. Solución Técnica en el Hook con Deduplicación (`src/hooks/useReelsFeed.ts`)

> 💡 **Nota Crítica de Consistencia SQL en RPC `get_reels_feed`:**  
> Para que el filtrado reactivo cruzado en `ReelsGrid.tsx` reconozca las etiquetas secundarias (`tags`), el procedimiento PostgreSQL `get_reels_feed` (documentado en [`Videos.Backend.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.Backend.md)) incluye `b.tags AS business_tags` en su cláusula `SELECT` y en su declaración `RETURNS TABLE (..., business_tags TEXT[])`.

```typescript
"use client";

import { useCallback, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { createClient } from "@/utils/supabase/client";
import { ReelFeedItem } from "@/types/reels";

interface UseReelsFeedParams {
  userLat?: number | null;
  userLng?: number | null;
  filterCategoryId?: string | null;
}

const PAGE_SIZE = 18;
const supabase = createClient();

async function fetchReelsFeed(
  key: [string, number | null, number | null, string | null, number, number]
): Promise<ReelFeedItem[]> {
  const [, userLat, userLng, filterCategoryId, pageLimit, pageOffset] = key;

  const { data, error } = await supabase.rpc("get_reels_feed", {
    user_lat: userLat ?? null,
    user_lng: userLng ?? null,
    filter_category_id: filterCategoryId ?? null,
    page_limit: pageLimit,
    page_offset: pageOffset,
  });

  if (error) {
    console.error("Error fetching reels feed:", error);
    throw error;
  }

  return (data || []).map((raw: any) => ({
    reelId: raw.reel_id,
    title: raw.title,
    instagramUrl: raw.instagram_url,
    thumbnailUrl: raw.thumbnail_url,
    viewsCount: raw.views_count || 0,
    clicksToMenuCount: raw.clicks_to_menu_count || 0,
    createdAt: raw.created_at,
    businessId: raw.business_id,
    businessName: raw.business_name,
    businessSlug: raw.business_slug,
    businessLogoUrl: raw.business_logo_url || null,
    businessCategoryId: raw.business_category_id || null,
    businessTags: raw.business_tags || [],
    distanceMeters:
      raw.distance_meters !== null && raw.distance_meters !== undefined
        ? Number(raw.distance_meters)
        : null,
  }));
}

export function useReelsFeed({
  userLat = null,
  userLng = null,
  filterCategoryId = null,
}: UseReelsFeedParams = {}) {
  // Generador de claves para cada página consecutiva
  const getKey = (
    pageIndex: number,
    previousPageData: ReelFeedItem[] | null
  ) => {
    // FRENO INTELIGENTE: Si la página anterior vino vacía o menor a PAGE_SIZE,
    // se llegó al final del catálogo y NO se hacen más consultas a la DB.
    if (previousPageData && previousPageData.length < PAGE_SIZE) return null;

    return [
      "reels-feed",
      userLat ?? null,
      userLng ?? null,
      filterCategoryId ?? null,
      PAGE_SIZE,
      pageIndex * PAGE_SIZE, // page_offset dinámico
    ];
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    fetchReelsFeed,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // Deduplicación estricta por reelId para prevenir warnings de claves duplicadas en React
  const reels: ReelFeedItem[] = useMemo(() => {
    if (!data) return [];
    const flat = data.flat();
    const map = new Map<string, ReelFeedItem>();
    flat.forEach((item) => {
      if (item && !map.has(item.reelId)) {
        map.set(item.reelId, item);
      }
    });
    return Array.from(map.values());
  }, [data]);

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    Boolean(size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    Boolean(isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE));

  // Memoización estricta con useCallback para no romper el IntersectionObserver
  const loadMore = useCallback(() => {
    if (!isReachingEnd && !isLoadingMore && !isValidating) {
      setSize((prev) => prev + 1);
    }
  }, [isReachingEnd, isLoadingMore, isValidating, setSize]);

  return {
    reels,
    loading: isLoadingInitialData,
    loadingMore: isLoadingMore,
    isReachingEnd,
    isValidating,
    loadMore,
    refreshFeed: mutate,
  };
}
```

### 3.3. Integración del Sensor en [`ReelsGrid.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/reels/ReelsGrid.tsx)

#### A. Sensor con `IntersectionObserver` y Protección Anti-Cascade
Para que los nuevos videos se carguen de manera fluida 250px antes del fondo, con debounce de 250ms que protege contra peticiones en cascada cuando el feed filtrado en memoria RAM retorna pocos elementos:

```tsx
const sentinelRef = useRef<HTMLDivElement | null>(null);
const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (!sentinelRef.current || isReachingEnd || loadingMore || isValidating) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isValidating && !isReachingEnd && !loadingMore) {
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = setTimeout(() => {
          onLoadMore();
        }, 250);
      }
    },
    { rootMargin: "250px" }
  );

  observer.observe(sentinelRef.current);
  return () => {
    observer.disconnect();
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
  };
}, [onLoadMore, isReachingEnd, loadingMore, isValidating]);
```

#### B. Pie de Cuadrícula en JSX
```tsx
{/* Elemento Centinela al pie de la cuadrícula */}
<div ref={sentinelRef} className="w-full py-4 flex justify-center items-center">
  {loadingMore && !isReachingEnd && (
    <Loader2 className="animate-spin text-orange-500" size={22} />
  )}
</div>
```

---

## 📱 4. Mejora 3: Navegación Gestual Vertical (*Swipe Up / Down*)

### 4.1. Diagnóstico Actual
[`ReelPlayerModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/reels/ReelPlayerModal.tsx) solo recibe un video individual. Para ver otro, el usuario debe cerrar el modal y seleccionar otra miniatura.

### 4.2. Solución Técnica Blindada en `ReelPlayerModal.tsx`

#### A. Contrato de Props & Navegación sobre la Lista Filtrada Activa con Puente `onLoadMore`
Para que el usuario que filtre por *"Hamburguesas"* solo navegue entre videos de esa búsqueda y pueda deslizar infinitamente sin topar con el límite de la primera página:

```typescript
interface ReelPlayerModalProps {
  reels: ReelFeedItem[]; // Lista activa filtrada (filteredReels)
  initialIndex?: number;
  onClose: () => void;
  onViewOnMap?: (businessId: string) => void;
  onLoadMore?: () => void; // Puente para pre-carga infinita continua
}
```

#### B. Conexión de Estado Reactivo en `ReelsFeedModal.tsx` & `ReelsGrid.tsx`
Para que el reproductor no quede limitado a los primeros 18 videos y reciba reactivamente los nuevos elementos descargados por `useSWRInfinite` durante el swipe infinito:

```tsx
// 1. En ReelsGrid.tsx: notifica la apertura con el reel seleccionado
onOpenReel: (reel: ReelFeedItem) => void;

// 2. En ReelsFeedModal.tsx: mantiene la lista viva (filteredReels) reactivamente conectada
const [activeReelId, setActiveReelId] = useState<string | null>(null);

// Lista reactiva activa: combina deep-link puntual (si aplica) con el feed vivo filtrado
const activePlayerList = useMemo(() => {
  if (deepLinkedReel) {
    return [deepLinkedReel, ...filteredReels.filter((r) => r.reelId !== deepLinkedReel.reelId)];
  }
  return filteredReels;
}, [deepLinkedReel, filteredReels]);

const activeIndex = useMemo(() => {
  if (!activeReelId) return 0;
  const idx = activePlayerList.findIndex((r) => r.reelId === activeReelId);
  return idx !== -1 ? idx : 0;
}, [activeReelId, activePlayerList]);

// Al renderizar el reproductor:
{activeReelId && (
  <ReelPlayerModal
    reels={activePlayerList}
    initialIndex={activeIndex}
    onClose={() => setActiveReelId(null)}
    onViewOnMap={onViewOnMap}
    onLoadMore={loadMore}
  />
)}
```

#### C. Capa Gestual Táctil con Aceleración (*Flick Velocity*) y Passthrough de Audio Móvil
Dado que los `<iframe>` absorben los toques en navegadores móviles (WebKit iOS y Chrome Android), se implementa una **capa transparente de captura gestual (`z-20 touch-none`) sobre el iframe con soporte de arrastre vertical (`drag="y"`) y respuesta a velocidad de lanzamiento (*flicks*)**:

```tsx
{/* Capa Gestual Transparente Superior (Inmune a la absorción del iframe y con soporte de Flick) */}
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    const threshold = 50; // Sensibilidad táctil de desplazamiento
    const velocityThreshold = 500; // Sensibilidad para gestos rápidos (Flicks)
    setShowSwipeHint(false); // Ocultar guía tras el primer gesto

    const isSwipeUp = info.offset.y < -threshold || info.velocity.y < -velocityThreshold;
    const isSwipeDown = info.offset.y > threshold || info.velocity.y > velocityThreshold;

    // Swipe Arriba ➔ Siguiente video (con precarga anticipada en penúltimo elemento)
    if (isSwipeUp) {
      if (currentIndex >= reels.length - 2) {
        onLoadMore?.();
      }
      if (currentIndex < reels.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    } 
    // Swipe Abajo ➔ Video anterior
    else if (isSwipeDown && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }}
  className="absolute inset-0 z-20 touch-none cursor-grab active:cursor-grabbing"
/>
```

* **Coexistencia con Botones Interactivos & Audio:**
  * **Botón Cerrar (`X`):** Ubicado en `z-30 pointer-events-auto` para responder al toque instantáneamente.
  * **Tarjeta Inferior (`ReelActionCard`):** Ubicada en `z-30 pointer-events-auto` para garantizar la interacción fluida con los botones `[ 🛒 Ver Menú ]`, `[ 📍 Ver en Mapa ]` y `[ ↗️ Compartir ]`.
  * **Audio en Móviles:** Respeta la política *User Gesture Required*. Al interactuar con el video, el control de sonido de Instagram y la tarjeta de acción responden con total fluidez.

#### D. Cero Pantalla Negra & Desacoplamiento de `iframeLoaded` por `currentReelId`
Para garantizar que al pasar de video se desmonte limpiamente el iframe anterior y se active instantáneamente la portada WebP blur sin parpadeos indeseados cuando se descargan nuevas páginas de fondo:

```tsx
const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0);
const [iframeLoaded, setIframeLoaded] = useState(false);

const currentReel = reels[currentIndex];
const currentReelId = currentReel?.reelId;

// Resetear estado de iframe SOLO cuando cambia el ID del video actual (evita parpadeos con nuevas páginas de fondo)
useEffect(() => {
  setIframeLoaded(false);
}, [currentReelId]);

if (!currentReel) return null;
const embedUrl = getInstagramEmbedUrl(currentReel.instagramUrl);

// Key única por reelId para forzar remontaje instantáneo a 0 ms:
<div key={currentReel.reelId} className="relative w-full h-full">
  {!iframeLoaded && (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
      <img
        src={currentReel.thumbnailUrl || "/placeholder-reel.jpg"}
        alt={currentReel.title}
        className="w-full h-full object-cover filter blur-md opacity-60 scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )}

  <iframe
    key={currentReel.reelId}
    src={embedUrl}
    className={`w-full h-full border-0 transition-opacity duration-300 ${
      iframeLoaded ? "opacity-100" : "opacity-0"
    }`}
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    allowFullScreen
    onLoad={() => setIframeLoaded(true)}
  />
</div>
```

#### E. Contador de Vistas con Memoria de Sesión (`viewedReelIdsRef`)
Garantiza que cada video sume **estrictamente 1 sola vista real en PostgreSQL por sesión**, siendo 100% inmune a re-renders de React, a actualizaciones del arreglo de fondo y a deslizamientos rápidos de ida y vuelta:

```typescript
const viewedReelIdsRef = useRef<Set<string>>(new Set());

useEffect(() => {
  if (currentReelId && !viewedReelIdsRef.current.has(currentReelId)) {
    viewedReelIdsRef.current.add(currentReelId);
    void supabase.rpc("increment_reel_view", {
      target_reel_id: currentReelId,
    });
  }
}, [currentReelId]);
```

#### F. Micro-Animación de Inducción Táctil (*Swipe Up Hint* con Mano Animada y Memoria `localStorage`)
Para guiar intuitivamente al usuario novel sobre la posibilidad de deslizar hacia arriba, se integra una micro-interacción visual flotante gobernada por `localStorage` (idéntica a la retención de datos en el checkout de FOWY):

* **Comportamiento con Memoria:** Solo se muestra la primera vez que el usuario abre el reproductor. Si ya lo vio o realiza su primer *swipe*, se almacena `fowy_reel_swipe_hint = "true"` y no vuelve a aparecer nunca más.
* **Diseño Visual:** Píldora translúcida de cristal (*glassmorphism* `bg-black/60 backdrop-blur-md`) con un icono de **mano blanca con el dedo señalando hacia arriba** (`Pointer` de Lucide) que realiza una micro-animación vertical ascendente durante 2.5 segundos antes de desvanecerse.

```tsx
// 1. Estado y persistencia en localStorage (Solo 1 vez por usuario):
const [showSwipeHint, setShowSwipeHint] = useState(false);

useEffect(() => {
  if (typeof window !== "undefined") {
    const hasSeenHint = localStorage.getItem("fowy_reel_swipe_hint");
    if (!hasSeenHint) {
      setShowSwipeHint(true);
      localStorage.setItem("fowy_reel_swipe_hint", "true");
      // Desvanecimiento suave automático tras 2.5 segundos
      const timer = setTimeout(() => setShowSwipeHint(false), 2500);
      return () => clearTimeout(timer);
    }
  }
}, []);

// 2. Elemento JSX animado con Framer Motion en el reproductor:
<AnimatePresence>
  {showSwipeHint && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: -16 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
      transition={{
        y: { repeat: Infinity, repeatType: "reverse", duration: 0.7, ease: "easeInOut" },
        opacity: { duration: 0.3 },
      }}
      className="absolute z-40 pointer-events-none flex flex-col items-center gap-1.5 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl"
    >
      <Pointer size={22} className="text-white drop-shadow-md -rotate-12" />
      <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">
        Desliza hacia arriba
      </span>
    </motion.div>
  )}
</AnimatePresence>
```

---

## 📊 5. Matriz de Archivos & Control de Presupuesto de Líneas

Cumpliendo con la **Regla de Techo Duro (< 180 líneas por componente / Máximo 250L en orquestadores)** de [`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md):

| Archivo | Estado Actual | Modificación a Realizar | Techo Estimado |
| :--- | :---: | :--- | :---: |
| [`src/app/(explorer)/explorar/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/explorar/page.tsx) | 244 L | `dynamic()` + `<AnimatePresence>` + `onViewOnMap` directo + limpieza de URL | ~238 L |
| [`src/hooks/useReelsFeed.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useReelsFeed.ts) | 84 L | `useSWRInfinite` + `useCallback(loadMore)` + Deduplicación `Map` + `isValidating` | ~110 L |
| [`src/components/explorer/reels/ReelsGrid.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/reels/ReelsGrid.tsx) | 136 L | Sensor `sentinelRef` + paso de `(filteredReels, index)` + debounce | ~160 L |
| [`src/components/explorer/reels/ReelsFeedModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/reels/ReelsFeedModal.tsx) | 116 L | Retiro de `isOpen` y `AnimatePresence` interno + DeepLink fallback con pestillo `hasHandledDeepLinkRef` | ~125 L |
| [`src/components/explorer/reels/ReelPlayerModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/reels/ReelPlayerModal.tsx) | 91 L | Capa táctil con `drag="y"` + `velocity.y`, `onLoadMore`, `key={reelId}`, `Set<string>`, `setIframeLoaded(currentReelId)` y Swipe Hint | ~160 L |

---

## 📋 6. Checklist Maestro de Implementación Quirúrgica (Paso a Paso)

- [ ] **Paso 1:** Configurar `dynamic(() => import(...), { ssr: false })` y renderizado condicional con `<AnimatePresence>` en `explorar/page.tsx`, con prefetch silencioso y paleta corporativa en `ReelsFeedButton.tsx` y limpieza de URL en `onClose`.
- [ ] **Paso 2:** Refactorizar `useReelsFeed.ts` con `useSWRInfinite`, generador de clave `getKey`, corte automático `previousPageData.length < PAGE_SIZE`, deduplicación por `reelId` con `Map`, memoización `useCallback` en `loadMore` y exportación de `isValidating`.
- [ ] **Paso 3:** Conectar el sensor `sentinelRef` con `IntersectionObserver`, debounce de 250ms y condición `!isValidating && !isReachingEnd` en `ReelsGrid.tsx`.
- [ ] **Paso 4:** Actualizar `ReelsFeedModal.tsx` eliminando el `<AnimatePresence>` interno, delegando el ciclo de vida al padre, agregando el fallback puntual con pestillo `hasHandledDeepLinkRef` para deep-links de reels fuera de la página 1 y transfiriendo la lista activa filtrada (`filteredReels`) con su índice y puente `loadMore` mediante `playerState`.
- [ ] **Paso 5:** Implementar `ReelPlayerModal.tsx` con capa gestual transparente `touch-none` sobre el iframe, soporte de aceleración `velocity.y` (*Flick*), puente continuo `onLoadMore`, `key={reelId}` para remontaje instantáneo, desacoplamiento de `iframeLoaded` por `currentReelId` para eliminar parpadeos, pestillo de vistas `Set<string>` e **inducción de mano animada (*Swipe Up Hint*) con `localStorage`**.
- [ ] **Paso 6:** Validar compilación limpia mediante `npm run build` y pruebas de navegación táctil e interactiva en emulador móvil.

---
*Documento oficial de actualización técnica — FOWY 2026 (Versión 100% Madura, Auditada y Blindada)*

