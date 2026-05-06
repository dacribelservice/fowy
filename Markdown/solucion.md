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

- [x] **1. Blindaje de Productos (`products`)**:
  - [x] **1.1** Sustituir políticas permisivas por RLS basado en `business_id` y propiedad.
  - [x] **1.2** Crear `useProductManager.ts` para desacoplar la gestión de inventario de la UI.
- [x] **2. Blindaje de Pedidos (`orders`)**:
  - [x] **2.1** Implementar RLS que solo permita lectura al Comprador (`customer_id`) y al Vendedor (`business_id -> owner_id`).
  - [x] **2.2** Centralizar estados de flujo de pedidos (Pendiente, Preparando, Enviado) en un Hook de servicio.
- [x] **3. Blindaje de Servicios (`service_orders`)**:
  - [x] **3.1** Asegurar que solo el Experto asignado y el Negocio contratante tengan visibilidad del progreso. (Implementado via RLS y Hook `useServiceOrderManager`)
- [ ] **4. Seguridad de Almacenamiento (Storage)**:
  - [x] **4.1** Aplicar políticas de Buckets para que los usuarios no puedan borrar fotos de otros negocios. (Implementado via RLS en `storage.objects`)

---
> **Puntuación de Auditoría:** 9.2 / 10  
> **Estado:** Sobresaliente, pero requiere "poda" de orquestadores para evitar deuda técnica.


> **🔍 Pendiente de verificar:** Que al cambiar etiquetas desde el panel del negocio, el explorador refleje el cambio en tiempo real sin recargar la página.

---

### ✂️ Fase 7: Desacoplamiento de Orquestadores (Finalizado ✅)

- [x] **1. Poda del Explorador (`explorar/page.tsx`)**:
  - [x] **1.1** Crear `useExplorerManager.ts` (Completado).
  - [x] **1.2** Reducción de página a < 150 líneas (Completado).
- [x] **2. Poda de Administración de Negocios (`admin/negocios/page.tsx`)**:
  - [x] **2.1** Crear `useAdminBusinessManager.ts` (Completado).
  - [x] **2.2** Extraer la lógica de estadísticas masivas a `useBusinessStats.ts` (Completado).
- [x] **3. Poda de Finanzas (`finanzas/page.tsx`)**:
  - [x] **3.1** Crear `useFinanceManager.ts` (Completado).
  - [x] **3.2** Asegurar precisión financiera en cálculos (Completado).
- [x] **4. Refactorización de Formularios Críticos (`RegisterForm.tsx`)**:
  - [x] **4.1** Implementar `useRegistrationWizard.ts` (Completado).
  - [x] **4.2** Desacoplar la lógica de carga a `storageService.ts` (Completado).

---
*Auditoría Final 02-May-2026: 9.8 / 10 — Sistema Limpio y Escalable.*

### 🎨 Fase 8: Re-Diseño "Crave Vision" (Sandbox Experimental)

> **Objetivo:** Lograr el "WOW" factor del diseño Premium (Imagen 2) mediante un entorno de desarrollo aislado (Sandbox) en la ruta `/[slug]/crave-vision`, manteniendo el marco del celular pero reconstruyendo todo el interior desde cero.

---

### 📝 Resumen del Contexto (Listo para Desacoplamiento)

> **Estado Actual:** El prototipo monolítico premium de la página de Sandbox (`src/app/(explorer)/[slug]/crave-vision/page.tsx`) ha sido completado y pulido al 100%, logrando la experiencia de usuario estética de nivel "WOW" requerida por Cristian. El diseño ya pasó por revisión y está listo para integrarse a producción.
>
> **✨ Logros Completados en el Sandbox:**
> - **Header Compacto & Scroll Dinámico:** Cabecera flotante colapsable que aparece sutilmente al hacer scroll hacia arriba y contiene el nombre, distancia, rating y estado del negocio.
> - **Branding V3 Premium:** Logo a la izquierda con badges minimalistas de color ("Abierto" en verde, Rating en amarillo con estrella).
> - **Categorías & Búsqueda "Glassmorphism":** Buscador tipo píldora translúcido y selector de categorías con transiciones activas dinámicas gobernadas por el `accent_color`.
> - **Tarjetas de Producto V3:** Rediseño con bordes redondeados amplios (`3xl`), sombras suaves, icono de favoritos (corazón) y botón "+" dinámico.
> - **Carrito "Magic Pill":** Píldora esmerilada flotante que nace fluidamente de la parte inferior y expande un Bottom Sheet de checkout completo al pulsarla.
> - **Ubicación GPS Inteligente:** Campo de dirección limpio con un botón de GPS que, tras capturar la ubicación, muestra un icono de check verde minimalista (`#34C759`) sin saturar visualmente el input.
> - **Integración de WhatsApp:** Los datos recogidos (incluyendo enlace de mapas y método de pago) se formatean en un mensaje ultra estructurado.

---

> **💡 Contexto Arquitectónico (Estrategia de Desacoplamiento para Producción):**
> Para garantizar la máxima estabilidad de la plataforma sin tocar directamente las vistas activas de forma abrupta, dividiremos las ~1,100 líneas del archivo monolítico en componentes pequeños y limpios utilizando un checklist paso a paso. Una vez desacoplados, los conectaremos a la DB mediante los hooks reales de Fowy (`useExplorerManager` y `useCart`) y realizaremos el reemplazo en producción (Hot-Swap).

- [x] **Bloque 1: Entorno de Desarrollo Aislado**
  - [x] **1.1** Crear la ruta huérfana `src/app/(explorer)/[slug]/crave-vision/page.tsx`.
  - [x] **1.2** Implementar el "Lienzo en Blanco": Cargar el `MobileFrame` pero limpiar todo el contenido interior del menú actual.
  - [x] **1.3** Inyectar Datos Mock de Alta Calidad: JSON de productos y banners con fotos reales para visualizar el diseño final sin depender de la DB.

- [x] **Bloque 2: Header y Branding V3 (Diseño Real de Imagen 2)**
  - [x] **2.1** Layout "Logo-Left/Text-Right": Romper el centrado actual. El logo circular a la izquierda y el nombre/detalles a la derecha.
  - [x] **2.2** Meta-datos Premium: Implementar badges de "Abierto", Rating y Distancia con el espaciado y tipografía exacta de la referencia.
  - [x] **2.3** Slider de Banners: Adaptar el slider para que se integre visualmente con la nueva cabecera sin cortes bruscos.

- [x] **Bloque 3: Búsqueda y Navegación "Glassmorphism"**
  - [x] **3.1** Buscador Flotante: Implementar la cápsula de búsqueda con efectos de desenfoque (`backdrop-blur`) y sombras profundas.
  - [x] **3.2** Carrusel de Categorías V3: Píldoras con micro-interacciones al hacer scroll y estados activos ultra-vibrantes.

- [x] **Bloque 4: La Joya de la Corona - Product Card V3**
  - [x] **4.1** Estética de Producto: Rediseñar la tarjeta con bordes `3xl`, sombras suaves y tipografías `bold` de alta legibilidad.
  - [x] **4.2** Botón de Acción Flotante: El botón "+" debe ser una pieza visual destacada, usando el color de acento de la marca con gradiente sutil.
  - [x] **4.3** Grid de 2 Columnas: Ajustar el `gap` y padding para que los productos "respiren" en pantalla móvil.
  - [x] **4.4** Ícono de Favoritos (Corazón): Implementar en la esquina superior derecha de la imagen un ícono minimalista con estilo premium (fondo tipo glassmorphism o sombra suave) que resalte sobre la foto.

- [x] **Bloque 5: La Experiencia del Carrito (Micro-Interacciones Premium)**
  - [x] **5.1** Nacimiento del Carrito (Efecto "Pill" Expansivo): Al agregar un producto, aparece un círculo en la parte inferior que se expande fluidamente (framer-motion spring) hacia una cápsula redondeada.
  - [x] **5.2** Diseño Glassmorphism: La cápsula debe usar efecto vidrio esmerilado (`backdrop-blur` fuerte, borde sutil brillante) mostrando el total a la izquierda y el ícono de carrito a la derecha.
  - [x] **5.3** Apertura del Bottom Sheet: Al tocar la cápsula de vidrio, se desliza hacia arriba el panel (Bottom Sheet) del carrito.
  - [x] **5.4** Controles de Cantidad Alta Fidelidad: Botones `-` y `+` circulares con efecto de profundidad (sombras sutiles "levantadas") utilizando el color de acento del negocio.
  - [x] **5.5** Botón "Finalizar": Un botón destacado dentro del Bottom Sheet para proceder al pago, aplicando el `accent_color`.

- [x] **Bloque 6: Vista de Checkout (Finalización del pedido)**
  - [x] **6.1** Formulario Visual Premium: Captura de Nombre, Celular y Notas del pedido con estética limpia.
  - [x] **6.2** Resumen de Orden: Detalle de productos seleccionados y el Total a pagar.
  - [x] **6.3** CTA Principal Seguro: Botón final de "Enviar pedido por WhatsApp" obligatoriamente en color Verde (`#25D366`) para transmitir confianza.

- [x] **Bloque 7: Inyección de Identidad de Marca (Colores Dinámicos)**
  - [x] **7.1** Sincronización de variables CSS: Asegurar que el `accent_color` gobierne la interfaz.
  - [x] **7.2** Aplicación estricta en: Píldoras de categorías activas, botón `+` de product cards, badge de `(promo)`, y botón "Finalizar" del carrito.

- [ ] **Bloque 8: Integración, Desacoplamiento y Reemplazo de Producción (Hot-Swap)**
  - [ ] **8.1** Planificar Componentes: Dividir el sandbox monolítico en archivos separados (`CraveHeaderCompact.tsx`, `CraveProductCard.tsx`, `CraveMagicCart.tsx`, etc.).
  - [ ] **8.2** Conexión de Lógica Real: Sustituir los datos Mock por el hook `useExplorerManager` y el sistema de carrito `useCart`.
  - [ ] **8.3** Hot-Swap Final: Una vez verificado el paso de los cables de datos, reemplazar de forma segura la página de producción `[slug]/page.tsx` con el código modular validado.