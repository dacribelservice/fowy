# 🧠 CONCEPTOS Y REGLAS DE ARQUITECTURA (FOWY)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.


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

## ⚡ 6. ESTABILIDAD REALTIME (REGLAS CRÍTICAS)
1.  **Singleton de Supabase**: Para suscripciones persistentes, el cliente de Supabase debe ser instanciado a nivel de módulo (fuera del componente) para evitar colisiones de estado en React 19.
2.  **Patrón `useRef` para Stale Closures**: Toda función que deba acceder a estados actualizados dentro de un callback de Realtime debe ser referenciada vía `useRef`. Prohibido depender de estados volátiles directamente en los listeners.
3.  **IDs de Canal Únicos**: Cada suscripción debe generar un ID de canal único (`channel-${Math.random()}`) para prevenir errores de "canal ya existente" durante el Fast Refresh o navegación rápida.

---

## 🚀 7. ESCALABILIDAD EMPRESARIAL (10,000+ NEGOCIOS)

> 🛑 **¡ALTO! LEY ABSOLUTA DE CÓDIGO HEREDADO (LA REGLA DEL "REMOLQUE")** 🛑
>
> **ESTÁ TERMINANTEMENTE PROHIBIDO, BAJO CUALQUIER MOTIVO, CONCEPTO O CIRCUNSTANCIA, REFACTORIZAR COMPONENTES O HOOKS YA CREADOS (Ej: `useExplorerManager`, `useBusinessMenuData`) PARA ADAPTARLOS A ESTAS REGLAS.** 
>
> 1. **PROHIBIDO TOCAR CÓDIGO EXISTENTE:** NUNCA intentes "modernizar", "arreglar" o "alinear" el código viejo para usar Zustand, React Query o Zod si ya está usando `useState` o `useEffect`. El código base actual se considera estable y cerrado.
> 2. **ANALOGÍA DEL CARRO Y EL REMOLQUE:** La app actual es un carro familiar que YA funciona perfecto. Tratar de reescribir el código existente para forzar estas reglas es equivalente a "cortar las latas y el chasis del carro", lo cual inevitablemente generará fallos catastróficos. En su lugar, cualquier nueva tecnología se anclará como un "remolque" al carro existente.
> 3. **APLICACIÓN EXCLUSIVA A CÓDIGO NUEVO:** Estas reglas de escalabilidad (Zustand, React Query, Zod, Tipado) **SOLO APLICAN A COMPONENTES Y MÓDULOS CREADOS DESDE CERO**. 
>
> ¡REPITO: PROHIBIDO MODIFICAR EL CÓDIGO EXISTENTE PARA APLICAR ESTAS REGLAS! ¡NUNCA SE DEBE REFACTORIZAR EL CÓDIGO VIEJO! ¡SOLO APLICAN A DESARROLLOS NUEVOS DESDE CERO!

1.  **Tipado Estricto (Sin `any` en entidades)**: Prohibido usar `any` para datos provenientes de la base de datos. Se debe autogenerar el esquema de tipos mediante la CLI de Supabase (`supabase gen types`) y usar tipos como `Database['public']['Tables']['businesses']['Row']` en todos los hooks y componentes.
2.  **Caché y Revalidación de Datos (React Query / SWR)**: Evitar el uso de `useEffect` para fetching directo de datos principales. Usar TanStack Query (React Query) o SWR para gestionar consultas a Supabase, logrando caché automático, deduplicación de consultas, revalidación en segundo plano y simplificación del manejo de estados de carga/error.
3.  **Gestión de Estado Global Ligera (Zustand)**: Para estados reactivos que compartan múltiples componentes (como ubicación GPS actual, filtros del explorador o estado del carrito), usar **Zustand** con selectores específicos. Evitar React Context en estos casos para no generar re-renders innecesarios.
4.  **Validación de Datos Complejos (Zod)**: Todo objeto JSON semiestructurado persistido en la base de datos (por ejemplo, horarios `schedules` o especificaciones de menús) debe ser validado con esquemas de **Zod** antes de ser consumido por la interfaz de usuario.
5.  **Resiliencia Visual (Error Boundaries)**: Envolver componentes interactivos de alta complejidad o dependientes de librerías de terceros (como el mapa de Leaflet, pasarelas de pago o gráficos de analítica) en un `<ErrorBoundary>` para evitar que un fallo aislado bloquee o apague toda la aplicación.
7.  **Regla de Viaje Único (RPC Consolidados)**: Si una interfaz requiere cargar información de más de dos tablas independientes de Supabase (ej: negocio, banners, categorías de menú), consolidar las consultas en una sola llamada RPC (PostgreSQL) para minimizar los viajes de red (RTT) desde el navegador.
8.  **Manejo de Errores de Tipado (`any` implícito en Vercel)**: Si durante una compilación Vercel arroja un error de tipo `Parameter implicitly has an 'any' type` en código heredado (ej. parámetros en callbacks de Supabase), **DEBES** aplicar un parche explícito (ej. `: any`) localmente en ese archivo. Queda estrictamente prohibido intentar arreglarlo modificando tipos globales (como el Singleton `supabaseClientInstance` en `client.ts`), ya que esto desencadenará un "Efecto Dominó" de decenas de errores de compilación masivos en código antiguo que funcionaba correctamente. (Aplicación directa de la Ley del Remolque).

---
*Este documento es dinámico y fue consolidado el 23 de Mayo de 2026 tras la auditoría de estabilidad y escalabilidad.*
