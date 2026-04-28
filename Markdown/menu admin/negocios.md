# 🏪 MÓDULO: GESTIÓN DE NEGOCIOS (ADMIN)

> ⚠️ **REGLA DE ORO**: Solo Cristian (CEO de FOWY) tiene autoridad para ordenar copias de seguridad (Backups) en GitHub.

Este módulo es el corazón de la administración de FOWY. Permite el control total sobre los establecimientos afiliados, su categorización y las funcionalidades (módulos) que tienen contratados.

---

## 🚀 1. FLUJO DE CREACIÓN Y ALMACENAMIENTO
- **Manual**: El negocio se crea directamente desde el panel de administración por el Super Admin.
- **URL (Slug)**: Se genera **automáticamente** al escribir el nombre (ej: "Pizza Real" -> "pizza-real").
- **Imágenes**: Se guardan en **Supabase Storage** (Categorías y Logos de negocios).

## 🏷️ 2. GESTIÓN DE CATEGORÍAS (COMIDA)
El Super Admin crea las categorías manualmente para que los negocios puedan elegirlas.
- **Visualización**: Fila superior de **círculos pequeños**.
- **Acción**: Al final de la fila habrá un círculo con el signo **(+)**.
- **Creación**: 
  - **PC**: Abre una ventana emergente (Modal).
  - **Móvil**: Abre un panel desde abajo (Bottom Sheet).
  - Permite subir `Nombre` e `Imagen`.

## 🧩 3. PLANES Y MÓDULOS (Switches)
Trato individual mediante **Switches**, organizados en 3 niveles:
- **Standard**: Básico.
- **Pro**: Intermedio.
- **Premium**: Avanzado.

---

## 🖥️ DISEÑO DE LA PANTALLA (INTERFAZ PREMIUM)

### Buscador y Filtros Inteligentes
- **Buscador**: Capacidad de buscar por **Nombre** e **ID**.
- **Filtros Multi-Nivel**: Filtros combinables por **Estatus (Activo/Inactivo)**, **País**, **Ciudad** y **Plan**.

### Vista de Tabla (Desktop)
Diseño de "Glassmorphism" con las siguientes columnas:
1. **ID**: Identificador único.
2. **Logo**: Imagen circular del negocio.
3. **Nombre**: Nombre comercial.
4. **Ubicación**: Ciudad - País.
5. **Plan**: Badge con el nivel (Standard/Pro/Premium).
6. **Estatus**: Indicador visual de Activo/Inactivo.
7. **Fecha de Pago**: Fecha de vencimiento/cobro.
8. **WhatsApp**: Icono de enlace directo al chat.
9. **Acciones**: Iconos para Editar (**Nueva pantalla de detalles**) y Borrar.

### Vista Responsiva (Mobile)
- La tabla se transforma en **Tarjetas (Cards)** optimizadas para celular.

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN (Paso a Paso)

### Fase 1: Infraestructura y Datos
- [x] **1.1** Crear tabla `categories` en Supabase (id, name, image_url).
- [x] **1.2** Crear tabla `businesses` en Supabase con todas las columnas.
- [x] **1.3** Configurar **Supabase Storage** (Buckets para `logos` y `categories`).
- [x] **1.4** Crear un negocio de prueba para validar visualización.

### Fase 2: Interfaz del Listado (Admin)
- [x] **2.1** Crear estructura de la página en `src/app/admin/negocios/page.tsx`.
- [x] **2.2** Diseñar la **Fila de Categorías** (Círculos pequeños) en la parte superior.
- [x] **2.3** Implementar botón **(+)** con lógica dual: **Bottom Sheet (Móvil)** / **Modal (PC)**.
- [x] **2.4** Implementar el **Buscador Inteligente** y el **Sistema de Filtros**.
- [x] **2.5** Diseñar la **Tabla Master** (PC) y la **Versión de Tarjetas** (Móvil).

### Fase 3: Acciones y Navegación
- [x] **3.1** Configurar el botón de **WhatsApp** dinámico.
- [x] **3.2** Crear la ruta de edición `src/app/admin/negocios/[id]/page.tsx`.
- [x] **3.3** Implementar el modal de **Creación de Negocio** con Slug automático.

### Fase 4: Lógica de Negocio (Módulos)
- [x] **4.1** Implementar el panel de **Switches** en la pantalla de edición.
- [x] **4.2** Vincular los cambios con la base de datos (JSONB).

### Fase 5: Geolocalización y Mapa Interactivo (En Progreso)
- [x] **5.1** Base de Datos: Añadir columnas `latitude` y `longitude` a la tabla `businesses` en Supabase.
- [x] **5.2** Dependencias: Instalar o verificar `leaflet`, `react-leaflet` y tipos correspondientes.
- [x] **5.3** UI/UX: Integrar el mapa interactivo (Componente `LocationPicker`) en la pantalla de edición (`[id]/page.tsx`).
- [x] **5.4** Reverse Geocoding: Conectar una API (ej. Nominatim) para auto-completar "Ciudad" y "País" al mover el pin.
- [x] **5.5** Persistencia: Guardar correctamente las coordenadas junto a los demás datos del negocio.
- [x] **5.6** Despliegue: Asegurar que la importación de Leaflet sea dinámica (`ssr: false`) para no romper el build de Next.js.

### Fase 6: Refactorización y Escalabilidad (Desacoplamiento de `[id]/page.tsx`)
- [x] **6.1** Crear componente `<BusinessProfileHeader />`: Extraer toda la sección de información básica (nombre, logo, etiquetas, inputs principales y botones de guardado).
- [x] **6.2** Crear componente `<BusinessLocationManager />`: Aislar la sección del mapa (LocationPicker) y el manejo de los estados de latitud, longitud, ciudad y país.
- [x] **6.3** Crear componente `<BusinessModuleManager />`: Extraer la cuadrícula de Switches (Standard, Pro, Premium) y la función `handleToggleModule`.
- [x] **6.4** Crear componente `<BusinessPaymentViewer />`: Separar la tarjeta de estado de pago, el enlace de cobro por WhatsApp y el visor de comprobantes.
- [x] **6.5** Integración en el Orquestador: Limpiar `src/app/admin/negocios/[id]/page.tsx`, importando y conectando los nuevos sub-componentes, centralizando solo el estado maestro (`businessData`) y las llamadas a Supabase.

### 📝 Bitácora de Refactorización (Fase 6)

**Paso 6.1 Completado:**
- Se creó el archivo `src/components/admin/businesses/BusinessProfileHeader.tsx`.
- Se extrajeron y exportaron tres componentes principales:
  - `<BusinessTopBar />`: Contiene el botón de volver y "Guardar Cambios".
  - `<BusinessProfileCard />`: Contiene la tarjeta principal izquierda (logo, ID, Estatus y "Plan Contratado").
  - `<BusinessBasicSettings />`: Contiene el formulario de configuración básica (Estatus, Plan, Próximo Pago).
- Se importaron estos componentes en `src/app/admin/negocios/[id]/page.tsx`, reduciendo drásticamente las líneas de código del archivo principal.

**Paso 6.2 Completado:**
- Se creó `<BusinessLocationManager />` en `src/components/admin/businesses/`.
- Se movió la importación dinámica (`next/dynamic`) de `LocationPicker` hacia este nuevo componente.
- Se reemplazó el bloque del mapa en `page.tsx`, pasando la función de actualización de coordenadas, ciudad y país mediante un callback unificado.

**Paso 6.3 Completado:**
- Se creó el archivo `src/components/admin/businesses/BusinessModuleManager.tsx`.
- Se extrajeron la cuadrícula de los módulos y el componente interno `<ModuleSwitch />` de `page.tsx` hacia este nuevo archivo.
- Se centralizó la función `handleToggleModule` dentro de `<BusinessModuleManager />`, llamando al `onChange` que actualiza el estado `businessData.modules` en el orquestador principal.
- Se redujeron más líneas de código en el archivo `page.tsx`.

**Paso 6.4 Completado:**
- Se creó el archivo `src/components/admin/businesses/BusinessPaymentViewer.tsx`.
- Se encapsuló toda la lógica del comprobante de pago, incluyendo el estado del modal de imagen (`isImageModalOpen`) y el renderizado del modal mismo.
- Se simplificó el orquestador eliminando estados locales que solo pertenecían a la visualización del pago.
- Se mantuvo la funcionalidad de "Ampliar" y visualización de placeholder cuando no hay comprobante.

**Paso 6.5 Completado (Final de Fase 6):**
- Se realizó una limpieza profunda de `src/app/admin/negocios/[id]/page.tsx`.
- Se eliminaron todos los imports de iconos no utilizados y componentes internos.
- El archivo orquestador ahora tiene menos de 200 líneas (reducción del ~50%), actuando puramente como controlador de datos y manejador de la base de datos.
- Se verificó que la comunicación entre sub-componentes y el estado maestro mediante callbacks (`onChange`) funciona correctamente.
- La Fase 6 se da por concluida con éxito.

### Fase 7: Refactorización del Dashboard (Centro de Mando)
- [x] **7.1** Crear componente `<DashboardHeader />`: Extraer el saludo de bienvenida, buscador y botones de acción (campana/ajustes).
- [x] **7.2** Crear componente `<DashboardStatsGrid />`: Aislar la cuadrícula de KPIs (Total negocios, activos, tasa de conversión y vencimientos).
- [x] **7.3** Crear componente `<DashboardGrowthChart />`: Extraer la sección de "Crecimiento de la Red" con su lógica de barras dinámicas y tooltips.
- [x] **7.4** Crear componente `<DashboardDistributionChart />`: Separar el gráfico circular (SVG) y la leyenda de distribución por planes.
- [x] **7.5** Orquestación Final: Limpiar `src/app/admin/dashboard/page.tsx`, delegando la UI a los nuevos componentes y manteniendo solo la lógica de fetching y estado global.

