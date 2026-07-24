# 📊 PLANTEAMIENTO TÉCNICO Y CHECKLIST DE EJECUCIÓN: GRÁFICO DE TRÁFICO Y CLIC WATSAPP

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.
> 
> **Cumplimiento de Arquitectura**: Este planteamiento sigue estrictamente las normas de modularidad, límites de líneas y desacoplamiento definidos en [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md).

---

## 🎯 1. Objetivo General del Requerimiento

Integrar en la vista de detalles del negocio en el panel de administración (`/admin/negocios/[id]`), justo debajo de la tarjeta de **Métricas de Rendimiento**, un gráfico interactivo combinado que represente:

1. **Tráfico de Visitas**: Curva suave con gradiente Fowy (reutilizando la estética y matemática SVG del Dashboard).
2. **Clics de WhatsApp**: Barras verticales en verde WhatsApp (`#25D366`) integradas en el mismo eje temporal.
3. **Filtros Temporales**: Botones de conmutación interactivos **DÍA**, **SEMANA** y **MES**.

---

## 🔍 2. Análisis Meticuloso de Riesgos e Imprevistos Colaterales

Antes de escribir una sola línea de código, se evaluaron los posibles ángulos de falla e imprevistos para garantizar **cero efectos secundarios (Collateral Damage)** en el resto de la aplicación:

| Posible Imprevisto / Riesgo | Diagnóstico y Medida Preventiva |
| :--- | :--- |
| **Riesgo 1: Desbordamiento de líneas en la página orquestadora** | Si metemos la lógica visual del gráfico en `page.tsx`, el archivo superaría las 350 líneas. **Solución**: Creación de 3 submódulos independientes (< 150 líneas cada uno). La página solo incluirá 3 líneas nuevas. |
| **Riesgo 2: Incompatibilidad de datos de clics (Clics a 0 o vacíos)** | Si un negocio no tiene registros de clics o son `null`, la barra SVG podría generar un NaN en la altura CSS. **Solución**: Sanitización defensiva en el hook (`Math.max(val, 0)`) con fallback a 0. |
| **Riesgo 3: Parpadeo de renderizado (Flickering / Hydration Mismatch)** | Al cambiar rápidamente entre filtros (Día, Semana, Mes) los datos tardan en cargar. **Solución**: Mantener un estado de `loading` con Skeleton Loader animado nativo de Framer Motion. |
| **Riesgo 4: Error de Tipado TypeScript en Vercel** | Inferencia de `any` en parámetros de Supabase al agrupar fechas. **Solución**: Definición explícita de interfaces `TrafficDataPoint` y `TimeFilter`. |
| **Riesgo 5: Daños en la Base de Datos** | Miedo a alterar la estructura de Supabase. **Solución**: Cero modificaciones de esquema. Únicamente consultas `select` de solo lectura sobre la tabla `analytics_visits` y `businesses`. |

---

## 🧩 3. Jerarquía de Archivos y Responsabilidades ([conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md))

```
src/
 ├── app/admin/negocios/[id]/page.tsx                   <-- Orquestador (Modificación mínima: +3 líneas)
 └── components/admin/businesses/
      ├── useBusinessTrafficData.ts                    <-- Lógica & Fetching (~75 líneas)
      ├── BusinessTrafficSvg.tsx                       <-- Renderizado SVG Curva + Barras (~130 líneas)
      └── BusinessTrafficChart.tsx                     <-- UI Contenedora y Filtros (~110 líneas)
```

---

## 📋 4. Checklist Ejecutable Paso a Paso (Atómica y Sin Ambigüedades)

Cada paso a continuación es **100% independiente, atómico y autocontenido**. Puedes pedir *"Ejecuta el paso X.X y paras"* sin dejar tareas incompletas ni romper el proyecto en estados intermedios.

---

### 🔹 FASE 1: Lógica y Procesamiento de Datos (`useBusinessTrafficData.ts`)

- [x] **Paso 1.1 — Creación del Hook Base y Definición de Tipos ✅**
  - **Acción**: Crear el archivo `src/components/admin/businesses/useBusinessTrafficData.ts`.
  - **Alcance**: Definir las interfaces `TrafficDataPoint`, `TimeFilter` y la firma del hook aceptando `businessId` y `filter`.
  - **Verificación**: Archivo creado sin errores de sintaxis ni de TypeScript. (Completado)

- [x] **Paso 1.2 — Lógica de Fetching y Procesamiento Temporal en Supabase ✅**
  - **Acción**: Desarrollar la consulta `select` a `analytics_visits` y `orders` agrupando visitas y clics por intervalos de tiempo (Día, Semana, Mes).
  - **Alcance**: Retornar `{ loading, points, maxVisits, maxClicks, totalPeriodVisits, totalPeriodClicks }` con sanitización anti-NaN.
  - **Verificación**: El hook compila limpiamente sin advertencias de tipos. (Completado)

---

### 🔹 FASE 2: Renderizado Visual SVG (`BusinessTrafficSvg.tsx`)

- [x] **Paso 2.1 — Estructura SVG Base y Cálculo de Ejes Vectoriales ✅**
  - **Acción**: Crear el archivo `src/components/admin/businesses/BusinessTrafficSvg.tsx`.
  - **Alcance**: Configurar el `viewBox` responsive (500x180), cálculo de coordenadas `(x,y)` para puntos de trazado y líneas de guía horizontales.
  - **Verificación**: El componente renderiza el lienzo SVG base limpio. (Completado)

- [x] **Paso 2.2 — Renderizado de la Curva de Visitas y Barras Verdes de WhatsApp ✅**
  - **Acción**: Implementar los trazados Bezier (`pathD`, `areaD`) con gradiente Fowy para Visitas y los rectángulos `<rect>` verticales en color verde WhatsApp (`#25D366`).
  - **Alcance**: Agregar los nodos circulares interactivos y animaciones de entrada con `framer-motion`.
  - **Verificación**: Curva y barras vectoriales dibujadas armónicamente sin superposiciones erróneas. (Completado)

- [x] **Paso 2.3 — Implementación de Tooltips Flotantes e Interacción Tactil/Hover ✅**
  - **Acción**: Agregar la tarjeta emergente flotante (Tooltip Glassmorphic) que muestra los valores de visitas y clics del punto activo.
  - **Alcance**: Manejo de eventos `onMouseEnter`, `onMouseLeave` y `onTouchStart`.
  - **Verificación**: Tooltip dinámico funcionando al pasar el cursor sobre los datos. (Completado)

---

### 🔹 FASE 3: UI Contenedora y Controles (`BusinessTrafficChart.tsx`)

- [x] **Paso 3.1 — Creación del Contenedor UI y Cabecera de Filtros ✅**
  - **Acción**: Crear el archivo `src/components/admin/businesses/BusinessTrafficChart.tsx`.
  - **Alcance**: Diseñar la tarjeta blanca redondeada, cabecera con leyenda de colores (Naranja = Tráfico, Verde = WhatsApp) y botones de conmutación (DÍA, SEMANA, MES).
  - **Verificación**: Interfaz con estilo Fowy rendered correctamente con estado de filtro reactivo. (Completado)

- [x] **Paso 3.2 — Integración con Skeleton Loader y Subcomponente SVG ✅**
  - **Acción**: Enlazar `useBusinessTrafficData` con `BusinessTrafficSvg` y agregar el estado de carga animado (`Skeleton Loader`) mientras `loading === true`.
  - **Alcance**: Resumen final del período en el pie de la tarjeta.
  - **Verificación**: Componente completo funcionando de manera autónoma. (Completado)

---

### 🔹 FASE 4: Vinculación Final en el Orquestador

- [x] **Paso 4.1 — Instanciación en la Página de Detalles (`page.tsx`) ✅**
  - **Acción**: Editar `src/app/admin/negocios/[id]/page.tsx` para importar e instanciar `<BusinessTrafficChart businessId={business.id} />` exactamente debajo de la sección `<BusinessMetricsList />`.
  - **Alcance**: Solo se agregan 3 líneas de código a `page.tsx`.
  - **Verificación**: El orquestador mantiene sus ~224 líneas sin sobrepasar el límite de 250 líneas. (Completado)

- [x] **Paso 4.2 — Corrección de Desbordamiento de Barras Verdes y Control de Calidad ✅**
  - **Acción**: 
    1. En `BusinessTrafficSvg.tsx`, condicionar el renderizado de la barra verde para que solo se dibuje si `p.clicks > 0` (eliminando las píldoras de 8px en días con 0 pedidos).
    2. Ajustar la escala de altura de la barra verde al 50%-60% del gráfico para que conviva armónicamente por debajo de la curva roja de visitas.
    3. Aplicar `overflow-hidden` defensivo en el contenedor para evitar cualquier saliente visual.
  - **Alcance**: Garantizar visualización limpia, fluida y sin desbordamientos en PC y móviles.
  - **Verificación**: Prueba visual sin desbordamientos y compilación limpia de TypeScript. (Completado)

---

*Checklist consolidada y lista para ser ejecutada paso a paso a indicación de Cristian.*
