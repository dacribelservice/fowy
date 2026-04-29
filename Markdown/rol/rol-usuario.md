# 🌍 ROL: EXPLORADOR (USUARIO FINAL)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Este documento define la experiencia del cliente final en FOWY. Se rige bajo una arquitectura de **"Mobile-First Shell"** para garantizar una experiencia uniforme en cualquier dispositivo.

---

## 📱 ARQUITECTURA DE VISUALIZACIÓN (The Shell)

Para mantener la esencia de "App Móvil" incluso en navegadores de escritorio, el sistema se comportará de la siguiente manera:

### 1. En Pantallas de PC (Desktop)
*   **Plantilla de Celular (Obligatorio)**: La UI/UX de la aplicación vivirá dentro de un contenedor centrado que simula un smartphone (Frame).
*   **Dimensiones del Frame**: Aproximadamente `375px` a `420px` de ancho, con bordes redondeados y sombra profunda.
*   **Laterales (Sidebars)**: El espacio sobrante a la izquierda y derecha se utilizará para mostrar **Información Relevante** (Branding de FOWY, Ayuda, Enlaces rápidos o Publicidad dinámica).
*   **Efecto**: El fondo general de la PC usará el degradado suave de `diseño.md`, mientras que el frame del celular destacará con `glass-morphism` y sombras premium.

### 2. En Pantallas de Celular (Native Mobile)
*   **Adaptación Total**: El frame desaparece y la UI ocupa el **100% de la pantalla**, comportándose como una Web App nativa.

---

## 🎨 LENGUAJE VISUAL (Basado en diseño.md)
*   **Superficies**: Uso obligatorio de `glass-morphism` con `backdrop-blur-xl` y bordes blancos traslúcidos.
*   **Colores Core**:
    *   **Botones Críticos/Checkout**: Gradiente **Energy** (`from-[#FF5A5F] to-[#FF9A3D]`).
    *   **Elementos Activos/Filtros**: Gradiente **Flow** (`from-[#7B61FF] to-[#4D8BFF]`).
*   **Geometría**: Todos los contenedores, botones y tarjetas deben usar `rounded-[20px]` (clase `rounded-fowy`).
*   **Fondo App**: Degradado suave de `[#FBFAFF]` a `[#EEF5FF]`.

---

## 🏛️ FLUJO DE EXPERIENCIA (UX) - DENTRO DEL FRAME

### 1. 📍 Home: Descubrimiento Inteligente (Map-Centric)
*   **Mapa Maestro**: Fondo completo del frame. Estética **Grayscale/Dark Grey** premium.
*   **Header Minimalista (Sin Títulos)**:
    *   **Perfil**: Botón circular a la derecha (acceso a configuración/pedidos).
    *   **Buscador Expansible**: Círculo con lupa a la izquierda del perfil (ambos en el lado derecho superior). Al activarse, se expande horizontalmente ocupando el ancho necesario.
*   **Bottom Navigation (Categorías)**: Las categorías actúan como el menú principal en la parte inferior.
*   **Interacción**: Al hacer clic en una categoría, se despliega un **Bottom Sheet** (cristal) con la lista de negocios correspondientes.
*   **Sin Barra Inferior**: Se elimina la barra de navegación tradicional para maximizar el área visual del mapa.

### 2. 🏪 Selección y Menú Digital
*   **Bottom Sheet**: Rejilla de **2 columnas** con logos circulares.
*   **Vista de Menú**: Tarjetas de producto con efecto de elevación y colores dinámicos del negocio.

### 3. 🛒 Carrito y Checkout Express
*   **Carrito**: Persistencia local (sin login). Sube desde abajo con estética de cristal.
*   **Checkout**: Formulario minimalista con botón **Energy** para el envío.

---

## 🗺️ HOJA DE RUTA: CHECKLIST DE IMPLEMENTACIÓN

Esta lista sigue los principios de **modularidad** y **limpieza** de `conceptos.md`.

### 🏗️ Fase 1: Arquitectura Maestro (The Shell)
- [x] **1.1 Explorer Layout**: Crear `app/(explorer)/layout.tsx` con el contenedor `MobileFrame`.
- [x] **1.2 Responsive Bridge**: Implementar lógica de CSS para ocultar el frame en pantallas móviles (`hidden md:block`).
- [x] **1.3 Side Panels**: Crear los componentes `ExplorerInfoLeft` y `ExplorerInfoRight` para el contenido de escritorio.
- [x] **1.4 Global Transitions**: Configurar `AnimatePresence` para transiciones suaves entre pantallas dentro del frame.
- [x] **1.5 Minimalist UI Cleanup**: Eliminar la barra de navegación inferior y limpiar el header de títulos.

### 📍 Fase 2: Home y Descubrimiento (El Mapa)
- [x] **2.1 Map Integration**: Crear `ExplorerMap.tsx` con carga dinámica (`ssr: false`) y estética **Clean Light** (Estilo Google Maps/Carto).
- [x] **2.2 Circular Search Engine**: Implementar lupa circular expansible horizontalmente en el header.
- [x] **2.3 Category Bottom Menu**: Carrusel de categorías en la parte inferior (sin títulos arriba).
- [x] **2.4 Bottom Sheet Trigger**: Al hacer clic en una categoría, subir panel con negocios etiquetados.
- [x] **2.5 Business Pins**: Marcadores minimalistas en el mapa que interactúan con el Bottom Sheet.

### 🍔 Fase 3: Menú y Experiencia de Compra
- [x] **3.1 Business Explorer Sheet**: Implement the Bottom Sheet con la rejilla de negocios (2 columnas).
- [x] **3.2 Digital Menu Page**: Ruta `app/(explorer)/[slug]/page.tsx` con inyección de branding dinámico.
- [x] **3.3 Product Grid**: Componentes `ProductCard` atomizados y optimizados para carga rápida.
- [x] **3.4 Cart Logic**: Hook `useCart.ts` para gestión de estado en `localStorage`.

### 📲 Fase 4: Checkout y WhatsApp Bridge
- [x] **4.1 Shopping Cart Sheet**: Panel de revisión de pedido con estética Glassmorphism.
- [x] **4.2 Checkout Form**: Pantalla de ingreso de datos del cliente (Sin registro obligatorio).
- [x] **4.3 WhatsApp Link Generator**: Lógica de formateo de mensaje con link de retorno al panel administrativo.
- [x] **4.4 Analytics Tracking**: Registrar visita y clic de pedido en Supabase para métricas del negocio.

### ✨ Fase 5: Refinamiento Estético Final (Wow Effect)
- [x] **5.1 Orange Gradient Background**: Implementado fondo vibrante `FF8A00` a `FF0000` con textura de cubos.
- [x] **5.2 Compact Frame**: Reducción de dimensiones del `MobileFrame` a `340x720` para ajuste óptimo en escritorio.
- [x] **5.3 Grey Map Aesthetic**: Aplicación de filtro grayscale y contraste al mapa para look premium.
- [x] **5.4 Global Navigation Sync**: Sincronización del perfil y búsqueda expansible entre Layout y Páginas.
- [x] **5.5 Category Bar Polish**: Refinamiento estético total: integrado control de flechas clásicas (Arrow Icons), indicador naranja con ancho dinámico proporcional y ajuste de precisión en el scroll para visualización perfecta de la última categoría.
- [x] **5.6 Contrast UI Cards**: Actualización de contenedores y tarjetas a Gris Claro (Zinc-100) para máxima legibilidad y estética premium.
- [x] **5.7 Header Alignment**: Reubicación de controles de navegación al lado derecho superior para ergonomía mobile-first.

---
## 🛡️ SEGURIDAD Y RENDIMIENTO (Reglas Conceptos.md)
*   **Paginación**: Todos los listados de negocios deben cargar por bloques de 20.
*   **Imágenes**: Uso obligatorio de `PremiumImage` para manejar esqueletos de carga.
*   **Orquestación**: Ninguna página de este módulo podrá exceder las 250 líneas.
*   **RLS**: Las consultas de búsqueda deben ser vía `anon-key` con políticas de solo lectura en tablas públicas.

---
*Dacribel Engine - Manual de Rol Usuario v1.6 - Master Checklist Activa*
