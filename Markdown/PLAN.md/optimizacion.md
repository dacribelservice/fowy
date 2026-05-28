# 📋 Plan de Optimización y Escalabilidad (FOWY)

Este documento detalla la hoja de ruta y la lista de comprobación (checklist) técnica para implementar las mejoras de escalabilidad necesarias para soportar más de 10,000 negocios en producción.

---

## 🗺️ Checklist de Implementación Técnica

### 1. 🌍 Filtrado Geográfico y Paginación en Base de Datos (PostGIS)
- [x] **1.1 Habilitar PostGIS**: Ejecutar el comando para habilitar la extensión espacial en la base de datos de Supabase.
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis;
  ```
- [x] **1.2 Agregar Columna Geográfica**: Crear la columna `geom` de tipo `geography(Point, 4326)` en la tabla `businesses` para almacenar la posición espacial exacta.
- [x] **1.3 Crear Índice Espacial GIST**: Crear un índice GIST sobre la columna `geom` para evitar escaneos completos de la tabla en búsquedas geográficas.
  ```sql
  CREATE INDEX IF NOT EXISTS businesses_geom_gist_idx ON businesses USING GIST (geom);
  ```
- [x] **1.4 Trigger de Sincronización**: Crear un Trigger en PostgreSQL para que mantenga actualizada la columna `geom` automáticamente cuando se inserten o actualicen latitud (`latitude`) o longitud (`longitude`).
- [x] **1.5 Crear Función RPC de Viewport (Bounding Box)**: Crear la función SQL que reciba los límites del mapa (Norte, Sur, Este, Oeste) y retorne los negocios visibles filtrados por estado y categoría con un límite máximo (ej. `LIMIT 250`).
- [x] **1.6 Actualizar Cliente (`useExplorerManager.ts`)**: Modificar el hook para que use la nueva función RPC pasándole los límites dinámicos del mapa cada vez que el usuario mueva o haga zoom en el mapa (aplicando un Debounce de 300ms para evitar peticiones repetidas).

---

### 2. ⚡ Consolidación de Carga de Menús (RPC Único)
- [x] **2.1 Desnormalizar Calificaciones (Ratings)**: Agregar las columnas `rating_average` y `rating_count` directamente en la tabla `businesses`.
- [x] **2.2 Trigger de Calificaciones**: Crear un Trigger en la tabla `business_ratings` que actualice automáticamente el promedio y conteo de ratings en la tabla `businesses` cuando un usuario califique a un negocio.
- [x] **2.3 Crear RPC Consolidada**: Crear la función en la base de datos `get_business_menu_payload` que realice un único viaje a la base de datos y retorne los datos del negocio, sus categorías y sus banners publicitarios formateados como JSON.
- [x] **2.4 Crear Nuevo Hook de Menú (`useV2BusinessMenuData.ts`)**: En cumplimiento estricto con la Ley del Remolque, crear un hook completamente nuevo que consuma el RPC consolidado y conectarlo a la UI, dejando intacto el código heredado de `useBusinessMenuData.ts`.

---

### 🛡️ 3. Modernización y Preparación de "Remolques" (Nuevas Reglas)
*De acuerdo con la "Ley del Remolque" (conceptos.md), el código heredado NO se debe refactorizar. Estas tareas establecen la base para que los **nuevos** desarrollos nazcan robustos y escalables, además de blindar la UI actual sin destruirla.*

- [ ] **3.1 Autogeneración de Tipos Estrictos**: Ejecutar `npx supabase gen types typescript --project-id <id>` para descargar el esquema oficial de la base de datos a `src/types/supabase.ts` y tenerlo disponible para futuros módulos.
- [ ] **3.2 Resiliencia con Error Boundaries**: Envolver el componente principal del mapa (`ExplorerMap`) o vistas complejas en un `<ErrorBoundary>`. Es una capa protectora (remolque pasivo) que no rompe la lógica de React existente.
- [ ] **3.3 Crear Plantilla de Módulo Nuevo (Zustand & React Query)**: Construir un archivo "esqueleto" de ejemplo que implemente Zustand y React Query/SWR correctamente. Esto será el estándar obligatorio y la guía visual para cualquier programador o IA que vaya a crear componentes **nuevos desde cero**.
- [ ] **3.4 Esquemas de Zod listos para usarse**: Dejar instalada y configurada la base de Zod para validar estructuras JSON (como nuevos formularios o esquemas `schedules`) antes de guardarlos en base de datos.
