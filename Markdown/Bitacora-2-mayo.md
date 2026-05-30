# 📓 BITÁCORA DEL PROYECTO: FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Esta bitácora es el registro maestro del proyecto. Sirve para que cualquier sesión futura (o cualquier desarrollador/IA) comprenda exactamente el estado, la arquitectura y las decisiones tomadas.
- **Guía de Arquitectura**: [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)

---

## 🚩 HISTORIAL DE HITOS Y AVANCES (MAYO 2026)

### 📌 Hito: Optimización de Escalabilidad Fase 1 (Filtrado Geográfico con PostGIS)
- **Fecha**: 23 de Mayo de 2026
- **Resumen**: Implementación de arquitectura geoespacial empresarial para soportar +10,000 negocios sin colapsos.
- **Detalles Técnicos**:
  - **Carga Inteligente (Bounding Box)**: La app pasó de descargar toda la base de datos a solicitar únicamente un límite máximo de 250 negocios que se encuentren dentro de las coordenadas del área visible en la pantalla del usuario.
  - **PostGIS y GIST**: Activación de la extensión PostGIS en Supabase, agregando columna espacial `geom` con índice `GIST` y un Trigger de sincronización en caliente, reduciendo los tiempos de consulta de segundos a milisegundos.
  - **Eficiencia en Cliente**: Se delegó el cálculo de proximidad (distancias pesadas) al motor de PostgreSQL en la nube, ahorrando batería y consumo de datos móviles (megas).
  - **Corrección de Bugs**: Se resolvieron bucles infinitos en el mapa (`autoPan`) y bloqueos de interfaz relacionados con restricciones de geolocalización en iOS (iPhone).

### 📌 Hito 5.9, 5.10 & 5.11: Automatización de Categorías y Menú Digital en Tiempo Real
- **Fecha**: 13 de Mayo de 2026
- **Resumen**: Implementación de la automatización inteligente del Catálogo Centralizado ("Crave Catalog") y su renderizado inmediato en la experiencia de cliente.
- **Detalles Técnicos**:
  - **Paso 5.9 (Activación Automatizada)**: Cuando el comercio activa un producto global, el sistema detecta si la categoría equivalente existe localmente; de lo contrario, la crea en caliente e inyecta el producto mapeando su categoría. Soporta edición de precio local e inline.
  - **Paso 5.10 & 5.11 (Visualización en Explorer)**: Las categorías autogeneradas se pintan dinámicamente como píldoras táctiles interactivas en la barra horizontal de `/explorer/[slug]`, mostrando bajo demanda los productos activos con fallbacks y precios configurados.
- **Control de Calidad**: Compilación verificada con `npx tsc --noEmit` (**0 errores**).

### 📌 Hito: Optimización de Escalabilidad Fase 2 (Consolidación de Menú por RPC)
- **Fecha**: 28 de Mayo de 2026
- **Resumen**: Eliminación del "efecto cascada" (waterfall) en la carga del menú de los negocios, aplicando la "Ley del Remolque".
- **Detalles Técnicos**:
  - **Desnormalización de Ratings**: Se agregaron las columnas `rating_average` y `rating_count` directamente a `businesses` para evitar consultas pesadas al cargar el perfil.
  - **Triggers de Base de Datos**: Se implementó un trigger inteligente en `business_ratings` para auto-calcular y sincronizar el promedio de calificaciones en caliente.
  - **Función Consolidada (RPC)**: Creación del procedimiento almacenado `get_business_menu_payload` que en un solo viaje ensambla y retorna el perfil, calificaciones, categorías y banners.
  - **Ley del Remolque**: Se programó un hook totalmente nuevo (`useV2BusinessMenuData.ts`) y se conectó a la interfaz. Tras verificar su éxito y velocidad, el viejo hook ineficiente fue eliminado por completo, eliminando código muerto.

### 📌 Hito: Modernización y Estandarización de Desarrollo (Paso 3.1)
- **Fecha**: 28 de Mayo de 2026
- **Resumen**: Blindaje del código fuente para asegurar que futuros módulos nazcan robustos.
- **Detalles Técnicos**:
  - **Autogeneración de Tipos Estrictos**: Extracción del esquema oficial de la base de datos de producción mediante Supabase CLI, creando `src/types/supabase.ts`.
  - **Impacto**: Actúa como un "diccionario" de validación estricta que impide que programadores o IAs usen columnas inexistentes o cometan errores tipográficos, bloqueando posibles "crashes" de producción desde el editor de código.

### 📌 Hito: Compatibilidad Absoluta y Prevención de Crashes en iPhone (iOS)
- **Fecha**: 29 de Mayo de 2026
- **Resumen**: Diagnóstico profundo y resolución de colapsos fatales de pantalla blanca ("This page couldn't load") al abrir la aplicación en iOS Safari y navegadores integrados (WebViews).
- **Detalles Técnicos**:
  - **Blindaje Push API**: Se envolvió la inicialización de Firebase Cloud Messaging (`getMessaging()`) en un `try/catch` para evitar que la falta de soporte síncrona bloquee el hilo de React.
  - **Manejo Seguro de Permisos**: Se validó `'Notification' in window` antes de invocar los permisos globales en `NotificationProvider.tsx`.
  - **Erradicación de Componente Fantasma**: Se descubrió y eliminó `BusinessNotificationListener.tsx`, un componente oculto que intentaba cargar `new Audio()` sin interacción del usuario. En iOS, esta agresión a la *Autoplay Policy* generaba un bloqueo de seguridad crítico que mataba la aplicación.
  - **Arquitectura de Sonido Unificada**: La reproducción de notificaciones de pedidos se centralizó en `useOrderManager.ts` (desbloqueando el sonido de forma legítima tras hacer clic en "Sonido Activo") y se configuró al proveedor global para que respete estrictamente esta preferencia almacenada localmente.

### 📌 Hito: Estabilidad en Autenticación y Realtime (Singleton de Supabase)
- **Fecha**: 30 de Mayo de 2026
- **Resumen**: Resolución de conflictos concurrentes en el cliente Supabase del navegador (`AbortError: Lock broken by another request with the 'steal' option`) y optimización de suscripciones en tiempo real.
- **Detalles Técnicos**:
  - **Paso 7.1 (Singleton de Supabase)**: Implementación del patrón Singleton en `src/utils/supabase/client.ts` para compartir una única instancia del cliente del navegador, alineado con la **Regla 6.1 (Estabilidad Realtime)** de `conceptos.md`.
  - **Eliminación de Conflictos de Bloqueo (Web Locks)**: Evita que múltiples inicializaciones del cliente luchen y "roben" la cerradura del token (`sb-...-auth-token`) en `localStorage`, lo que provocaba cierres inesperados de sesión y errores intermitentes en la consola.
  - **Optimización de Conectividad**: Consolidación y reutilización de la conexión de websockets en tiempo real para todos los proveedores globales (favoritos, pedidos y notificaciones en `NotificationProvider.tsx`), reduciendo la sobrecarga de conexiones concurrentes.
