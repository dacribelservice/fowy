# 🛡️ MÓDULO: ROL EXPERTO (Marketplace)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.


Este módulo gestiona la conexión entre los dueños de negocios y profesionales verificados (Vetted Experts). Su objetivo principal es ofrecer servicios especializados (Marketing, Fotografía, Ads) con un sistema de pago seguro en custodia (Escrow).

## 🚀 Funcionalidades Clave
1.  **Marketplace de Expertos**: Visualización de perfiles filtrados por categoría (Marketing, Fotografía, etc.).
2.  **Sistema de Verificación**: Distintivo de confianza para profesionales que cumplen los estándares de FOWY.
3.  **Contratación Escrow**: El pago se retiene por FOWY y solo se libera cuando el negocio marca el trabajo como completado.
4.  **Gestión de Órdenes**: Panel para que el negocio siga el progreso de sus contrataciones activas.
5.  **Portafolio Dinámico**: Visualización de trabajos previos del experto.

---

## 🛠️ CHECKLIST DE REFACTORIZACIÓN (Fase 1)
Siguiendo las reglas de la **Carpeta Maestra** y el límite de **250 líneas** definido en `conceptos.md`.

### FASE 1: DESACOPLAMIENTO Y ARQUITECTURA
*   [x] **1.1. Extracción de Datos Estáticos**: 
    *   Mover `FALLBACK_EXPERTOS` a un archivo de mocks/constantes para limpiar el ruido visual del inicio de la página.
- [x] **1.2. Componentización de UI Atómica**: 
    - [x] Crear `ExpertCard.tsx`: Lógica de la tarjeta individual en el marketplace.
    - [x] Crear `CategoryBar.tsx`: Barra de filtros por especialidad.
*   [x] **1.3. Aislamiento del Modal de Detalle**: 
    *   Crear `ExpertDetailModal.tsx`: Extraer las ~200 líneas que manejan la vista expandida del profesional.
*   [x] **1.4. Modularización de Contrataciones**: 
    *   Crear `ExpertOrdersList.tsx`: Extraer la lógica de la vista `orders` (Mis Contrataciones).
*   [x] **1.5. Refactor del Orquestador (Page.tsx)**: 
    *   Reducir `src/app/(partners)/business/expertos/page.tsx` a menos de 200 líneas.
    *   Implementar `useCallback` para las funciones de Supabase (`fetchExpertos`, `fetchMyOrders`) para eliminar advertencias de linting.
*   [x] **1.6. Corrección de Seguridad y UX**: 
    *   Sustituir el `confirm()` nativo por un modal de confirmación premium de FOWY.
    *   Asegurar que los enums de estatus coincidan exactamente con la base de datos (Regla 4.3).

---
*Estado: Fase 1 Completada.*
