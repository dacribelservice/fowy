# 🎪 PLAN DE IMPLEMENTACIÓN: MOTOR CENTRAL DE MARKETING (GLOBAL, CIUDAD Y LOCAL)

Este documento detalla el plan y las especificaciones para evolucionar el actual sistema de banners hacia un **Motor de Promoción Cruzada y Marketing Segmentado**. Este sistema permite a FOWY gestionar publicidad colaborativa entre comercios y campañas globales desde un único punto de control.

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

---

## 🗺️ 1. Concepto y Visión de Negocio (Sinergia Local)

El objetivo es incentivar la cooperación entre comercios vecinos no competidores, ofreciéndoles publicidad cruzada. Un cliente que ve el menú de una *Hamburguesería* visualizará publicidad de una *Heladería* de su mismo barrio.

### Reglas Clave:
*   **Ganar-Ganar (Colaboración Opt-in):** Acuerdos manuales donde los comercios se benefician mutuamente del tráfico sin competir directamente.
*   **Segmentación Geográfica:** FOWY controla exactamente dónde se ve un anuncio (Nacional, Ciudad o Menú Específico) para evitar cruces imposibles (ej. mostrar pizzerías de Cali a clientes en Bogotá).
*   **Pasar Contexto (Propiedades del Orquestador):** Para que el carrusel unificado filtre por la ciudad y el ID del negocio correspondiente en el explorador sin repetir consultas lentas ni violar la "Ley del Remolque", modificaremos la firma del componente `<AutoScrollBanners />` para que reciba las propiedades `businessId` y `city` directamente desde la página `/app/(explorer)/[slug]/page.tsx`.
*   **Experiencia Limpia (Una sola fila):** Para evitar la "fatiga de banners" en pantallas móviles, **todos los banners (globales y locales) se fusionarán en un solo carrusel unificado**.

---

## 🛠️ 2. Flujo del Administrador (Admin Panel Centralizado)

Toda la gestión de banners se realizará **exclusivamente** desde el panel actual de **"Campañas y Marketing"** (`/admin/marketing`). No se añadirán configuraciones de banners individuales en la ficha de cada negocio para mantener la plataforma limpia.

### Requisitos Técnicos para el Autocompletado de Ciudades (Sincronización de Datos):
Para que la consulta cruzada (`target_city = 'Cali, Valle del Cauca, Colombia'`) funcione de manera perfecta en la base de datos, los nombres de las ciudades deben coincidir milimétricamente. Por ello, la implementación del Buscador con Autocompletado requiere modificar **tres puntos clave de la app**:
1. **Formulario de Campañas y Marketing (`/admin/marketing`):** Al crear o editar un banner de alcance por ciudad, el campo "Ciudad" debe ser el nuevo componente *Autocomplete*.
2. **Formulario de Negocios (`/admin/negocios`):** **CRÍTICO.** El modal de "Nuevo Establecimiento" (y el de edición) también debe sustituir su actual input de texto manual por exactamente el mismo componente *Autocomplete*. Así garantizamos que el perfil del negocio guarde la misma cadena de texto que el banner para hacer *match* en Supabase.
3. **Archivo JSON Local:** Se debe incorporar al proyecto un archivo (ej. `public/colombia.json` o en `utils/`) con la lista oficial de ciudades y departamentos para alimentar estos componentes en tiempo real, sin depender de APIs lentas.
4. **Migración de Negocios Existentes (Script SQL):** Como el sistema actual guardaba la ciudad de forma manual (ej. `"Cali"` o `"cali"`), los negocios antiguos quedarán "huérfanos" y no harán *match* con los nuevos banners (que buscarán el texto exacto `"Cali, Valle del Cauca, Colombia"`). Para solucionarlo de forma automática y segura, se deberá ejecutar un único script `UPDATE` en el SQL Editor de Supabase para estandarizar masivamente el campo `city` de los negocios existentes al nuevo formato.
5. **Prevención de Sobrecarga en Modales (Límites de Líneas):** Para evitar que el archivo `BannerUploadModal.tsx` (actualmente de 247 líneas) exceda el límite permitido por `conceptos.md` (200-250 líneas), extraeremos la lógica de selección de alcance en un subcomponente separado `BannerScopeSelector.tsx`.
6. **Buscador de Autocompletado Server-side:** El selector de negocios en el panel de administración debe realizar búsquedas contra la base de datos de Supabase en tiempo real en lugar de cargar todos los negocios en el cliente, asegurando la escalabilidad del sistema para 10,000+ comercios.

### Organización y Filtros en el Panel Principal:
Para evitar que el panel principal de "Campañas y Marketing" se sature al administrar cientos de banners locales, la interfaz contará de forma obligatoria con:
1.  **Filtros Rápidos (Tabs):** Botones en la parte superior para filtrar la vista de los banners: *Todos | Globales | Por Ciudad | Por Negocio*.
2.  **Buscador de Negocios:** Una barra de búsqueda de texto. El administrador podrá escribir el nombre de un local (Ej: "Terraza Mana") y el sistema filtrará la pantalla para mostrar únicamente los banners configurados para ese menú.

### Proceso de Creación/Edición de Banners:
Al hacer clic en "Agregar Banner", el administrador define:
1.  **Datos Básicos:** Imagen (pasando por compresión), Título y Enlace de destino (`link_url`). *Nota de Negocio: FOWY es el único que diseña y sube las imágenes de los banners para asegurar una calidad visual impecable; el comercio no diseña.*
2.  **Nueva Configuración de Alcance (¿Dónde se mostrará?):** Un selector con 3 niveles de jerarquía:
    *   🌍 **Global (Nivel Nacional):** Se muestra en todos los menús de la plataforma. (Para campañas propias de FOWY, ej. descargas de app).
    *   🏙️ **Ciudad (Buscador con Autocompletado):** No usaremos un paso a paso estricto (País -> Departamento -> Ciudad) ni escritura manual. En su lugar, se implementará una opción premium y rápida: un Buscador con Autocompletado. Al escribir "Cal...", el sistema desplegará "Cali, Valle del Cauca, Colombia" para seleccionarlo con un clic. El banner solo se renderizará si el negocio que el usuario está visitando pertenece a esa ciudad.
    *   🏠 **Específico (Menú Local/Cruce):** Se selecciona el negocio exacto donde aparecerá el banner. Para garantizar escalabilidad visual, **este campo utilizará obligatoriamente un Buscador (Autocomplete/Searchable Dropdown)**. El administrador escribirá ej: "Terr..." y el sistema le arrojará "Terraza Mana" para seleccionarlo. El banner solo se cargará dentro de ese menú en específico, permitiendo la conexión artesanal entre comercios de un barrio.

### Visualización de Métricas (Ficha de Negocio):
Para demostrar el valor comercial de la red cruzada a los comercios, el sistema medirá los clics recibidos desde estos banners locales. Esta estadística se mostrará en `/admin/negocios`, dentro de la vista de edición del negocio, específicamente en la tarjeta de **Métricas de Rendimiento**. 
Se agregará una fila indicando, por ejemplo: *🔗 Visitas por Red de Barrio: 45*. (Esto será el principal argumento de retención al momento de cobrar la suscripción).

---

## 📱 3. Flujo en el Explorador (End User Catalog)

El frontend en `/explorar/[slug]` unificará la presentación. Para lograrlo de la forma más eficiente posible sin hacer peticiones duplicadas y respetando la "Ley del Remolque", el componente `<AutoScrollBanners />` se modificará para recibir el ID del negocio y la ciudad como propiedades:
```tsx
<AutoScrollBanners businessId={business.id} city={business.city} />
```

### Comportamiento del Renderizado (Carrusel Único):
1.  **Fusión de Datos:** El orquestador del nuevo hook `useSegmentedBanners` obtiene todos los banners activos que cumplen con la regla de alcance para el negocio actual (trae los globales + los de su ciudad + los específicos de su menú).
2.  **Lista Única y Sin Límite:** Los fusiona en un solo arreglo (`[...locales, ...ciudad, ...globales]`) dándole prioridad visual a los locales al inicio de la lista. Se mostrarán todos los banners coincidentes sin límite de cantidad para dar máxima visibilidad.
3.  **Visualización e Interacción (Scroll Manual y Swipe):** El carrusel tendrá una marquesina autodeslizable infinita. Sin embargo, para una experiencia premium, si el usuario pone el dedo sobre el carrusel y hace swipe (desliza), la animación CSS se detendrá por completo (pausa absoluta) y se convertirá en un carrusel manual de arrastre (manual drag/swipe con Framer Motion o CSS touch-scroll) para que explore a su propio ritmo. Al quitar el dedo o perder el foco, el auto-desplazamiento se reanudará tras un delay.
4.  **Redirección Directa:** Al dar clic en un banner, el usuario es redirigido automáticamente y de forma instantánea al menú destino (sin cuadros de advertencia ni interrupciones).
5.  **Auto-Cleanup (Negocios Inactivos):** Si un banner de promoción cruzada apunta a un negocio de destino que está inactivo (`status = false` o cerrado), este se filtrará y se excluirá automáticamente del carrusel en tiempo real gracias a la verificación de la relación `destination_business_id` en la consulta.

---

## 🗄️ 4. Estructura de Datos Definitiva (Supabase)

Basado en la estructura real del proyecto en `src/types/supabase.ts`, el sistema actualmente gestiona la publicidad a través de la tabla **`marketing_banners`**. Esta tabla hoy es 100% "ciega y global" (contiene `id`, `image_url`, `link_url`, `title`, `sort_order`, y `is_active`).

Para lograr la promoción cruzada de forma eficiente y segura, **evolucionaremos la tabla `marketing_banners`**.

**Modificación a ejecutar mediante migración SQL:**
Se deben añadir las siguientes tres columnas opcionales (nullable) a la tabla `marketing_banners` para manejar el alcance y la validación de destino:
*   `target_city` (String, nullable): Almacena la ciudad de destino completa en formato estandarizado (Ej: `"Cali, Valle del Cauca, Colombia"`) para evitar colisiones geográficas. Debe coincidir exactamente con el campo `city` de la tabla `businesses`.
*   `target_business_id` (UUID, Foreign Key a `businesses.id`, nullable): Si tiene valor, restringe el banner a ese único menú (origen de la promoción cruzada).
*   `destination_business_id` (UUID, Foreign Key a `businesses.id`, nullable): Si el banner redirige a un negocio dentro de FOWY, esta columna almacena su ID para poder validar de forma automática su estado de actividad (`status`) y realizar el Auto-Cleanup antes de mostrarlo.

*Nota de Consulta (Query): Al cargar el menú de un negocio en Cali (ID '123' con ciudad 'Cali, Valle del Cauca, Colombia'), la API hará un SELECT de `marketing_banners` incluyendo un JOIN con `businesses` (a través de `destination_business_id`) para filtrar solo aquellos donde `destination_business.status = true` (o donde no haya negocio destino asociado) y que cumplan el alcance:*
```sql
SELECT mb.* 
FROM marketing_banners mb
LEFT JOIN businesses dest ON mb.destination_business_id = dest.id
WHERE mb.is_active = true 
  AND (dest.id IS NULL OR dest.status = true)
  AND (
    mb.target_business_id = '123' 
    OR mb.target_city = 'Cali, Valle del Cauca, Colombia' 
    OR (mb.target_business_id IS NULL AND mb.target_city IS NULL)
  );
```

---

## 📐 5. Alineación con las Reglas de Arquitectura (`conceptos.md`)

Esta implementación debe cumplir de manera estricta las directrices de [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md):

1.  **Cumplimiento de la "Ley del Remolque":** Prohibido modificar el hook viejo `useV2BusinessMenuData`. Para obtener la lista combinada de banners bajo esta nueva lógica geográfica, se debe crear un hook totalmente nuevo (ej. `useSegmentedBanners.ts`) desde cero.
2.  **Desacoplamiento Visual:** El componente `AutoScrollBanners` ya existe, pero si requiere ajustes profundos, debe mantenerse aislado y no ensuciar el archivo `page.tsx`.
3.  **Optimización (Fase 8+):** 
    *   Es obligatorio usar la función utilitaria `compressImage` antes de subir cualquier banner nuevo desde "Campañas y Marketing".
    *   Si se elimina un banner de la base de datos, es **obligatorio** eliminar el archivo físico del bucket de Supabase Storage (Storage Cleanup).
    *   La visualización en móvil seguirá usando `<PremiumImage />` para los efectos shimmer de carga.
    *   La consulta de banners debe estar cacheada (SWR o React Query) para no agotar la red en cada recarga.
4.  **Resiliencia y Estética:** Mantener el `<ErrorBoundary>` actual que protege la marquesina, y asegurar que los diálogos en el admin panel al configurar el alcance del banner sean *Toasts Premium* (cero `alert()` nativos).

