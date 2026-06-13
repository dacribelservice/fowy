# Hoja de Ruta - 3 de Junio

### Fase 1: Gestión de Negocios Inactivos / Pausados

- [x] **1.1. Ocultar negocios inactivos del mapa**: Modificar `src/hooks/useExplorerManager.ts` para que la función `fetchBusinesses` filtre los resultados asegurando que solo se muestren los negocios activos (`status === true`) que además estén abiertos (`isBusinessOpen(biz.schedules)`).
- [x] **1.2. Pantalla Glassmorphism en Menú Inactivo**: Editar `src/app/(explorer)/[slug]/page.tsx` para verificar el estado del negocio (`const isBusinessActive = business?.status === true;`). Si el negocio está inactivo, renderizar un overlay absoluto con efecto de vidrio esmerilado premium (`backdrop-blur-md`) que bloquee la interacción con el menú.
- [x] **1.3. Diseño de la Pantalla de Mantenimiento**: Diseñar una tarjeta central sobre el overlay que contenga un mensaje de "Menú en mantenimiento" y un botón de "Regresar al mapa". (importante los logos deben de ser minimalistas) ⚠️
