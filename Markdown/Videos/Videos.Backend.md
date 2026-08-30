# ⚙️ FOWY REELS — ESPECIFICACIÓN TÉCNICA & MOTOR BACKEND

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Documento Maestro de Base de Datos, Procedimientos RPC, Seguridad y Escalabilidad**  
> **Autor:** Cristian (CEO de FOWY)  
> **Alineación:** [`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md), [`Markdown/proyecto.md`](file:///c:/Users/cange/Documents/fowy/Markdown/proyecto.md) y [`Markdown/Videos/Videos.UX-UI.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.UX-UI.md)  
> **Fecha:** 27 de Agosto de 2026  
> **Estado:** Listo para Implementación  

---

## 🗄️ 1. Modelo de Datos (PostgreSQL en Supabase)

### Tabla Principal: `business_reels`
Almacena los videos incrustados vinculados a cada restaurante sin sobrecargar la tabla `businesses`.

```sql
CREATE TABLE business_reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  instagram_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  clicks_to_menu_count INTEGER DEFAULT 0, -- Métrica de Oro (Conversiones al Menú)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de aceleración B-Tree
CREATE INDEX idx_business_reels_business_id ON business_reels(business_id);
CREATE INDEX idx_business_reels_active ON business_reels(is_active);
CREATE INDEX idx_business_reels_created_at ON business_reels(created_at DESC);
```

---

## ⚡ 2. Procedimiento Almacenado RPC: `get_reels_feed` (1 Solo RTT + Fallback sin GPS)

Para evitar múltiples viajes de red (Waterfall requests), se implementa una función PostgreSQL que consolida el video, datos del negocio y cálculo de distancia GPS en una sola respuesta JSON ultrarrápida (<15ms).

Soporta dos modos de ejecución automáticos:
1. **Modo con GPS:** Ordenamiento por cercanía geográfica mediante el operador espacial PostGIS GiST (`<->`).
2. **Modo Fallback sin GPS (Coordenadas NULL):** Ordenamiento por popularidad (`views_count DESC`) y novedad (`created_at DESC`), retornando `distance_meters = NULL` para alimentar la UI sin GPS documentada en [`Markdown/Videos/Videos.UX-UI.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Videos/Videos.UX-UI.md).

```sql
CREATE OR REPLACE FUNCTION get_reels_feed(
  user_lat DOUBLE PRECISION DEFAULT NULL,
  user_lng DOUBLE PRECISION DEFAULT NULL,
  filter_category_id UUID DEFAULT NULL,
  page_limit INTEGER DEFAULT 18,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  reel_id UUID,
  title VARCHAR,
  instagram_url TEXT,
  thumbnail_url TEXT,
  views_count INTEGER,
  clicks_to_menu_count INTEGER,
  created_at TIMESTAMPTZ,
  business_id UUID,
  business_name VARCHAR,
  business_slug VARCHAR,
  business_logo_url TEXT,
  business_category_id UUID,
  business_tags TEXT[],
  distance_meters DOUBLE PRECISION
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
    -- MODO CON GPS: Ordenado por proximidad geográfica con operador GiST (<->)
    RETURN QUERY
    SELECT 
      r.id AS reel_id,
      r.title,
      r.instagram_url,
      r.thumbnail_url,
      r.views_count,
      r.clicks_to_menu_count,
      r.created_at,
      b.id AS business_id,
      b.name AS business_name,
      b.slug AS business_slug,
      b.logo_url AS business_logo_url,
      b.category_id AS business_category_id,
      b.tags AS business_tags,
      ST_Distance(
        ST_SetSRID(ST_MakePoint(b.longitude, b.latitude), 4326)::geography, 
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
      ) AS distance_meters
    FROM business_reels r
    INNER JOIN businesses b ON r.business_id = b.id
    WHERE r.is_active = true 
      AND b.status = true
      AND b.latitude IS NOT NULL 
      AND b.longitude IS NOT NULL
      AND (filter_category_id IS NULL OR b.category_id = filter_category_id)
    ORDER BY 
      ST_SetSRID(ST_MakePoint(b.longitude, b.latitude), 4326) <-> ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326),
      r.created_at DESC
    LIMIT page_limit
    OFFSET page_offset;
  ELSE
    -- MODO FALLBACK SIN GPS (Permiso denegado / navegación sin ubicación):
    -- Ordenado por vistas y fecha reciente. distance_meters = NULL
    RETURN QUERY
    SELECT 
      r.id AS reel_id,
      r.title,
      r.instagram_url,
      r.thumbnail_url,
      r.views_count,
      r.clicks_to_menu_count,
      r.created_at,
      b.id AS business_id,
      b.name AS business_name,
      b.slug AS business_slug,
      b.logo_url AS business_logo_url,
      b.category_id AS business_category_id,
      b.tags AS business_tags,
      NULL::DOUBLE PRECISION AS distance_meters
    FROM business_reels r
    INNER JOIN businesses b ON r.business_id = b.id
    WHERE r.is_active = true 
      AND b.status = true
      AND (filter_category_id IS NULL OR b.category_id = filter_category_id)
    ORDER BY 
      r.views_count DESC,
      r.created_at DESC
    LIMIT page_limit
    OFFSET page_offset;
  END IF;
END;
$$;
```

---

## 🛡️ 3. Políticas de Seguridad RLS (Row Level Security) y Funciones RPC

```sql
ALTER TABLE business_reels ENABLE ROW LEVEL SECURITY;

-- 1. Lectura pública (Cualquier usuario o cliente anónimo puede ver videos activos)
CREATE POLICY "Public read active reels" 
ON business_reels 
FOR SELECT 
USING (is_active = true);

-- 2. Gestión exclusiva para Super Administrador
CREATE POLICY "Super admin full access on reels" 
ON business_reels 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
  )
);
```

### Funciones Atómicas RPC & Permisos de Ejecución:

```sql
-- 1. Métrica de Oro: Clics al Menú desde el Video
CREATE OR REPLACE FUNCTION increment_reel_menu_click(target_reel_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE business_reels 
  SET clicks_to_menu_count = clicks_to_menu_count + 1 
  WHERE id = target_reel_id;
END;
$$;

-- 2. Métrica de Vistas: Registro Atómico de Visualización al Reproducir
CREATE OR REPLACE FUNCTION increment_reel_view(target_reel_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE business_reels 
  SET views_count = views_count + 1 
  WHERE id = target_reel_id;
END;
$$;

-- 3. Permisos de Ejecución Pública (PostgREST / Supabase Client API)
GRANT EXECUTE ON FUNCTION get_reels_feed(DOUBLE PRECISION, DOUBLE PRECISION, UUID, INTEGER, INTEGER) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_reel_menu_click(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_reel_view(UUID) TO anon, authenticated, service_role;
```

> 🔒 **Patrón de Ejecución Frontend para Vistas (`hasIncrementedViewRef`)**:
> En el cliente React, la llamada a `increment_reel_view` se ejecuta en un `useEffect` con un pestillo booleano `useRef(false)` (`hasIncrementedViewRef`). Esto garantiza que la métrica se incremente exactamente **1 sola vez por apertura de video**, protegiendo la base de datos contra incrementos duplicados por re-renderizados internos del modal.

---

## 📦 4. Almacenamiento de Miniaturas (Supabase Storage)

* **Bucket:** `reels-thumbnails` (Acceso público para lectura).
* **Extensión de Tipos:** Se agrega `'reels-thumbnails'` al tipo `BucketName` en [`src/services/storageService.ts`](file:///c:/Users/cange/Documents/fowy/src/services/storageService.ts).
* **Política de Subida:** Restringida al rol `super_admin`.
* **Formato Estricto:** Imágenes WebP comprimidas (< 35 KB por miniatura, relación 9:16).
* **Limpieza Automática:** Al editar una miniatura o eliminar un reel, se invoca `storageService.deleteFileByUrl` para no dejar imágenes huérfanas en el bucket.

---

## 📜 5. Contratos de Tipos & Sanitización TypeScript

### 5.1. Tipos de Datos (`src/types/reels.ts`)
```typescript
export interface BusinessReel {
  id: string;
  businessId: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  viewsCount: number;
  clicksToMenuCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReelFeedItem {
  reelId: string;
  title: string;
  instagramUrl: string;
  thumbnailUrl: string;
  viewsCount: number;
  clicksToMenuCount: number;
  createdAt: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  businessLogoUrl: string | null;
  businessCategoryId: string | null; // Para filtrado reactivo cruzado en cliente
  distanceMeters: number | null; // null cuando se navega en modo fallback sin GPS
}

/** Resumen de métricas de Reels por negocio para la tabla de /admin/reels */
export interface BusinessReelsSummary {
  businessId: string;
  businessName: string;
  businessSlug: string;
  businessLogoUrl: string | null;
  businessCity: string | null;
  status: boolean;
  totalReels: number;
  totalViews: number;
  totalClicksToMenu: number;
}

/** Métricas globales consolidadas para la cabecera de /admin/reels */
export interface AdminReelsGlobalStats {
  totalActiveReels: number;
  totalViews: number;
  totalClicksToMenu: number;
  globalConversionRate: number;
  topBusinesses: {
    businessId: string;
    businessName: string;
    totalViews: number;
  }[];
}
```

### 5.2. Utilidad de Sanitización & Normalización de URLs (`src/utils/instagram.ts`)
Limpia parámetros de tracking (`?igsh=...`, `?utm_source=...`) y extrae el shortcode único de Instagram para soportar enlaces `/reel/`, `/reels/` y `/p/`:

```typescript
/**
 * Expresión regular robusta para URLs de Instagram (Reels y Posts)
 */
export const INSTAGRAM_REEL_REGEX = /(?:instagram\.com\/(?:reel|reels|p)\/|instagr\.am\/(?:reel|reels|p)\/)([A-Za-z0-9_-]+)/i;

/**
 * Extrae el código corto único de 11 caracteres de Instagram
 */
export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const match = url.match(INSTAGRAM_REEL_REGEX);
  return match ? match[1] : null;
}

/**
 * Normaliza cualquier enlace de Instagram a su formato canónico limpio
 */
export function sanitizeInstagramUrl(rawUrl: string): string {
  const shortcode = extractInstagramShortcode(rawUrl);
  if (!shortcode) throw new Error("URL de Instagram inválida. Debe ser un Reel o Publicación.");
  return `https://www.instagram.com/reel/${shortcode}/`;
}

/**
 * Genera la URL optimizada para renderizar en el Iframe seguro
 */
export function getInstagramEmbedUrl(rawOrCleanUrl: string): string {
  const shortcode = extractInstagramShortcode(rawOrCleanUrl);
  if (!shortcode) return "";
  return `https://www.instagram.com/reel/${shortcode}/embed/`;
}
```

### 5.3. Mapeo Explícito de Tipos RPC (`snake_case` DB ➔ `camelCase` TS)
Dado que el procedimiento PostgreSQL retorna identificadores en `snake_case`, el hook [`src/hooks/useReelsFeed.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useReelsFeed.ts) mapea explícitamente cada registro al contrato `ReelFeedItem`:

```typescript
const mappedItems: ReelFeedItem[] = (rawRpcData || []).map((raw: any) => ({
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
  businessLogoUrl: raw.business_logo_url,
  businessCategoryId: raw.business_category_id,
  distanceMeters: raw.distance_meters !== null ? Number(raw.distance_meters) : null
}));
```

---

## ⚡ 6. Estrategia de Rendimiento para 100.000+ Usuarios

1. **Cero Consumo de Ancho de Banda de Video:** FOWY no almacena ni transmite video crudo ($0 costo en CDN).
2. **Índice GiST `idx_businesses_geo_location`:** Búsquedas por cercanía espacial ejecutadas a nivel binario en PostgreSQL.
3. **Caché en Cliente con SWR:** 5 minutos de revalidación en memoria RAM para navegación instantánea (0ms).
4. **Resiliencia de Conexión:** Si el usuario no tiene GPS, el RPC conmuta a ordenamiento B-Tree por vistas/fecha sin penalizar tiempo de respuesta (<15ms).
5. **Arquitectura Híbrida de Filtrado por Categoría:**
   - **En RAM (60 FPS):** Filtrado reactivo instantáneo (`useMemo`) sobre el feed activo para máxima fluidez táctil sin latencia de red.
   - **En Servidor SQL (`filter_category_id`):** Si se requiere paginación aislada por categoría o si el usuario busca agotar la totalidad de videos de un rubro específico, el RPC `get_reels_feed` procesa la cláusula `(filter_category_id IS NULL OR b.category_id = filter_category_id)` directamente en PostgreSQL.
