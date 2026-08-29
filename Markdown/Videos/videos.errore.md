# 🚨 INFORME DE DIAGNÓSTICO & SOLUCIÓN — ERROR RPC EN FOWY REELS

> **Archivo:** `Markdown/Videos/videos.errore.md`  
> **Fecha:** 29 de Agosto de 2026  
> **Estado:** Diagnosticado con Causa Raíz y Solución Inmediata  

---

## 🎯 1. Resumen del Diagnóstico

El primer video ("Kaprichos en Vallegrande") fue **subido y publicado con total éxito** en el panel de administración (`/admin/reels`), confirmando que la base de datos, las tablas y las políticas de Storage funcionan al 100%.

El error que aparece en el explorador móvil (`/explorar`) al abrir el modal de Reels es un **desajuste estricto de tipos de datos en PostgreSQL PL/pgSQL**:

```text
POST https://exkyplxnyglpwomkunzk.supabase.co/rest/v1/rpc/get_reels_feed 400 (Bad Request)
code: '42804'
message: 'structure of query does not match function result type'
details: 'Returned type text does not match expected type character varying in column 9.'
```

---

## 🔬 2. Causa Raíz Técnica

1. En la tabla `businesses` de PostgreSQL, la columna `name` está definida como tipo de dato nativo `TEXT`.
2. En la firma del procedimiento almacenado `get_reels_feed`, la columna 9 de retorno (`RETURNS TABLE`) fue declarada como `business_name VARCHAR` en lugar de `business_name TEXT`.
3. El motor PL/pgSQL de PostgreSQL exige coincidencia de tipo 1:1 entre el `SELECT` interno y las columnas del `RETURNS TABLE`. Al encontrar `TEXT` en la consulta pero `VARCHAR` en la definición, aborta la ejecución con el código de error `42804`.

---

## 🛠️ 3. Solución Quirúrgica (SQL en Supabase)

Para corregirlo, simplemente se actualiza la firma del procedimiento `get_reels_feed` unificando todos los campos de texto como `TEXT` (estándar óptimo en PostgreSQL / Supabase).

### Script a ejecutar en el SQL Editor de Supabase:

```sql
-- 1. Eliminar la versión previa de la función
DROP FUNCTION IF EXISTS get_reels_feed;

-- 2. Crear la función con tipos de texto unificados (TEXT)
CREATE OR REPLACE FUNCTION get_reels_feed(
  user_lat DOUBLE PRECISION DEFAULT NULL,
  user_lng DOUBLE PRECISION DEFAULT NULL,
  filter_category_id UUID DEFAULT NULL,
  page_limit INTEGER DEFAULT 18,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  reel_id UUID,
  title TEXT,
  instagram_url TEXT,
  thumbnail_url TEXT,
  views_count INTEGER,
  clicks_to_menu_count INTEGER,
  created_at TIMESTAMPTZ,
  business_id UUID,
  business_name TEXT,
  business_slug TEXT,
  business_logo_url TEXT,
  business_category_id UUID,
  distance_meters DOUBLE PRECISION
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
    -- MODO CON GPS: Ordenado por proximidad espacial GiST (<->)
    RETURN QUERY
    SELECT 
      r.id AS reel_id,
      r.title::TEXT,
      r.instagram_url::TEXT,
      r.thumbnail_url::TEXT,
      r.views_count,
      r.clicks_to_menu_count,
      r.created_at,
      b.id AS business_id,
      b.name::TEXT AS business_name,
      b.slug::TEXT AS business_slug,
      b.logo_url::TEXT AS business_logo_url,
      b.category_id AS business_category_id,
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
    -- MODO FALLBACK SIN GPS: Ordenado por vistas y novedad
    RETURN QUERY
    SELECT 
      r.id AS reel_id,
      r.title::TEXT,
      r.instagram_url::TEXT,
      r.thumbnail_url::TEXT,
      r.views_count,
      r.clicks_to_menu_count,
      r.created_at,
      b.id AS business_id,
      b.name::TEXT AS business_name,
      b.slug::TEXT AS business_slug,
      b.logo_url::TEXT AS business_logo_url,
      b.category_id AS business_category_id,
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

-- 3. Re-otorgar permisos de ejecución para la API
GRANT EXECUTE ON FUNCTION get_reels_feed(DOUBLE PRECISION, DOUBLE PRECISION, UUID, INTEGER, INTEGER) TO anon, authenticated, service_role;
```

---

## ✅ 4. Resultado Esperado

Una vez ejecutado este script en Supabase:
1. El endpoint `rpc/get_reels_feed` responderá con código `200 OK`.
2. El modal del explorador móvil cargará inmediatamente el video publicado de "Kaprichos" con su miniatura 9:16, filtros y botones de acción.
