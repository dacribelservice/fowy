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
- [ ] **1.1 Crear la tabla `global_products`**: Crear la tabla maestra en el esquema público de Supabase con campos para id, nombre, descripción, URL de imagen y categoría por defecto.
- [ ] **1.2 Extender la tabla `products`**: Agregar la columna `global_product_id` (UUID nullable) con una clave foránea que referencie a `global_products(id) ON DELETE SET NULL`.
- [ ] **1.3 Modificar restricciones de nulidad**: Permitir que `name`, `description` e `image_url` en `products` sean nulos para habilitar el fallback del catálogo.
- [ ] **1.4 Configurar políticas RLS**:
  - `global_products`: Permitir `SELECT` público para todos; restringir `INSERT/UPDATE/DELETE` únicamente al rol de `super_admin`.
  - `products`: Mantener las políticas actuales donde los comercios solo pueden manipular sus propios productos.

#### ⚙️ Fase 2: Integración de Hooks y Lógica de Datos (Crave Engine)
- [ ] **2.1 Actualizar `useBusinessMenuData.ts`**:
  - Modificar la consulta para hacer un left join con `global_products`: `.select("*, global_products(*)")`.
  - Actualizar la función de mapeo para aplicar la lógica de fallback dinámico (`name: p.name || p.global_products?.name`).
- [ ] **2.2 Actualizar `useProductManager.ts`**:
  - Modificar las consultas de listado en el hook del panel de socios para incluir la relación `global_products`.
  - Adaptar la función `addProduct` para que acepte opcionalmente un `global_product_id`.

#### 🎨 Fase 3: Interfaz de Usuario y Componentes (Ethereal High-Tech UI)
- [ ] **3.1 Diseñar el componente `GlobalProductSelector.tsx`**:
  - Crear el componente en `src/components/partners/business/menu/GlobalProductSelector.tsx`.
  - Implementar un grid visual de gaseosas pre-cargadas usando `PremiumImage` para evitar placeholders.
  - Añadir soporte de búsqueda server-side y paginación para optimizar la carga del catálogo global.
- [ ] **3.2 Integrar el selector en el Panel del Comercio (`/business/menu`)**:
  - Añadir un botón premium estilo "Agregar desde Catálogo Fowy" en la vista del menú del socio.
  - Implementar un flujo modal donde al hacer clic en una gaseosa, se despliegue un modal secundario (o panel) para ingresar el **precio local** y elegir la **categoría local** del menú del comercio.
  - Al guardar, insertar el registro correspondiente en la tabla `products`.
- [ ] **3.3 Actualizar formularios existentes (`ProductFormModal.tsx`)**:
  - Asegurar que al editar un producto de tipo global, el formulario reconozca que es heredado y muestre los campos del catálogo bloqueados/sugeridos, permitiendo editar libremente el precio, el stock y la categoría local.

#### 🧪 Fase 4: Pruebas, Optimización y Control de Errores
- [ ] **4.1 Pruebas de compatibilidad móvil**: Validar que la cuadrícula y el modal funcionen sin desbordamientos en Safari/iOS (siguiendo las directrices de `iPhone.md`).
- [ ] **4.2 Validar eliminación en cascada**: Probar que eliminar un producto local no afecte al catálogo general, y que borrar un producto del catálogo de forma segura no rompa los menús de los comercios (gracias a `ON DELETE SET NULL`).
- [ ] **4.3 Comprimir imágenes del catálogo**: Subir las 20 gaseosas oficiales comprimiéndolas previamente con `compressImage` según estipula `conceptos.md`.
