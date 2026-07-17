# ⚡ DIAGNÓSTICO Y PLAN DE VELOCIDAD DE CARGA — FOWY

Este documento funciona como hoja de trabajo e información para seguir puliendo la velocidad de carga del menú digital de clientes (`/[slug]`), alineado con las reglas de arquitectura y la hoja de ruta del proyecto.

---

## 📊 1. Evaluación de Métricas de Rendimiento (Lighthouse)

Basado en las últimas auditorías de carga para la vista del menú en móviles:

*   **Largest Contentful Paint (LCP) = 5.0 s (Crítico 🔴):** La imagen del banner del negocio tarda demasiado en cargarse por completo.
*   **Interaction to Next Paint (INP) = 361 ms (Mejorable 🟡):** Existe un retraso perceptible de más de 300 ms cuando el cliente intenta interactuar con la interfaz (por ejemplo, buscar o filtrar categorías).
*   **First Contentful Paint (FCP) = 2.5 s (Mejorable 🟡):** El primer contenido de la pantalla (el esqueleto) tarda 2.5 segundos en dibujarse debido a que hay recursos bloqueando el renderizado inicial.
*   **Time to First Byte (TTFB) = 0.8 s (Bueno 🟢):** La base de datos responde rápido, por lo que el problema está en cómo procesamos y enviamos la información, no en el servidor.

---

## 🔍 2. Diagnóstico del Código y Causa Raíz

### A. Carga Sincrónica de Firebase Cloud Messaging (FCM)
*   **Problema:** En `src/app/layout.tsx`, el `<NotificationProvider>` carga de forma obligatoria y sincrónica el SDK del cliente de Firebase (`firebase/messaging` y `firebase/app`).
*   **Impacto:** Los clientes que solo entran a ver el menú de comida se ven obligados a descargar este script pesado al inicio, lo que retrasa el renderizado (FCP de 2.5s).
*   **Alineación con [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md):** La Sección 2.3 de *conceptos.md* obliga al uso de **Importaciones Dinámicas** para elementos pesados.

### B. El Efecto Cascada en la Imagen del Banner (LCP Waterfall)
*   **Problema:** `src/app/(explorer)/[slug]/page.tsx` es un Client Component (`"use client"`). El flujo de carga es:
    1. Descarga el HTML vacío/esqueleto.
    2. Descarga y ejecuta el JavaScript.
    3. Hace la llamada a la base de datos (RPC) en el cliente.
    4. Recibe la URL de la imagen del banner.
    5. Descarga la imagen.
*   **Impacto:** El navegador no sabe que la imagen existe hasta el paso 4. Esto empuja el LCP a los 5 segundos.

---

## 🛠️ 3. Soluciones Propuestas (Plan de Acción)

Para lograr un rendimiento óptimo de más de 95 puntos en móviles sin alterar la estabilidad del proyecto, seguiremos estas pautas:

### 1. Implementar Estrategia de Caché en el Navegador (Nivel 1)
*   **Idea:** Guardar temporalmente los datos en el celular del cliente para navegación instantánea sin consumo de datos.
*   **Implementación:** En `useV2BusinessMenuData.ts` (o dentro de `CraveMenuClient.tsx`), alimentar la herramienta de caché del cliente (SWR) usando la opción `fallbackData` con los datos ya provistos por el servidor (`initialData`):
    ```typescript
    const { data } = useSWR(`menu-${slug}`, fetcher, { fallbackData: initialData });
    ```
    Esto evita que React haga peticiones de red duplicadas durante el montaje.

### 2. Cargar Firebase dinámicamente ("Lazy Loading")
*   **Idea:** Evitar que el SDK de Firebase se descargue en la primera carga del menú digital.
*   **Implementación:** Mantener `NotificationProvider` importado estáticamente en `src/app/layout.tsx`. Sin embargo, dentro de `src/modules/notifications/NotificationProvider.tsx`, mover las importaciones estáticas de `firebase/messaging` y `firebase/app` a bloques de importación dinámica asíncrona (`await import(...)`) activados bajo demanda por condiciones específicas (ver Sección 5.A).

### 3. Renderizado Híbrido en Servidor (SSR)
*   **Idea:** Pre-renderizar el HTML del menú en el servidor para eliminar el efecto cascada de la imagen del LCP y mostrar contenido inmediato a motores de búsqueda.
*   **Implementación:**
    1. **Convertir página de ruta:** Quitar la directiva `"use client"` de `src/app/(explorer)/[slug]/page.tsx` para transformarlo en un Componente de Servidor asíncrono.
    2. **Crear Componente de Cliente:** Crear el archivo `src/components/explorer/CraveMenuClient.tsx` con la directiva `"use client"` para albergar toda la interfaz, estados interactivos de React, carrito y animaciones.
    3. **Traspaso de Datos:** En `page.tsx` (servidor), obtener el payload de Supabase vía `rpc("get_business_menu_payload")` y pasarlo al componente cliente: `<CraveMenuClient initialData={payload} />`.

---

## 📈 4. Estado de Avances Actuales (`PLAN.md/optimizacion.md`)

De acuerdo con el plan técnico en [optimizacion.md](file:///c:/Users/cange/Documents/fowy/Markdown/PLAN.md/optimizacion.md), ya se han implementado las bases estructurales:
*   [x] **Sección 2.3:** Creación de la RPC consolidada en base de datos (`get_business_menu_payload`) que extrae en un solo viaje de red la información del negocio, sus categorías y sus banners publicitarios.
*   [x] **Sección 2.4:** Creación del nuevo hook `useV2BusinessMenuData.ts` para consumir este payload consolidado de forma aislada, respetando la Ley del Remolque.

---

## 💡 5. Recomendaciones de Arquitectura y Auditoría de Código (Aportes IA)

Tras auditar detalladamente el código base actual, se identifican las siguientes observaciones técnicas y puntos de mejora críticos para asegurar el éxito del plan sin introducir errores de compilación o regresiones:

### A. Ajuste en Lazy Loading de Firebase
*   **Observación:** Importar `NotificationProvider` con `next/dynamic` y `{ ssr: false }` en `layout.tsx` anulará el renderizado en el servidor (SSR) de toda la aplicación, perjudicando el rendimiento de las páginas de los menús.
*   **Recomendación:** Mantener el proveedor estático y cargar dinámicamente las dependencias de Firebase dentro del `useEffect` o funciones del archivo `src/modules/notifications/NotificationProvider.tsx`.
*   **Disparadores de Carga del SDK (Triggers):**
    1. **Inicio de Sesión:** Cargar e inicializar Firebase cuando se detecte una sesión activa (`supabase.auth.getUser()`).
    2. **Pantalla de Checkout:** Cargar el SDK si un cliente anónimo llega al formulario de checkout/pedido.
    3. **Rutas Protegidas (`/admin` y `/business`):** Cargar inmediatamente si la ruta coincide con los paneles mediante `usePathname()`.
    *Ejemplo de carga dinámica:*
    ```typescript
    const { getMessaging, getToken } = await import('firebase/messaging');
    const { messaging } = await import('./firebase');
    ```

### B. El Conflicto de `LazyWrapper.tsx` vs. SSR
*   **Observación:** `LazyWrapper.tsx` utiliza `IntersectionObserver` y se inicializa en `false` en el servidor, provocando que en el HTML inicial solo se envíen esqueletos vacíos. Esto rompe la indexación SEO de los platos e impide que el navegador precargue las imágenes de los productos.
*   **Recomendación:** Renderizar los primeros 6 productos directamente en el HTML inicial para asegurar el SEO, y aplicar `LazyWrapper` a partir del séptimo elemento.
    *Ejemplo de implementación en el bucle:*
    ```tsx
    {products.map((product, index) => 
      index < 6 ? (
        <CraveProductCard key={product.id} product={product} {...props} />
      ) : (
        <LazyWrapper key={product.id}>
          <CraveProductCard product={product} {...props} />
        </LazyWrapper>
      )
    )}
    ```

### C. Await en Parámetros de Ruta (Next.js 16)
*   **Observación:** La aplicación corre sobre Next.js 16.2.4. En esta versión, los `params` de las páginas de servidor son promesas obligatorias.
*   **Recomendación:** Al reescribir `[slug]/page.tsx` para soportar SSR, se debe asegurar la desestructuración asíncrona de los parámetros:
    ```typescript
    interface PageProps {
      params: Promise<{ slug: string }>;
    }
    
    export default async function BusinessMenuPage({ params }: PageProps) {
      const { slug } = await params;
      // ...
    }
    ```

### D. Aclaración de Búsqueda Server-side vs. Client-side
*   **Observación:** Aunque la Sección 3.2 de `conceptos.md` prohíbe el filtrado en cliente, para menús individuales con pocos productos es mucho más rápido y reduce la carga del servidor usar el `useMemo` del hook `useV2BusinessMenuData.ts`.
*   **Recomendación:** Mantener la búsqueda actual en el navegador y aclarar en la documentación que la regla 3.2 aplica a catálogos globales (como `/explorar`), pero se exceptúa en menús individuales.

### E. Arquitectura Quirúrgica (Servidor vs. Cliente)
*   **Observación:** Convertir directamente `page.tsx` en un Componente de Servidor romperá las partes interactivas (carrito, modales, búsqueda, favoritos) que requieren hooks y estados de cliente (`useState`, `useCart`, etc.).
*   **Recomendación:** Crear el archivo de cliente `src/components/explorer/CraveMenuClient.tsx` y migrar allí toda la lógica interactiva. `src/app/(explorer)/[slug]/page.tsx` quedará como servidor puro sirviendo de puente de datos.

### F. Resiliencia de Datos y Ubicación (GPS / LocalStorage)
*   **Observación:** El servidor no tiene acceso al `localStorage` ni al GPS del celular del usuario durante el renderizado inicial, lo que puede causar errores de hidratación al calcular la distancia del negocio.
*   **Recomendación:** Mantener los estados de ubicación del usuario y la lectura del `localStorage` estrictamente dentro de los efectos del componente cliente `CraveMenuClient.tsx`, asegurando que el cálculo de distancia ocurra de manera diferida tras el montaje del lado del cliente.

### G. Plan de Respaldo (Failsafe) en SSR
*   **Observación:** Si la conexión entre el servidor y la base de datos experimenta latencia o fallos en el renderizado, el sitio podría quedar inaccesible.
*   **Recomendación:** Implementar un bloque `try/catch` en el servidor. Si el fetch de datos del servidor falla, el componente de servidor debe renderizar el componente de cliente pasándole un valor nulo para que el cliente intente cargar los datos directamente en el navegador (como funciona hoy), manteniendo la app disponible en un 100%.

---

## 📋 6. Checklist de Implementación Técnica (Paso a Paso)

### Fase 1: Optimización de Caché en Navegador (Nivel 1)
*   [x] **Paso 1.1:** Instalar y configurar `swr` en el hook `useV2BusinessMenuData.ts`.
*   [x] **Paso 1.2:** Modificar `useV2BusinessMenuData.ts` para usar `useSWR` y configurar la opción `fallbackData` con los datos pre-renderizados del servidor (`initialData`).
*   [x] **Paso 1.3:** Eliminar los estados locales de React (`useState` para `business`, `categories`, `products` y `banners`) y derivar directamente todas las variables desde el objeto de datos de `SWR` mediante `useMemo` para evitar dobles renders innecesarios.
*   [x] **Paso 1.4:** **[Mejora Consistencia]** Centralizar todo el mapeo y formato de productos dentro del `useMemo` del hook, consumiendo el payload crudo (`initialData`) tanto del servidor como de las consultas del cliente para evitar que los productos cambien de diseño o "parpadeen" al recargarse.
*   [x] **Paso 1.5:** Probar en el navegador local que el cambio de pestañas de categorías y navegación atrás/adelante se resuelva instantáneamente sin realizar consultas de red adicionales.

---

## 📄 Planificación de Fases Posteriores (Solo Informativo)

### Fase 2: Carga Dinámica de Firebase (FCM)
* Identificar y remover las importaciones estáticas de `firebase/messaging` y `firebase/app` en `src/modules/notifications/NotificationProvider.tsx`, así como la importación estática de `src/modules/notifications/firebase.ts` (ya que este archivo ejecuta importaciones estáticas internamente).
* Crear una función asíncrona de inicialización de Firebase bajo demanda (ej. `getFirebaseMessaging()`) dentro del proveedor, que importe dinámicamente (`await import`) las dependencias de Firebase en el cliente.
* **[Corrección de Oyente]** Asegurar que la suscripción al evento `onMessage` (el oyente de notificaciones) se reactive de forma dinámica únicamente después de que el SDK de Firebase se haya inicializado correctamente de fondo.
* **[Restricción de Alertas]** Condicionar el prompt de activación de notificaciones (`PermissionPrompt`) para que solo se intente cargar e inicializar para usuarios autenticados, evitando molestar a los clientes anónimos que entran a ver el menú.
* Configurar el disparador de sesión: Invocar la función de carga e inicialización del SDK cuando se detecte una sesión activa (`supabase.auth.getUser()`).
* Configurar el disparador de checkout: Vincular la función de carga del SDK a la acción de apertura de la hoja de checkout en el carrito de compras.
* Configurar el disparador de rutas: Detectar mediante `usePathname()` si el cliente ingresa a `/admin` o `/business` para inicializar y cargar de inmediato el SDK.
* Validar en la consola de red (Network Tab) que el script de Firebase no se descargue en la primera carga del menú individual de cliente anónimo.

### Fase 3: Renderizado Híbrido en Servidor (SSR)
* Crear una función utilitaria de mapeo de productos compartida (ej. `src/utils/menuMapper.ts`) que resuelva de forma idéntica los fallbacks de nombres, descripciones e imágenes provenientes de `global_products`.
* Crear el componente de cliente `src/components/explorer/CraveMenuClient.tsx` y migrar allí la interactividad, estados, carrito y animaciones actuales de `page.tsx`.
* Modificar `src/app/(explorer)/[slug]/page.tsx` para quitar la directiva `"use client"`. Convertirlo en un Componente de Servidor asíncrono resolviendo `params` con `await params`.
* Importar el cliente de Supabase de servidor (`src/utils/supabase/server.ts`) in `page.tsx` y llamar al RPC `get_business_menu_payload`.
* Ejecutar la función utilitaria de mapeo de productos en el servidor (`page.tsx`) antes de enviar los datos al cliente. Esto garantiza que el HTML del servidor coincida con la hidratación del cliente, evitando errores de Hydration Mismatch.
* Añadir un bloque `try/catch` de contingencia (Failsafe) en el servidor que permita renderizar el componente de cliente con datos vacíos (nulo) para que realice la carga del lado del navegador si la consulta en el servidor falla, manteniendo la app activa en un 100%.
* Pasar el payload de datos pre-renderizados y ya mapeados de servidor a cliente vía `<CraveMenuClient initialData={payload} />`.
* **[Mejora de SEO Dinámico]** Configurar la función `generateMetadata` en `page.tsx` para extraer de forma dinámica el nombre, descripción y logotipo del negocio e inyectarlos en las etiquetas meta del servidor.
* Ajustar el bucle de renderizado de productos en `CraveMenuClient.tsx` para mostrar los primeros 6 platos de forma directa, y aplicar `LazyWrapper` únicamente a partir del séptimo producto para asegurar la indexación SEO de la pantalla inicial.
* Probar el pre-renderizado del sitio desactivando JavaScript en el navegador para asegurar la visibilidad completa del menú e imágenes, así como verificar que WhatsApp y Google lean correctamente el título y foto del negocio al compartir el enlace.

---


## ⚠️ 7. Evaluación de Riesgo y Complejidad de Implementación

*   **Puntuación General:** `5 / 10` (Riesgo Moderado-Medio)
*   **Justificación:** El riesgo global se mantiene controlado debido a la aplicación estricta de la *Ley del Remolque* (no se modifica lógica heredada, solo se reubica la UI a un componente cliente dedicado). La principal precaución radica en garantizar que los tipos de datos devueltos por el RPC de base de datos coincidan perfectamente con los que espera el componente cliente para evitar pantallas en blanco, y testear la correcta hidratación del carrito de compras.

### 📊 Comparativa de Riesgo/Complejidad por Solución (De menor a mayor)

1. **🟢 Fase 1: Caché en el Navegador (Nivel 1)**
   * **Riesgo:** `2 / 10` (Muy Bajo)
   * **Complejidad:** `2 / 10`
   * **Justificación:** Es el más seguro de implementar. Únicamente guarda copias temporales en la memoria local del celular del cliente (mediante SWR) sin afectar la carga de scripts ni la infraestructura del servidor o la base de datos.

2. **🟡 Fase 2: Cargar Firebase dinámicamente ("Lazy Loading")**
   * **Riesgo:** `3 / 10` (Bajo)
   * **Complejidad:** `3 / 10`
   * **Justificación:** Solo cambia el momento en que se descarga el SDK de Firebase de internet. Es un cambio aislado dentro de un único archivo (`NotificationProvider.tsx`) y solo requiere validar que el registro de tokens siga funcionando bajo los disparadores clave (login, checkout, paneles admin/business).

3. **🔴 Fase 3: Renderizado en el Servidor (SSR)**
   * **Riesgo:** `5 / 10` (Moderado-Medio)
   * **Complejidad:** `5 / 10`
   * **Justificación:** Es el que requiere mayor cuidado porque exige dividir la página principal en dos partes (un archivo para el servidor y otro para el cliente), cuidar que los datos se transfieran correctamente y evitar que elementos dinámicos (GPS, carrito de compras o localStorage) generen errores visuales (hidratación) en la pantalla inicial del celular.





