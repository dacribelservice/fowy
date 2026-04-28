# 🧠 CONCEPTOS Y REGLAS DE ARQUITECTURA (FOWY)

Este documento define las reglas de oro para mantener el código limpio, escalable y modular. Es de **obligado cumplimiento** para cualquier sesión de desarrollo.

---

## 🏗️ 1. REGLA DE LA "CARPETA MAESTRA" (Estructura)
Para evitar que los archivos crezcan descontroladamente, seguimos esta jerarquía:

### 📁 `src/app/...` (Los Orquestadores)
- **Función**: Solo deben manejar el *fetching* de datos (Supabase), estados globales y la estructura de la página.
- **Límite**: Si un archivo en `/app` supera las **200-250 líneas**, DEBE ser refactorizado extrayendo la lógica visual a componentes.

### 📁 `src/components/admin/[modulo]/...` (Componentes Especializados)
- **Función**: Contener la lógica visual y de interacción de una sección específica (ej. `BusinessLocationManager.tsx`).
- **Aislamiento**: Cada componente debe ser lo más independiente posible, comunicándose con el padre mediante callbacks (`onChange`, `onSuccess`).

### 📁 `src/components/admin/shared/...` (El ADN Reutilizable)
- Aquí van los componentes que se usan en múltiples partes del sistema: `PremiumImage`, `DeleteConfirmModal`, `Pagination`, `SuccessToast`.

---

## 🧩 2. FILOSOFÍA DE DESACOPLAMIENTO
1.  **No Monolitos**: Prohibido crear páginas donde la UI, el mapa, los formularios y los listados vivan en un solo archivo `.tsx`.
2.  **Un Archivo, Una Responsabilidad**:
    - Un componente para el Perfil.
    - Un componente para la Ubicación.
    - Un componente para los Módulos.
3.  **Importaciones Dinámicas**: Para componentes pesados (como mapas con Leaflet), usar siempre `next/dynamic` con `{ ssr: false }` para evitar errores de hidratación.

---

## ⚡ 3. ESTÁNDARES DE RENDIMIENTO (Fase 8+)
1.  **Paginación Obligatoria**: Ningún listado debe cargar todos los datos de golpe. Usar `range(from, to)` de Supabase.
2.  **Búsqueda Server-side**: Los filtros y buscadores deben consultar a la base de datos, no filtrar el array en memoria del cliente.
3.  **Gestión de Imágenes**:
    - **Compresión**: Es obligatorio usar `compressImage` antes de subir cualquier archivo a Storage.
    - **Visualización**: Usar `PremiumImage` para manejar estados de carga y errores de forma elegante.
4.  **Storage Cleanup**: Toda función de borrado en la base de datos debe incluir la lógica para eliminar sus archivos asociados en el Storage.

---

## 🎨 4. CALIDAD "ETHEREAL HIGH-TECH"
1.  **No `alert()` nativos**: Queda prohibido el uso de diálogos del navegador. Usar el sistema de **Toasts Premium** o modales de confirmación.
2.  **Micro-animaciones**: Usar `framer-motion` para transiciones suaves (fade-in, slide-up) al cargar datos o abrir modales.
3.  **Sin "Hardcoding"**: Los nombres de planes, estatus y roles deben coincidir exactamente con los Enums de la base de datos (`standard`, `pro`, `premium` en minúsculas).

---

## 🛡️ 5. SEGURIDAD Y DATOS
1.  **RLS (Row Level Security)**: Las políticas de Supabase deben ser auditadas. Solo el rol `super_admin` puede tener permisos de edición en el panel administrativo.
2.  **Índices**: Al crear nuevas columnas de búsqueda, se debe crear su índice correspondiente en PostgreSQL (usar `pg_trgm` para texto).

---
*Este documento es dinámico y debe actualizarse cuando se adopte un nuevo patrón arquitectónico.*
