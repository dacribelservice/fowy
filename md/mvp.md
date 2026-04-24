# 🎯 FOWY MVP: FASE 1 - MOTOR DE NEGOCIOS Y EXPLORACIÓN GLOBAL

> **REGLA DE ORO:** Solo Cristian, el CEO de Fowy, va a poder dar la orden para hacer copias de seguridad en GitHub y dar la orden para ejecutar líneas de código.

> "Empieza pequeño, luce gigante."

## 1. OBJETIVO DEL MVP
Demostrar la potencia de FOWY como visor de menús premium, con carga instantánea y diseño de alta gama. El enfoque es el **Producto Final** (el Menú que ve el cliente) y la capacidad de descubrimiento de toda la plataforma.

## 2. FASE 0: LA CONSTRUCCIÓN DEL BÚNKER (SEGURIDAD CORE)

Antes de mostrar el primer menú, estableceremos los cimientos de seguridad que protegerán todo el proyecto a largo plazo.

### Pilares del Búnker:
1.  **Tablas Blindadas (RLS First)**: Ninguna tabla se crea sin sus políticas de seguridad activas. El acceso a datos está filtrado por negocio a nivel de base de datos.
2.  **Identidad Protegida (Roles MVP)**: 
    *   **BUSINESS**: Acceso a su dashboard administrativo y edición de sus propios productos.
    *   **USER**: Acceso a visualización de todos los menús y catálogo global de la plataforma.
3.  **Logs de Auditoría**: Sistema de registro inmutable para cada cambio en los menús (Precio, Stock, Visibilidad).
4.  **Escudo de Middleware**: Validación de subdominios y roles en el Edge antes del renderizado.

---

## 3. EL "CORE" DEL MVP (NEGOCIO Y EXPLORACIÓN)

En esta fase, conectamos al dueño del negocio con el cliente final. FOWY actúa como el "Mall" que contiene todos los locales.

### Funcionalidades Incluidas:
1.  **Motor de Rendimiento**: Interfaz móvil-primero ultra rápida (ISR/Server Components).
2.  **Mapeo de Subdominios**: `negocio.fowy.com` muestra el menú específico del `negocio`.
3.  **Experiencia del Usuario (Exploración Local - Cali)**:
    *   **Mapa Interactivo (Cali-Geo):** Pantalla principal dinámica que muestra todos los negocios en el mapa de Cali usando GeoJSON local para máxima velocidad.
    *   **Navegación Omnipresente:** Un acceso al "Directorio Global FOWY" presente en todos los menús, permitiendo al usuario saltar de un negocio al mapa de la ciudad.
4.  **Dashboard de Negocio (El Gestor)**:
    *   **Panel de Control Premium:** Visualización clara del flujo de trabajo del día.
    *   **KPIs Financieros:** 
        *   Venta Total (Día/Mes).
        *   Ticket Promedio (Venta / # Pedidos).
        *   Contador de Pedidos (Realizados vs Completados).
    *   **KPIs de Oportunidad (Inteligencia):**
        *   **Tasa de Conversión:** % de visitantes que se convierten en compradores.
        *   **Productos Estrella:** Top 5 items con mayor retorno.
        *   **Peak Hours:** Mapa de calor de horas de mayor actividad para optimizar operación.
5.  **Cierre de Venta (WhatsApp Order Engine)**:
    *   **Generador de Mensaje Estructurado:** FOWY compila el carrito y los datos del cliente en una lista legible.
    *   **Redirección Directa:** Un botón de "Confirmar en WhatsApp" que abre el chat del negocio con el pedido listo para enviar.
    *   **Datos incluidos en el mensaje:** Nombre, Teléfono, Dirección de entrega, Lista de productos, Cantidades, Precios y Total.
6.  **Experiencia del Usuario (Retención)**:
    *   **Mis Favoritos:** El usuario puede marcar negocios en el mapa de Cali para acceso rápido.
    *   **Historial Local:** Lista de sus últimos pedidos realizados.
7.  **Integración con Supabase**: Sincronización de datos y analítica básica en tiempo real.

---

## 4. ESQUEMA DE DATOS MÍNIMO (MVP)

Para que esto funcione, solo necesitamos estas tablas iniciales:
- **`profiles`**: ID, Email, Role (BUSINESS / USER).
- **`cities`**: ID, Name, Slug, Center_Coords.
- **`businesses`**: ID, City_ID, Nombre, Logo, Slug, Location (Lat/Lng), Barrio, Metadata de Diseño.
- **`categories`**: ID, Business_ID, Nombre, Orden.
- **`menu_items`**: ID, Category_ID, Nombre, Descripción, Precio, Imagen_URL, Visibilidad.
- **`analytics_basic`**: ID, Business_ID, Event_Type (view_menu, click_item), Timestamp.

---

## 5. DISEÑO "THE SOLAR FLARE" (FACTOR WOW)

En el MVP, el diseño es nuestra mayor ventaja competitiva. Implementaremos un entorno de **alta energía y máxima visibilidad**:
*   **Geometría Fluida**: Uso obligatorio de formas de **Píldora (Redondeado nivel 3)** en todos los botones e inputs.
*   **Barra de Navegación "FOWY Connect"**: Una barra flotante en el pie de página que utiliza el Rojo Primario (#ff0000) para destacar sobre el fondo claro.
*   **Contraste Energético**: Base blanca impecable con acentos vibrantes en Ámbar y Verde Azulado para una lectura rápida.
*   **Micro-interacciones Kinéticas**: Los elementos ganan saturación al interactuar, indicando movimiento y precisión.
*   **Tipografía Clínica**: Uso exclusivo de **Inter** en pesos Bold para encabezados.

---

## 6. PRÓXIMOS PASOS TÉCNICOS
1.  Inicializar proyecto **Next.js**.
2.  Configurar **Middleware** para lectura de subdominios y validación de sesiones.
3.  Configurar **Supabase Auth & RLS** para los roles BUSINESS y USER.
4.  Crear la primera **Plantilla Maestra** de menú digital con el Directorio Global integrado.

---

## 📝 CHECKLIST DE EJECUCIÓN (ROADMAP DETALLADO)

### 🏗️ FASE 1: CIMIENTOS Y SEGURIDAD (EL BÚNKER)
- [x] **1.1 Inicialización del Proyecto**: Configuración de Next.js, Tailwind/Vanilla CSS y estructura de carpetas modular.
- [x] **1.2 Despliegue de DB**: Creación de tablas base (`profiles`, `cities`, `businesses`, `categories`, `menu_items`) en Supabase.
- [x] **1.3 Blindaje RLS**: Implementación de políticas de seguridad por `negocio_id` en todas las tablas.
- [x] **1.4 Sistema de Auth**: Configuración de Supabase Auth y sincronización con la tabla `profiles`.
- [x] **1.5 Middleware de Seguridad**: Protección de rutas administrativas y validación de sesiones en el Edge.

### 🌐 FASE 2: MOTOR DE SUBDOMINIOS Y EXPLORACIÓN
- [x] **2.1 Mapeo de Subdominios**: Lógica de Middleware para leer `nombre.fowy.com` y extraer datos del negocio.
- [x] **2.2 Mapa Interactivo de Cali**: Implementación del visor GeoJSON local y marcadores de negocios.
- [x] **2.3 Directorio Global**: Buscador de negocios por barrios de Cali y categorías (Comida, Servicios, etc.).

### 🍱 FASE 3: EL PRODUCTO ESTRELLA (MENÚ DIGITAL)
- [x] **3.1 Plantilla Maestra UI**: Diseño premium con Glassmorphism y Skeleton Loaders.
- [x] **3.2 Navegación de Productos**: Agrupación por categorías y visualización detallada de items.
- [x] **3.3 Carrito Local**: Lógica de selección de productos y cantidades persistente en la sesión.
- [x] **3.4 WhatsApp Order Engine**: Generador de mensajes dinámicos con toda la información del pedido.

### 📊 FASE 4: DASHBOARD ADMINISTRATIVO (BUSINESS)
- [x] **4.1 Gestor de Inventario**: CRUD completo de productos y categorías con carga de imágenes.
- [x] **4.2 Panel de KPIs Financieros**: Visualización de ventas, pedidos y ticket promedio.
- [x] **4.3 Panel de Inteligencia**: Tasa de conversión y mapa de calor de horas pico.
- [x] **4.4 Configuración de Marca**: Personalización de logo, colores y banner del negocio.

### ✨ FASE 5: PULIDO Y "WOW FACTOR"
- [x] **5.1 Barra FOWY Connect**: Integración de la navegación global dentro de cada menú individual.
- [x] **5.2 Sistema de Favoritos**: Funcionalidad para que el usuario guarde sus locales preferidos.
- [x] **5.3 Micro-Animaciones**: Implementación de transiciones suaves y hover effects premium.
- [x] **5.4 Auditoría Final**: Pruebas de carga, seguridad y SEO.

### 🌍 FASE 6: INTELIGENCIA GEOGRÁFICA Y ESCALABILIDAD
- [x] **6.1 Geolocalización Activa**: Implementación de la Geolocation API para auto-centrado del mapa.
- [x] **6.2 Validación de Cobertura (3km)**: Lógica de cálculo de distancia (Haversine) para filtrar negocios.
- [x] **6.3 UI "Modo Expansión"**: Pantalla de feedback para usuarios en zonas sin cobertura.
- [x] **6.4 Tracking de Demanda Insatisfecha**: Registro de intentos de acceso fuera de zona para el Admin Master.
- [x] **6.5 Refinamiento Estético SaaS**: Aplicación del sistema de diseño Next-Gen (iconos minimalistas y degradados dinámicos).

---
**"FOWY: Un paso a la vez, hacia el éxito global."**
