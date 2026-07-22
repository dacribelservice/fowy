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

### 📌 Hito: Formulario de Envío — Campo Barrio y Ajustes de Domicilio
- **Fecha**: 13 de Julio de 2026
- **Resumen**: Implementación del campo de texto obligatorio "Barrio" en el checkout del explorador, mapeo seguro en base de datos y modificación de la plantilla del mensaje de WhatsApp para reflejar el Barrio y actualizar el domicilio.
- **Detalles Técnicos**:
  - **Formulario (UI)**: Se modificó `CheckoutFormView.tsx` y `useCheckoutLogic.ts` para crear el estado `customerNeighborhood` y renderizar un campo de entrada premium arriba de "Dirección de Entrega".
  - **Plantilla de WhatsApp**: Se inyectó la línea `🏘️ Barrio: [dato]` y se modificó `🛵 + Domicilio` por `🛵 Sin Domicilio` en `useCheckoutLogic.ts`.
  - **Persistencia (Supabase)**: Para no modificar la base de datos ni generar migraciones de esquema innecesarias, se concatenaron los campos en el backend del cliente (`"Barrio: [dato] - Dirección: [dato]"`) al rellenar la columna `delivery_address` en Supabase.

### 📌 Hito: Distancia Dinámica en Menú y Navegación a Google Maps (Fase 6)
- **Fecha**: 13 de Julio de 2026
- **Resumen**: Integración de la persistencia de ubicación en `localStorage` para calcular la distancia real en la vista del menú (incluso en visitas directas o recargas de página) y conversión del indicador de distancia en un enlace de navegación directa a Google Maps con ruta trazada.
- **Detalles Técnicos**:
  - **Persistencia de GPS**: Modificado `useExplorerManager.ts` para guardar la ubicación `[latitude, longitude]` bajo la clave `'fowy_user_location'` en `localStorage` una vez que el usuario otorga el permiso de ubicación con éxito.
  - **Cálculo en Cliente**: Modificado `src/app/(explorer)/[slug]/page.tsx` para cargar las coordenadas del storage, recalcular la distancia real usando `getDistance` y enviarla a la cabecera.
  - **Enlace de Google Maps (Navegación)**: Modificado `CraveBusinessHeader.tsx` para recibir `latitude` y `longitude` del negocio y envolver el texto de distancia en un enlace `<a>` a Google Maps con la ruta de origen a destino (`maps/dir`).
  - **Alineación con Reglas de Hooks**: Se solventó un error de orden de hooks (`Render Order Mismatch`) y referencia temporal (`ReferenceError`) reubicando el hook `useMemo` de distancia después del hook de datos `useV2BusinessMenuData` (donde se define `business`) pero obligatoriamente antes de las sentencias condicionales de retorno temprano (`if (loading)`).

### 📌 Hito: Optimización de Caché SWR en Menú de Negocios y Resolución de Errores de Tipado Vercel (Fase 1 de Velocidad)
- **Fecha**: 15 de Julio de 2026
- **Resumen**: Implementación de la primera fase de optimización de velocidad de carga mediante caché en el navegador para la vista pública de negocios (`/[slug]`) y solución a errores de compilación estrictos en Vercel.
- **Detalles Técnicos**:
  - **Optimización de Caché (SWR)**: Se refactorizó el hook `useV2BusinessMenuData.ts` sustituyendo el uso de `useEffect` y peticiones directas por `useSWR`. Esto permite almacenar temporalmente los datos del negocio, productos y categorías en caché, reduciendo el parpadeo y acelerando significativamente la carga visual para clientes recurrentes.
  - **Resolución de Error Vercel (Ley del Remolque)**: Se corrigió un error crítico de compilación en Vercel (`Parameter implicitly has an 'any' type`) en el archivo `src/app/(explorer)/[slug]/page.tsx` agregando tipado explícito local (`: any`) en las iteraciones de arreglos, respetando estrictamente la "Ley del Remolque" definida en los conceptos de arquitectura.

### 📌 Hito: Agrupamiento Inteligente de Marcadores en el Mapa (Clusterización & Rendimiento - Fase 8)
- **Fecha**: 21 de Julio de 2026
- **Resumen**: Implementación del agrupamiento dinámico de marcadores en el mapa del explorador (`/explorar`), garantizando máxima fluidez y velocidad en celulares antiguos y escalabilidad ante miles de negocios simultáneos sin congelar la pantalla.
- **Detalles Técnicos**:
  - **Importación Dinámica**: Se integró `react-leaflet-cluster` usando `next/dynamic` con `{ ssr: false }` en `src/components/explorer/ExplorerMap.tsx`, evitando errores de hidratación en Next.js (cumpliendo con la Sección 2.3 de `conceptos.md`).
  - **Estilo Ethereal High-Tech**: Se programó la función `createCustomClusterIcon` con tipado explícito para generar burbujas numéricas con el gradiente oficial de Fowy (`#FF5A5F` / `#FF9A3D`), bordes blancos y sombras elevadas.
  - **Ajustes de Zoom de Calle**: Se configuró `disableClusteringAtZoom={16}`, `maxClusterRadius={35}` y `spiderfyOnMaxZoom={false}` para asegurar que, al acercar el mapa a nivel de barrio/calle, las burbujas se disuelvan automáticamente y los marcadores queden 100% independientes, manteniendo intactos los Popups y botones de "Navegar" y "Menú".

