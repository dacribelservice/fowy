# 🧠 PLAN DE ACCIÓN GEO (GENERATIVE ENGINE OPTIMIZATION) — FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> 🎯 **DIRECTRIZ ABSOLUTA DEL PROYECTO**: Este plan está enfocado **100% en GEO** (Optimización para Motores de Búsqueda Generativos como ChatGPT, Perplexity, Gemini y Claude). **Queda terminantemente prohibido crear interfaces de usuario, listados visuales, buscadores o pantallas públicas para el cliente.** Todo el posicionamiento debe ocurrir bajo el capó (inyección invisible en el HTML para los crawlers de IA), manteniendo la UX del cliente intacta y libre de código innecesario.

---

## 🎯 El Objetivo GEO
Los motores de búsqueda de IA realizan rastreos en tiempo real para contestar preguntas locales (ej: *"¿Dónde comer hamburguesas en Vallegrande?"*). FOWY inyectará datos en prosa y esquemas estructurados directamente en el código de las páginas de los negocios (`/[slug]`) para alimentar a los bots de IA de forma directa, limpia y sin ambigüedades.

---

## 🛠️ Auditoría de Base de Datos (Mapeo de Campos Reales)
Para evitar errores de compilación en Vercel o valores `undefined`, la lógica de metadatos se alimenta **exclusivamente** de los campos que realmente existen en nuestra base de datos. Queda prohibido inventar campos.

### 🏠 Tabla `businesses` (El Negocio)
*   `name`: Nombre comercial.
*   `city`: Ciudad y departamento estandarizados (ej: *"Cali, Valle del Cauca, Colombia"*).
*   `latitude` y `longitude`: Coordenadas GPS numéricas exactas.
*   `phone`: Número telefónico de pedidos.
*   `tags`: Array de strings para categorías o ubicación secundaria (ej: `["comida rapida", "hamburguesas", "vallegrande"]`).
*   `schedules`: Objeto JSON con la configuración de apertura/cierre diaria.
*   *Nota: No existen campos físicos para "dirección de calle" o "barrio".*

### 🍔 Tabla `products` (El Catálogo)
*   `name`: Nombre del plato.
*   `description`: Ingredientes o detalles.
*   `price`: Precio del producto.
*   `is_active`: Estado de disponibilidad.

---

## 🔍 Estado de Diagnóstico Inicial (¿Qué ve la IA hoy?)
*   **JSON-LD Técnico (Completado ✅):** El archivo `[slug]/layout.tsx` ya inyecta correctamente el JSON-LD con coordenadas GPS, teléfonos y categorías de menús estructuradas.
*   **Metadatos OpenGraph (Completado ✅):** El archivo `[slug]/layout.tsx` expone etiquetas `<title>` y `<meta>` OpenGraph/Twitter.
*   **Sitemap y Robots (Completado ✅):** `robots.ts` y `sitemap.ts` permiten y guían el rastreo de bots de IA.
*   **Resumen Semántico en Prosa (Pendiente ❌):** El archivo `[slug]/page.tsx` no tiene implementado el contenedor invisible `sr-only` con el resumen semántico ni la lógica para estructurar el horario y productos destacados en lenguaje natural.
*   **Accesibilidad Agéntica (Pendiente ❌):** Faltan etiquetas descriptivas en elementos interactivos (carrusel de imágenes y enlaces del Footer) para que los navegadores agénticos entiendan qué hace cada botón o enlace.
*   **Folleto de Bienvenida (Pendiente ❌):** No existe el archivo `public/llms.txt` para ofrecer una indexación rápida y directa de toda la plataforma en menos de 1 milisegundo.

---

## 🏛️ Los 5 Pilares Técnicos de GEO (Bajo el Capó)

### ✍️ Pilar 1: Resumen Semántico Invisible (`sr-only`)
Las IAs procesan textos descriptivos en prosa con mayor facilidad que listas de botones interactivas.
*   **Implementación:** En el render inicial de la página de menús (`src/app/(explorer)/[slug]/page.tsx`), se inyecta un bloque de texto descriptivo invisible para el usuario humano (`className="sr-only"`), pero perfectamente legible para los bots.
*   **Lógica de Mapeo Real (Código Seguro):**
    1.  **Nombre y Categoría:** Obtenidos de `business.name` y los primeros `business.tags` (ej: *"restaurante de comidas rápidas"*).
    2.  **Ubicación:** Obtenida de `business.city` combinada con las coordenadas GPS `(lat: business.latitude, lng: business.longitude)`.
    3.  **Horarios:** Construidos dinámicamente mapeando el JSON de `business.schedules`:
        ```typescript
        const activeDays = Object.entries(business.schedules || {})
          .filter(([_, sched]: [string, any]) => sched && sched.active !== false)
          .map(([day, sched]: [string, any]) => `${day} (${sched.open || '09:00'} a ${sched.close || '22:00'})`)
          .join(", ");
        ```
    4.  **Menú:** Mapeado desde la lista de productos activos (`products.slice(0, 5)`):
        ```typescript
        const productsSummary = products
          .slice(0, 5)
          .map(p => `${p.name} por $${p.price.toLocaleString("es-CO")}`)
          .join(", ");
        ```
*   **Formato de Texto Renderizado:**
    ```html
    <div className="sr-only" aria-hidden="true">
      {business.name} es un restaurante de comidas rápidas ubicado en {business.city}. 
      Ubicación exacta coordenadas GPS: {business.latitude}, {business.longitude}.
      Horarios de atención: {activeDays}. 
      Su menú digital de Fowy ofrece especialidades como {productsSummary}. 
      Pedidos directos por WhatsApp al {business.phone}.
    </div>
    ```

### 🗂️ Pilar 2: Schema JSON-LD de Menú y Ubicación
Las IAs estructuran sus tarjetas informativas y mapas (como el mapa nativo en ChatGPT) leyendo el formato estandarizado JSON-LD.
*   **Implementación:** Enriquecer el script de tipo `@type: FoodEstablishment` o `@type: Restaurant` en `[slug]/layout.tsx` para inyectar:
    *   `geo`: Mapeando `latitude` y `longitude` validados como números.
    *   `address`: Mapeando `addressLocality` desde `business.city` y `addressCountry` desde `business.country || 'CO'`.
    *   `menu`: Mapeando `hasMenuSection` construido dinámicamente agrupando los productos activos de Supabase por su categoría de base de datos.

### ♿ Pilar 3: Accesibilidad Agéntica (ARIA Labels / Div Conversion)
Los agentes de IA que navegan por la pantalla leen las etiquetas de accesibilidad del navegador para saber cómo interactuar con botones o enlaces sin texto.
*   **En Carruseles (`MenuHeroSliderV2.tsx`):** Añadir `aria-label` a los botones indicadores de cambio de imagen:
    ```html
    <button aria-label={`Ver banner ${index + 1}`} ... />
    ```
*   **En Iconos del Footer sin Links (`Footer.tsx`):** Convertir las etiquetas de redes sociales de `motion.a` a `motion.div` y añadirles `aria-hidden="true"`. Esto oculta los iconos vacíos de los bots de IA (evitando fallos de accesibilidad en la auditoría), pero los mantiene 100% interactivos y visuales para los clientes humanos.

### 📄 Pilar 4: Folleto de Bienvenida para IAs (`public/llms.txt`)
Evita que los bots consuman ancho de banda escaneando todo el sitio web a ciegas. Este archivo resume Fowy y su sitemap en 1 milisegundo.
*   **Implementación:** Crear `public/llms.txt` con formato Markdown estructurado:
    ```markdown
    # Fowy - Directorio de Menús Digitales Locales

    Fowy es una plataforma modular que permite a los restaurantes locales de Cali, Colombia, publicar sus menús digitales y recibir pedidos directamente por WhatsApp.

    ## Enlaces Útiles
    - [Sitemap Completo](https://fowy.pro/sitemap.xml)
    - [Directorio del Explorador](https://fowy.pro/explorar)
    ```

### 🛡️ Pilar 5: Escudo Failsafe (Riesgo Cero)
Dado que los datos de la inyección GEO dependen de consultas a Supabase en el servidor, cualquier error debe aislarse por completo:
*   **Aislamiento:** Toda la generación de textos y JSON-LD dinámicos debe estar envuelta en bloques `try-catch`.
*   **Valores de respaldo:** Si falla la consulta, el bloque catch capturará el error de forma silenciosa y devolverá metadatos y resúmenes genéricos predefinidos.
*   **Resultado:** El usuario final nunca experimentará una pantalla de error 500 y su menú cargará con total normalidad.

---

## 📋 Checklist de Ejecución GEO

### 📁 Fase 1: Inyección de Resúmenes Semánticos en el Menú (Pilares 1 y 5)
- [x] **1.1** Modificar `src/app/(explorer)/[slug]/page.tsx` para generar de manera automática y dinámica el string del resumen semántico en prosa a partir de las columnas reales (`business.name`, `business.city`, `business.schedules`, `business.phone` y `products`).
- [x] **1.2** Renderizar este string de resumen dentro de una etiqueta invisible (`className="sr-only"`) en la parte superior del HTML de la página.
- [x] **1.3** Envolver toda la lógica de armado de datos y formateo en un bloque `try-catch` (Escudo Failsafe) para garantizar que ante cualquier error se sirva un texto de respaldo por defecto y la página del menú cargue sin error 500.

### 📁 Fase 2: Corrección de Accesibilidad Agéntica (Pilar 3)
- [x] **2.1** Modificar `src/components/explorer/Footer.tsx` para cambiar la etiqueta de los iconos de redes sociales de `motion.a` a `motion.div` y añadirles `aria-hidden="true"`, ocultándolos temporalmente del árbol de accesibilidad de los bots mientras no tengan enlaces reales.
- [x] **2.2** Modificar los botones de cambio de diapositivas en los carruseles (como `MenuHeroSliderV2.tsx`) añadiéndoles un atributo `aria-label` dinámico (ej: `aria-label={`Ver banner ${index + 1}`}`) para que los bots identifiquen su función.

### 📁 Fase 3: Folleto de Bienvenida para IAs (Pilar 4)
- [x] **3.1** Crear el archivo estático `public/llms.txt` en formato Markdown con el título H1 y la descripción general del sitemap y el directorio del explorador para facilitar la indexación rápida de los crawlers de LLM.

---
*Última actualización: 14 de Julio de 2026 — Estrategia de GEO Pura detallada con checklist de pasos técnicos e inofensivos.*
