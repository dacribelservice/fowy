# 🛠️ Solución: Filtro de Categorías en el Explorador

> **Problema:** Al seleccionar una categoría en el panel del negocio (ej: "Hamburguesa") y guardar, el cambio **no se reflejaba** en la página del Explorador. La página se quedaba cargando infinitamente o mostraba datos desactualizados.

---

## 📋 Intentos de Solución

### Paso 1 — Sincronización de `category_id` en la Base de Datos

> **Diagnóstico:** La columna `category_id` de la tabla `businesses` estaba vacía (NULL) para todos los negocios, rompiendo los JOINs con la tabla `categories`.

- [x] **1.1** Ejecutar script SQL para poblar `category_id` basándose en `tags[1]` (primera etiqueta) de cada negocio existente.
- [x] **1.2** Modificar `handleSaveCategories` en `/business/menu/page.tsx` para que al guardar los tags, automáticamente busque el ID de la categoría correspondiente y actualice `category_id` en la misma transacción.

---

### Paso 2 — Separar la obtención de categorías del fetch de negocios

> **Diagnóstico:** La función `fetchData` obtenía **tanto categorías como negocios** en la misma llamada. Cuando actualizaba el estado de `categories`, esto re-disparaba `fetchData` (porque `categories` era dependencia del `useCallback`), creando un **bucle infinito** → spinner eterno.

- [x] **2.1** Crear un `useEffect` independiente solo para obtener categorías (`fetchCats`) que se ejecuta una sola vez al montar el componente.
- [x] **2.2** Dejar `fetchData` solo para obtener negocios, usando el estado `categories` ya cargado para filtrar.

---

### Paso 3 — Implementar `refreshTrigger` para el Realtime

> **Diagnóstico:** La suscripción Realtime llamaba directamente a `fetchData()` dentro del callback. Pero ese `fetchData` era una referencia "vieja" (stale closure) que usaba estados vacíos, causando que la recarga trajera datos incorrectos o vacíos.

- [x] **3.1** Crear un estado `refreshTrigger` (contador numérico).
- [x] **3.2** En el callback del Realtime, en lugar de llamar `fetchData()` directamente, incrementar `setRefreshTrigger(prev => prev + 1)`.
- [x] **3.3** Agregar `refreshTrigger` como dependencia del `useEffect` que ejecuta `fetchData`, para que React re-ejecute el fetch con el estado más reciente.

---

### Paso 4 — Refactorización completa con `useRef` + Singleton de Supabase

> **Diagnóstico:** El enfoque del Paso 3 seguía fallando porque:
> 1. `createClient()` se llamaba **dentro del componente** en cada render (aunque internamente es singleton, genera una referencia nueva en el scope de React).
> 2. `fetchData` dependía de `[supabase, selectedCategoryId, userLocation, categories]` en el `useCallback`, causando cadenas inestables de re-renderizado.
> 3. El callback del Realtime seguía capturando una versión desactualizada de `fetchData`.

- [x] **4.1** Mover `const supabase = createClient()` **fuera del componente** (module-level singleton) para garantizar una sola instancia estable.
- [x] **4.2** Crear `useRef` para `categories`, `selectedCategoryId` y `userLocation` para que `fetchBusinesses` siempre lea los valores más recientes sin depender de ellos en el `useCallback`.
- [x] **4.3** Sincronizar los refs con los estados usando `useEffect` individuales:
  ```
  useEffect(() => { categoriesRef.current = categories; }, [categories]);
  useEffect(() => { selectedCategoryIdRef.current = selectedCategoryId; }, [selectedCategoryId]);
  useEffect(() => { userLocationRef.current = userLocation; }, [userLocation]);
  ```
- [x] **4.4** Reescribir `fetchBusinesses` con `useCallback(async () => { ... }, [])` — **sin dependencias** — leyendo todo desde refs.
- [x] **4.5** Crear `fetchRef = useRef(fetchBusinesses)` para que el callback del Realtime siempre acceda a la versión más reciente de la función.
- [x] **4.6** Cambiar la suscripción Realtime a `useEffect(() => { ... }, [])` — **sin dependencias** — para que nunca se re-suscriba.
- [x] **4.7** En el callback del Realtime, llamar `fetchRef.current()` en lugar de `fetchData()` o `setRefreshTrigger`.
- [x] **4.8** Agregar `console.log` del status de suscripción para debug: `.subscribe((status) => { console.log('Realtime subscription status:', status); })`.

---

### Paso 5 — Actualizar coordenadas de negocios

> **Diagnóstico:** Los negocios creados (Neon Burger y Solar Pizza) no tenían coordenadas (`latitude` y `longitude` eran NULL), por lo que no aparecían en el mapa.

- [x] **5.1** Actualizar Neon Burger con coordenadas: `lat: 3.432572, lng: -76.518521`
- [x] **5.2** Actualizar Solar Pizza con coordenadas: `lat: 3.406864, lng: -76.518244`

---

## 📊 Resumen de Arquitectura Actual (Post Paso 4)

```
┌─────────────────────────────────────────────┐
│  Module Level (fuera del componente)        │
│  const supabase = createClient() ← SINGLETON│
├─────────────────────────────────────────────┤
│  ExplorarPage Component                     │
│                                             │
│  States:  categories, businesses, loading,  │
│           selectedCategoryId, userLocation   │
│                                             │
│  Refs:    categoriesRef, selectedCategoryIdRef│
│           userLocationRef, fetchRef          │
│                                             │
│  useEffect[] → fetchCats (una sola vez)     │
│  useEffect[selectedCategoryId, userLocation,│
│            categories] → fetchBusinesses()  │
│  useEffect[] → Realtime subscription        │
│                 → fetchRef.current()        │
└─────────────────────────────────────────────┘
```

---

## ⏳ Estado Actual

| Paso | Estado | Notas |
|------|--------|-------|
| 1 | ✅ Ejecutado | SQL + sync automático en save |
| 2 | ✅ Ejecutado | Separación de fetchCats |
| 3 | ✅ Ejecutado | Reemplazado por Paso 4 |
| 4 | ✅ Ejecutado | Arquitectura final con refs |
| 5 | ✅ Ejecutado | Coordenadas actualizadas |

---

## 🚨 Auditoría de Código y Arquitectura (Fase 8.5)

Tras una auditoría profunda del estado actual de la plataforma, se han identificado los siguientes hallazgos críticos para mantener la escalabilidad y el estándar premium de FOWY.

### 🔍 Hallazgos Principales

1.  **Violación de la Regla de las 250 Líneas**:
    - `explorar/page.tsx` (**405 líneas**): Exceso de responsabilidades visuales (Sheet, List, Detail).
    - `admin/negocios/page.tsx` (**353 líneas**): Contiene componentes internos y lógica de stats pesada.
2.  **Inconsistencia en Componentes de UI**:
    - Uso de `<img>` nativo en el Explorador en lugar de `PremiumImage` (incumplimiento de la regla 3.3 de `conceptos.md`).
3.  **Componentes "Nómadas"**:
    - `StatCard` y `SuccessToast` definidos internamente en páginas administrativas en lugar de en `src/components/admin/shared/`.
4.  **Seguridad RLS**:
    - Persistencia de la política `"DEV: Allow all updates"` en la tabla `businesses`.

### ✅ Checklist de Refactorización (Próximos Pasos)

- [x] **1. Desacoplamiento del Explorador**:
  - [x] **1.1** Extraer `BusinessListSheet.tsx`.
  - [x] **1.2** Extraer `BusinessDetailSheet.tsx`.
- [x] **2. Estandarización Visual**:
  - [x] **2.1** Migrar todas las imágenes del Explorador a `PremiumImage`.
- [x] **3. Migración de ADN Shared**:
  - [x] **3.1** Mover `StatCard` y `SuccessToast` a `src/components/admin/shared/`.
- [ ] **4. Blindaje de Producción**:
  - [x] **4.1** Implementar políticas RLS definitivas basadas en `auth.uid() = owner_id`.
- [ ] **5. Optimización de Lógica**:
  - [x] **5.1** Mover la lógica de cálculo de estadísticas de negocios a un hook personalizado o servicio de Supabase.

---

### 🛡️ Fase 6: Blindaje y Optimización Global (Multi-tabla)

Siguiendo el estándar implementado en `businesses`, se debe aplicar el mismo rigor de seguridad y desacoplamiento en el resto de la infraestructura.

- [ ] **1. Blindaje de Productos (`products`)**:
  - [ ] **1.1** Sustituir políticas permisivas por RLS basado en `business_id` y propiedad.
  - [ ] **1.2** Crear `useProductManager.ts` para desacoplar la gestión de inventario de la UI.
- [ ] **2. Blindaje de Pedidos (`orders`)**:
  - [ ] **2.1** Implementar RLS que solo permita lectura al Comprador (`customer_id`) y al Vendedor (`business_id -> owner_id`).
  - [ ] **2.2** Centralizar estados de flujo de pedidos (Pendiente, Preparando, Enviado) en un Hook de servicio.
- [ ] **3. Blindaje de Servicios (`service_orders`)**:
  - [ ] **3.1** Asegurar que solo el Experto asignado y el Negocio contratante tengan visibilidad del progreso.
- [ ] **4. Seguridad de Almacenamiento (Storage)**:
  - [ ] **4.1** Aplicar políticas de Buckets para que los usuarios no puedan borrar fotos de otros negocios.

---
> **Puntuación de Auditoría:** 9.2 / 10  
> **Estado:** Sobresaliente, pero requiere "poda" de orquestadores para evitar deuda técnica.


> **🔍 Pendiente de verificar:** Que al cambiar etiquetas desde el panel del negocio, el explorador refleje el cambio en tiempo real sin recargar la página.
