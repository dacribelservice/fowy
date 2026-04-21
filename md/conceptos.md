# 💡 CONCEPTOS CLAVE: AISLAMIENTO Y ESCALABILIDAD EN FOWY

> **REGLA DE ORO:** Solo Cristian puede dar la orden de crear código.

En este documento se explica cómo se gestiona la independencia de los negocios y la relación entre subdominios y la base de datos de Supabase.

---

## 1. ¿TABLAS INDEPENDIENTES? (NO FÍSICAS, SÍ LÓGICAS)

En lugar de crear una tabla `pedidos_negocio_1`, `pedidos_negocio_2`, etc., usaremos lo que se llama **Multi-tenancy con RLS**:

*   **Una sola tabla maestra**: Por ejemplo, tendremos una tabla llamada `pedidos`.
*   **La "Llave del Local"**: Cada fila en esa tabla tendrá una columna llamada `negocio_id` (un UUID único).
*   **El Muro (RLS)**: En Supabase, activamos el **Row Level Security**. Esto es como poner un guardia en la puerta de cada local. Cuando el "Negocio A" consulta la base de datos, el guardia (Postgres) automáticamente dice: *"Solo te voy a mostrar las filas donde el `negocio_id` sea el tuyo"*.

### ¿Por qué es mejor así?
*   **Mantenimiento**: Si decides agregar una nueva función (ej: "Propina digital"), solo actualizas la tabla maestra una vez y todos tus negocios la reciben al instante. Si tuvieras tablas independientes, ¡tendrías que actualizar miles de tablas una por una!
*   **Escalabilidad**: Postgres maneja millones de filas en una sola tabla de forma extremadamente rápida si usamos índices.

---

## 2. ¿CÓMO FUNCIONAN LOS SUBDOMINIOS?

Si un negocio quiere usar `pasteleria.fowy.com`, el proceso es este:

1.  **Middleware**: Cuando alguien entra a `pasteleria.fowy.com`, nuestra aplicación (en el **Edge**, antes de cargar) lee el nombre "pasteleria".
2.  **Mapeo**: Busca en la tabla de `negocios` cuál es el ID que corresponde a ese nombre (slug).
3.  **Filtrado Inyectado**: La app le dice a Supabase: *"Oye, voy a pedir datos, y mi identidad actual es la del Negocio XYZ"*.
4.  **Aislamiento Total**: A partir de ahí, el código ni siquiera tiene que preocuparse por filtrar. La base de datos ya sabe que no debe entregar nada que no pertenezca a ese subdominio.

---

## 3. LA ANALOGÍA DEL CENTRO COMERCIAL APLICADA A LA DB

*   **La Base de Datos**: Es el edificio del Centro Comercial.
*   **Las Tablas**: Son los pasillos y la infraestructura (agua, luz, seguridad).
*   **RLS (Row Level Security)**: Son las **paredes de concreto** entre locales. Aunque todos están en el mismo edificio, el del local 1 no puede ver lo que hay dentro del local 2, ni puede entrar a su caja registradora.

### ¿Se puede dañar un negocio y afectar a otros?
**No.** Si un negocio configura mal sus productos o borra sus datos, **solo se borran sus filas**. Debido a que el RLS está configurado a nivel de base de datos, es físicamente imposible que una consulta del "Negocio A" borre o edite algo del "Negocio B".

---

## 4. ESTRATEGIA "CAMALEÓN": THEMING DINÁMICO (FOWY)

Para ofrecer personalización sin sacrificar la escalabilidad, implementaremos un sistema de **Estructura Fija vs. Marca Flexible**.

### El Concepto
Todos los locales comparten el mismo código (el "esqueleto"), pero la personalidad (la "piel") es dinámica.

### Elementos Personalizables (Tokens)
Cada dueño de negocio puede configurar desde su dashboard:
*   **Paleta de Colores**: Color primario, acentos y gradientes.
*   **Branding**: Logo, Favicon y Banners de cabecera.
*   **Tipografía**: Selección de sets de fuentes pre-aprobadas (Google Fonts optimizadas).
*   **Modo Visual**: Opción de Light Mode, Dark Mode o Glassmorphism (Efecto cristal).

### Implementación Técnica: Variables CSS Dinámicas
El sistema carga los valores de la base de datos y los inyecta en el estilo global del subdominio:

```css
:root {
  /* Cargado dinámicamente desde la Tabla 'businesses' */
  --fowy-primary: #negocio_color;
  --fowy-font: 'Font_Negocio';
  --fowy-radius: 12px;
}
```

### Beneficios
1.  **Mantenimiento Centralizado**: Una corrección de un botón arregla el botón en todos los negocios.
2.  **Identidad Propia**: El cliente siente que tiene su propia app personalizada.
3.  **Monetización**: Se pueden ofrecer "Plantillas Premium" como un servicio adicional (Upselling).

---

## 5. ESTRATEGIA DE MAPAS Y NAVEGACIÓN (COSTO EFICIENTE)

Para maximizar el rendimiento y reducir a cero los costos de APIs externas (como Google Maps Platform) en el inicio, seguiremos este modelo:

### A. Exploración Interna (FOWY Map)
*   **Tecnología**: Leaflet + OpenStreetMap (OSM).
*   **Funcionamiento**: FOWY descarga un archivo GeoJSON con los límites de Cali y las coordenadas de los negocios. El mapa se dibuja localmente.
*   **Experiencia**: El usuario descubre negocios, filtra por barrios de Cali y ve promociones sin salir de la app.

### B. Navegación Externa (Deep Linking)
*   **Tecnología**: `geo:` intents y esquemas de URL (`https://maps.google.com/?daddr=...`).
*   **Funcionamiento**: Cuando el usuario decide ir físicamente al local, FOWY lanza una llamada al sistema operativo para abrir la app de GPS preferida (Google Maps, Waze, Apple Maps).
*   **Beneficio**: Tráfico en tiempo real del Valle del Cauca y navegación por voz sin costo para FOWY.

## 6. SOCIAL PROOF Y RETENCIÓN (GAMIFICACIÓN)

Para que el usuario regrese a FOWY, implementaremos elementos que generen confianza y recurrencia:

1.  **"Lo más Pedido en Cali":** Basado en los datos de la tabla `order_items`, mostraremos etiquetas de "Best Seller" en los platos reales más vendidos.
2.  **Validación de Negocio:** Etiquetas de "Negocio Popular" para locales con alto volumen de visitas o favoritos.
3.  **Favoritos Estratégicos:** Permitir al usuario guardar sus locales para que, cuando abra el mapa de Cali, sus lugares preferidos brillen con un color especial.

---
**"FOWY: Estructura de hierro, diseño de seda."**

