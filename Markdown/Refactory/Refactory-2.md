# 🛠️ PLAN DE REFACTORIZACIÓN: Menú Digital (`menu/page.tsx`)

⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Esta bitácora es el registro maestro del proyecto. Sirve para que cualquier sesión futura (o cualquier desarrollador/IA) comprenda exactamente el estado, la arquitectura y las decisiones tomadas.
- **Guía de Arquitectura**: [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)

---

## 🎯 Objetivo
Refactorizar el archivo `src/app/(partners)/business/menu/page.tsx` (actualmente +1,000 líneas) para cumplir con el estándar de máximo 250 líneas por archivo orquestador, eliminando diálogos nativos y aplicando el principio de responsabilidad única.

## 📋 Checklist de Refactorización

### Fase 1: Desacoplamiento de Tarjeta de Producto Global
- [ ] **1.1** Crear el archivo `src/components/partners/business/menu/GlobalProductCard.tsx`.
- [ ] **1.2** Migrar la interfaz `GlobalProductCardProps` y toda la lógica del componente `GlobalProductCard` (líneas 52-306 aprox.).
- [ ] **1.3** Eliminar el `window.confirm` en `handleToggleSwitch` y reemplazarlo por un flujo de UI Premium (Modal de confirmación o un sistema integrado para evitar bloqueos del navegador).

### Fase 2: Extracción del Catálogo Centralizado (Subpantalla)
- [ ] **2.1** Crear el componente `src/components/partners/business/menu/FowyCatalogView.tsx`.
- [ ] **2.2** Mover todo el bloque JSX y la lógica visual cuando `selectedGlobalCat` está activo (el layout de búsqueda, la cabecera del catálogo y el mapeo de productos filtrados).
- [ ] **2.3** Pasar los manejadores de estado como *props* desde el padre (`onClose`, `onProductToggle`, etc.).

### Fase 3: Aislamiento del Gestor de Etiquetas (Tags)
- [ ] **3.1** Crear el componente `src/components/partners/business/menu/BusinessTagsManager.tsx`.
- [ ] **3.2** Mover el renderizado del listado `dbCategories`, la lógica de `toggleCategory` y el botón de guardar.
- [ ] **3.3** Sustituir el uso explícito de `alert("Error al guardar las categorías.");` por el uso de `toast.error("...")` cumpliendo con la regla 4.1 de Ethereal High-Tech.

### Fase 4: Extracción del Carrusel de Categorías Globales
- [ ] **4.1** Crear el componente `src/components/partners/business/menu/GlobalCategoriesCarousel.tsx`.
- [ ] **4.2** Migrar la sección visual del carrusel de categorías (mini-tarjetas circulares con `PremiumImage`).

### Fase 5: Optimización del Orquestador Principal
- [ ] **5.1** Limpiar `src/app/(partners)/business/menu/page.tsx` conservando únicamente los `useEffect` de carga inicial, hooks como `useProductManager`, y el esqueleto base.
- [ ] **5.2** Importar todos los componentes aislados en los pasos 1 a 4. (Aplicar `next/dynamic` si se agregan módulos muy pesados o que dependan fuertemente de visuales en cliente).
- [ ] **5.3** Confirmar que el archivo orquestador quede condensado a un máximo de 200 a 250 líneas.
- [ ] **5.4** Ejecutar `npx tsc --noEmit` para verificar que el tipado estricto se mantenga intacto.
