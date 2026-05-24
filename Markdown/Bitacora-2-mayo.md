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
