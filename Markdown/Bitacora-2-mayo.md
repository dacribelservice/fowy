# 📓 BITÁCORA DEL PROYECTO: FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Esta bitácora es el registro maestro del proyecto. Sirve para que cualquier sesión futura (o cualquier desarrollador/IA) comprenda exactamente el estado, la arquitectura y las decisiones tomadas.
- **Guía de Arquitectura**: [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)

---

## 🚩 HISTORIAL DE HITOS Y AVANCES (MAYO 2026)

### 📌 Hito 5.9, 5.10 & 5.11: Automatización de Categorías y Menú Digital en Tiempo Real
- **Fecha**: 13 de Mayo de 2026
- **Resumen**: Implementación de la automatización inteligente del Catálogo Centralizado ("Crave Catalog") y su renderizado inmediato en la experiencia de cliente.
- **Detalles Técnicos**:
  - **Paso 5.9 (Activación Automatizada)**: Cuando el comercio activa un producto global, el sistema detecta si la categoría equivalente existe localmente; de lo contrario, la crea en caliente e inyecta el producto mapeando su categoría. Soporta edición de precio local e inline.
  - **Paso 5.10 & 5.11 (Visualización en Explorer)**: Las categorías autogeneradas se pintan dinámicamente como píldoras táctiles interactivas en la barra horizontal de `/explorer/[slug]`, mostrando bajo demanda los productos activos con fallbacks y precios configurados.
- **Control de Calidad**: Compilación verificada con `npx tsc --noEmit` (**0 errores**).
