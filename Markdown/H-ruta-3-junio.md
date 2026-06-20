# Hoja de Ruta - 3 de Junio

### Fase 1: Gestión de Negocios Inactivos / Pausados

- [x] **1.1. Ocultar negocios inactivos del mapa**: Modificar `src/hooks/useExplorerManager.ts` para que la función `fetchBusinesses` filtre los resultados asegurando que solo se muestren los negocios activos (`status === true`) que además estén abiertos (`isBusinessOpen(biz.schedules)`).
- [x] **1.2. Pantalla Glassmorphism en Menú Inactivo**: Editar `src/app/(explorer)/[slug]/page.tsx` para verificar el estado del negocio (`const isBusinessActive = business?.status === true;`). Si el negocio está inactivo, renderizar un overlay absoluto con efecto de vidrio esmerilado premium (`backdrop-blur-md`) que bloquee la interacción con el menú.
- [x] **1.3. Diseño de la Pantalla de Mantenimiento**: Diseñar una tarjeta central sobre el overlay que contenga un mensaje de "Menú en mantenimiento" y un botón de "Regresar al mapa". (importante los logos deben de ser minimalistas) ⚠️

### Fase 2: Corrección de Métricas y Gráficas de Ventas

- [x] **2.1. Corregir contador de Pedidos Recibidos y Ticket Promedio**: Modificar `src/components/admin/businesses/BusinessMetricsList.tsx` para usar la consulta de conteo nativo de Supabase (`count: "exact"`) para la cantidad de pedidos y, preferiblemente, implementar una función RPC (ej. `get_business_sales_stats`) para calcular el ticket promedio sin descargar la tabla completa de pedidos (lo cual causa que el total se quede estancado en 1000 debido al límite de la base de datos).
- [x] **2.2. Solucionar días vacíos ($0) en la Gráfica de Ventas**: Modificar el hook `src/components/admin/businesses/useFowySalesData.ts`. En la consulta principal (`supabase.from("orders")...`), calcular la fecha de inicio del período en el cliente (ej. 7 días, 6 semanas o 6 meses atrás) y añadir un filtro `.gte("created_at", fechaInicio)`. Esto evita descargar los 1000 registros más antiguos y garantiza que la gráfica siempre reciba los datos de los días recientes.

### Fase 3: Gestión de Menú del Negocio desde el Panel de Administrador

- [x] **3.1. Agregar Botón de "Tienda" en la Tabla (BusinessList)**: Modificar la tabla de listado (`src/components/admin/businesses/BusinessList.tsx`) añadiendo un botón con el ícono de "Tienda" junto al botón de "Lápiz". Este nuevo botón enlazará a la ruta exclusiva: `/admin/negocios/[id]/catalogo`.
- [x] **3.2. Crear Nueva Pantalla Completa (Ruta de Catálogo)**: Crear un archivo totalmente nuevo en `src/app/admin/negocios/[id]/catalogo/page.tsx` para alojar la gestión del menú. Esto brindará todo el ancho de pantalla necesario y separará el contexto de configuración general (pagos, módulos) del contexto de inventario.
- [x] **3.3. Ensamblar el "Remolque" (Reutilización Segura)**: Construir la nueva pantalla importando los subcomponentes y ganchos del socio (`ProductFormModal`, `useProductManager`, etc.) pasándoles el `businessId` de la URL. **Prohibido tocar/modificar** la vista actual del dueño (`src/app/(partners)/business/menu/page.tsx`) cumpliendo estrictamente con la Regla del Remolque.
- [x] **3.4. Validar Políticas RLS de Supabase**: Asegurar que las políticas de seguridad (RLS) en Supabase permitan al Super Administrador insertar, actualizar y eliminar registros en las tablas de `products`, `product_categories` y `categories` para cualquier `business_id`.

### Fase 4: Solución de Redirección a WhatsApp en iOS (Safari / WebViews)

- [x] **4.1. Eliminar `await` en la inserción de base de datos**: Modificar el hook `src/components/explorer/hooks/useCheckoutLogic.ts` en `handleSendWhatsApp` para disparar la inserción en Supabase en segundo plano sin usar `await`. Esto preserva el hilo de ejecución síncrono para el evento de clic.
- [x] **4.2. Cambiar redirección a `window.location.href`**: Reemplazar `window.open(whatsappUrl, "_blank")` por `window.location.href = whatsappUrl` en `useCheckoutLogic.ts`. Esto evita que iOS Safari bloquee el popup e invoque directamente la aplicación nativa de WhatsApp.
- [ ] **4.3. Pruebas de compatibilidad**: Validar el flujo tanto en iPhone (Safari y WebViews) como en Android para confirmar que la redirección sea instantánea y que el pedido continúe registrándose correctamente en Supabase en segundo plano.
