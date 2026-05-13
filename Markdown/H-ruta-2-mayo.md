# 📋 HOJA DE RUTA: FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Esta bitácora es el registro maestro de las fases de desarrollo activas del proyecto.

---

## 🥤 FASE: CATÁLOGO GLOBAL DE PRODUCTOS (FOWY GLOBAL CATALOG)

### 📝 Resumen del Proyecto
Se implementará un catálogo centralizado de productos genéricos comunes (como gaseosas de marca, licores, bebidas estándar, etc.) gestionado a nivel de plataforma.
Cada comercio afiliado podrá asociar estos productos globales a su menú local, definiendo únicamente su **precio local** y su **disponibilidad (stock)**, heredando de forma dinámica el nombre, la descripción y la imagen de alta calidad del catálogo global de Fowy.

**Decisión Técnica Elegida (Modelo Híbrido)**:
Añadir una relación nullable `global_product_id` en la tabla `products` existente. Si las columnas de texto locales del producto (`name`, `description`, `image_url`) son `null`, se hace un fallback dinámico a los valores de la plantilla global mediante consultas unificadas (`left join`). Esto evita la duplicación masiva de datos y permite personalización si un negocio decide alterar algún campo.

---

### 🗺️ PLAN DE ACCIÓN DETALLADO

#### 🛠️ Fase 1: Base de Datos y Seguridad (Supabase DDL & RLS)
- [x] **1.1 Crear la tabla `global_products`**: Crear la tabla maestra en el esquema público de Supabase con campos para id, nombre, descripción, URL de imagen, categoría por defecto y un campo `is_active` (boolean, default true) para habilitar Soft Delete.
- [x] **1.2 Extender la tabla `products`**: Agregar la columna `global_product_id` (UUID nullable) con una clave foránea que referencie a `global_products(id) ON DELETE RESTRICT` (para evitar borrados físicos accidentales) y crear un índice en esta columna para acelerar las consultas con fallback.
- [x] **1.3 Modificar restricciones de nulidad**: Permitir que `name`, `description` e `image_url` en `products` sean nulos para habilitar el fallback del catálogo.
- [x] **1.4 Configurar políticas RLS**:
  - `global_products`: Permitir `SELECT` público para todos; restringir `INSERT/UPDATE/DELETE` únicamente al rol de `super_admin`.
  - `products`: Mantener las políticas actuales donde los comercios solo pueden manipular sus propios productos.

#### ⚙️ Fase 2: Integración de Hooks y Lógica de Datos (Crave Engine)
- [x] **2.1 Actualizar `useBusinessMenuData.ts`**:
  - Modificar la consulta para hacer un left join con `global_products`: `.select("*, global_products(*)")`.
  - Actualizar la función de mapeo para aplicar la lógica de fallback dinámico (`name: p.name || p.global_products?.name`).
- [x] **2.2 Actualizar `useProductManager.ts`**:
  - Modificar las consultas de listado en el hook del panel de socios para incluir la relación `global_products`.
  - Adaptar la función `addProduct` para que acepte opcionalmente un `global_product_id`.

#### 🎨 Fase 3: Interfaz de Usuario y Componentes (Ethereal High-Tech UI)
- [x] **3.1 Diseñar el componente `GlobalProductSelector.tsx`**:
  - Crear el componente en `src/components/partners/business/menu/GlobalProductSelector.tsx`.
  - Implementar un grid visual de gaseosas pre-cargadas usando `PremiumImage` para evitar placeholders.
  - Añadir soporte de búsqueda server-side y paginación para optimizar la carga del catálogo global.
- [x] **3.2 Integrar el selector en el Panel del Comercio (`/business/menu`)**:
  - Añadir un botón premium estilo "Agregar desde Catálogo Fowy" en la vista del menú del socio.
  - Implementar un flujo modal donde al hacer clic en una gaseosa, se despliegue un modal secundario (o panel) para ingresar el **precio local** y elegir la **categoría local** del menú del comercio.
  - Al guardar, insertar el registro correspondiente en la tabla `products`.
- [x] **3.3 Actualizar formularios existentes (`ProductFormModal.tsx`)**:
  - Asegurar que al editar un producto de tipo global, el formulario reconozca que es heredado, bloqueando los campos fijos como Nombre e Imagen (indicándolos con un candado sutil).
  - Implementar la lógica híbrida inteligente para la **Descripción**:
    - *Por defecto (Vacío):* El campo mostrará en gris claro la descripción global de Fowy (actuando como placeholder o sugerencia). Si el socio no escribe nada, en la base de datos se guarda como `null` y el cliente final heredará la descripción global automáticamente.
    - *Personalizado:* Si el socio escribe su propia versión, se guardará en su registro de `products` local, sobrescribiendo la descripción global únicamente para su negocio.
    - *Restauración:* Si el socio borra lo que escribió, el campo se limpia volviendo a guardar `null` en la base de datos para heredar automáticamente la descripción global original de Fowy.
  - Permitir editar libremente el precio, el stock y la categoría local.

#### 🧪 Fase 4: Pruebas, Optimización y Control de Errores
- [ ] **4.1 Pruebas de compatibilidad móvil**: Validar que la cuadrícula y el modal funcionen sin desbordamientos en Safari/iOS (siguiendo las directrices de `iPhone.md`).
- [ ] **4.2 Validar desactivación (Soft Delete)**: Probar que desactivar un producto global (`is_active = false`) lo oculte de las búsquedas en el selector de nuevos productos, pero mantenga intacto el menú de los comercios que ya lo tenían asociado.
- [ ] **4.3 Comprimir imágenes del catálogo**: Subir las 20 gaseosas oficiales comprimiéndolas previamente con `compressImage` según estipula `conceptos.md`.

---

## 🍭 FASE 5: CATÁLOGO "CRAVE CATALOG" CENTRALIZADO (Categorías Circulares Automáticas y Ecosistema Admin-Socio)

Esta fase integra la capacidad de crear categorías globales representadas por imágenes circulares y automatizar por completo la creación de las categorías locales equivalentes cuando un comercio activa productos globales desde el panel de socios.

#### 🧱 Bloque 1: Base de Datos y Seguridad (Supabase DDL & RLS)
- [x] **5.1 Tabla de Categorías Globales (`global_categories`)**:
  - Crear la tabla con campos: `id` (UUID gen_random_uuid() primary key), `name` (text, unique), `image_url` (text, nullable), `is_active` (boolean, default true), y `created_at` (timestamp with time zone).
- [x] **5.2 Relación en Productos Globales (`global_products`)**:
  - Agregar la columna `global_category_id` (foreign key a `global_categories(id) ON DELETE RESTRICT`) y crear su índice correspondiente para consultas rápidas.
- [x] **5.3 Políticas de Seguridad (RLS)**:
  - `global_categories`: `SELECT` permitido para todo público; `INSERT/UPDATE/DELETE` restringido estrictamente para el rol de `super_admin`.

#### 👑 Bloque 2: Panel de Administración de Fowy (`/admin`) — "Catálogo Fowy"
- [x] **5.4 Ítem en la barra lateral (Sidebar)**:
  - Añadir la opción **"Catálogo Fowy"** en la barra lateral del administrador con un ícono elegante y animaciones premium (con hover resplandeciente `glow` y micro-interacción táctil `active:scale-95`).
- [x] **5.5 Creador de Categorías Globales**:
  - Vista modularizada para listar categorías globales en un grid visual premium con bordes `rounded-fowy` (`20px`).
  - Formulario modal con soporte de compresión previa obligatoria (`compressImage`) para subir la imagen de branding oficial (circular).
- [x] **5.6 Creador de Productos Globales**:
  - Formulario de creación de productos con un selector visual que cargue dinámicamente las categorías circulares desde `global_categories`.

#### 🤝 Bloque 3: Panel del Comercio (`/business/menu`) — Activación Inteligente
- [x] **5.7 Carrusel de Categorías Circulares**:
  - Eliminar el botón antiguo y redundante "Catálogo Fowy" en la esquina superior derecha para limpiar la interfaz.
  - Implementar un carrusel horizontal con scroll táctil súper fluido justo debajo de "Etiquetas de tu Negocio".
  - Renderizar las categorías globales como círculos perfectos (`w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-sm backdrop-blur-md`) usando `PremiumImage`.
- [x] **5.8 Pestaña/Subpantalla de Selección de Productos**:
  - Al dar clic en una categoría circular (ej. "Coca-Cola"), transicionar mediante Framer Motion hacia una subvista que muestre todos los productos del catálogo asociados a ella.
- [ ] **5.9 Switch Táctil de Activación y Automatización de Categoría Local**:
  - **Lógica Inteligente de Creación Automática de Categoría**: Al activar el Switch del producto global (ej. "Coca-Cola Original 350ml"):
    - Fowy buscará si el negocio ya posee una categoría local con el nombre exacto de la categoría global ("Coca-Cola").
    - Si **no existe**, Fowy creará la categoría local automáticamente.
    - Se creará el producto en la tabla `products` del comercio asociado automáticamente al ID de la categoría local correspondiente.
  - **Edición Inline de Precios**: Habilitar campos inmediatos para fijar el **Precio Local** y una **Descripción Local** opcional en caliente sin cerrar la pestaña.

#### 📱 Bloque 4: Menú Digital del Cliente (Explorer Edition)
- [ ] **5.10 Renderizado Dinámico en la Barra de Categorías**:
  - Asegurar que la categoría creada automáticamente por el sistema (ej. "Coca-Cola") se renderice como una píldora seleccionable en la barra horizontal de categorías del cliente.
- [ ] **5.11 Carga Elegante de Productos Activos**:
  - Mostrar los productos globales activados bajo la categoría correspondiente, consumiendo dinámicamente la imagen oficial de catálogo mediante `PremiumImage` y el precio local fijado por el comercio.

