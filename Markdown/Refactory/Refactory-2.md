# 🛠️ PLAN DE REFACTORIZACIÓN: Menú Digital (`menu/page.tsx`)

⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Esta bitácora es el registro maestro del proyecto. Sirve para que cualquier sesión futura (o cualquier desarrollador/IA) comprenda exactamente el estado, la arquitectura y las decisiones tomadas.
- **Guía de Arquitectura**: [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)

---

## 🎯 Objetivo
Refactorizar el archivo `src/app/(partners)/business/menu/page.tsx` (actualmente +1,000 líneas) para cumplir con el estándar de máximo 250 líneas por archivo orquestador, eliminando diálogos nativos y aplicando el principio de responsabilidad única.

## 📋 Checklist de Refactorización

### Fase 1: Desacoplamiento de Tarjeta de Producto Global
- [x] **1.1** Crear el archivo `src/components/partners/business/menu/GlobalProductCard.tsx`.
- [x] **1.2** Migrar la interfaz `GlobalProductCardProps` y toda la lógica del componente `GlobalProductCard` (líneas 52-306 aprox.).
- [x] **1.3** Eliminar el `window.confirm` en `handleToggleSwitch` y reemplazarlo por un flujo de UI Premium (Modal de confirmación o un sistema integrado para evitar bloqueos del navegador).

### Fase 2: Extracción del Catálogo Centralizado (Subpantalla)
- [x] **2.1** Crear el componente `src/components/partners/business/menu/FowyCatalogView.tsx`.
- [x] **2.2** Mover todo el bloque JSX y la lógica visual cuando `selectedGlobalCat` está activo (el layout de búsqueda, la cabecera del catálogo y el mapeo de productos filtrados).
- [x] **2.3** Pasar los manejadores de estado como *props* desde el padre (`onClose`, `onProductToggle`, etc.).

### Fase 3: Aislamiento del Gestor de Etiquetas (Tags)
- [x] **3.1** Crear el componente `src/components/partners/business/menu/BusinessTagsManager.tsx`.
- [x] **3.2** Mover el renderizado del listado `dbCategories`, la lógica de `toggleCategory` y el botón de guardar.
- [x] **3.3** Sustituir el uso explícito de `alert("Error al guardar las categorías.");` por el uso de `toast.error("...")` cumpliendo con la regla 4.1 de Ethereal High-Tech.

### Fase 4: Extracción del Carrusel de Categorías Globales
- [x] **4.1** Crear el componente `src/components/partners/business/menu/GlobalCategoriesCarousel.tsx`.
- [x] **4.2** Migrar la sección visual del carrusel de categorías (mini-tarjetas circulares con `PremiumImage`).

### Fase 5: Optimización del Orquestador Principal
- [x] **5.1** Limpiar `src/app/(partners)/business/menu/page.tsx` conservando únicamente los `useEffect` de carga inicial, hooks como `useProductManager`, y el esqueleto base.
- [x] **5.2** Importar todos los componentes aislados en los pasos 1 a 4. (Aplicar `next/dynamic` si se agregan módulos muy pesados o que dependan fuertemente de visuales en cliente).
- [x] **5.3** Confirmar que el archivo orquestador quede condensado a un máximo de 200 a 250 líneas.
- [x] **5.4** Ejecutar `npx tsc --noEmit` para verificar que el tipado estricto se mantenga intacto.

### Fase 6: Descomposición del Componente Footer (Reducción de +600 líneas)
- [x] **6.1** Crear una subcarpeta dedicada `src/components/explorer/modals/` (o dentro de una estructura `shared/legal` si aplica) para alojar los modales de texto extenso.
- [x] **6.2** Extraer el bloque del popup "Términos y Condiciones" hacia un nuevo componente `TermsModal.tsx`.
- [x] **6.3** Extraer el bloque del popup "Políticas de Privacidad" hacia un nuevo componente `PrivacyModal.tsx`.
- [x] **6.4** Extraer el bloque del popup "Políticas de Cookies" hacia un nuevo componente `CookiesModal.tsx`.
- [x] **6.5** Extraer el bloque del popup "Nuestra Visión" hacia un nuevo componente `VisionModal.tsx`.
- [x] **6.6** Aislar los íconos SVG manuales (`Instagram`, `Facebook`, `Twitter`) en un archivo de UI independiente (ej. `SocialIcons.tsx`) para limpiar la cabecera del archivo.
- [x] **6.7** Actualizar `Footer.tsx` importando los nuevos componentes y pasándoles la prop para cerrar el modal (`onClose={() => setActiveModal(null)}`). Confirmar que `Footer.tsx` baje a menos de 150 líneas.

### Fase 7: Resolución de Conflictos de Bloqueo de Auth (Singleton de Supabase)
- [x] **7.1** Modificar `src/utils/supabase/client.ts` para implementar el patrón **Singleton de Supabase** en el navegador (instanciar el cliente a nivel de módulo en cliente y reutilizarlo), alineado con la **Regla 6.1 (Estabilidad Realtime)** de `conceptos.md`.
- [x] **7.2** Confirmar que no aparezcan advertencias en consola del tipo `"lock:sb-...-auth-token"` ni excepciones `AbortError` (lock broken) causadas por la inicialización múltiple del SDK.
- [x] **7.3** Verificar que las suscripciones en tiempo real del explorador (favoritos, pedidos e historial en `NotificationProvider.tsx`) sigan funcionando de forma normal.

### Fase 8: Refactorización de DashboardGrowthChart.tsx (Reducción a < 250 líneas)
- [x] **8.1** Crear el nuevo componente especializado `src/components/admin/dashboard/DashboardSvgCurve.tsx` que se encargará del renderizado de la curva SVG y del tooltip interactivo de afiliaciones y visitas.
- [x] **8.2** Migrar la lógica matemática y de visualización del SVG a `DashboardSvgCurve.tsx` (cálculo de `maxValue`, generación de `points`, `pathD`, `areaD`, y renderizado del `<svg>` con sus nodos y guías).
- [x] **8.3** Mapear el Tooltip absoluto flotante interactivo y su estado `activePoint` dentro de `DashboardSvgCurve.tsx`.
- [x] **8.4** Simplificar `src/components/admin/dashboard/DashboardGrowthChart.tsx`, removiendo los bloques matemáticos y de visualización del SVG y el tooltip.
- [x] **8.5** Importar `DashboardSvgCurve` en `DashboardGrowthChart.tsx` y renderizarlo condicionalmente, pasándole el `chartData` procesado y los datos de `rankings`.



