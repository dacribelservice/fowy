# Bitácora - 3 de Junio

### 📌 Hito: Gestión de Menú de Negocios para Súper Administrador (Regla del Remolque)
- **Fecha**: 15 de Junio de 2026
- **Resumen**: Implementación de una vista completa de gestión de catálogo para el Súper Administrador, permitiendo controlar el inventario de cualquier negocio sin afectar la vista del dueño del negocio.
- **Detalles Técnicos**:
  - **Nueva Ruta de Administración**: Se creó una ruta exclusiva en `src/app/admin/negocios/[id]/catalogo/page.tsx` a la cual se accede desde un nuevo botón de "Tienda" en la tabla de negocios.
  - **Aplicación de la "Regla del Remolque"**: En lugar de modificar y comprometer la pantalla original del socio (`src/app/(partners)/business/menu/page.tsx`), se ensambló una nueva página desde cero importando los subcomponentes y hooks compartidos (`useProductManager`, `useCategoryManager`, `ProductFormModal`, etc.). Al inyectarles el `businessId` desde la URL del admin, se logra la misma funcionalidad pero desde un entorno completamente aislado.
  - **Actualización de Supabase y Políticas RLS**: Se actualizaron los tipos de Supabase (`src/types/supabase.ts`) usando la CLI y se aplicaron políticas de *Row Level Security* (RLS) en la base de datos que otorgan al rol `super_admin` los permisos necesarios (BYPASS) para gestionar de forma total las tablas `products`, `product_menu_categories` y `categories`.

### 📌 Hito: Solución Crítica de Redirección a WhatsApp en iOS (Safari/WebViews)
- **Fecha**: 20 de Junio de 2026
- **Resumen**: Se resolvió un bug donde Safari y WebViews de iOS bloqueaban la apertura de WhatsApp (popup block) al intentar enviar un pedido.
- **Detalles Técnicos**:
  - **Identificación de la causa raíz**: El problema se originaba por la política de *User Activation* de WebKit (iOS), que bloquea `window.open` si este ocurre después de operaciones asíncronas (`await` de lectura/escritura en Supabase).
  - **Patrón "Fire and Forget"**: Se removió el `await` en `useCheckoutLogic.ts` aislando el guardado en Supabase a una función en segundo plano, para no demorar la redirección a WhatsApp.
  - **Redirección Síncrona Segura**: Se sustituyó `window.open(..., "_blank")` por la asignación directa a `window.location.href`, garantizando la apertura instantánea de la app nativa de WhatsApp.
