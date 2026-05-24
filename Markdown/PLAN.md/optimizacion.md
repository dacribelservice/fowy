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
- [ ] **1.5 Crear Función RPC de Viewport (Bounding Box)**: Crear la función SQL que reciba los límites del mapa (Norte, Sur, Este, Oeste) y retorne los negocios visibles filtrados por estado y categoría con un límite máximo (ej. `LIMIT 250`).
- [ ] **1.6 Actualizar Cliente (`useExplorerManager.ts`)**: Modificar el hook para que use la nueva función RPC pasándole los límites dinámicos del mapa cada vez que el usuario mueva o haga zoom en el mapa (aplicando un Debounce de 300ms para evitar peticiones repetidas).

---

### 2. 📍 Agrupamiento de Marcadores (Clustering) en el Mapa
- [ ] **2.1 Implementar Supercluster**: Configurar la biblioteca de agrupación de marcadores en el cliente (como `use-supercluster` de React) para gestionar el renderizado lógico de puntos según el zoom del mapa.
- [ ] **2.2 Diseñar el Marcador de Clúster**: Crear el componente visual premium para representar un grupo de negocios amontonados (ej. un círculo con el número total de locales).
- [ ] **2.3 Renderizado Condicional**: Modificar [ExplorerMap.tsx](file:///c:/Users/cange/Documents/fowy/src/components/explorer/ExplorerMap.tsx) para que pinte marcadores individuales solo si no están agrupados en un clúster, reduciendo los elementos del DOM de 10,000 a menos de 50.
- [ ] **2.4 Interacción del Clúster**: Programar el evento clic en cada clúster para que haga zoom y se centre en el grupo de negocios seleccionado.

---

### 3. 🔌 Optimización del Tráfico Realtime
- [ ] **3.1 Eliminar Suscripción Realtime Global**: Desactivar la escucha realtime de la tabla completa `businesses` en el mapa y en el listado del explorador.
- [ ] **3.2 Polling de Bajo Consumo**: Implementar una recarga pasiva del listado bajo demanda o en intervalos largos (ej. cada 5 minutos) en lugar de recargas inmediatas en cada cambio de base de datos.
- [ ] **3.3 Suscripción Realtime por ID Único**: Limitar el canal en tiempo real únicamente al negocio seleccionado cuando se abra la ficha de detalles (`BusinessDetailSheet.tsx`) y en el carrito de compras.

---

### 4. ⚡ Consolidación de Carga de Menús (RPC Único)
- [ ] **4.1 Desnormalizar Calificaciones (Ratings)**: Agregar las columnas `rating_average` y `rating_count` directamente en la tabla `businesses`.
- [ ] **4.2 Trigger de Calificaciones**: Crear un Trigger en la tabla `business_ratings` que actualice automáticamente el promedio y conteo de ratings en la tabla `businesses` cuando un usuario califique a un negocio.
- [ ] **4.3 Crear RPC Consolidada**: Crear la función en la base de datos `get_business_menu_payload` que realice un único viaje a la base de datos y retorne los datos del negocio, sus categorías y sus banners publicitarios formateados como JSON.
- [ ] **4.4 Actualizar Hook de Menú (`useBusinessMenuData.ts`)**: Reemplazar las múltiples peticiones simultáneas por una única llamada a la función RPC consolidada al entrar al menú digital de un negocio.

---

### 🛡️ 5. Modernización y Preparación de "Remolques" (Nuevas Reglas)
*De acuerdo con la "Ley del Remolque" (conceptos.md), el código heredado NO se debe refactorizar. Estas tareas establecen la base para que los **nuevos** desarrollos nazcan robustos y escalables, además de blindar la UI actual sin destruirla.*

- [ ] **5.1 Autogeneración de Tipos Estrictos**: Ejecutar `npx supabase gen types typescript --project-id <id>` para descargar el esquema oficial de la base de datos a `src/types/supabase.ts` y tenerlo disponible para futuros módulos.
- [ ] **5.2 Resiliencia con Error Boundaries**: Envolver el componente principal del mapa (`ExplorerMap`) o vistas complejas en un `<ErrorBoundary>`. Es una capa protectora (remolque pasivo) que no rompe la lógica de React existente.
- [ ] **5.3 Crear Plantilla de Módulo Nuevo (Zustand & React Query)**: Construir un archivo "esqueleto" de ejemplo que implemente Zustand y React Query/SWR correctamente. Esto será el estándar obligatorio y la guía visual para cualquier programador o IA que vaya a crear componentes **nuevos desde cero**.
- [ ] **5.4 Esquemas de Zod listos para usarse**: Dejar instalada y configurada la base de Zod para validar estructuras JSON (como nuevos formularios o esquemas `schedules`) antes de guardarlos en base de datos.
