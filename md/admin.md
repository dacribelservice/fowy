# Fowy Admin (Dueño de Fowy) - Especificaciones

> **Referencia Local:** [admin.md](file:///c:/Users/cange/Documents/fowy/md/admin.md)  
> **Estructura de URLs (Puerto 3000):**
> - **Usuarios Regulares:** [http://localhost:3000/](http://localhost:3000/)
> - **Panel de Negocios:** [http://localhost:3000/negocio](http://localhost:3000/negocio)
> - **Fowy Master Admin:** [http://localhost:3000/fowy-admin](http://localhost:3000/fowy-admin)

Este documento define la estructura y objetivos del panel maestro para el dueño de la plataforma Fowy.

## 🗺️ Visualización de la Estructura (Master Admin)

```mermaid
graph TD
    A[Master Admin Dashboard] --> B[Directorio Maestro]
    A --> C[Gestión de Vendedores]
    A --> D[Gestión de Profesionales]
    A --> E[Categorías Globales]
    A --> F[Finanzas Globales]
    A --> G[Bóveda de Seguridad]

    B -- "Seleccionar Negocio" --> H[EL BÚNKER (Master Business Editor)]
    
    subgraph "Niveles del Búnker (Configuración Profunda)"
    H --> H1[Identidad: Marca/Colores]
    H --> H2[Cartera: Pagos/Recibos]
    H --> H3[Operación: GPS/Radio]
    H --> H4[Módulos: Plug & Play]
    H --> H5[Puente: WhatsApp/Pedidos]
    H --> H6[Soporte: Impersonate/KPIs]
    end
```

## 📈 KPIs Clave (Dashboard Principal)

1. **Negocios Totales**: Conteo general de locales registrados en el ecosistema.
2. **Estado de Red**: Métricas de negocios **Activos** vs. **Inactivos/Suspendidos**.
3. **Volumen Global de Pedidos**: Seguimiento del flujo total de intención de compra (clics en WhatsApp) en toda la plataforma.
4. **Categoría Reina**: Identificación de la categoría con mayor tracción y conversión en Cali.
5. **Tráfico de Usuarios**: Monitor de usuarios únicos explorando el mapa de Cali en tiempo real.
6. **Mapa de Calor de Demanda (Zonas Sin Cobertura)**: Visualización de áreas geográficas desde donde los usuarios intentan acceder pero no encuentran negocios cerca. (KPI Crítico para expansión).

## 🗄️ Estructura de Tablas (Base de Datos)

### 1. Tabla: `negocios` (Maestra)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único. |
| `nombre` | String | Nombre comercial del negocio. |
| `logo_url` | String | URL de la imagen del logo. |
| `banner_url` | String | URL de la imagen de portada. |
| `id_owner` | UUID | Referencia al usuario dueño del local. |
| `activo` | Boolean | Switch maestro para mostrar/ocultar en el mapa. |
| `coordenadas` | GeoPoint | Latitud y longitud para el MapViewer. |
| `plan_id` | Integer | Nivel de suscripción (ej: 0=Gratis, 1=Premium). |
| `subdomain` | String | El slug para el acceso (ej: `bunker`). |

### 2. Tabla: `categorias` (Gestión Central)
- **Campos**: `id`, `nombre`, `imagen_url`, `orden_prioridad`.
- **Uso**: El Admin Master define qué categorías existen y qué iconos se muestran en el mapa.

### 3. Tabla: `analytics_global` (Big Data)
- **Campos**: `id_negocio`, `evento` (click_wa, vista_perfil), `timestamp`, `ubicacion_usuario`.
- **Uso**: Alimentar el "Solar Heatmap" y los reportes de rendimiento.

### 4. Tabla: `usuarios_master`
- **Uso**: Credenciales y permisos para el equipo interno de Fowy que opera el Bunker Admin.

## 📝 CHECKLIST DE EJECUCIÓN (ROADMAP FOWY-ADMIN)

### 🏗️ FASE 1: CIMIENTOS Y ESTILO "SOLAR FLARE"
- [x] **1.1 Estructura Base (Layout):** Implementar el layout maestro con Sidebar lateral y Header en modo claro.
- [x] **1.2 Sistema de Navegación:** Configurar rutas internas (Dashboard, Negocios, Categorías, Analytics).
- [x] **1.3 Tokens de Diseño:** Aplicar la paleta de colores (Rojo Primario, Ámbar) y la regla de la Píldora (redondeado nivel 3).

### 📊 FASE 2: DASHBOARD DE CONTROL MAESTRO (KPIs)
- [x] **2.1 Implementación de KPIs Globales:** Visualización de Negocios Totales, Estado de Red y Volumen de Pedidos.
- [x] **2.2 Monitor de Tráfico en Tiempo Real:** Gráfica de usuarios activos explorando el mapa.
- [x] **2.3 Insights de Categorías:** Identificación visual de la "Categoría Reina".

### 🗄️ FASE 3: GESTIÓN ESTRATÉGICA (BUNKER CONTROL)
- [x] **3.1 Directorio Maestro de Negocios:** Tabla interactiva con filtros por ciudad, plan y estado.
- [x] **3.2 Switch de Activación:** Control maestro para habilitar/deshabilitar locales en el mapa instantáneamente.
- [x] **3.3 Editor de Categorías Globales:** Gestión centralizada de las categorías que aparecen en toda la plataforma.

### 🏰 FASE 5: EL BÚNKER (SISTEMA DE PESTAÑAS MAESTRO)
*Diseño Minimalista, Colores Pastel y Botones Estilizados.*

- [x] **5.1 Arquitectura de Navegación:** Implementar el menú de pestañas internas del Búnker.
- [x] **5.2 Pestaña Identidad (Marca):** 
    - [x] Gestión de Slugs, Color HEX y Branding Visual.
- [ ] **5.3 Pestaña Cartera (Blindaje Financiero):** 
    - [ ] Fecha de corte dinámica y repositorio de recibos.
    - [ ] Sistema de alertas (Amarillo/Rojo/Bunker Lock).
- [ ] **5.4 Pestaña Operación (Geocerca):** 
    - [ ] Selector GPS en mapa y radio de visibilidad.
- [ ] **5.5 Pestaña Módulos (Plug & Play):** 
    - [ ] Switch para Inventario, Estadísticas y Gestión de Pedidos.
- [ ] **5.6 Pestaña Pedidos (Bridge):** 
    - [ ] Número de WhatsApp Maestro y Template de mensajes.
- [ ] **5.7 Pestaña Soporte (Master Access):** 
    - [ ] Botón de "Impersonate" y monitoreo de KPIs individuales.

---
**"FOWY Admin: El poder total sobre el ecosistema."**
