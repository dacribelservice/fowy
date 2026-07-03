# Bitácora - 3 de Junio

### 📌 Hito: Gestión de Menú de Negocios para Súper Administrador (Regla del Remolque)
- **Fecha**: 15 de Junio de 2026
- **Resumen**: Implementación de una vista completa de gestión de catálogo para el Súper Administrador, permitiendo controlar el inventario de cualquier negocio sin afectar la vista del dueño del negocio.
- **Detalles Técnicos**:
  - **Nueva Ruta de Administración**: Se creó una ruta exclusiva en `src/app/admin/negocios/[id]/catalogo/page.tsx` a la cual se accede desde un nuevo botón de "Tienda" en la tabla de negocios.
  - **Aplicación de la "Regla del Remolque"**: En lugar de modificar y comprometer la pantalla original del socio (`src/app/(partners)/business/menu/page.tsx`), se ensambló una nueva página desde cero importando los subcomponentes y hooks compartidos (`useProductManager`, `useCategoryManager`, `ProductFormModal`, etc.). Al inyectarles el `businessId` desde la URL del admin, se logra la misma funcionalidad pero desde un entorno completamente aislado.
  - **Actualización de Supabase y Políticas RLS**: Se actualizaron los tipos de Supabase (`src/types/supabase.ts`) usando la CLI y se aplicaron políticas de *Row Level Security* (RLS) en la base de datos que otorgan al rol `super_admin` los permisos necesarios (BYPASS) para gestionar de forma total las tablas `products`, `product_menu_categories` y `categories`.

### 📌 Hito: Solución Crítica de Redirección a WhatsApp en iOS (Safari/WebViews)
- **Fecha**: 20 de Junio de 2026
- **Resumen**: Se resolvió un bug donde Safari y WebViews de iOS bloqueaban la apertura de WhatsApp (popup block) al intentar enviar un pedido.
- **Detalles Técnicos**:
  - **Identificación de la causa raíz**: El problema se originaba por la política de *User Activation* de WebKit (iOS), que bloquea `window.open` si este ocurre después de operaciones asíncronas (`await` de lectura/escritura en Supabase).
  - **Patrón "Fire and Forget"**: Se removió el `await` en `useCheckoutLogic.ts` aislando el guardado en Supabase a una función en segundo plano, para no demorar la redirección a WhatsApp.
  - **Redirección Síncrona Segura**: Se sustituyó `window.open(..., "_blank")` por la asignación directa a `window.location.href`, garantizando la apertura instantánea de la app nativa de WhatsApp.

### 📌 Hito: Motor Central de Marketing y Banners Segmentados (Fase 5)
- **Fecha**: 2 de Julio de 2026
- **Resumen**: Implementación de la infraestructura de segmentación de banners por alcance (global, ciudad, negocio), carga automatizada interactiva con mapa, analíticas de clics de tráfico cruzado, y visualización móvil optimizada con caché y render diferido en el explorador.
- **Detalles Técnicos**:
  - **Base de Datos y Tipos**: Agregados campos de segmentación (`target_city`, `target_business_id`) y redirección a negocios (`destination_business_id`) en `marketing_banners`, y métrica de clics (`cross_traffic_clicks`) en `businesses`, sincronizando tipos en `supabase.ts` y creando el RPC `increment_cross_traffic`.
  - **Panel de Administración**: 
    - Integración de selector por pestañas (`BannerScopeSelector`) y autocompletador debounceado (`Autocomplete`) con 300ms de retardo.
    - Autocompletado inteligente de `link_url` basado en el slug invariantivo al seleccionar un negocio Fowy de destino.
    - Zero-Click UX en creación de negocios (`AddBusinessModal`) creando ubicación como nula y mostrando advertencia visual de `⚠️ Ubicación Pendiente` en el panel (`BusinessList`).
    - Geolocalización OSM inversa inteligente en `LocationPicker` con fuzzy matching contra `colombia.json` y fallback automático a autocomplete manual.
    - Integración de métrica de clics en tiempo real en `BusinessMetricsList`.
  - **Explorador y Performance**:
    - Nuevo hook asíncrono `useSegmentedBanners` usando `SWR` para caché y filtrado en JS de banners inactivos sin colapsar redirecciones externas.
    - Marquee infinito en `AutoScrollBanners` usando Framer Motion (`useAnimationFrame` + `useMotionValue` con wrapping reactivo) para soporte fluido de swipe táctil manual, pausa de 3s y reanudación a velocidad constante.
    - Carga dinámica diferida del bundle (`next/dynamic` con `ssr: false`) y renderizado bajo demanda utilizando `<LazyWrapper />` al hacer scroll.
    - Registro asíncrono sin bloqueo de tráfico cruzado previo a la redirección instantánea.

