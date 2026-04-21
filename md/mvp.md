# 🎯 FOWY MVP: FASE 1 - MOTOR DE NEGOCIOS Y EXPLORACIÓN GLOBAL

> **REGLA DE ORO:** Solo Cristian puede dar la orden de crear código.

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

## 5. DISEÑO "WOW FACTOR"

En el MVP, el diseño es nuestra mayor ventaja competitiva. Implementaremos:
*   **Barra de Navegación "FOWY Connect"**: Una barra sutil y elegante en los menús que permite al usuario saber que está en un ecosistema más grande y saltar al catálogo global.
*   **Skeleton Loaders**: Para que la app se sienta instantánea mientras cargan los datos.
*   **Micro-interacciones**: Hover en productos y scroll suave entre categorías.
*   **Tipografía Moderna**: Uso de fuentes premium que denoten calidad.

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
- [ ] **1.4 Sistema de Auth**: Configuración de Supabase Auth y sincronización con la tabla `profiles`.
- [ ] **1.5 Middleware de Seguridad**: Protección de rutas administrativas y validación de sesiones en el Edge.

### 🌐 FASE 2: MOTOR DE SUBDOMINIOS Y EXPLORACIÓN
- [ ] **2.1 Mapeo de Subdominios**: Lógica de Middleware para leer `nombre.fowy.com` y extraer datos del negocio.
- [ ] **2.2 Mapa Interactivo de Cali**: Implementación del visor GeoJSON local y marcadores de negocios.
- [ ] **2.3 Directorio Global**: Buscador de negocios por barrios de Cali y categorías (Comida, Servicios, etc.).

### 🍱 FASE 3: EL PRODUCTO ESTRELLA (MENÚ DIGITAL)
- [ ] **3.1 Plantilla Maestra UI**: Diseño premium con Glassmorphism y Skeleton Loaders.
- [ ] **3.2 Navegación de Productos**: Agrupación por categorías y visualización detallada de items.
- [ ] **3.3 Carrito Local**: Lógica de selección de productos y cantidades persistente en la sesión.
- [ ] **3.4 WhatsApp Order Engine**: Generador de mensajes dinámicos con toda la información del pedido.

### 📊 FASE 4: DASHBOARD ADMINISTRATIVO (BUSINESS)
- [ ] **4.1 Gestor de Inventario**: CRUD completo de productos y categorías con carga de imágenes.
- [ ] **4.2 Panel de KPIs Financieros**: Visualización de ventas, pedidos y ticket promedio.
- [ ] **4.3 Panel de Inteligencia**: Tasa de conversión y mapa de calor de horas pico.
- [ ] **4.4 Configuración de Marca**: Personalización de logo, colores y banner del negocio.

### ✨ FASE 5: PULIDO Y "WOW FACTOR"
- [ ] **5.1 Barra FOWY Connect**: Integración de la navegación global dentro de cada menú individual.
- [ ] **5.2 Sistema de Favoritos**: Funcionalidad para que el usuario guarde sus locales preferidos.
- [ ] **5.3 Micro-Animaciones**: Implementación de transiciones suaves y hover effects premium.
- [ ] **5.4 Auditoría Final**: Pruebas de carga, seguridad y SEO.

---
**"FOWY: Un paso a la vez, hacia el éxito global."**
